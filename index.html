// ============================================================
// 📥 استيراد البيانات من Google Sheets (Excel / CSV)
// ============================================================

// خريطة الأعمدة لكل نوع بيانات
const SHEET_MAPS = {
  drivers: {
    label: 'السائقون والسيارات',
    icon: '👤',
    collection: 'drivers',
    columns: ['name', 'car'],
    headers: ['اسم السائق', 'رقم السيارة'],
    sample: ['محمد أحمد', 'أ ب ج 1234'],
    transform: (row) => ({
      name: ss(row[0]),
      car:  ss(row[1])
    }),
    validate: (r) => !!r.name
  },
  violations: {
    label: 'المخالفات',
    icon: '🚨',
    collection: 'violations',
    columns: ['date', 'driver', 'car', 'desc', 'amount'],
    headers: ['التاريخ', 'اسم السائق', 'رقم السيارة', 'الوصف', 'المبلغ'],
    sample: ['2024-01-15', 'محمد أحمد', 'أ ب ج 1234', 'سرعة زائدة', '500'],
    transform: (row) => ({
      date:   toISO(row[0]) || '',
      driver: ss(row[1]),
      car:    ss(row[2]),
      desc:   ss(row[3]),
      amount: Number(row[4]) || 0
    }),
    validate: (r) => !!r.driver && r.amount > 0
  },
  deductions: {
    label: 'الخصومات',
    icon: '💸',
    collection: 'deductions',
    columns: ['date', 'driver', 'amount', 'type'],
    headers: ['التاريخ', 'اسم السائق', 'المبلغ', 'النوع'],
    sample: ['2024-01-20', 'محمد أحمد', '1000', 'خصم شهري'],
    transform: (row) => ({
      date:   toISO(row[0]) || '',
      driver: ss(row[1]),
      amount: Number(row[2]) || 0,
      type:   ss(row[3]) || 'خصم'
    }),
    validate: (r) => !!r.driver && r.amount > 0
  },
  licenses: {
    label: 'التراخيص',
    icon: '🪪',
    collection: 'licenses',
    columns: ['carNumber', 'company', 'carType', 'chassis', 'driver', 'expiry', 'notes'],
    headers: ['رقم السيارة', 'الشركة', 'نوع السيارة', 'رقم الشاسيه', 'السائق', 'تاريخ الانتهاء', 'ملاحظات'],
    sample: ['أ ب ج 1234', 'شركة النقل', 'نقل', 'ABC123', 'محمد أحمد', '2025-06-30', ''],
    transform: (row) => {
      const expiry = toISO(row[5]) || '';
      const { status, diffDays } = calcLicenseStatus(expiry);
      return {
        carNumber: ss(row[0]),
        company:   ss(row[1]),
        carType:   ss(row[2]),
        chassis:   ss(row[3]),
        driver:    ss(row[4]),
        expiry,
        notes:     ss(row[6]),
        status,
        diffDays
      };
    },
    validate: (r) => !!r.carNumber
  },
  custody: {
    label: 'العهد',
    icon: '📦',
    collection: 'custody',
    columns: ['date', 'employee', 'car', 'itemDesc', 'quantity', 'unit', 'value', 'status', 'notes'],
    headers: ['التاريخ', 'الموظف', 'رقم السيارة', 'الصنف', 'الكمية', 'الوحدة', 'القيمة', 'الحالة', 'ملاحظات'],
    sample: ['2024-01-10', 'محمد أحمد', 'أ ب ج 1234', 'إطار احتياطي', '2', 'قطعة', '800', 'مسلّمة', ''],
    transform: (row) => ({
      date:     toISO(row[0]) || '',
      employee: ss(row[1]),
      car:      ss(row[2]),
      itemDesc: ss(row[3]),
      quantity: Number(row[4]) || 1,
      unit:     ss(row[5]) || 'قطعة',
      value:    Number(row[6]) || 0,
      status:   ss(row[7]) || 'مسلّمة',
      notes:    ss(row[8])
    }),
    validate: (r) => !!r.employee && !!r.itemDesc
  },
  approvals: {
    label: 'الموافقات',
    icon: '✅',
    collection: 'approvals',
    columns: ['date', 'requestType', 'requester', 'description', 'status', 'approver', 'notes'],
    headers: ['التاريخ', 'نوع الطلب', 'مقدم الطلب', 'الوصف', 'الحالة', 'الموافق', 'ملاحظات'],
    sample: ['2024-01-05', 'إجازة', 'أحمد محمد', 'طلب إجازة سنوية', 'موافق', 'المدير', ''],
    transform: (row) => ({
      date:        toISO(row[0]) || '',
      requestType: ss(row[1]),
      requester:   ss(row[2]),
      description: ss(row[3]),
      status:      ss(row[4]) || 'قيد المراجعة',
      approver:    ss(row[5]),
      notes:       ss(row[6])
    }),
    validate: (r) => !!r.requester && !!r.requestType
  },
  invoices: {
    label: 'الفواتير',
    icon: '🧾',
    collection: 'invoices',
    columns: ['invoiceNum', 'date', 'client', 'description', 'total', 'status', 'notes'],
    headers: ['رقم الفاتورة', 'التاريخ', 'العميل/الجهة', 'الوصف', 'الإجمالي', 'الحالة', 'ملاحظات'],
    sample: ['INV-001', '2024-01-15', 'شركة النقل', 'خدمات نقل', '5000', 'مدفوعة', ''],
    transform: (row) => ({
      invoiceNum: ss(row[0]),
      date:       toISO(row[1]) || '',
      client:     ss(row[2]),
      description:ss(row[3]),
      total:      Number(row[4]) || 0,
      status:     ss(row[5]) || 'معلقة',
      notes:      ss(row[6]),
      items:      []
    }),
    validate: (r) => !!r.client && r.total > 0
  }
};

// الحالة الداخلية للاستيراد
const IMP = {
  current: 'drivers',
  parsed:  {},
  stats:   {}
};

// ── تهيئة القسم ──────────────────────────────────────────

function initImportSection() {
  const tabBar = document.getElementById('imp-tab-bar');
  const panels = document.getElementById('imp-panels');
  if (!tabBar || !panels) return;

  tabBar.innerHTML = '';
  panels.innerHTML = '';

  Object.entries(SHEET_MAPS).forEach(([key, cfg]) => {
    // تاب
    const tab = document.createElement('button');
    tab.className = 'imp-tab' + (key === IMP.current ? ' active' : '');
    tab.textContent = cfg.icon + ' ' + cfg.label;
    tab.onclick = () => switchImportTab(key);
    tabBar.appendChild(tab);

    // بانيل
    const panel = document.createElement('div');
    panel.id = 'imp-panel-' + key;
    panel.className = 'import-panel';
    panel.style.display = key === IMP.current ? '' : 'none';
    panel.innerHTML = buildImportPanel(key, cfg);
    panels.appendChild(panel);
  });

  // إضافة event listeners لمناطق السحب والإفلات
  Object.keys(SHEET_MAPS).forEach(setupDropZone);
}

function switchImportTab(key) {
  IMP.current = key;
  document.querySelectorAll('.imp-tab').forEach((t, i) => {
    t.classList.toggle('active', Object.keys(SHEET_MAPS)[i] === key);
  });
  Object.keys(SHEET_MAPS).forEach(k => {
    const p = document.getElementById('imp-panel-' + k);
    if (p) p.style.display = k === key ? '' : 'none';
  });
}

function buildImportPanel(key, cfg) {
  return `
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:1rem">
      <div>
        <div style="font-weight:700;font-size:.9rem">${cfg.icon} استيراد ${cfg.label}</div>
        <div style="font-size:.75rem;color:var(--muted);margin-top:2px">
          ارفع ملف Excel المُصدَّر من Google Sheets — الأعمدة المطلوبة: <strong>${cfg.headers.join(' | ')}</strong>
        </div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="downloadSample('${key}')">⬇ تحميل نموذج CSV</button>
    </div>

    <div class="drop-zone" id="dz-${key}" onclick="document.getElementById('fi-${key}').click()">
      <input type="file" id="fi-${key}" accept=".xlsx,.xls,.csv" style="display:none" onchange="handleImportFile('${key}',this)">
      <div class="drop-zone-icon">📂</div>
      <div class="drop-zone-txt">اسحب ملف Excel / CSV هنا أو <strong>اضغط للاختيار</strong></div>
    </div>

    <div class="import-preview" id="prev-${key}">
      <div class="prev-title" id="prev-title-${key}"></div>
      <div style="overflow-x:auto;max-height:260px;overflow-y:auto" id="prev-tbl-wrap-${key}"></div>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <button class="btn btn-green" id="imp-btn-${key}" onclick="uploadToFirebase('${key}')">
          🔥 رفع إلى Firebase
        </button>
        <button class="btn btn-outline btn-sm" onclick="clearImport('${key}')">🗑 إلغاء</button>
      </div>
    </div>

    <div class="import-progress" id="prog-${key}">
      <div class="progress-txt" id="prog-txt-${key}">جاري الرفع...</div>
      <div class="progress-bar-wrap"><div class="progress-bar" id="prog-bar-${key}"></div></div>
    </div>

    <div class="import-result" id="imp-result-${key}"></div>
  `;
}

function setupDropZone(key) {
  const dz = document.getElementById('dz-' + key);
  if (!dz) return;
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('over'));
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('over');
    const file = e.dataTransfer.files[0];
    if (file) processImportFile(key, file);
  });
}

// ── معالجة الملف ─────────────────────────────────────────

function handleImportFile(key, input) {
  const file = input.files[0];
  if (!file) return;
  processImportFile(key, file);
  input.value = '';
}

function processImportFile(key, file) {
  const reader = new FileReader();
  const isCSV  = file.name.toLowerCase().endsWith('.csv');

  reader.onload = e => {
    try {
      let rows;
      if (isCSV) {
        rows = parseCSV(e.target.result);
      } else {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });
      }

      // تخطي الهيدر (أول صف)
      const dataRows = rows.slice(1).filter(r => r.some(c => c !== '' && c !== null && c !== undefined));
      if (!dataRows.length) { showImportResult(key, false, 'لم يتم العثور على بيانات في الملف'); return; }

      const cfg = SHEET_MAPS[key];
      const transformed = dataRows.map(r => cfg.transform(r));
      const valid   = transformed.filter(r => cfg.validate(r));
      const invalid = transformed.length - valid.length;

      IMP.parsed[key] = valid;
      IMP.stats[key]  = { total: transformed.length, valid: valid.length, invalid };

      showImportPreview(key, valid, invalid);
    } catch (err) {
      showImportResult(key, false, 'خطأ في قراءة الملف: ' + err.message);
    }
  };

  if (isCSV) reader.readAsText(file, 'UTF-8');
  else       reader.readAsArrayBuffer(file);
}

function parseCSV(text) {
  return text.split('\n').map(line =>
    line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
  ).filter(r => r.length > 1);
}

// ── عرض المعاينة ──────────────────────────────────────────

function showImportPreview(key, valid, invalidCount) {
  const cfg   = SHEET_MAPS[key];
  const prev  = document.getElementById('prev-' + key);
  const title = document.getElementById('prev-title-' + key);
  const wrap  = document.getElementById('prev-tbl-wrap-' + key);
  const btn   = document.getElementById('imp-btn-' + key);

  if (!prev) return;
  prev.style.display = '';

  const previewRows = valid.slice(0, 8);
  const colKeys = cfg.columns;

  title.innerHTML =
    `<span style="color:var(--g);font-weight:700">✅ ${valid.length} سجل صالح</span>` +
    (invalidCount > 0 ? ` &nbsp; <span style="color:var(--accent)">⚠️ ${invalidCount} تم تجاهلها</span>` : '') +
    ` &nbsp; <span style="color:var(--muted);font-size:.76rem">(معاينة أول ${previewRows.length})</span>`;

  wrap.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:.78rem;min-width:400px">
      <thead><tr>${cfg.headers.map(h => `<th style="background:var(--ink);color:#f5f0e8;padding:7px 10px;text-align:right;white-space:nowrap">${h}</th>`).join('')}</tr></thead>
      <tbody>${previewRows.map(r =>
        `<tr style="border-bottom:1px solid var(--cream)">${colKeys.map(c =>
          `<td style="padding:6px 10px;background:#fff">${r[c] ?? '—'}</td>`
        ).join('')}</tr>`
      ).join('')}</tbody>
    </table>
  `;

  if (btn) btn.textContent = `🔥 رفع ${valid.length} سجل إلى Firebase`;
}

// ── الرفع إلى Firebase ────────────────────────────────────

async function uploadToFirebase(key) {
  if (!FB_READY) { toast('⚠ اتصل بـ Firebase أولاً من الإعدادات', 'warn'); return; }
  const rows = IMP.parsed[key];
  if (!rows || !rows.length) { toast('⚠ لا توجد بيانات للرفع', 'warn'); return; }

  const btn  = document.getElementById('imp-btn-' + key);
  const prog = document.getElementById('prog-' + key);
  const bar  = document.getElementById('prog-bar-' + key);
  const txt  = document.getElementById('prog-txt-' + key);

  if (btn)  btn.disabled = true;
  if (prog) prog.style.display = '';
  if (txt)  txt.textContent = `جاري رفع ${rows.length} سجل...`;

  try {
    await dbBatchImport(SHEET_MAPS[key].collection, rows, pct => {
      if (bar) bar.style.width = pct + '%';
      if (txt) txt.textContent = `جاري الرفع... ${pct}%`;
    });

    if (prog) prog.style.display = 'none';
    showImportResult(key, true, `✅ تم رفع ${rows.length} سجل بنجاح إلى Firebase`);
    clearImport(key);
    toast(`✅ تم استيراد ${rows.length} سجل (${SHEET_MAPS[key].label})`, 'ok');
    await loadAll();
  } catch (err) {
    if (prog) prog.style.display = 'none';
    showImportResult(key, false, '❌ فشل الرفع: ' + err.message);
    if (btn) btn.disabled = false;
  }
}

function showImportResult(key, ok, msg) {
  const el = document.getElementById('imp-result-' + key);
  if (!el) return;
  el.style.display = '';
  el.className = 'import-result ' + (ok ? 'ok' : 'err');
  el.textContent = msg;
  setTimeout(() => { el.style.display = 'none'; }, 6000);
}

function clearImport(key) {
  IMP.parsed[key] = null;
  const prev = document.getElementById('prev-' + key);
  if (prev) prev.style.display = 'none';
  const prog = document.getElementById('prog-' + key);
  if (prog) prog.style.display = 'none';
}

// ── تحميل نموذج CSV ───────────────────────────────────────

function downloadSample(key) {
  const cfg = SHEET_MAPS[key];
  const rows = [cfg.headers, cfg.sample];
  const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href  = URL.createObjectURL(blob);
  link.download = `نموذج_${cfg.label}.csv`;
  link.click();
}
