// ============================================================
// 🔥 Firebase Firestore — عمليات قاعدة البيانات
// ============================================================

let db = null;
let fbApp = null;
let FB_READY = false;

function initFirebase() {
  try {
    if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === "YOUR_API_KEY") {
      setStatus('warn', '⚠️ Firebase غير مُهيَّأ — اضغط على ⚙️ الإعدادات لإضافة بياناتك');
      showFirebaseWarning(true);
      return false;
    }
    if (!firebase.apps.length) {
      fbApp = firebase.initializeApp(FIREBASE_CONFIG);
    } else {
      fbApp = firebase.apps[0];
    }
    db = firebase.firestore();
    FB_READY = true;
    setStatus('ok', '✅ Firebase متصل');
    showFirebaseWarning(false);
    return true;
  } catch (e) {
    setStatus('err', '❌ خطأ Firebase: ' + e.message);
    showFirebaseWarning(true);
    console.error('Firebase init error:', e);
    return false;
  }
}

function showFirebaseWarning(show) {
  const w = document.getElementById('fb-warning');
  if (w) w.style.display = show ? 'block' : 'none';
}

// ── GENERIC HELPERS ────────────────────────────────────────

async function colGet(col) {
  const snap = await db.collection(col).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function colAdd(col, data) {
  const ref = await db.collection(col).add({ ...data, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  return ref.id;
}

async function colUpdate(col, id, data) {
  await db.collection(col).doc(id).update({ ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
}

async function colDelete(col, id) {
  await db.collection(col).doc(id).delete();
}

async function colBatchAdd(col, rows) {
  const CHUNK = 400;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = db.batch();
    rows.slice(i, i + CHUNK).forEach(r => {
      const ref = db.collection(col).doc();
      batch.set(ref, { ...r, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();
  }
}

// ── DRIVERS ───────────────────────────────────────────────

async function dbGetDrivers() {
  return await colGet('drivers');
}
async function dbAddDriver(name, car) {
  return await colAdd('drivers', { name, car });
}
async function dbUpdateDriver(id, name, car) {
  return await colUpdate('drivers', id, { name, car });
}
async function dbDeleteDriver(id) {
  return await colDelete('drivers', id);
}

// ── VIOLATIONS ────────────────────────────────────────────

async function dbGetViolations() {
  const snap = await db.collection('violations').orderBy('date', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function dbAddViolation(date, driver, car, desc, amount) {
  return await colAdd('violations', { date, driver, car, desc, amount: Number(amount) });
}
async function dbUpdateViolation(id, date, driver, car, desc, amount) {
  return await colUpdate('violations', id, { date, driver, car, desc, amount: Number(amount) });
}
async function dbDeleteViolation(id) {
  return await colDelete('violations', id);
}

// ── DEDUCTIONS ────────────────────────────────────────────

async function dbGetDeductions() {
  const snap = await db.collection('deductions').orderBy('date', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function dbAddDeduction(date, driver, amount, type) {
  return await colAdd('deductions', { date, driver, amount: Number(amount), type: type || 'خصم' });
}
async function dbUpdateDeduction(id, date, driver, amount, type) {
  return await colUpdate('deductions', id, { date, driver, amount: Number(amount), type: type || 'خصم' });
}
async function dbDeleteDeduction(id) {
  return await colDelete('deductions', id);
}

// ── LICENSES ──────────────────────────────────────────────

async function dbGetLicenses() {
  return await colGet('licenses');
}
async function dbAddLicense(data) {
  return await colAdd('licenses', data);
}
async function dbUpdateLicense(id, data) {
  return await colUpdate('licenses', id, data);
}
async function dbDeleteLicense(id) {
  return await colDelete('licenses', id);
}

// ── CUSTODY (العهد) ───────────────────────────────────────

async function dbGetCustody() {
  const snap = await db.collection('custody').orderBy('date', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function dbAddCustody(data) {
  return await colAdd('custody', data);
}
async function dbUpdateCustody(id, data) {
  return await colUpdate('custody', id, data);
}
async function dbDeleteCustody(id) {
  return await colDelete('custody', id);
}

// ── APPROVALS (الموافقات) ─────────────────────────────────

async function dbGetApprovals() {
  const snap = await db.collection('approvals').orderBy('date', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function dbAddApproval(data) {
  return await colAdd('approvals', data);
}
async function dbUpdateApproval(id, data) {
  return await colUpdate('approvals', id, data);
}
async function dbDeleteApproval(id) {
  return await colDelete('approvals', id);
}

// ── INVOICES (الفواتير) ───────────────────────────────────

async function dbGetInvoices() {
  const snap = await db.collection('invoices').orderBy('date', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
async function dbAddInvoice(data) {
  return await colAdd('invoices', data);
}
async function dbUpdateInvoice(id, data) {
  return await colUpdate('invoices', id, data);
}
async function dbDeleteInvoice(id) {
  return await colDelete('invoices', id);
}

// ── BATCH IMPORT ──────────────────────────────────────────

async function dbBatchImport(col, rows, onProgress) {
  const total = rows.length;
  const CHUNK = 400;
  let done = 0;
  for (let i = 0; i < total; i += CHUNK) {
    const batch = db.batch();
    rows.slice(i, i + CHUNK).forEach(r => {
      const ref = db.collection(col).doc();
      batch.set(ref, { ...r, importedAt: firebase.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();
    done += Math.min(CHUNK, total - i);
    if (onProgress) onProgress(Math.round(done / total * 100));
  }
}

// ── COMPUTE ACCOUNTS ──────────────────────────────────────

function computeAccounts(violations, deductions, drivers) {
  const map = {};
  const allDrivers = [...new Set([
    ...violations.map(v => v.driver),
    ...deductions.map(d => d.driver),
    ...drivers.map(d => d.name)
  ])];
  allDrivers.forEach(name => {
    const totalV = violations.filter(v => v.driver === name).reduce((s, v) => s + Number(v.amount || 0), 0);
    const totalD = deductions.filter(d => d.driver === name).reduce((s, d) => s + Number(d.amount || 0), 0);
    map[name] = { driver: name, violations: totalV, deductions: totalD, remaining: totalV - totalD };
  });
  return Object.values(map);
}

// ── LICENSE STATUS ────────────────────────────────────────

function calcLicenseStatus(expiry) {
  if (!expiry) return { status: '—', diffDays: null };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const exp = new Date(expiry); exp.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((exp - today) / 86400000);
  let status = diffDays < 0 ? 'منتهي' : diffDays <= APP_CONFIG.warnDays ? 'ينتهي قريباً' : 'ساري';
  return { status, diffDays };
}
