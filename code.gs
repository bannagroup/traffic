

// ==============================================================
// 🚦 نظام متكامل — السائقين + المخالفات + الخصومات + التراخيص
// ==============================================================

/* =========================
   القائمة الرئيسية الموحدة
========================= */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚦 النظام المتكامل')
    .addItem('🌐 فتح لوحة التحكم', 'openWebApp')
    .addSeparator()
    .addItem('📂 إنشاء النظام كامل', 'createSystem')
    .addSeparator()
    .addItem('💾 حفظ مخالفة', 'saveViolation')
    .addItem('💸 حفظ خصم', 'saveDeduction')
    .addSeparator()
    .addItem('📊 تحديث التقارير', 'runReport')
    .addSeparator()
    .addItem('🔍 إنشاء واجهة بحث التراخيص', 'createSearchSheet')
    .addToUi();
}

/* =========================
   🌐 فتح لوحة التحكم
========================= */
function openWebApp() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('🚦 النظام المتكامل')
    .setWidth(1800)
    .setHeight(900);
  SpreadsheetApp.getUi().showModalDialog(html, '🚦 نظام إدارة السائقين والمخالفات والتراخيص');
}

/* =========================
   🌐 Web App - GET
========================= */
function doGet(e) {
  if (!e || !e.parameter || !e.parameter.action) {
    return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('🚦 النظام المتكامل')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case "getDrivers":    result = getDriversData();    break;
      case "getViolations": result = getViolationsData(); break;
      case "getDeductions": result = getDeductionsData(); break;
      case "getAccounts":   result = getAccountsData();   break;
      case "getLicenses":   result = getLicensesData();   break;
      case "getAll":
      default:
        result = {
          drivers:    getDriversData(),
          violations: getViolationsData(),
          deductions: getDeductionsData(),
          accounts:   getAccountsData(),
          licenses:   getLicensesData()
        };
    }
    return jsonResponse({ status: "ok", data: result });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.message });
  }
}

/* =========================
   🌐 Web App - POST
========================= */
function doPost(e) {
  try {
    const body    = JSON.parse(e.postData.contents);
    const action  = body.action;
    const payload = body.payload || {};

    switch (action) {
      case "addDriver":       addDriverRow(payload.name, payload.car);                                                      break;
      case "updateDriver":    updateDriverRow(payload.id, payload.name, payload.car);                                       break;
      case "deleteDriver":    deleteDriverRow(payload.id);                                                                  break;
      case "addViolation":    addViolationRow(payload.date, payload.driver, payload.car, payload.desc, payload.amount); updateAccount(payload.driver); break;
      case "updateViolation": updateViolationRow(payload.id, payload.date, payload.driver, payload.car, payload.desc, payload.amount); updateAllAccounts(); break;
      case "deleteViolation": deleteViolationRow(payload.id); updateAllAccounts();                                          break;
      case "addDeduction":    addDeductionRow(payload.date, payload.driver, payload.amount, payload.type); updateAccount(payload.driver); break;
      case "updateDeduction": updateDeductionRow(payload.id, payload.date, payload.driver, payload.amount, payload.type); updateAllAccounts(); break;
      case "deleteDeduction": deleteDeductionRow(payload.id); updateAllAccounts();                                          break;
      case "updateLicense":   updateLicenseRow(payload.carNumber, payload.newDate);                                         break;
      default: return jsonResponse({ status: "error", message: "action غير معروف: " + action });
    }
    return jsonResponse({ status: "ok" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.message });
  }
}

/* =========================
   🔗 دوال مستدعاة من HTML
========================= */
function serverGetAll() {
  try {
    const result = {
      drivers:    getDriversData(),
      violations: getViolationsData(),
      deductions: getDeductionsData(),
      accounts:   getAccountsData(),
      licenses:   getLicensesData()
    };
    return JSON.stringify(result);
  } catch(e) {
    throw new Error("serverGetAll error: " + e.message);
  }
}

function serverPost(action, payload) {
  payload = payload || {};
  switch (action) {
    case "addDriver":       addDriverRow(payload.name, payload.car);                                                                    break;
    case "updateDriver":    updateDriverRow(payload.id, payload.name, payload.car);                                                     break;
    case "deleteDriver":    deleteDriverRow(payload.id);                                                                                break;
    case "addViolation":    addViolationRow(payload.date, payload.driver, payload.car, payload.desc, payload.amount); updateAccount(payload.driver); break;
    case "updateViolation": updateViolationRow(payload.id, payload.date, payload.driver, payload.car, payload.desc, payload.amount); updateAllAccounts(); break;
    case "deleteViolation": deleteViolationRow(payload.id); updateAllAccounts();                                                        break;
    case "addDeduction":    addDeductionRow(payload.date, payload.driver, payload.amount, payload.type); updateAccount(payload.driver); break;
    case "updateDeduction": updateDeductionRow(payload.id, payload.date, payload.driver, payload.amount, payload.type); updateAllAccounts(); break;
    case "deleteDeduction": deleteDeductionRow(payload.id); updateAllAccounts();                                                        break;
    case "updateLicense":   updateLicenseRow(payload.carNumber, payload.newDate);                                                       break;
    default: throw new Error("action غير معروف: " + action);
  }
  return JSON.stringify({ status: "ok" });
}

// ==========================================================
// =========================================================
//  قسم السائقين والمخالفات والخصومات
// =========================================================
// ==========================================================

/* =========================================
   دوال قراءة البيانات
========================================= */
function getDriversData() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("بيانات_السائقين_والسيارات");
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1).map((r, i) => ({
    id:   r[2] || "row_" + (i + 2),
    name: r[0],
    car:  r[1]
  })).filter(r => r.name);
}

function getViolationsData() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("سجل_المخالفات");
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1).map((r, i) => ({
    id:     r[5] || "row_" + (i + 2),
    date:   formatDate(r[0]),
    driver: r[1],
    car:    r[2],
    desc:   r[3],
    amount: Number(r[4])
  })).filter(r => r.driver);
}

function getDeductionsData() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("سجل_الخصومات");
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1).map((r, i) => ({
    id:     r[4] || "row_" + (i + 2),
    date:   formatDate(r[0]),
    driver: r[1],
    amount: Number(r[2]),
    type:   r[3]
  })).filter(r => r.driver);
}

function getAccountsData() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("الحسابات");
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1).map(r => ({
    driver:     r[0],
    violations: Number(r[1]),
    deductions: Number(r[2]),
    remaining:  Number(r[3])
  })).filter(r => r.driver);
}

/* =========================================
   دوال كتابة البيانات — السائقون
========================================= */
function addDriverRow(name, car) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("بيانات_السائقين_والسيارات");
  sheet.appendRow([name, car, generateId()]);
}

function updateDriverRow(id, name, car) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("بيانات_السائقين_والسيارات");
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][2] === id) { sheet.getRange(i + 1, 1, 1, 2).setValues([[name, car]]); return; }
  }
}

function deleteDriverRow(id) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("بيانات_السائقين_والسيارات");
  const rows  = sheet.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][2] === id) { sheet.deleteRow(i + 1); return; }
  }
}

/* =========================================
   دوال كتابة البيانات — المخالفات
========================================= */
function addViolationRow(date, driver, car, desc, amount) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("سجل_المخالفات");
  sheet.appendRow([date, driver, car, desc, Number(amount), generateId()]);
}

function updateViolationRow(id, date, driver, car, desc, amount) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("سجل_المخالفات");
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][5] === id) { sheet.getRange(i + 1, 1, 1, 5).setValues([[date, driver, car, desc, Number(amount)]]); return; }
  }
}

function deleteViolationRow(id) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("سجل_المخالفات");
  const rows  = sheet.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][5] === id) { sheet.deleteRow(i + 1); return; }
  }
}

/* =========================================
   دوال كتابة البيانات — الخصومات
========================================= */
function addDeductionRow(date, driver, amount, type) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("سجل_الخصومات");
  sheet.appendRow([date, driver, Number(amount), type || "خصم", generateId()]);
}

function updateDeductionRow(id, date, driver, amount, type) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("سجل_الخصومات");
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][4] === id) { sheet.getRange(i + 1, 1, 1, 4).setValues([[date, driver, Number(amount), type || "خصم"]]); return; }
  }
}

function deleteDeductionRow(id) {
  const sheet = SpreadsheetApp.getActive().getSheetByName("سجل_الخصومات");
  const rows  = sheet.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][4] === id) { sheet.deleteRow(i + 1); return; }
  }
}

/* =========================
   onEdit الموحد
========================= */
function onEdit(e) {
  try {
    if (!e || !e.range) return;

    const sheet     = e.range.getSheet();
    const sheetName = sheet.getName();
    const editedCell = e.range.getA1Notation();

    // ✅ تحديث حسابات السائقين تلقائياً عند التعديل في سجلات المخالفات أو الخصومات
    if (sheetName === "سجل_المخالفات" || sheetName === "سجل_الخصومات") {
      const row = e.range.getRow();
      if (row <= 1) return;
      const driverName = sheet.getRange(row, 2).getValue();
      if (driverName) { updateAccount(driverName); updateAllAccounts(); }
    }

    // ✅ طباعة فاتورة ترخيص عند تعديل B3 في الشيتات المرقمة
    if (/^\d+$/.test(sheetName) && editedCell === "B3") {
      const carNumber = sheet.getRange("B3").getValue();
      if (!carNumber) {
        SpreadsheetApp.getActiveSpreadsheet().toast("B3 فارغة — تم الإلغاء.");
        return;
      }
      printLicenseInvoice_(sheet, carNumber);
    }

  } catch (err) {
    Logger.log("Error in onEdit: " + err.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast("❌ حدث خطأ: " + err.toString());
  }
}

/* =========================
   تحديث الحسابات
========================= */
function updateAccount(driver) {
  const ss    = SpreadsheetApp.getActive();
  const vData = ss.getSheetByName("سجل_المخالفات").getDataRange().getValues();
  const dData = ss.getSheetByName("سجل_الخصومات").getDataRange().getValues();
  const acc   = ss.getSheetByName("الحسابات");

  let totalV = 0, totalD = 0;
  vData.slice(1).forEach(r => { if (r[1] === driver) totalV += Number(r[4]); });
  dData.slice(1).forEach(r => { if (r[1] === driver) totalD += Number(r[2]); });

  const remain  = totalV - totalD;
  const accData = acc.getDataRange().getValues();
  let found = false;
  for (let i = 1; i < accData.length; i++) {
    if (accData[i][0] === driver) { acc.getRange(i + 1, 2, 1, 3).setValues([[totalV, totalD, remain]]); found = true; break; }
  }
  if (!found) acc.appendRow([driver, totalV, totalD, remain]);
}

function updateAllAccounts() {
  const ss    = SpreadsheetApp.getActive();
  const vData = ss.getSheetByName("سجل_المخالفات").getDataRange().getValues();
  const dData = ss.getSheetByName("سجل_الخصومات").getDataRange().getValues();
  const driversSet = new Set();
  vData.slice(1).forEach(r => { if (r[1]) driversSet.add(r[1]); });
  dData.slice(1).forEach(r => { if (r[1]) driversSet.add(r[1]); });
  driversSet.forEach(driver => updateAccount(driver));
}

/* =========================
   التقارير
========================= */
function runReport() {
  const ss   = SpreadsheetApp.getActive();
  const report = ss.getSheetByName("التقارير");
  const data = ss.getSheetByName("سجل_المخالفات").getDataRange().getValues();
  report.clear();
  report.getRange(1, 1, data.length, data[0].length).setValues(data);
}

/* =========================
   حفظ المخالفات (من الشيت)
========================= */
function saveViolation() {
  const ss     = SpreadsheetApp.getActive();
  const entry  = ss.getSheetByName("إدخال_مخالفات");
  const log    = ss.getSheetByName("سجل_المخالفات");
  const date   = entry.getRange("B1").getValue();
  const car    = entry.getRange("B2").getValue();
  const driver = entry.getRange("B3").getValue();
  const details = entry.getRange("A5:B9").getValues();

  if (!driver || !car) { SpreadsheetApp.getUi().alert("⚠️ برجاء اختيار السائق ورقم السيارة"); return; }
  details.forEach(r => { if (r[0] && r[1]) log.appendRow([date, driver, car, r[0], r[1], generateId()]); });
  updateAccount(driver);
  SpreadsheetApp.getUi().alert("✅ تم حفظ المخالفات بنجاح");
}

/* =========================
   حفظ الخصم (من الشيت)
========================= */
function saveDeduction() {
  const ss     = SpreadsheetApp.getActive();
  const entry  = ss.getSheetByName("إدخال_خصم");
  const log    = ss.getSheetByName("سجل_الخصومات");
  const date   = entry.getRange("B1").getValue();
  const driver = entry.getRange("B2").getValue();
  const amount = entry.getRange("B3").getValue();

  if (!driver || !amount) { SpreadsheetApp.getUi().alert("⚠️ برجاء إدخال السائق والمبلغ"); return; }
  log.appendRow([date, driver, amount, "خصم", generateId()]);
  updateAccount(driver);
  SpreadsheetApp.getUi().alert("💸 تم تسجيل الخصم بنجاح");
}

/* =========================
   إنشاء جميع الشيتات
========================= */
function createSystem() {
  const ss = SpreadsheetApp.getActive();
  [
    "بيانات_السائقين_والسيارات",
    "إدخال_مخالفات",
    "سجل_المخالفات",
    "إدخال_خصم",
    "سجل_الخصومات",
    "الحسابات",
    "التقارير",
    "البيانات"   // شيت بيانات السيارات والتراخيص
  ].forEach(name => { if (!ss.getSheetByName(name)) ss.insertSheet(name); });

  ss.getSheetByName("بيانات_السائقين_والسيارات").getRange("A1:C1").setValues([["اسم السائق","رقم السيارة","ID"]]);
  ss.getSheetByName("سجل_المخالفات").getRange("A1:F1").setValues([["التاريخ","اسم السائق","رقم السيارة","الوصف","المبلغ","ID"]]);
  ss.getSheetByName("سجل_الخصومات").getRange("A1:E1").setValues([["التاريخ","اسم السائق","المبلغ","النوع","ID"]]);
  ss.getSheetByName("الحسابات").getRange("A1:D1").setValues([["اسم السائق","إجمالي مخالفات","إجمالي خصومات","المتبقي"]]);
  ss.getSheetByName("البيانات").getRange("A1:G1").setValues([["رقم السيارة","الشركة","نوع السيارة","رقم الشاسيه","السائق","تاريخ انتهاء الترخيص","ملاحظات"]]);

  setupForms();
  SpreadsheetApp.getUi().alert("✅ تم إنشاء النظام بنجاح!\nافتح لوحة التحكم من القائمة 🚦 النظام المتكامل > فتح لوحة التحكم");
}

/* =========================
   تجهيز صفحات الإدخال
========================= */
function setupForms() {
  const ss      = SpreadsheetApp.getActive();
  const drivers = ss.getSheetByName("بيانات_السائقين_والسيارات");
  const violations = ss.getSheetByName("إدخال_مخالفات");
  const deductions = ss.getSheetByName("إدخال_خصم");

  violations.clear();
  violations.getRange("A1:B1").setValues([["التاريخ", new Date()]]);
  violations.getRange("A2:B2").setValues([["رقم السيارة",""]]);
  violations.getRange("A3:B3").setValues([["اسم السائق",""]]);
  violations.getRange("A4:B4").setValues([["الوصف","المبلغ"]]);
  violations.getRange("A5:B9").setValues([["",""],["",""],["",""],["",""],["",""]]);

  const carRule    = SpreadsheetApp.newDataValidation().requireValueInRange(drivers.getRange("B2:B"), true).build();
  const driverRule = SpreadsheetApp.newDataValidation().requireValueInRange(drivers.getRange("A2:A"), true).build();
  violations.getRange("B2").setDataValidation(carRule);
  violations.getRange("B3").setDataValidation(driverRule);

  deductions.clear();
  deductions.getRange("A1:B1").setValues([["التاريخ", new Date()]]);
  deductions.getRange("A2:B2").setValues([["اسم السائق",""]]);
  deductions.getRange("A3:B3").setValues([["المبلغ",""]]);
  deductions.getRange("B2").setDataValidation(driverRule);
}

// ==========================================================
// =========================================================
//  قسم التراخيص
// =========================================================
// ==========================================================

/* =========================================
   قراءة بيانات التراخيص
========================================= */
function getLicensesData() {
  const ss = SpreadsheetApp.getActive();
  const dataSheet = ss.getSheetByName('البيانات');
  if (!dataSheet) return [];

  const data = dataSheet.getDataRange().getValues();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return data.slice(1).map((row, i) => {
    const expiry = row[5]; // العمود F — تاريخ انتهاء الترخيص
    let calcStatus = '—', diffDays = null;

    if (expiry instanceof Date) {
      diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
      if (diffDays < 0)       calcStatus = 'منتهي';
      else if (diffDays <= 30) calcStatus = 'ينتهي قريباً';
      else                     calcStatus = 'ساري';
    }

    return {
      id:        "lic_" + (i + 2),
      carNumber: String(row[0] || ''),
      company:   String(row[1] || ''),
      carType:   String(row[2] || ''),
      chassis:   String(row[3] || ''),
      driver:    String(row[4] || ''),
      expiry:    expiry instanceof Date ? expiry.toISOString().slice(0, 10) : String(expiry || ''),
      status:    calcStatus,
      diffDays:  diffDays,
      notes:     String(row[6] || '')
    };
  }).filter(r => r.carNumber);
}

/* =========================================
   تحديث تاريخ الترخيص
========================================= */
function updateLicenseRow(carNumber, newDate) {
  const ss = SpreadsheetApp.getActive();
  const dataSheet = ss.getSheetByName('البيانات');
  if (!dataSheet) throw new Error('شيت البيانات غير موجود');

  const data = dataSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(carNumber).trim()) {
      const dateVal = new Date(newDate);
      dataSheet.getRange(i + 1, 6).setValue(dateVal);
      return;
    }
  }
  throw new Error('رقم السيارة غير موجود: ' + carNumber);
}

/* ==========================================================
   🔢 نظام الترقيم التلقائي للفواتير
========================================================== */
function getNextInvoiceNumber() {
  const props = PropertiesService.getDocumentProperties();
  let lastNumber = Number(props.getProperty("lastInvoiceNumber")) || 1000;
  const nextNumber = lastNumber + 1;
  props.setProperty("lastInvoiceNumber", nextNumber);
  return nextNumber;
}

/* ==========================================================
   🖨️ طباعة فاتورة الترخيص (تُستدعى من onEdit)
========================================================== */
function printLicenseInvoice_(sheet, carNumber) {
  const ss = sheet.getParent();
  const originalSheet = sheet;
  const invoiceNumber = getNextInvoiceNumber();
  sheet.getRange("B1").setValue(invoiceNumber);

  const headerValues = sheet.getRange("A1:B6").getValues();

  const startRow = 7, endRow = 20;
  const allValues = sheet.getRange(`A${startRow}:B${endRow}`).getValues();
  const dataRowsInfo = allValues
    .map((r, i) => ({ rowValues: r, sourceRow: i + startRow }))
    .filter(item => item.rowValues[0] !== "" && item.rowValues[0] !== null);

  if (dataRowsInfo.length === 0) {
    SpreadsheetApp.getActiveSpreadsheet().toast("⚠️ لا توجد بيانات في العمود A من 7 إلى 20 للطباعة.");
    return;
  }

  const finalData = [];
  headerValues.forEach(r => finalData.push(r));
  dataRowsInfo.forEach(item => finalData.push(item.rowValues));
  const finalRowsCount = finalData.length;

  const tempName = "_TEMP_PRINT_";
  const existing = ss.getSheetByName(tempName);
  if (existing) ss.deleteSheet(existing);
  const tempSheet = ss.insertSheet(tempName);

  tempSheet.setRightToLeft(true);
  tempSheet.getRange(1, 1, finalRowsCount, 2).setValues(finalData);

  const headerSource = sheet.getRange("A1:B6");
  const headerTarget = tempSheet.getRange(1, 1, 6, 2);
  headerSource.copyTo(headerTarget, { formatOnly: true });

  for (let i = 0; i < dataRowsInfo.length; i++) {
    const srcRow = dataRowsInfo[i].sourceRow;
    const dstRow = 6 + i + 1;
    sheet.getRange(srcRow, 1, 1, 2).copyTo(tempSheet.getRange(dstRow, 1, 1, 2), { formatOnly: true });
  }

  for (let c = 1; c <= 2; c++) tempSheet.setColumnWidth(c, sheet.getColumnWidth(c));
  for (let r = 1; r <= finalRowsCount; r++) tempSheet.setRowHeight(r, sheet.getRowHeight(r));

  ss.setActiveSheet(tempSheet);
  SpreadsheetApp.flush();
  Utilities.sleep(1500);

  const folderName = "فواتير السيارات";
  const folders = DriveApp.getFoldersByName(folderName);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

  const url = ss.getUrl().replace(/edit$/, '') +
    'export?exportFormat=pdf&format=pdf' +
    '&size=A5&portrait=true&sheetnames=false&printtitle=false' +
    '&pagenumbers=false&gridlines=false&fzr=false' +
    '&top_margin=0.25&bottom_margin=0.25&left_margin=0.25&right_margin=0.25' +
    '&gid=' + tempSheet.getSheetId();

  const token = ScriptApp.getOAuthToken();
  const response = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + token } });

  folder.createFile(response.getBlob()).setName(`${carNumber}.pdf`);

  ss.setActiveSheet(originalSheet);
  SpreadsheetApp.flush();
  Utilities.sleep(300);

  if (ss.getSheetByName(tempName)) ss.deleteSheet(tempSheet);
  sheet.getRange("B3").clearContent();
  sheet.getRange("A7:B12").clearContent();

  SpreadsheetApp.getActiveSpreadsheet().toast("✅ تم حفظ فاتورة الترخيص PDF بنجاح.");
}

/* ==========================================================
   🔍 واجهة بحث التراخيص (في الشيت مباشرة)
========================================================== */
function createSearchSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('البيانات');
  if (!dataSheet) {
    SpreadsheetApp.getUi().alert('❌ لا يوجد شيت باسم "البيانات"');
    return;
  }

  let sheet = ss.getSheetByName('بحث وطباعة');
  if (!sheet) sheet = ss.insertSheet('بحث وطباعة');
  else sheet.clear();

  sheet.getRange('B2').setValue('ابحث برقم السيارة:');
  sheet.getRange('B3').setValue('أو اختر حالة الترخيص:');

  const carNumbers = dataSheet.getRange('A2:A').getValues().flat().filter(String);

  sheet.getRange('C2').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(carNumbers, true).setAllowInvalid(true).build()
  );
  sheet.getRange('C3').setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['ساري', 'منتهي', 'ينتهي قريباً'], true).setAllowInvalid(true).build()
  );

  sheet.getRange('B5:G5')
    .setValues([['رقم السيارة', 'رقم الشاسيه', 'الشركة', 'السائق', 'انتهاء الترخيص', 'حالة الترخيص']])
    .setFontWeight('bold')
    .setBackground('#b6d7a8');

  sheet.getRange('E1:G1')
    .setValues([['رقم السيارة', 'تاريخ قديم', 'تاريخ جديد']])
    .setFontWeight('bold')
    .setBackground('#f9cb9c');
  sheet.getRange('H1').setValue('نتيجة العملية').setFontWeight('bold');

  deleteTriggersByHandler_('searchCarOrStatus');
  deleteTriggersByHandler_('updateLicenseDate');

  ScriptApp.newTrigger('searchCarOrStatus').forSpreadsheet(ss).onEdit().create();
  ScriptApp.newTrigger('updateLicenseDate').forSpreadsheet(ss).onEdit().create();

  SpreadsheetApp.getUi().alert('✅ تم إنشاء واجهة بحث التراخيص بنجاح');
}

/* ==========================================================
   🔎 البحث في التراخيص (يُستدعى من تريجر onEdit)
========================================================== */
function searchCarOrStatus(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'بحث وطباعة') return;
  if (!['C2', 'C3'].includes(e.range.getA1Notation())) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('البيانات');
  const data = dataSheet.getDataRange().getValues();

  const outputRow = 7;
  sheet.getRange(outputRow - 1, 2, sheet.getMaxRows(), 6).clearContent();

  const carNum   = sheet.getRange('C2').getValue().toString().trim();
  const statusVal = sheet.getRange('C3').getValue().toString().trim();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let results = [];
  for (let i = 1; i < data.length; i++) {
    const row    = data[i];
    const expiry = row[5];
    if (!(expiry instanceof Date)) continue;

    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    let calcStatus = diffDays < 0 ? 'منتهي' : diffDays <= 30 ? 'ينتهي قريباً' : 'ساري';

    if ((carNum && row[0].toString().trim() === carNum) || (!carNum && calcStatus === statusVal)) {
      results.push([row[0], row[3], row[1], row[4], expiry, calcStatus]);
    }
  }

  if (results.length) {
    if (statusVal) sheet.getRange(outputRow - 1, 2).setValue(`🔹 عدد السيارات (${statusVal}) = ${results.length}`);
    sheet.getRange(outputRow, 2, results.length, 6).setValues(results);
  } else {
    sheet.getRange(outputRow, 2).setValue('❌ لا توجد نتائج مطابقة');
  }
}

/* ==========================================================
   🧾 تجديد تاريخ الترخيص من شيت البحث
========================================================== */
function updateLicenseDate(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'بحث وطباعة') return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName('البيانات');

  if (e.range.getA1Notation() === 'E2') {
    const carNum = sheet.getRange('E2').getValue().toString().trim();
    if (!carNum) return;
    const data = dataSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString().trim() === carNum) { sheet.getRange('F2').setValue(data[i][5]); return; }
    }
    sheet.getRange('F2').setValue('🚫 غير موجود');
  }

  if (e.range.getA1Notation() === 'G2') {
    const carNum = sheet.getRange('E2').getValue().toString().trim();
    const newDate = sheet.getRange('G2').getValue();
    if (!carNum || !(newDate instanceof Date)) { sheet.getRange('H2').setValue('⚠️ أدخل البيانات كاملة'); return; }
    const data = dataSheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString().trim() === carNum) {
        dataSheet.getRange(i + 1, 6).setValue(newDate);
        sheet.getRange('E2:G2').clearContent();
        sheet.getRange('H2').setValue('✅ تم تحديث الترخيص');
        return;
      }
    }
    sheet.getRange('H2').setValue('🚫 رقم السيارة غير موجود');
  }
}

/* ==========================================================
   🛠 حذف التريجرات القديمة
========================================================== */
function deleteTriggersByHandler_(name) {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === name) ScriptApp.deleteTrigger(t);
  });
}

// ==========================================================
// =========================================================
//  دوال مساعدة مشتركة
// =========================================================
// ==========================================================

function generateId() {
  return "id_" + new Date().getTime() + "_" + Math.random().toString(36).slice(2, 7);
}

function formatDate(d) {
  if (!d) return "";
  try { return new Date(d).toISOString().slice(0, 10); } catch (e) { return String(d); }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function formatLocalDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getTodayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}

function toLocalDateString(dateValue) {
  if (!dateValue) return '';
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  } catch(e) { return String(dateValue); }
}
