// ============================================================
// 🚦 النظام المتكامل — المنطق الرئيسي
// ============================================================

// ── STATE ─────────────────────────────────────────────────
const DATA = {
  drivers: [], violations: [], deductions: [], accounts: [],
  licenses: [], custody: [], approvals: [], invoices: []
};
const PS = APP_CONFIG.pageSize;
const PG = { vlog: 1, dlog: 1, rp: 1, cust: 1, appr: 1, inv: 1 };
const FILTERS = { vlog: '', dlog: '', acc: '', rp: '', dr: '', cust: '', appr: '', inv: '', lic: '' };
let LIC_FILTER = 'all';

// ── INIT ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const ok = initFirebase();
  if (ok) loadAll();
  setTodayDates();
  buildInvItemsRows();
  initImportSection();
  updateSettingsUI();
  // عدد الأسطر في فاتورة الإدخال
  setTimeout(() => buildFvRows(), 80);
});

// ── LOAD ALL ──────────────────────────────────────────────
async function loadAll() {
  if (!FB_READY) { setStatus('warn', '⚠️ Firebase غير مُهيَّأ'); return; }
  setStatus('loading', 'جاري التحميل...');
  try {
    const [drivers, violations, deductions, licenses, custody, approvals, invoices] = await Promise.all([
      dbGetDrivers(), dbGetViolations(), dbGetDeductions(),
      dbGetLicenses(), dbGetCustody(), dbGetApprovals(), dbGetInvoices()
    ]);
    DATA.drivers    = drivers;
    DATA.violations = violations;
    DATA.deductions = deductions;
    DATA.licenses   = licenses.map(l => { const s = calcLicenseStatus(l.expiry); return { ...l, ...s }; });
    DATA.custody    = custody;
    DATA.approvals  = approvals;
    DATA.invoices   = invoices;
    DATA.accounts   = computeAccounts(violations, deductions, drivers);
    setStatus('ok', '✅ متصل — ' + new Date().toLocaleTimeString('ar-EG'));
    renderAll();
    toast('✅ تم تحديث البيانات', 'ok');
  } catch (e) {
    setStatus('err', '❌ ' + e.message);
    toast('❌ ' + e.message, 'err');
    console.error('loadAll error:', e);
  }
}

function renderAll() {
  buildDriverSelects();
  renderDash();
  buildDriversTable();
  renderVLog();
  renderDLog();
  renderAcc();
  renderReport();
  renderLicenses();
  renderLicStats();
  renderCustody();
  renderApprovals();
  renderInvoices();
  updateDatalist();
  setTodayDates();
}

// ── NAV ───────────────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tnav-btn').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');
  const tn = document.getElementById('tn-' + id);
  if (tn) tn.classList.add('active');
  if (id === 'licenses') { renderLicenses(); renderLicStats(); }
  if (id === 'import') initImportSection();
}

// ── STATUS ────────────────────────────────────────────────
function setStatus(t, txt) {
  document.getElementById('status-dot').className = 'status-dot ' + t;
  document.getElementById('status-txt').textContent = txt;
}

// ── HELPERS ───────────────────────────────────────────────
function ss(v) { return v === null || v === undefined ? '' : String(v); }
function toISO(d) {
  if (!d) return '';
  try {
    if (d instanceof Date) return d.toISOString().slice(0, 10);
    const s = String(d).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(s)) {
      const [a, b, c] = s.split(/[\/\-]/);
      return `${c}-${b.padStart(2, '0')}-${a.padStart(2, '0')}`;
    }
    const dt = new Date(s);
    if (!isNaN(dt)) return dt.toISOString().slice(0, 10);
    return s;
  } catch { return String(d); }
}
function toDay() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}
function fmtD(d) {
  if (!d) return '—';
  try {
    const [y, m, day] = String(d).slice(0, 10).split('-');
    return new Date(+y, +m - 1, +day).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return d; }
}
function fmt(n) { return Number(n).toLocaleString('ar-EG', { maximumFractionDigits: 0 }); }
function setTodayDates() {
  ['fv-date', 'fd-date', 'fc-date', 'fa-date', 'fi-date'].forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value) el.value = toDay();
  });
}
function buildDriverSelects() {
  const names = [...new Set([
    ...DATA.drivers.map(d => d.name),
    ...DATA.violations.map(v => v.driver),
    ...DATA.deductions.map(d => d.driver)
  ])].filter(Boolean).sort();
  const opts = '<option value="">كل السائقين</option>' + names.map(n => `<option value="${n}">${n}</option>`).join('');
  ['vs-driver', 'ds-driver', 'rp-driver'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const c = el.value;
    el.innerHTML = opts;
    if (c) el.value = c;
  });
}
function updateDatalist() {
  const dl = document.getElementById('dl-list');
  if (dl) dl.innerHTML = DATA.drivers.map(d => `<option value="${d.name}">`).join('');
}
function buildFvRows() {
  const t = document.getElementById('fv-rows');
  if (!t || t.children.length >= 5) return;
  t.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    t.insertAdjacentHTML('beforeend',
      `<tr><td><input type="text" id="fv-desc-${i}" placeholder="وصف المخالفة"></td>
       <td><input type="number" id="fv-amt-${i}" placeholder="0" min="0"></td></tr>`);
  }
}

// ── PAGER ─────────────────────────────────────────────────
function makePager(total, cur, onPage, containerId) {
  const pages = Math.ceil(total / PS);
  const el = document.getElementById(containerId);
  if (!el || pages <= 1) { if (el) el.innerHTML = ''; return; }
  const btns = [];
  if (cur > 1) btns.push(`<button class="pg-btn" onclick="${onPage}(${cur - 1})">›</button>`);
  for (let p = Math.max(1, cur - 2); p <= Math.min(pages, cur + 2); p++) {
    btns.push(`<button class="pg-btn ${p === cur ? 'on' : ''}" onclick="${onPage}(${p})">${p}</button>`);
  }
  if (cur < pages) btns.push(`<button class="pg-btn" onclick="${onPage}(${cur + 1})">‹</button>`);
  el.innerHTML = btns.join('');
}

// ── DASHBOARD ─────────────────────────────────────────────
function renderDash() {
  const vA = DATA.violations.reduce((s, v) => s + Number(v.amount || 0), 0);
  const dA = DATA.deductions.reduce((s, d) => s + Number(d.amount || 0), 0);
  const dr = new Set([...DATA.drivers.map(d => d.name), ...DATA.violations.map(v => v.driver)]);
  const invTotal = DATA.invoices.reduce((s, i) => s + Number(i.total || 0), 0);
  const custTotal = DATA.custody.reduce((s, c) => s + (Number(c.value || 0) * Number(c.quantity || 1)), 0);

  setEl('s-vc', DATA.violations.length);
  setEl('s-va', fmt(vA) + ' ج');
  setEl('s-da', fmt(dA) + ' ج');
  setEl('s-rem', fmt(vA - dA) + ' ج');
  setEl('s-dr', dr.size);
  setEl('s-cars', new Set(DATA.violations.map(v => v.car)).size);
  setEl('s-inv', fmt(invTotal) + ' ج');
  setEl('s-cust', DATA.custody.length);

  // آخر المخالفات
  const latest = [...DATA.violations].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  setEl('dash-vtbl', !latest.length
    ? '<tr><td colspan="5" class="tbl-loading">لا توجد مخالفات</td></tr>'
    : latest.map(v => `<tr>
        <td>${fmtD(v.date)}</td>
        <td class="driver-cell">${v.driver}</td>
        <td class="car-cell">${v.car || '—'}</td>
        <td class="desc-cell">${v.desc}</td>
        <td class="money-red">${fmt(v.amount)} ج</td>
      </tr>`).join(''));

  // تراخيص تحتاج انتباه
  const urgentLics = DATA.licenses.filter(l => l.status !== 'ساري')
    .sort((a, b) => (a.diffDays ?? 999) - (b.diffDays ?? 999)).slice(0, 6);
  setEl('s-lic-ok',   DATA.licenses.filter(l => l.status === 'ساري').length);
  setEl('s-lic-soon', DATA.licenses.filter(l => l.status === 'ينتهي قريباً').length);
  setEl('s-lic-exp',  DATA.licenses.filter(l => l.status === 'منتهي').length);
  setEl('dash-lic-tbl', !urgentLics.length
    ? '<tr><td colspan="4" class="tbl-loading" style="color:var(--g)">✅ كل التراخيص سارية</td></tr>'
    : urgentLics.map(l => `<tr>
        <td class="car-cell">${l.carNumber}</td>
        <td>${l.company || '—'}</td>
        <td class="lic-expiry ${l.status === 'منتهي' ? 'expired' : 'soon'}">${fmtD(l.expiry)}</td>
        <td>${licStatusTag(l.status)}</td>
      </tr>`).join(''));

  // موافقات معلقة
  const pending = DATA.approvals.filter(a => a.status === 'قيد المراجعة').slice(0, 5);
  setEl('s-appr-pend', pending.length);
  setEl('dash-appr-tbl', !pending.length
    ? '<tr><td colspan="3" class="tbl-loading" style="color:var(--g)">✅ لا توجد طلبات معلقة</td></tr>'
    : pending.map(a => `<tr>
        <td>${a.requestType}</td>
        <td class="driver-cell">${a.requester}</td>
        <td>${approvalStatusTag(a.status)}</td>
      </tr>`).join(''));
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = val;
}

// ── DRIVERS TABLE ─────────────────────────────────────────
function buildDriversTable() {
  const q = (FILTERS.dr || '').toLowerCase();
  const rows = DATA.drivers.filter(d =>
    !q || d.name.toLowerCase().includes(q) || (d.car || '').toLowerCase().includes(q)
  );
  setEl('dr-tbl', !rows.length
    ? '<tr><td colspan="4" class="empty-state"><div class="empty-icon">👤</div><div class="empty-txt">لا يوجد سائقون</div></td></tr>'
    : rows.map((d, i) => `<tr>
        <td class="num-cell">${i + 1}</td>
        <td class="driver-cell">${d.name}</td>
        <td class="car-cell">${d.car || '—'}</td>
        <td>
          <button class="btn btn-edit-sm btn-sm" onclick="openEditDriver('${d.id}')">✏ تعديل</button>
          <button class="btn btn-del-sm btn-sm" onclick="confirmDel('driver','${d.id}')">🗑</button>
        </td>
      </tr>`).join(''));
  setEl('dr-count', `${rows.length} سائق`);
}

// ── VIOLATIONS LOG ────────────────────────────────────────
function renderVLog() {
  const q  = (FILTERS.vlog || '').toLowerCase();
  const dr = document.getElementById('vs-driver')?.value || '';
  let rows = DATA.violations.filter(v =>
    (!dr || v.driver === dr) &&
    (!q  || v.driver.toLowerCase().includes(q) || (v.car || '').toLowerCase().includes(q) || (v.desc || '').toLowerCase().includes(q))
  );
  const total = rows.length;
  rows = rows.slice((PG.vlog - 1) * PS, PG.vlog * PS);
  setEl('vlog-tbl', !rows.length
    ? '<tr><td colspan="7" class="empty-state"><div class="empty-icon">🚨</div><div class="empty-txt">لا توجد مخالفات</div></td></tr>'
    : rows.map((v, i) => `<tr>
        <td class="num-cell">${(PG.vlog - 1) * PS + i + 1}</td>
        <td>${fmtD(v.date)}</td>
        <td class="driver-cell">${v.driver}</td>
        <td class="car-cell">${v.car || '—'}</td>
        <td class="desc-cell">${v.desc}</td>
        <td class="money-red">${fmt(v.amount)} ج</td>
        <td>
          <button class="btn btn-edit-sm btn-sm" onclick="openEditV('${v.id}')">✏</button>
          <button class="btn btn-del-sm btn-sm" onclick="confirmDel('violation','${v.id}')">🗑</button>
        </td>
      </tr>`).join(''));
  makePager(total, PG.vlog, 'pgVlog', 'vlog-pager');
}
function pgVlog(p) { PG.vlog = p; renderVLog(); }

// ── DEDUCTIONS LOG ────────────────────────────────────────
function renderDLog() {
  const q  = (FILTERS.dlog || '').toLowerCase();
  const dr = document.getElementById('ds-driver')?.value || '';
  let rows = DATA.deductions.filter(d =>
    (!dr || d.driver === dr) &&
    (!q  || d.driver.toLowerCase().includes(q) || (d.type || '').toLowerCase().includes(q))
  );
  const total = rows.length;
  rows = rows.slice((PG.dlog - 1) * PS, PG.dlog * PS);
  setEl('dlog-tbl', !rows.length
    ? '<tr><td colspan="6" class="empty-state"><div class="empty-icon">💸</div><div class="empty-txt">لا توجد خصومات</div></td></tr>'
    : rows.map((d, i) => `<tr>
        <td class="num-cell">${(PG.dlog - 1) * PS + i + 1}</td>
        <td>${fmtD(d.date)}</td>
        <td class="driver-cell">${d.driver}</td>
        <td class="money-grn">${fmt(d.amount)} ج</td>
        <td><span class="tag tag-d">${d.type || 'خصم'}</span></td>
        <td>
          <button class="btn btn-edit-sm btn-sm" onclick="openEditD('${d.id}')">✏</button>
          <button class="btn btn-del-sm btn-sm" onclick="confirmDel('deduction','${d.id}')">🗑</button>
        </td>
      </tr>`).join(''));
  makePager(total, PG.dlog, 'pgDlog', 'dlog-pager');
}
function pgDlog(p) { PG.dlog = p; renderDLog(); }

// ── ACCOUNTS ──────────────────────────────────────────────
function renderAcc() {
  const q = (FILTERS.acc || '').toLowerCase();
  const rows = DATA.accounts.filter(a =>
    !q || a.driver.toLowerCase().includes(q)
  ).sort((a, b) => b.remaining - a.remaining);
  setEl('acc-tbl', !rows.length
    ? '<tr><td colspan="4" class="empty-state"><div class="empty-icon">💰</div><div class="empty-txt">لا توجد حسابات</div></td></tr>'
    : rows.map((a, i) => `<tr>
        <td class="num-cell">${i + 1}</td>
        <td class="driver-cell">${a.driver}</td>
        <td class="money-red">${fmt(a.violations)} ج</td>
        <td class="money-grn">${fmt(a.deductions)} ج</td>
        <td class="${a.remaining > 0 ? 'money-gold' : 'money-grn'}">${fmt(a.remaining)} ج</td>
      </tr>`).join(''));
  const totV = DATA.accounts.reduce((s, a) => s + a.violations, 0);
  const totD = DATA.accounts.reduce((s, a) => s + a.deductions, 0);
  setEl('acc-total-v', fmt(totV) + ' ج');
  setEl('acc-total-d', fmt(totD) + ' ج');
  setEl('acc-total-r', fmt(totV - totD) + ' ج');
}

// ── REPORT ────────────────────────────────────────────────
function renderReport() {
  const q  = (FILTERS.rp || '').toLowerCase();
  const dr = document.getElementById('rp-driver')?.value || '';
  const tp = document.getElementById('rp-type')?.value || '';
  const combined = [
    ...DATA.violations.map(v => ({ ...v, _type: 'مخالفة' })),
    ...DATA.deductions.map(d => ({ ...d, _type: 'خصم' }))
  ].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  let rows = combined.filter(r =>
    (!dr || r.driver === dr) &&
    (!tp || r._type === tp) &&
    (!q  || r.driver.toLowerCase().includes(q))
  );
  const total = rows.length;
  rows = rows.slice((PG.rp - 1) * PS, PG.rp * PS);
  setEl('rp-tbl', !rows.length
    ? '<tr><td colspan="7" class="empty-state"><div class="empty-icon">📊</div><div class="empty-txt">لا توجد بيانات</div></td></tr>'
    : rows.map((r, i) => `<tr>
        <td class="num-cell">${(PG.rp - 1) * PS + i + 1}</td>
        <td>${fmtD(r.date)}</td>
        <td class="driver-cell">${r.driver}</td>
        <td class="car-cell">${r.car || '—'}</td>
        <td class="desc-cell">${r.desc || r.type || '—'}</td>
        <td class="${r._type === 'مخالفة' ? 'money-red' : 'money-grn'}">${fmt(r.amount)} ج</td>
        <td><span class="tag ${r._type === 'مخالفة' ? 'tag-v' : 'tag-d'}">${r._type}</span></td>
      </tr>`).join(''));
  makePager(total, PG.rp, 'pgRp', 'rp-pager');
}
function pgRp(p) { PG.rp = p; renderReport(); }

// ── LICENSES ──────────────────────────────────────────────
function licStatusTag(s) {
  if (s === 'ساري')           return '<span class="tag tag-ok">✅ ساري</span>';
  if (s === 'ينتهي قريباً')   return '<span class="tag tag-warn">⚠️ ينتهي قريباً</span>';
  if (s === 'منتهي')          return '<span class="tag tag-expired">❌ منتهي</span>';
  return `<span class="tag">${s}</span>`;
}
function renderLicStats() {
  setEl('ls-ok',    DATA.licenses.filter(l => l.status === 'ساري').length);
  setEl('ls-soon',  DATA.licenses.filter(l => l.status === 'ينتهي قريباً').length);
  setEl('ls-exp',   DATA.licenses.filter(l => l.status === 'منتهي').length);
  setEl('ls-total', DATA.licenses.length);
}
function setLicFilter(f, btn) {
  LIC_FILTER = f;
  document.querySelectorAll('.lic-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderLicenses();
}
function renderLicenses() {
  const q = (document.getElementById('lic-q')?.value || '').toLowerCase().trim();
  let lics = DATA.licenses;
  if (LIC_FILTER !== 'all') lics = lics.filter(l => l.status === LIC_FILTER);
  if (q) lics = lics.filter(l =>
    (l.carNumber || '').toLowerCase().includes(q) ||
    (l.company || '').toLowerCase().includes(q) ||
    (l.driver || '').toLowerCase().includes(q)
  );
  lics = lics.sort((a, b) => (a.diffDays ?? 9999) - (b.diffDays ?? 9999));
  const grid  = document.getElementById('lic-cards');
  const empty = document.getElementById('lic-empty');
  if (!lics.length) {
    if (grid)  grid.innerHTML = '';
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';
  if (grid) grid.innerHTML = lics.map(l => {
    const cls    = l.status === 'منتهي' ? 'expired' : l.status === 'ينتهي قريباً' ? 'soon' : '';
    const expCls = l.status === 'منتهي' ? 'expired' : l.status === 'ينتهي قريباً' ? 'soon' : 'ok';
    const days   = l.diffDays === null ? '' : l.diffDays < 0 ? `منذ ${Math.abs(l.diffDays)} يوم` : l.diffDays === 0 ? 'ينتهي اليوم!' : `باقي ${l.diffDays} يوم`;
    return `
      <div class="lic-card ${cls}">
        <div class="lic-card-head ${cls || 'ok'}">
          <div>
            <div class="lic-car-num">🚗 ${l.carNumber}</div>
            ${l.carType ? `<div style="font-size:.72rem;color:var(--muted);margin-top:2px">${l.carType}</div>` : ''}
          </div>
          ${licStatusTag(l.status)}
        </div>
        <div class="lic-card-body">
          ${l.company ? `<div class="lic-row"><span class="lic-lbl">الشركة</span><span class="lic-val">${l.company}</span></div>` : ''}
          <div class="lic-row"><span class="lic-lbl">السائق</span><span class="lic-val">${l.driver || '—'}</span></div>
          ${l.chassis ? `<div class="lic-row"><span class="lic-lbl">الشاسيه</span><span class="lic-val" style="font-family:monospace;font-size:.77rem">${l.chassis}</span></div>` : ''}
          <div class="lic-row" style="margin-top:5px">
            <span class="lic-lbl">تاريخ الانتهاء</span>
            <span class="lic-expiry ${expCls}">${fmtD(l.expiry)}</span>
          </div>
          ${days ? `<div style="font-size:.73rem;font-weight:700;color:var(--muted);text-align:left">${days}</div>` : ''}
        </div>
        <div class="lic-card-foot" style="display:flex;gap:6px">
          <button class="btn btn-teal btn-sm" style="flex:1;justify-content:center" onclick="openRenewLicense('${l.id}','${l.carNumber}','${l.expiry}','${l.company || ''}','${l.driver || ''}')">🔄 تجديد</button>
          <button class="btn btn-del-sm btn-sm" onclick="confirmDel('license','${l.id}')">🗑</button>
        </div>
      </div>`;
  }).join('');
}

// ── CUSTODY (العهد) ───────────────────────────────────────
function renderCustody() {
  const q  = (FILTERS.cust || '').toLowerCase();
  let rows = DATA.custody.filter(c =>
    !q || c.employee.toLowerCase().includes(q) || (c.itemDesc || '').toLowerCase().includes(q)
  );
  const total = rows.length;
  rows = rows.slice((PG.cust - 1) * PS, PG.cust * PS);

  const totVal = DATA.custody.reduce((s, c) => s + (Number(c.value || 0) * Number(c.quantity || 1)), 0);
  const delivered = DATA.custody.filter(c => c.status === 'مسلّمة').length;
  const returned  = DATA.custody.filter(c => c.status === 'مُعادة').length;
  setEl('cust-total',     DATA.custody.length);
  setEl('cust-delivered', delivered);
  setEl('cust-returned',  returned);
  setEl('cust-value',     fmt(totVal) + ' ج');

  setEl('cust-tbl', !rows.length
    ? '<tr><td colspan="8" class="empty-state"><div class="empty-icon">📦</div><div class="empty-txt">لا توجد عهد</div></td></tr>'
    : rows.map((c, i) => `<tr>
        <td class="num-cell">${(PG.cust - 1) * PS + i + 1}</td>
        <td>${fmtD(c.date)}</td>
        <td class="driver-cell">${c.employee}</td>
        <td class="car-cell">${c.car || '—'}</td>
        <td>${c.itemDesc}</td>
        <td class="num-cell">${c.quantity} ${c.unit || ''}</td>
        <td class="money-gold">${fmt(Number(c.value || 0) * Number(c.quantity || 1))} ج</td>
        <td><span class="tag ${c.status === 'مسلّمة' ? 'tag-delivered' : 'tag-returned'}">${c.status || '—'}</span></td>
        <td>
          <button class="btn btn-edit-sm btn-sm" onclick="openEditCustody('${c.id}')">✏</button>
          <button class="btn btn-del-sm btn-sm" onclick="confirmDel('custody','${c.id}')">🗑</button>
        </td>
      </tr>`).join(''));
  makePager(total, PG.cust, 'pgCust', 'cust-pager');
}
function pgCust(p) { PG.cust = p; renderCustody(); }

// ── APPROVALS (الموافقات) ─────────────────────────────────
function approvalStatusTag(s) {
  if (s === 'موافق')          return '<span class="tag tag-approved">✅ موافق</span>';
  if (s === 'مرفوض')          return '<span class="tag tag-rejected">❌ مرفوض</span>';
  if (s === 'قيد المراجعة')   return '<span class="tag tag-pending">⏳ قيد المراجعة</span>';
  return `<span class="tag">${s}</span>`;
}
function renderApprovals() {
  const q = (FILTERS.appr || '').toLowerCase();
  const st = document.getElementById('appr-status')?.value || '';
  let rows = DATA.approvals.filter(a =>
    (!st || a.status === st) &&
    (!q  || a.requester.toLowerCase().includes(q) || (a.requestType || '').toLowerCase().includes(q))
  );
  const total = rows.length;
  rows = rows.slice((PG.appr - 1) * PS, PG.appr * PS);

  setEl('appr-total',    DATA.approvals.length);
  setEl('appr-pending',  DATA.approvals.filter(a => a.status === 'قيد المراجعة').length);
  setEl('appr-approved', DATA.approvals.filter(a => a.status === 'موافق').length);
  setEl('appr-rejected', DATA.approvals.filter(a => a.status === 'مرفوض').length);

  setEl('appr-tbl', !rows.length
    ? '<tr><td colspan="7" class="empty-state"><div class="empty-icon">✅</div><div class="empty-txt">لا توجد طلبات</div></td></tr>'
    : rows.map((a, i) => `<tr>
        <td class="num-cell">${(PG.appr - 1) * PS + i + 1}</td>
        <td>${fmtD(a.date)}</td>
        <td><span class="tag tag-pending" style="background:rgba(26,74,122,.1);color:var(--b)">${a.requestType}</span></td>
        <td class="driver-cell">${a.requester}</td>
        <td class="desc-cell">${a.description || '—'}</td>
        <td>${approvalStatusTag(a.status)}</td>
        <td>
          ${a.status === 'قيد المراجعة' ? `
            <button class="btn btn-ok-sm btn-sm" onclick="changeApprovalStatus('${a.id}','موافق')">✅</button>
            <button class="btn btn-del-sm btn-sm" onclick="changeApprovalStatus('${a.id}','مرفوض')">❌</button>
          ` : ''}
          <button class="btn btn-edit-sm btn-sm" onclick="openEditApproval('${a.id}')">✏</button>
          <button class="btn btn-del-sm btn-sm" onclick="confirmDel('approval','${a.id}')">🗑</button>
        </td>
      </tr>`).join(''));
  makePager(total, PG.appr, 'pgAppr', 'appr-pager');
}
function pgAppr(p) { PG.appr = p; renderApprovals(); }

// ── INVOICES (الفواتير) ───────────────────────────────────
function invoiceStatusTag(s) {
  if (s === 'مدفوعة') return '<span class="tag tag-paid">✅ مدفوعة</span>';
  if (s === 'معلقة')  return '<span class="tag tag-unpaid">⏳ معلقة</span>';
  if (s === 'ملغاة')  return '<span class="tag tag-rejected">❌ ملغاة</span>';
  return `<span class="tag">${s}</span>`;
}
function renderInvoices() {
  const q  = (FILTERS.inv || '').toLowerCase();
  const st = document.getElementById('inv-status')?.value || '';
  let rows = DATA.invoices.filter(inv =>
    (!st || inv.status === st) &&
    (!q  || (inv.client || '').toLowerCase().includes(q) || (inv.invoiceNum || '').toLowerCase().includes(q))
  );
  const total = rows.length;
  rows = rows.slice((PG.inv - 1) * PS, PG.inv * PS);

  const totAll  = DATA.invoices.reduce((s, i) => s + Number(i.total || 0), 0);
  const totPaid = DATA.invoices.filter(i => i.status === 'مدفوعة').reduce((s, i) => s + Number(i.total || 0), 0);
  const totPend = DATA.invoices.filter(i => i.status === 'معلقة').reduce((s, i) => s + Number(i.total || 0), 0);

  setEl('inv-total',   DATA.invoices.length);
  setEl('inv-paid',    fmt(totPaid) + ' ج');
  setEl('inv-pending', fmt(totPend) + ' ج');
  setEl('inv-sum',     fmt(totAll) + ' ج');

  setEl('inv-tbl', !rows.length
    ? '<tr><td colspan="7" class="empty-state"><div class="empty-icon">🧾</div><div class="empty-txt">لا توجد فواتير</div></td></tr>'
    : rows.map((inv, i) => `<tr>
        <td class="num-cell">${(PG.inv - 1) * PS + i + 1}</td>
        <td style="font-family:monospace;font-weight:700">${inv.invoiceNum || '—'}</td>
        <td>${fmtD(inv.date)}</td>
        <td class="driver-cell">${inv.client}</td>
        <td class="desc-cell">${inv.description || '—'}</td>
        <td class="money-gold">${fmt(inv.total)} ج</td>
        <td>${invoiceStatusTag(inv.status)}</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="printInvoice('${inv.id}')">🖨</button>
          <button class="btn btn-edit-sm btn-sm" onclick="openEditInvoice('${inv.id}')">✏</button>
          <button class="btn btn-del-sm btn-sm" onclick="confirmDel('invoice','${inv.id}')">🗑</button>
        </td>
      </tr>`).join(''));
  makePager(total, PG.inv, 'pgInv', 'inv-pager');
}
function pgInv(p) { PG.inv = p; renderInvoices(); }

// ── INVOICE ITEMS ─────────────────────────────────────────
let INV_ITEMS = [{ desc: '', qty: 1, price: 0 }];
function buildInvItemsRows() {
  const t = document.getElementById('inv-items-body');
  if (!t) return;
  t.innerHTML = INV_ITEMS.map((item, i) => `
    <tr>
      <td><input type="text" value="${item.desc}" oninput="INV_ITEMS[${i}].desc=this.value" placeholder="البيان"></td>
      <td><input type="number" value="${item.qty}" min="1" oninput="INV_ITEMS[${i}].qty=+this.value;calcInvTotal()" style="width:70px"></td>
      <td><input type="number" value="${item.price}" min="0" oninput="INV_ITEMS[${i}].price=+this.value;calcInvTotal()" placeholder="0"></td>
      <td class="money-gold" id="inv-item-tot-${i}">${fmt(item.qty * item.price)}</td>
      <td><button class="btn btn-del-sm btn-sm" onclick="removeInvItem(${i})">×</button></td>
    </tr>`).join('');
  calcInvTotal();
}
function addInvItem() {
  INV_ITEMS.push({ desc: '', qty: 1, price: 0 });
  buildInvItemsRows();
}
function removeInvItem(i) {
  if (INV_ITEMS.length <= 1) return;
  INV_ITEMS.splice(i, 1);
  buildInvItemsRows();
}
function calcInvTotal() {
  INV_ITEMS.forEach((item, i) => {
    const el = document.getElementById('inv-item-tot-' + i);
    if (el) el.textContent = fmt(item.qty * item.price);
  });
  const total = INV_ITEMS.reduce((s, item) => s + item.qty * item.price, 0);
  setEl('inv-grand-total', fmt(total) + ' ج');
  return total;
}

// ── CRUD — DRIVERS ────────────────────────────────────────
let editDrvId = null;
function openAddDriver() {
  editDrvId = null;
  setEl('m-driver-title', '➕ إضافة سائق جديد');
  document.getElementById('md-name').value = '';
  document.getElementById('md-car').value  = '';
  openModal('m-driver');
}
function openEditDriver(id) {
  const d = DATA.drivers.find(x => x.id === id);
  if (!d) return;
  editDrvId = id;
  setEl('m-driver-title', '✏ تعديل بيانات السائق');
  document.getElementById('md-name').value = d.name;
  document.getElementById('md-car').value  = d.car;
  openModal('m-driver');
}
async function saveDriver() {
  const name = document.getElementById('md-name').value.trim();
  const car  = document.getElementById('md-car').value.trim();
  if (!name || !car) { toast('⚠ أدخل الاسم ورقم السيارة', 'warn'); return; }
  setBtnLoading('md-save', true);
  try {
    if (editDrvId) { await dbUpdateDriver(editDrvId, name, car); toast('✅ تم التعديل', 'ok'); }
    else           { await dbAddDriver(name, car); toast('✅ تمت الإضافة', 'ok'); }
    closeModal('m-driver');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('md-save', false); }
}

// ── CRUD — VIOLATIONS ────────────────────────────────────
async function saveViolation() {
  const driver = document.getElementById('fv-driver').value.trim();
  const car    = document.getElementById('fv-car').value.trim();
  const date   = document.getElementById('fv-date').value;
  if (!driver || !date) { toast('⚠ أدخل السائق والتاريخ', 'warn'); return; }
  const rows = [];
  for (let i = 0; i < 5; i++) {
    const desc = document.getElementById('fv-desc-' + i)?.value.trim();
    const amt  = parseFloat(document.getElementById('fv-amt-' + i)?.value || '0');
    if (desc && amt > 0) rows.push({ date, driver, car, desc, amount: amt });
  }
  if (!rows.length) { toast('⚠ أدخل مخالفة واحدة على الأقل', 'warn'); return; }
  setBtnLoading('fv-save', true);
  try {
    for (const r of rows) await dbAddViolation(r.date, r.driver, r.car, r.desc, r.amount);
    toast(`✅ تم حفظ ${rows.length} مخالفة`, 'ok');
    ['fv-driver', 'fv-car'].forEach(id => document.getElementById(id) && (document.getElementById(id).value = ''));
    for (let i = 0; i < 5; i++) {
      const d = document.getElementById('fv-desc-' + i); if (d) d.value = '';
      const a = document.getElementById('fv-amt-' + i);  if (a) a.value = '';
    }
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('fv-save', false); }
}

let editVId = null;
function openEditV(id) {
  const v = DATA.violations.find(x => x.id === id);
  if (!v) return;
  editVId = id;
  document.getElementById('ev-date').value   = v.date;
  document.getElementById('ev-driver').value = v.driver;
  document.getElementById('ev-car').value    = v.car;
  document.getElementById('ev-desc').value   = v.desc;
  document.getElementById('ev-amount').value = v.amount;
  openModal('m-ev');
}
async function updateViolation() {
  const date   = document.getElementById('ev-date').value;
  const driver = document.getElementById('ev-driver').value.trim();
  const car    = document.getElementById('ev-car').value.trim();
  const desc   = document.getElementById('ev-desc').value.trim();
  const amount = parseFloat(document.getElementById('ev-amount').value);
  if (!date || !driver || !desc || isNaN(amount) || amount <= 0) { toast('⚠ تحقق من البيانات', 'warn'); return; }
  setBtnLoading('ev-save', true);
  try {
    await dbUpdateViolation(editVId, date, driver, car, desc, amount);
    toast('✅ تم التعديل', 'ok');
    closeModal('m-ev');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('ev-save', false); }
}

// ── CRUD — DEDUCTIONS ─────────────────────────────────────
async function saveDeduction() {
  const driver = document.getElementById('fd-driver').value.trim();
  const amount = parseFloat(document.getElementById('fd-amount').value);
  const date   = document.getElementById('fd-date').value;
  const type   = document.getElementById('fd-type').value.trim() || 'خصم';
  if (!driver || !date || isNaN(amount) || amount <= 0) { toast('⚠ تحقق من البيانات', 'warn'); return; }
  setBtnLoading('fd-save', true);
  try {
    await dbAddDeduction(date, driver, amount, type);
    toast('✅ تم تسجيل الخصم', 'ok');
    document.getElementById('fd-driver').value = '';
    document.getElementById('fd-amount').value = '';
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('fd-save', false); }
}

let editDId = null;
function openEditD(id) {
  const d = DATA.deductions.find(x => x.id === id);
  if (!d) return;
  editDId = id;
  document.getElementById('ed-date').value   = d.date;
  document.getElementById('ed-driver').value = d.driver;
  document.getElementById('ed-amount').value = d.amount;
  document.getElementById('ed-type').value   = d.type || 'خصم';
  openModal('m-ed');
}
async function updateDeduction() {
  const date   = document.getElementById('ed-date').value;
  const driver = document.getElementById('ed-driver').value.trim();
  const amount = parseFloat(document.getElementById('ed-amount').value);
  const type   = document.getElementById('ed-type').value.trim() || 'خصم';
  if (!date || !driver || isNaN(amount) || amount <= 0) { toast('⚠ تحقق من البيانات', 'warn'); return; }
  setBtnLoading('ed-save', true);
  try {
    await dbUpdateDeduction(editDId, date, driver, amount, type);
    toast('✅ تم التعديل', 'ok');
    closeModal('m-ed');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('ed-save', false); }
}

// ── CRUD — LICENSES ───────────────────────────────────────
let editLicId = null;
function openAddLicense() {
  editLicId = null;
  setEl('m-lic-title', '➕ إضافة ترخيص');
  ['ml-car','ml-company','ml-cartype','ml-chassis','ml-driver','ml-expiry','ml-notes'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  openModal('m-license-form');
}
async function openRenewLicense(id, carNum, expiry, company, driver) {
  editLicId = id;
  const info = document.getElementById('lic-modal-info');
  if (info) info.innerHTML = `<strong>🚗 ${carNum}</strong>${company ? ' — ' + company : ''}${driver ? '<br>السائق: ' + driver : ''}<br>تاريخ الانتهاء الحالي: <strong style="color:var(--accent)">${fmtD(expiry)}</strong>`;
  document.getElementById('lic-new-date').value = '';
  openModal('m-license-renew');
}
async function saveLicenseRenewal() {
  const newDate = document.getElementById('lic-new-date').value;
  if (!newDate) { toast('⚠ أدخل التاريخ الجديد', 'warn'); return; }
  setBtnLoading('lic-renew-btn', true);
  try {
    const { status, diffDays } = calcLicenseStatus(newDate);
    await dbUpdateLicense(editLicId, { expiry: newDate, status, diffDays });
    toast('✅ تم تجديد الترخيص', 'ok');
    closeModal('m-license-renew');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('lic-renew-btn', false); }
}
async function saveLicenseForm() {
  const car = document.getElementById('ml-car').value.trim();
  if (!car) { toast('⚠ أدخل رقم السيارة', 'warn'); return; }
  const expiry = document.getElementById('ml-expiry').value;
  const { status, diffDays } = calcLicenseStatus(expiry);
  const data = {
    carNumber: car,
    company:   document.getElementById('ml-company').value.trim(),
    carType:   document.getElementById('ml-cartype').value.trim(),
    chassis:   document.getElementById('ml-chassis').value.trim(),
    driver:    document.getElementById('ml-driver').value.trim(),
    expiry, status, diffDays,
    notes:     document.getElementById('ml-notes').value.trim()
  };
  setBtnLoading('ml-save', true);
  try {
    if (editLicId) { await dbUpdateLicense(editLicId, data); toast('✅ تم التعديل', 'ok'); }
    else           { await dbAddLicense(data); toast('✅ تمت الإضافة', 'ok'); }
    closeModal('m-license-form');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('ml-save', false); }
}

// ── CRUD — CUSTODY ────────────────────────────────────────
async function saveCustody() {
  const employee = document.getElementById('fc-employee').value.trim();
  const itemDesc = document.getElementById('fc-item').value.trim();
  const date     = document.getElementById('fc-date').value;
  if (!employee || !itemDesc || !date) { toast('⚠ أدخل البيانات المطلوبة', 'warn'); return; }
  const data = {
    date, employee,
    car:      document.getElementById('fc-car').value.trim(),
    itemDesc,
    quantity: Number(document.getElementById('fc-qty').value) || 1,
    unit:     document.getElementById('fc-unit').value.trim() || 'قطعة',
    value:    Number(document.getElementById('fc-value').value) || 0,
    status:   document.getElementById('fc-status').value || 'مسلّمة',
    notes:    document.getElementById('fc-notes').value.trim()
  };
  setBtnLoading('fc-save', true);
  try {
    await dbAddCustody(data);
    toast('✅ تم تسجيل العهدة', 'ok');
    ['fc-employee','fc-car','fc-item','fc-qty','fc-value','fc-notes'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('fc-save', false); }
}

let editCustId = null;
function openEditCustody(id) {
  const c = DATA.custody.find(x => x.id === id);
  if (!c) return;
  editCustId = id;
  ['fc2-date','fc2-employee','fc2-car','fc2-item','fc2-qty','fc2-unit','fc2-value','fc2-status','fc2-notes'].forEach((fid, i) => {
    const keys = ['date','employee','car','itemDesc','quantity','unit','value','status','notes'];
    const el = document.getElementById(fid); if (el) el.value = c[keys[i]] ?? '';
  });
  openModal('m-custody');
}
async function updateCustody() {
  const data = {
    date:     document.getElementById('fc2-date').value,
    employee: document.getElementById('fc2-employee').value.trim(),
    car:      document.getElementById('fc2-car').value.trim(),
    itemDesc: document.getElementById('fc2-item').value.trim(),
    quantity: Number(document.getElementById('fc2-qty').value) || 1,
    unit:     document.getElementById('fc2-unit').value.trim() || 'قطعة',
    value:    Number(document.getElementById('fc2-value').value) || 0,
    status:   document.getElementById('fc2-status').value,
    notes:    document.getElementById('fc2-notes').value.trim()
  };
  if (!data.employee || !data.itemDesc) { toast('⚠ أدخل البيانات المطلوبة', 'warn'); return; }
  setBtnLoading('fc2-save', true);
  try {
    await dbUpdateCustody(editCustId, data);
    toast('✅ تم التعديل', 'ok');
    closeModal('m-custody');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('fc2-save', false); }
}

// ── CRUD — APPROVALS ──────────────────────────────────────
async function saveApproval() {
  const requester   = document.getElementById('fa-requester').value.trim();
  const requestType = document.getElementById('fa-type').value.trim();
  const date        = document.getElementById('fa-date').value;
  if (!requester || !requestType || !date) { toast('⚠ أدخل البيانات المطلوبة', 'warn'); return; }
  const data = {
    date, requester, requestType,
    description: document.getElementById('fa-desc').value.trim(),
    status:      document.getElementById('fa-status').value || 'قيد المراجعة',
    approver:    document.getElementById('fa-approver').value.trim(),
    notes:       document.getElementById('fa-notes').value.trim()
  };
  setBtnLoading('fa-save', true);
  try {
    await dbAddApproval(data);
    toast('✅ تم تسجيل الطلب', 'ok');
    ['fa-requester','fa-type','fa-desc','fa-approver','fa-notes'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('fa-save', false); }
}

async function changeApprovalStatus(id, status) {
  if (!FB_READY) return;
  try {
    await dbUpdateApproval(id, { status });
    toast(status === 'موافق' ? '✅ تمت الموافقة' : '❌ تم الرفض', status === 'موافق' ? 'ok' : 'err');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
}

let editApprId = null;
function openEditApproval(id) {
  const a = DATA.approvals.find(x => x.id === id);
  if (!a) return;
  editApprId = id;
  ['fa2-date','fa2-type','fa2-requester','fa2-desc','fa2-status','fa2-approver','fa2-notes'].forEach((fid, i) => {
    const keys = ['date','requestType','requester','description','status','approver','notes'];
    const el = document.getElementById(fid); if (el) el.value = a[keys[i]] ?? '';
  });
  openModal('m-approval');
}
async function updateApproval() {
  const data = {
    date:        document.getElementById('fa2-date').value,
    requestType: document.getElementById('fa2-type').value.trim(),
    requester:   document.getElementById('fa2-requester').value.trim(),
    description: document.getElementById('fa2-desc').value.trim(),
    status:      document.getElementById('fa2-status').value,
    approver:    document.getElementById('fa2-approver').value.trim(),
    notes:       document.getElementById('fa2-notes').value.trim()
  };
  setBtnLoading('fa2-save', true);
  try {
    await dbUpdateApproval(editApprId, data);
    toast('✅ تم التعديل', 'ok');
    closeModal('m-approval');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('fa2-save', false); }
}

// ── CRUD — INVOICES ───────────────────────────────────────
async function saveInvoice() {
  const client = document.getElementById('fi-client').value.trim();
  const date   = document.getElementById('fi-date').value;
  if (!client || !date) { toast('⚠ أدخل العميل والتاريخ', 'warn'); return; }
  const total = INV_ITEMS.reduce((s, item) => s + item.qty * item.price, 0);
  const invoiceNum = 'INV-' + Date.now().toString().slice(-6);
  const data = {
    invoiceNum,
    date, client,
    description: document.getElementById('fi-desc').value.trim(),
    items:       [...INV_ITEMS],
    total,
    status:      document.getElementById('fi-status').value || 'معلقة',
    notes:       document.getElementById('fi-notes').value.trim()
  };
  setBtnLoading('fi-save', true);
  try {
    await dbAddInvoice(data);
    toast(`✅ تم إنشاء الفاتورة ${invoiceNum}`, 'ok');
    INV_ITEMS = [{ desc: '', qty: 1, price: 0 }];
    buildInvItemsRows();
    ['fi-client','fi-desc','fi-notes'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('fi-save', false); }
}

let editInvId = null;
function openEditInvoice(id) {
  const inv = DATA.invoices.find(x => x.id === id);
  if (!inv) return;
  editInvId = id;
  document.getElementById('fi2-num').value    = inv.invoiceNum || '';
  document.getElementById('fi2-date').value   = inv.date || '';
  document.getElementById('fi2-client').value = inv.client || '';
  document.getElementById('fi2-desc').value   = inv.description || '';
  document.getElementById('fi2-total').value  = inv.total || 0;
  document.getElementById('fi2-status').value = inv.status || 'معلقة';
  document.getElementById('fi2-notes').value  = inv.notes || '';
  openModal('m-invoice');
}
async function updateInvoice() {
  const data = {
    invoiceNum:  document.getElementById('fi2-num').value.trim(),
    date:        document.getElementById('fi2-date').value,
    client:      document.getElementById('fi2-client').value.trim(),
    description: document.getElementById('fi2-desc').value.trim(),
    total:       Number(document.getElementById('fi2-total').value) || 0,
    status:      document.getElementById('fi2-status').value,
    notes:       document.getElementById('fi2-notes').value.trim()
  };
  setBtnLoading('fi2-save', true);
  try {
    await dbUpdateInvoice(editInvId, data);
    toast('✅ تم التعديل', 'ok');
    closeModal('m-invoice');
    await loadAll();
  } catch (e) { toast('❌ ' + e.message, 'err'); }
  finally { setBtnLoading('fi2-save', false); }
}

function printInvoice(id) {
  const inv = DATA.invoices.find(x => x.id === id);
  if (!inv) return;
  const itemsHtml = (inv.items || []).map(item =>
    `<tr><td style="padding:8px 12px;border:1px solid #ddd">${item.desc}</td>
     <td style="padding:8px 12px;border:1px solid #ddd;text-align:center">${item.qty}</td>
     <td style="padding:8px 12px;border:1px solid #ddd;text-align:left">${fmt(item.price)} ج</td>
     <td style="padding:8px 12px;border:1px solid #ddd;text-align:left;font-weight:700">${fmt(item.qty * item.price)} ج</td></tr>`
  ).join('');
  const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
    <title>فاتورة ${inv.invoiceNum}</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'IBM Plex Sans Arabic',sans-serif;padding:32px;direction:rtl;color:#0d1117}
    .hd{text-align:center;border-bottom:4px solid #c0392b;padding-bottom:16px;margin-bottom:24px}
    .hd h1{font-size:1.8rem;font-weight:800;color:#c0392b}.hd h2{font-size:1rem;color:#555;margin-top:4px}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
    .meta-box{border:1.5px solid #c8bfaa;border-radius:10px;padding:14px}
    .meta-title{font-weight:800;font-size:.8rem;color:#8a7f70;text-transform:uppercase;margin-bottom:8px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    th{background:#0d1117;color:#f5f0e8;padding:10px 12px;text-align:right;font-size:.82rem}
    tfoot td{background:#f5f0e8;font-weight:800;font-size:1rem;padding:12px}
    .sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:40px}
    .sig-box{border-top:2px dashed #c8bfaa;padding-top:10px;text-align:center;font-size:.8rem;color:#888}
    @media print{@page{margin:10mm}}</style></head>
    <body><div class="hd"><h1>🚦 ${APP_CONFIG.name}</h1><h2>فاتورة رقم: ${inv.invoiceNum}</h2></div>
    <div class="meta">
      <div class="meta-box"><div class="meta-title">بيانات العميل</div><strong>${inv.client}</strong></div>
      <div class="meta-box"><div class="meta-title">بيانات الفاتورة</div>
        <div>التاريخ: <strong>${fmtD(inv.date)}</strong></div>
        <div>الحالة: <strong>${inv.status}</strong></div>
      </div>
    </div>
    <table><thead><tr><th>البيان</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
    <tbody>${itemsHtml}</tbody>
    <tfoot><tr><td colspan="3" style="text-align:left;padding:10px 12px;font-size:.85rem">الإجمالي الكلي</td>
    <td style="color:#c0392b;font-size:1.1rem">${fmt(inv.total)} ج</td></tr></tfoot></table>
    ${inv.notes ? `<p style="margin:12px 0;font-size:.82rem;color:#666">ملاحظات: ${inv.notes}</p>` : ''}
    <div class="sig"><div class="sig-box">توقيع المستلم</div><div class="sig-box">توقيع المسؤول</div></div>
    <div style="text-align:center;margin-top:28px;font-size:.72rem;color:#aaa">طُبع: ${new Date().toLocaleString('ar-EG')}</div>
    </body></html>`;
  const w = window.open('', '_blank', 'width=800,height=900');
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 600);
}

// ── DELETE CONFIRM ────────────────────────────────────────
let pendingDel = null;
function confirmDel(type, id) {
  pendingDel = { type, id };
  openModal('m-confirm');
}
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('confirm-del-btn');
  if (!btn) return;
  btn.onclick = async () => {
    if (!pendingDel) return;
    const { type, id } = pendingDel;
    btn.disabled = true;
    btn.textContent = '⏳ جاري...';
    const ops = {
      driver: dbDeleteDriver, violation: dbDeleteViolation,
      deduction: dbDeleteDeduction, license: dbDeleteLicense,
      custody: dbDeleteCustody, approval: dbDeleteApproval, invoice: dbDeleteInvoice
    };
    try {
      if (ops[type]) await ops[type](id);
      toast('🗑 تم الحذف', 'ok');
      closeModal('m-confirm');
      pendingDel = null;
      await loadAll();
    } catch (e) { toast('❌ ' + e.message, 'err'); }
    finally { btn.disabled = false; btn.textContent = '🗑 تأكيد الحذف'; }
  };
});

// ── SETTINGS ──────────────────────────────────────────────
function updateSettingsUI() {
  const configured = FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY';
  const statusEl = document.getElementById('fb-connect-status');
  if (!statusEl) return;
  if (configured && FB_READY) {
    statusEl.className = 'firebase-status ok';
    statusEl.innerHTML = '🟢 Firebase متصل — ' + FIREBASE_CONFIG.projectId;
  } else if (configured) {
    statusEl.className = 'firebase-status warn';
    statusEl.innerHTML = '🟡 Firebase مُهيَّأ لكن غير متصل';
  } else {
    statusEl.className = 'firebase-status err';
    statusEl.innerHTML = '🔴 Firebase غير مُهيَّأ — عدّل ملف firebase-config.js';
  }
}

// ── EXPORT EXCEL ──────────────────────────────────────────
function exportToExcel() {
  const wb = XLSX.utils.book_new();
  const sheets = [
    { name: 'السائقون',   data: [['الاسم','السيارة'],          ...DATA.drivers.map(d=>[d.name,d.car])] },
    { name: 'المخالفات',  data: [['التاريخ','السائق','السيارة','الوصف','المبلغ'], ...DATA.violations.map(v=>[v.date,v.driver,v.car,v.desc,v.amount])] },
    { name: 'الخصومات',   data: [['التاريخ','السائق','المبلغ','النوع'],           ...DATA.deductions.map(d=>[d.date,d.driver,d.amount,d.type])] },
    { name: 'الحسابات',   data: [['السائق','مخالفات','خصومات','المتبقي'],         ...DATA.accounts.map(a=>[a.driver,a.violations,a.deductions,a.remaining])] },
    { name: 'التراخيص',   data: [['رقم السيارة','الشركة','السائق','الانتهاء','الحالة'], ...DATA.licenses.map(l=>[l.carNumber,l.company,l.driver,l.expiry,l.status])] },
    { name: 'العهد',      data: [['التاريخ','الموظف','الصنف','الكمية','القيمة','الحالة'], ...DATA.custody.map(c=>[c.date,c.employee,c.itemDesc,c.quantity,c.value,c.status])] },
    { name: 'الموافقات',  data: [['التاريخ','النوع','مقدم الطلب','الوصف','الحالة'],      ...DATA.approvals.map(a=>[a.date,a.requestType,a.requester,a.description,a.status])] },
    { name: 'الفواتير',   data: [['رقم الفاتورة','التاريخ','العميل','الإجمالي','الحالة'], ...DATA.invoices.map(i=>[i.invoiceNum,i.date,i.client,i.total,i.status])] }
  ];
  sheets.forEach(s => {
    const ws = XLSX.utils.aoa_to_sheet(s.data);
    XLSX.utils.book_append_sheet(wb, ws, s.name);
  });
  XLSX.writeFile(wb, `النظام_المتكامل_${toDay()}.xlsx`);
  toast('⬇ تم تصدير Excel', 'ok');
}

// ── MODAL / TOAST UI ──────────────────────────────────────
function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.backdrop').forEach(b =>
    b.addEventListener('click', e => { if (e.target === b) b.classList.remove('open'); })
  );
});
let toastT;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className   = 'show' + (type ? ' ' + type : '');
  clearTimeout(toastT);
  toastT = setTimeout(() => { el.className = ''; }, 3400);
}
function setBtnLoading(id, loading) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) { btn.dataset.orig = btn.innerHTML; btn.innerHTML = '<span class="spinner"></span> جاري...'; }
  else         { btn.innerHTML = btn.dataset.orig || btn.innerHTML; }
}
