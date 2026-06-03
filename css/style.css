:root{--ink:#0d1117;--paper:#f5f0e8;--cream:#ede8dc;--warm:#e8e0d0;--border:#c8bfaa;--muted:#8a7f70;--accent:#c0392b;--g:#2c6e49;--b:#1a4a7a;--gold:#b8860b;--teal:#0e7490;--purple:#6b21a8;--orange:#c2410c;--shadow:rgba(13,17,23,.12);--r:10px}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{scroll-behavior:smooth;height:100%}
body{font-family:'IBM Plex Sans Arabic',sans-serif;background:var(--paper);color:var(--ink);font-size:14px;line-height:1.6;display:flex;flex-direction:column}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");pointer-events:none;z-index:0}
.app{position:relative;z-index:1;display:flex;flex-direction:column;height:100vh}

/* ── TOPBAR ── */
.topbar{background:var(--ink);color:#f5f0e8;padding:0 1.2rem;display:flex;align-items:center;justify-content:space-between;height:52px;position:sticky;top:0;z-index:200;border-bottom:3px solid var(--accent);gap:8px}
.brand{display:flex;align-items:center;gap:8px;font-family:'Readex Pro',sans-serif;font-weight:700;font-size:.9rem;letter-spacing:-.3px;white-space:nowrap;flex-shrink:0}
.brand-dot{width:10px;height:10px;background:var(--accent);border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,.5)}50%{box-shadow:0 0 0 6px rgba(192,57,43,0)}}
.topbar-nav{display:flex;gap:2px;flex-wrap:wrap;overflow-x:auto}
.tnav-btn{background:none;border:none;color:rgba(245,240,232,.55);font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.75rem;font-weight:600;padding:6px 9px;cursor:pointer;border-radius:6px;transition:all .2s;position:relative;white-space:nowrap}
.tnav-btn.active,.tnav-btn:hover{color:#f5f0e8;background:rgba(255,255,255,.08)}
.tnav-btn.active::after{content:'';position:absolute;bottom:-3px;left:0;right:0;height:3px;background:var(--accent)}
.tnav-btn.teal.active::after{background:var(--teal)}
.tnav-btn.purple.active::after{background:var(--purple)}
.tnav-btn.orange.active::after{background:var(--orange)}
.tnav-btn.green.active::after{background:var(--g)}

/* ── STATUS BAR ── */
.status-bar{background:#1e2a3a;color:#a8c4e0;padding:5px 1.2rem;display:flex;align-items:center;gap:10px;font-size:.74rem;border-bottom:1px solid #2a3a4a;flex-wrap:wrap}
.status-dot{width:8px;height:8px;border-radius:50%;background:#6b7280;flex-shrink:0}
.status-dot.ok{background:#22c55e;box-shadow:0 0 6px rgba(34,197,94,.5)}
.status-dot.err{background:#ef4444}
.status-dot.loading{background:#f59e0b;animation:pulse 1s infinite}
.content{flex:1;padding:1.4rem;width:100%;overflow-y:auto}
.section{display:none}
.section.active{display:block;animation:slideUp .3s ease}
@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* ── PAGE HEADER ── */
.pg-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:1.4rem;padding-bottom:1rem;border-bottom:2px solid var(--border);flex-wrap:wrap;gap:8px}
.pg-title{font-family:'Readex Pro',sans-serif;font-size:1.3rem;font-weight:700;letter-spacing:-.5px}
.pg-title em{font-style:normal;color:var(--accent)}
.pg-title em.teal{color:var(--teal)}
.pg-title em.purple{color:var(--purple)}
.pg-title em.orange{color:var(--orange)}
.pg-title em.green{color:var(--g)}
.pg-sub{color:var(--muted);font-size:.77rem;margin-top:3px}

/* ── STATS ── */
.stats-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.8rem;margin-bottom:1.6rem}
.stat{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:.9rem 1.1rem;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s}
.stat:hover{transform:translateY(-2px);box-shadow:0 6px 18px var(--shadow)}
.stat::before{content:'';position:absolute;top:0;right:0;width:4px;height:100%}
.stat.red::before{background:var(--accent)}.stat.green::before{background:var(--g)}.stat.blue::before{background:var(--b)}.stat.gold::before{background:var(--gold)}.stat.teal::before{background:var(--teal)}.stat.purple::before{background:var(--purple)}.stat.orange::before{background:var(--orange)}
.stat-label{font-size:.68rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.stat-val{font-family:'Readex Pro',sans-serif;font-size:1.5rem;font-weight:700;line-height:1}
.stat.red .stat-val{color:var(--accent)}.stat.green .stat-val{color:var(--g)}.stat.blue .stat-val{color:var(--b)}.stat.gold .stat-val{color:var(--gold)}.stat.teal .stat-val{color:var(--teal)}.stat.purple .stat-val{color:var(--purple)}.stat.orange .stat-val{color:var(--orange)}

/* ── TOOLBAR ── */
.toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:1rem}
.search-wrap{flex:1;min-width:200px;position:relative}
.search-wrap input{width:100%;background:#fff;border:1.5px solid var(--border);border-radius:8px;padding:8px 12px 8px 34px;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.84rem;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s}
.search-wrap input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(192,57,43,.08)}
.search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:.8rem;pointer-events:none;color:var(--muted)}

/* ── BUTTONS ── */
.btn{padding:8px 15px;border-radius:8px;border:none;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.8rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .18s;white-space:nowrap}
.btn-red{background:var(--accent);color:#fff;box-shadow:0 3px 10px rgba(192,57,43,.25)}
.btn-red:hover{background:#a93226;transform:translateY(-1px)}
.btn-green{background:var(--g);color:#fff;box-shadow:0 3px 10px rgba(44,110,73,.25)}
.btn-green:hover{background:#235a3b;transform:translateY(-1px)}
.btn-blue{background:var(--b);color:#fff;box-shadow:0 3px 10px rgba(26,74,122,.25)}
.btn-blue:hover{background:#153d66;transform:translateY(-1px)}
.btn-gold{background:var(--gold);color:#fff}
.btn-gold:hover{background:#9a6e09;transform:translateY(-1px)}
.btn-teal{background:var(--teal);color:#fff;box-shadow:0 3px 10px rgba(14,116,144,.25)}
.btn-teal:hover{background:#0c6478;transform:translateY(-1px)}
.btn-purple{background:var(--purple);color:#fff;box-shadow:0 3px 10px rgba(107,33,168,.25)}
.btn-purple:hover{background:#581c87;transform:translateY(-1px)}
.btn-orange{background:var(--orange);color:#fff;box-shadow:0 3px 10px rgba(194,65,12,.25)}
.btn-orange:hover{background:#9a3412;transform:translateY(-1px)}
.btn-outline{background:#fff;color:var(--ink);border:1.5px solid var(--border)}
.btn-outline:hover{border-color:var(--ink)}
.btn-sm{padding:5px 10px;font-size:.73rem;border-radius:6px}
.btn-edit-sm{background:rgba(26,74,122,.08);color:var(--b);border:1px solid rgba(26,74,122,.18)}
.btn-edit-sm:hover{background:rgba(26,74,122,.15)}
.btn-del-sm{background:rgba(192,57,43,.07);color:var(--accent);border:1px solid rgba(192,57,43,.15)}
.btn-del-sm:hover{background:rgba(192,57,43,.15)}
.btn-ok-sm{background:rgba(44,110,73,.08);color:var(--g);border:1px solid rgba(44,110,73,.18)}
.btn-ok-sm:hover{background:rgba(44,110,73,.15)}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}

/* ── TABLE ── */
.tbl-wrap{background:#fff;border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:0 2px 8px var(--shadow);overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.82rem;min-width:400px}
thead th{background:var(--ink);color:#f5f0e8;padding:10px 13px;text-align:right;font-weight:600;font-size:.74rem;letter-spacing:.3px;white-space:nowrap}
tbody tr{border-bottom:1px solid var(--cream);transition:background .12s}
tbody tr:last-child{border-bottom:none}
tbody tr:hover{background:var(--cream)}
tbody td{padding:9px 13px;vertical-align:middle}
.num-cell{color:var(--muted);font-size:.74rem}
.driver-cell{font-weight:600}
.car-cell{color:var(--muted);font-family:monospace;font-size:.8rem}
.desc-cell{color:#555}
.money-red{color:var(--accent);font-weight:700;font-family:'Readex Pro',sans-serif}
.money-grn{color:var(--g);font-weight:700;font-family:'Readex Pro',sans-serif}
.money-gold{color:var(--gold);font-weight:700;font-family:'Readex Pro',sans-serif}

/* ── TAGS ── */
.tag{display:inline-block;padding:2px 9px;border-radius:20px;font-size:.7rem;font-weight:700}
.tag-v{background:rgba(192,57,43,.1);color:var(--accent)}
.tag-d{background:rgba(44,110,73,.1);color:var(--g)}
.tag-ok{background:rgba(44,110,73,.1);color:var(--g)}
.tag-warn{background:rgba(184,134,11,.1);color:var(--gold)}
.tag-expired{background:rgba(192,57,43,.1);color:var(--accent)}
.tag-pending{background:rgba(107,33,168,.1);color:var(--purple)}
.tag-approved{background:rgba(44,110,73,.1);color:var(--g)}
.tag-rejected{background:rgba(192,57,43,.1);color:var(--accent)}
.tag-paid{background:rgba(44,110,73,.1);color:var(--g)}
.tag-unpaid{background:rgba(184,134,11,.1);color:var(--gold)}
.tag-delivered{background:rgba(26,74,122,.1);color:var(--b)}
.tag-returned{background:rgba(14,116,144,.1);color:var(--teal)}

/* ── EMPTY / LOADING ── */
.empty-state{text-align:center;padding:3rem 2rem;color:var(--muted)}
.empty-icon{font-size:2.2rem;margin-bottom:.6rem;opacity:.5}
.empty-txt{font-size:.84rem}
.tbl-loading{text-align:center;padding:2.5rem;color:var(--muted);font-size:.87rem}
.spinner{display:inline-block;width:18px;height:18px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-left:6px}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── PAGER ── */
.pager{display:flex;align-items:center;gap:4px;justify-content:center;padding:.8rem;border-top:1px solid var(--cream);background:var(--paper)}
.pg-btn{min-width:30px;height:30px;border-radius:6px;border:1.5px solid var(--border);background:#fff;color:var(--muted);font-family:'Readex Pro',sans-serif;font-size:.77rem;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center}
.pg-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.pg-btn.on{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:700}
.pg-btn:disabled{opacity:.3;cursor:default}

/* ── FORM CARD ── */
.form-card{background:#fff;border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:0 2px 8px var(--shadow);margin-bottom:1.4rem}
.form-card-head{background:var(--ink);color:#f5f0e8;padding:11px 16px;font-weight:700;font-size:.88rem;display:flex;align-items:center;gap:8px}
.form-body{padding:1.2rem}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
.fg{display:flex;flex-direction:column;gap:5px}
.fg.span2{grid-column:span 2}
.fg.span3{grid-column:span 3}
.fg label{font-size:.72rem;font-weight:700;color:var(--muted);letter-spacing:.3px;text-transform:uppercase}
.fg input,.fg select,.fg textarea{background:var(--paper);border:1.5px solid var(--border);border-radius:7px;padding:8px 11px;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.84rem;color:var(--ink);outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
.fg input:focus,.fg select:focus,.fg textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(192,57,43,.07);background:#fff}
.form-footer{display:flex;gap:8px;justify-content:flex-end;padding:.8rem 1.2rem;border-top:1px solid var(--cream);background:var(--paper);flex-wrap:wrap}

/* ── INVOICE ITEMS TABLE ── */
.inv-items-table{width:100%;border-collapse:collapse;margin-top:.5rem}
.inv-items-table th{background:var(--cream);color:var(--muted);padding:7px 9px;text-align:right;font-size:.72rem;font-weight:700;border-bottom:1.5px solid var(--border)}
.inv-items-table td{padding:4px 5px;border-bottom:1px solid var(--cream)}
.inv-items-table input{background:#fff;border:1px solid var(--border);border-radius:5px;padding:6px 8px;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.82rem;color:var(--ink);width:100%;outline:none}
.inv-items-table input:focus{border-color:var(--accent)}
.inv-total-row{text-align:left;padding:8px 12px;font-weight:800;font-size:.95rem;color:var(--accent);border-top:2px solid var(--border);background:var(--cream)}

/* ── LICENSE CARDS ── */
.lic-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1rem;margin-bottom:1.4rem}
.lic-card{background:#fff;border:1.5px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:0 2px 8px var(--shadow);transition:transform .2s,box-shadow .2s}
.lic-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px var(--shadow)}
.lic-card.expired{border-color:rgba(192,57,43,.4);background:rgba(192,57,43,.02)}
.lic-card.soon{border-color:rgba(184,134,11,.4);background:rgba(184,134,11,.02)}
.lic-card-head{padding:10px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
.lic-card-head.expired{background:rgba(192,57,43,.07)}
.lic-card-head.soon{background:rgba(184,134,11,.07)}
.lic-card-head.ok{background:rgba(44,110,73,.05)}
.lic-car-num{font-family:monospace;font-size:.95rem;font-weight:800;letter-spacing:.5px}
.lic-card-body{padding:12px 14px;display:flex;flex-direction:column;gap:5px}
.lic-row{display:flex;justify-content:space-between;font-size:.79rem}
.lic-lbl{color:var(--muted);font-weight:600}
.lic-val{font-weight:600}
.lic-expiry{font-family:'Readex Pro',sans-serif;font-size:.95rem;font-weight:700}
.lic-expiry.expired{color:var(--accent)}
.lic-expiry.soon{color:var(--gold)}
.lic-expiry.ok{color:var(--g)}
.lic-card-foot{padding:8px 14px;border-top:1px solid var(--border);background:var(--paper)}
.lic-filter-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:1rem}
.lic-tab{padding:5px 13px;border-radius:20px;border:1.5px solid var(--border);background:#fff;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.77rem;font-weight:700;cursor:pointer;transition:all .2s;color:var(--muted)}
.lic-tab.active{background:var(--teal);border-color:var(--teal);color:#fff}
.lic-tab.active.red{background:var(--accent);border-color:var(--accent)}
.lic-tab.active.gold{background:var(--gold);border-color:var(--gold)}

/* ── CUSTODY / APPROVALS CARDS ── */
.cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;margin-bottom:1.4rem}
.info-card{background:#fff;border:1.5px solid var(--border);border-radius:12px;overflow:hidden;box-shadow:0 2px 8px var(--shadow);transition:transform .2s,box-shadow .2s}
.info-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px var(--shadow)}
.info-card-head{padding:11px 15px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);background:var(--cream)}
.info-card-body{padding:12px 15px;display:flex;flex-direction:column;gap:6px;font-size:.82rem}
.info-card-row{display:flex;justify-content:space-between;align-items:center}
.info-card-lbl{color:var(--muted);font-weight:600;font-size:.76rem}
.info-card-val{font-weight:700}
.info-card-foot{padding:8px 14px;border-top:1px solid var(--border);background:var(--paper);display:flex;gap:6px}

/* ── IMPORT SECTION ── */
.import-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:1.2rem;border-bottom:2px solid var(--border);padding-bottom:.6rem}
.imp-tab{padding:7px 14px;border-radius:8px 8px 0 0;border:1.5px solid transparent;background:transparent;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.78rem;font-weight:700;cursor:pointer;transition:all .2s;color:var(--muted)}
.imp-tab.active{background:#fff;border-color:var(--border);border-bottom-color:#fff;color:var(--ink);margin-bottom:-2px}
.import-panel{background:#fff;border:1.5px solid var(--border);border-radius:var(--r);padding:1.2rem;margin-bottom:1.4rem}
.drop-zone{border:2.5px dashed var(--border);border-radius:10px;padding:1.8rem;text-align:center;cursor:pointer;transition:all .2s;background:var(--paper)}
.drop-zone:hover,.drop-zone.over{border-color:var(--accent);background:rgba(192,57,43,.04)}
.drop-zone-icon{font-size:2rem;opacity:.55;margin-bottom:.4rem}
.drop-zone-txt{font-size:.83rem;color:var(--muted)}
.drop-zone-txt strong{color:var(--accent)}
.import-preview{margin-top:1rem;background:var(--cream);border-radius:8px;padding:12px;font-size:.8rem;display:none}
.import-preview .prev-title{font-weight:700;margin-bottom:.5rem;color:var(--ink)}
.import-preview table{background:#fff;border-radius:6px;overflow:hidden}
.import-progress{display:none;margin-top:1rem}
.progress-bar-wrap{background:var(--cream);border-radius:20px;height:10px;overflow:hidden;margin:.5rem 0}
.progress-bar{height:100%;background:linear-gradient(90deg,var(--g),var(--teal));border-radius:20px;transition:width .3s;width:0%}
.progress-txt{font-size:.78rem;color:var(--muted);text-align:center}
.import-result{display:none;margin-top:.8rem;padding:10px 14px;border-radius:8px;font-size:.82rem;font-weight:700}
.import-result.ok{background:rgba(44,110,73,.1);color:var(--g);border:1px solid rgba(44,110,73,.2)}
.import-result.err{background:rgba(192,57,43,.1);color:var(--accent);border:1px solid rgba(192,57,43,.2)}

/* ── MODAL ── */
.backdrop{position:fixed;inset:0;background:rgba(13,17,23,.55);backdrop-filter:blur(4px);z-index:300;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}
.backdrop.open{opacity:1;pointer-events:all}
.modal{background:#fff;border-radius:14px;width:92%;max-width:540px;box-shadow:0 20px 50px rgba(13,17,23,.3);transform:scale(.95) translateY(8px);transition:transform .25s;overflow:hidden}
.modal.wide{max-width:720px}
.backdrop.open .modal{transform:scale(1) translateY(0)}
.modal-head{background:var(--ink);color:#f5f0e8;padding:13px 18px;display:flex;align-items:center;justify-content:space-between}
.modal-title{font-weight:700;font-size:.88rem}
.modal-x{background:none;border:none;color:rgba(245,240,232,.5);font-size:1.2rem;cursor:pointer;line-height:1;transition:color .15s}
.modal-x:hover{color:#f5f0e8}
.modal-body{padding:1.2rem;max-height:72vh;overflow-y:auto}
.modal-footer{padding:.85rem 1.2rem;border-top:1px solid var(--cream);display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
.confirm-wrap{text-align:center;padding:.5rem 0}
.confirm-icon{font-size:2rem;margin-bottom:.5rem}
.confirm-ttl{font-weight:800;font-size:.93rem;margin-bottom:.4rem}
.confirm-msg{color:var(--muted);font-size:.81rem;line-height:1.5}

/* ── TOAST ── */
#toast{position:fixed;bottom:1.4rem;left:50%;transform:translateX(-50%) translateY(60px);background:var(--ink);color:#f5f0e8;padding:10px 18px;border-radius:9px;font-size:.81rem;font-weight:600;display:flex;align-items:center;gap:8px;z-index:9999;pointer-events:none;opacity:0;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .3s;box-shadow:0 6px 20px rgba(13,17,23,.3);border-right:4px solid var(--accent)}
#toast.show{transform:translateX(-50%) translateY(0);opacity:1}
#toast.ok{border-right-color:var(--g)}
#toast.warn{border-right-color:var(--gold)}
#toast.err{border-right-color:var(--accent)}

/* ── FILTERS ── */
select.flt{background:#fff;border:1.5px solid var(--border);border-radius:8px;padding:7px 10px;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.82rem;color:var(--ink);outline:none;cursor:pointer;transition:border-color .2s}
select.flt:focus{border-color:var(--accent)}

/* ── SETTINGS ── */
.settings-card{background:#fff;border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:0 2px 8px var(--shadow);margin-bottom:1.2rem}
.settings-head{background:var(--cream);padding:12px 18px;font-weight:700;font-size:.9rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
.settings-body{padding:1.2rem}
.firebase-status{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;font-size:.82rem;font-weight:600;margin-bottom:1rem}
.firebase-status.ok{background:rgba(44,110,73,.1);color:var(--g);border:1px solid rgba(44,110,73,.2)}
.firebase-status.err{background:rgba(192,57,43,.1);color:var(--accent);border:1px solid rgba(192,57,43,.2)}
.firebase-status.warn{background:rgba(184,134,11,.1);color:var(--gold);border:1px solid rgba(184,134,11,.2)}
.code-block{background:var(--ink);color:#a8c4e0;padding:14px 18px;border-radius:8px;font-family:monospace;font-size:.8rem;line-height:1.7;overflow-x:auto;margin-top:8px;white-space:pre}
.code-highlight{color:#f59e0b}

/* ── REPORT SECTION ── */
.report-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.8rem;margin-bottom:1.2rem}
.rstat{background:var(--cream);border-radius:var(--r);padding:.9rem;text-align:center}
.rstat-label{font-size:.68rem;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:4px}
.rstat-val{font-family:'Readex Pro',sans-serif;font-size:1.35rem;font-weight:700}
.monthly-card{background:#fff;border:1.5px solid var(--border);border-radius:var(--r);padding:.9rem;margin-bottom:1rem;display:flex;align-items:center;flex-wrap:wrap;gap:10px}
.monthly-card select,.monthly-card input[type=number]{padding:7px 10px;border:1.5px solid var(--border);border-radius:8px;font-family:'IBM Plex Sans Arabic',sans-serif;font-size:.82rem;background:#fff;outline:none}

/* ── DASH QUICK ── */
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.4rem}
.dash-card{background:#fff;border:1.5px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:0 2px 8px var(--shadow)}
.dash-card-head{background:var(--ink);color:#f5f0e8;padding:10px 15px;font-weight:700;font-size:.82rem;display:flex;align-items:center;gap:6px}
.dash-card-body{overflow-x:auto}

/* ── RESPONSIVE ── */
@media(max-width:640px){
  .form-grid{grid-template-columns:1fr}
  .fg.span2,.fg.span3{grid-column:span 1}
  .topbar{padding:0 .75rem}
  .content{padding:.85rem}
  .dash-grid{grid-template-columns:1fr}
  .lic-grid{grid-template-columns:1fr}
  .cards-grid{grid-template-columns:1fr}
}
