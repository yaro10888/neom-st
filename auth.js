/* =========================================================
   Neom Studio — Page styles
   ========================================================= */

/* --------------------------------------------------------
   PAGE HEADER (inner pages) — reinforces the route path
   -------------------------------------------------------- */
.page-head {
  margin: clamp(18px, 3vw, 30px) var(--gutter) 0;
}
.page-head-inner {
  max-width: var(--maxw); margin-inline: auto;
  border-radius: var(--r-xl);
  border: 1px solid var(--stroke-soft);
  background:
    radial-gradient(700px 300px at 90% -20%, rgba(150,110,240,.25), transparent 60%),
    linear-gradient(120deg, rgba(30,52,98,.5), rgba(40,30,86,.4));
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  padding: clamp(22px, 3vw, 36px);
  box-shadow: var(--sh-soft);
}
.breadcrumb {
  display: flex; align-items: center; gap: 8px;
  font-size: .82rem; color: var(--tx-3); margin-bottom: 10px; flex-wrap: wrap;
}
.breadcrumb a:hover { color: var(--c-turquoise); }
.breadcrumb .sep { color: var(--tx-muted); }
.breadcrumb .route {
  font-family: var(--font-en);
  font-size: .72rem;
  color: var(--c-turquoise);
  background: rgba(43,216,198,.12);
  border: 1px solid rgba(43,216,198,.35);
  padding: 2px 9px; border-radius: var(--r-pill);
  margin-inline-start: 4px;
}
.page-head h1 { font-size: clamp(1.7rem, 3vw, 2.4rem); margin: 0 0 .3em; }
.page-head p { color: var(--tx-3); margin: 0; max-width: 60ch; }

/* toolbar (search + filters) */
.toolbar {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  margin: 22px var(--gutter) 0; max-width: var(--maxw);
  margin-inline: auto; padding-inline: var(--gutter);
}
.toolbar .search { position: relative; flex: 1; min-width: 220px; }
.toolbar .search .input { padding-inline-start: 42px; }
.toolbar .search svg { position: absolute; inset-inline-start: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: var(--tx-muted); }
.chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  padding: 9px 16px; border-radius: var(--r-pill);
  border: 1px solid var(--stroke); background: rgba(255,255,255,.04);
  color: var(--tx-3); font-size: .82rem; font-weight: 600;
  transition: all var(--t) var(--ease);
}
.chip:hover { color: #fff; border-color: var(--stroke-strong); }
.chip.active { background: var(--grad-btn); color: #fff; border-color: transparent; box-shadow: var(--glow-btn); }

/* --------------------------------------------------------
   CATALOG GRID (maps / systems / courses)
   -------------------------------------------------------- */
.catalog {
  max-width: var(--maxw); margin: 26px auto 0; padding-inline: var(--gutter);
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
}
.item-card { --accent: #2bd8c6; overflow: hidden; display: flex; flex-direction: column; cursor: pointer; }
.item-thumb { position: relative; aspect-ratio: 16/10; overflow: hidden; }
.item-thumb .ph {
  position: absolute; inset: 0;
  background:
    radial-gradient(400px 200px at 30% 20%, color-mix(in srgb, var(--accent) 40%, transparent), transparent 60%),
    linear-gradient(135deg, #1b2a4a, #2a1f50);
}
.item-thumb .glyph { position: absolute; inset: 0; display: grid; place-items: center; color: color-mix(in srgb, var(--accent) 80%, #fff); opacity: .85; }
.item-thumb .glyph svg { width: 64px; height: 64px; filter: drop-shadow(0 0 20px color-mix(in srgb, var(--accent) 70%, transparent)); }
.item-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--t-slow) var(--ease); }
.item-card:hover .item-thumb img { transform: scale(1.08); }
.item-thumb .badge-tl { position: absolute; top: 12px; inset-inline-start: 12px; }
.item-thumb .badge-tr { position: absolute; top: 12px; inset-inline-end: 12px; }
.item-body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.item-body h3 { margin: 0; font-size: 1.08rem; }
.item-body .desc { color: var(--tx-3); font-size: .85rem; margin: 0; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.item-meta { display: flex; align-items: center; gap: 14px; color: var(--tx-muted); font-size: .76rem; margin-top: auto; }
.item-meta span { display: inline-flex; align-items: center; gap: 5px; }
.item-meta svg { width: 14px; height: 14px; }
.item-prices { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 4px; }
.item-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 12px; }

/* --------------------------------------------------------
   MODAL: item detail (slider)
   -------------------------------------------------------- */
.slider { position: relative; border-radius: var(--r-md); overflow: hidden; aspect-ratio: 16/9; background: #0e1530; }
.slider .slides { display: flex; height: 100%; transition: transform var(--t) var(--ease-out); }
.slider .slide { min-width: 100%; height: 100%; position: relative; }
.slider .slide .ph { position: absolute; inset: 0; }
.slider .slide .glyph { position: absolute; inset: 0; display: grid; place-items: center; }
.slider .slide .glyph svg { width: 84px; height: 84px; }
.slider-btn {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(8,12,30,.6); border: 1px solid var(--stroke);
  color: #fff; display: grid; place-items: center; z-index: 3;
  transition: background var(--t);
}
.slider-btn:hover { background: rgba(8,12,30,.9); }
.slider-btn.prev { inset-inline-start: 12px; }
.slider-btn.next { inset-inline-end: 12px; }
.slider-dots { position: absolute; bottom: 12px; inset-inline: 0; display: flex; justify-content: center; gap: 7px; z-index: 3; }
.slider-dots b { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.4); cursor: pointer; transition: all var(--t); }
.slider-dots b.on { background: var(--c-turquoise); width: 22px; border-radius: 5px; }
.detail-prices { display: flex; gap: 10px; flex-wrap: wrap; margin: 16px 0; }
.feature-list { list-style: none; padding: 0; margin: 14px 0; display: grid; gap: 8px; }
.feature-list li { display: flex; gap: 10px; color: var(--tx-2); font-size: .9rem; }
.feature-list svg { width: 18px; height: 18px; color: var(--a-green); flex-shrink: 0; margin-top: 2px; }

/* --------------------------------------------------------
   HOME: dual panels (news + forum) + join box
   -------------------------------------------------------- */
.home-panels {
  max-width: var(--maxw); margin: clamp(40px,6vw,80px) auto 0; padding-inline: var(--gutter);
  display: grid; grid-template-columns: 1fr 1fr 360px; gap: 20px; align-items: start;
}
.panel { padding: 22px; }
.panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.panel-head h2 { margin: 0; font-size: 1.3rem; }

.news-row, .forum-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 12px; border-radius: var(--r-sm);
  transition: background var(--t) var(--ease);
}
.news-row:hover, .forum-row:hover { background: var(--glass-row); }
.news-row + .news-row, .forum-row + .forum-row { border-top: 1px solid var(--stroke-soft); }
.news-row .nr-body, .forum-row .fr-body { flex: 1; min-width: 0; }
.news-row .nr-body h4, .forum-row .fr-body h4 { margin: 0 0 3px; font-size: .96rem; color: var(--tx-1); }
.news-row .nr-body p, .forum-row .fr-body p { margin: 0; font-size: .8rem; color: var(--tx-muted); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.news-row time { font-family: var(--font-en); font-size: .76rem; color: var(--tx-muted); flex-shrink: 0; }

.forum-row .fr-ico {
  width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
  display: grid; place-items: center; color: var(--accent, #58b6ff);
  background: color-mix(in srgb, var(--accent,#58b6ff) 14%, rgba(10,16,34,.4));
  border: 1px solid color-mix(in srgb, var(--accent,#58b6ff) 30%, transparent);
}
.forum-row .fr-ico svg { width: 22px; height: 22px; }
.forum-row .fr-stats { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0; font-family: var(--font-en); }
.forum-row .fr-stats b { font-size: .92rem; color: var(--tx-1); }
.forum-row .fr-stats span { font-size: .68rem; color: var(--tx-muted); }

.join-box { padding: 24px; text-align: center; position: relative; overflow: hidden; }
.join-box .tag { position: absolute; top: 18px; inset-inline-end: 18px; }
.join-box h3 { color: var(--c-turquoise); margin: 12px 0 8px; font-size: 1.15rem; }
.join-box p { color: var(--tx-3); font-size: .86rem; margin-bottom: 18px; }
.join-box .join-ill { width: 90px; height: 90px; margin: 6px auto 4px; opacity: .9; }

/* --------------------------------------------------------
   FORUM PAGE
   -------------------------------------------------------- */
.forum-list { max-width: 920px; margin: 26px auto 0; padding-inline: var(--gutter); display: flex; flex-direction: column; gap: 18px; }
.post {
  display: grid; grid-template-columns: 200px 1fr; gap: 0; overflow: hidden;
}
.post .p-thumb { position: relative; min-height: 100%; }
.post .p-thumb .ph { position: absolute; inset: 0; }
.post .p-thumb .glyph { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; opacity: .8; }
.post .p-thumb .glyph svg { width: 48px; height: 48px; }
.post .p-body { padding: 18px 20px; display: flex; flex-direction: column; gap: 10px; }
.post .p-tags { display: flex; gap: 7px; flex-wrap: wrap; }
.post h3 { margin: 0; font-size: 1.15rem; }
.post .p-excerpt { color: var(--tx-3); font-size: .9rem; margin: 0; }
.post .p-meta { display: flex; align-items: center; gap: 16px; color: var(--tx-muted); font-size: .78rem; flex-wrap: wrap; }
.post .p-meta span { display: inline-flex; align-items: center; gap: 6px; }
.post .p-meta .author { display: inline-flex; align-items: center; gap: 7px; }
.post .p-meta .author img { width: 24px; height: 24px; border-radius: 7px; }

/* reactions */
.reactions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
.react {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: var(--r-pill);
  border: 1px solid var(--stroke); background: rgba(255,255,255,.04);
  font-size: .85rem; color: var(--tx-2);
  transition: all var(--t) var(--ease);
  font-family: var(--font-en);
}
.react .emo { font-size: 1.05rem; line-height: 1; transition: transform var(--t) var(--ease); }
.react:hover { border-color: var(--stroke-strong); background: rgba(255,255,255,.08); transform: translateY(-2px); }
.react:hover .emo { transform: scale(1.25); }
.react.on { border-color: color-mix(in srgb, var(--c-turquoise) 55%, transparent); background: rgba(43,216,198,.16); color: #fff; }
.react.pop .emo { animation: emoPop .45s var(--ease-out); }
@keyframes emoPop { 0% { transform: scale(1); } 40% { transform: scale(1.6); } 100% { transform: scale(1); } }

/* --------------------------------------------------------
   PROFILE
   -------------------------------------------------------- */
.profile-grid { max-width: var(--maxw); margin: 26px auto 0; padding-inline: var(--gutter); display: grid; grid-template-columns: 340px 1fr; gap: 22px; align-items: start; }
.profile-card { padding: 26px; text-align: center; }
.profile-card .pf-avatar { width: 120px; height: 120px; border-radius: 28px; margin: 0 auto 14px; box-shadow: var(--glow-purple); }
.profile-card h2 { margin: 0 0 4px; }
.profile-card .role { display: inline-flex; align-items: center; gap: 6px; padding: 4px 14px; border-radius: var(--r-pill); font-weight: 700; font-size: .8rem; }
.profile-progress { margin-top: 20px; text-align: start; }
.progress-bar { height: 9px; border-radius: 999px; background: rgba(255,255,255,.08); overflow: hidden; margin-top: 8px; }
.progress-bar i { display: block; height: 100%; border-radius: 999px; background: var(--grad-btn); width: 0; transition: width 1.2s var(--ease-out); }
.profile-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
.mini-stat { padding: 14px; border-radius: var(--r-sm); background: rgba(255,255,255,.04); border: 1px solid var(--stroke-soft); text-align: center; }
.mini-stat b { display: block; font-family: var(--font-en); font-size: 1.4rem; color: var(--tx-1); }
.mini-stat span { font-size: .74rem; color: var(--tx-muted); }

.info-list { padding: 24px; }
.info-list h3 { margin: 0 0 18px; }
.info-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 13px 0; border-bottom: 1px solid var(--stroke-soft); }
.info-row:last-child { border-bottom: none; }
.info-row .k { color: var(--tx-muted); font-size: .85rem; display: inline-flex; align-items: center; gap: 9px; }
.info-row .k svg { width: 17px; height: 17px; }
.info-row .v { color: var(--tx-1); font-size: .9rem; font-weight: 600; font-family: var(--font-en); }
.locked-note { font-size: .72rem; color: var(--a-gold); margin-inline-start: 8px; }

.avatar-pick { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.avatar-pick button { border-radius: 16px; overflow: hidden; border: 2px solid transparent; transition: border-color var(--t), transform var(--t); }
.avatar-pick button:hover { transform: translateY(-3px); }
.avatar-pick button.sel { border-color: var(--c-turquoise); box-shadow: var(--glow-teal); }

/* --------------------------------------------------------
   ADMIN
   -------------------------------------------------------- */
.admin-shell { display: grid; grid-template-columns: 264px 1fr; min-height: 100vh; }
.admin-side {
  position: sticky; top: 0; align-self: start; height: 100vh; overflow-y: auto;
  background: rgba(10,16,34,.55);
  -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px);
  border-inline-end: 1px solid var(--stroke-soft);
  padding: 20px 14px;
  transition: width var(--t) var(--ease);
}
.admin-side .a-brand { display: flex; align-items: center; gap: 10px; padding: 6px 8px 18px; }
.admin-side .a-brand img { width: 34px; height: 34px; }
.admin-side .a-brand b { font-family: var(--font-en); color: #fff; font-size: 1.05rem; }
.admin-nav { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 3px; }
.admin-nav a {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 13px; border-radius: 12px;
  color: var(--tx-3); font-size: .9rem; font-weight: 600;
  transition: background var(--t), color var(--t);
}
.admin-nav a svg { width: 19px; height: 19px; flex-shrink: 0; }
.admin-nav a:hover { background: rgba(255,255,255,.05); color: #fff; }
.admin-nav a.active { background: var(--grad-brand-soft); color: #fff; box-shadow: inset 0 0 0 1px var(--stroke); }
.admin-nav .grp { font-size: .68rem; text-transform: uppercase; letter-spacing: .12em; color: var(--tx-muted); padding: 14px 13px 6px; font-family: var(--font-en); }

.admin-main { padding: clamp(18px, 2.6vw, 34px); min-width: 0; }
.admin-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.admin-top h1 { margin: 0; font-size: 1.6rem; }
.admin-top .who { display: flex; align-items: center; gap: 10px; }
.admin-top .who img { width: 40px; height: 40px; border-radius: 12px; }
.admin-burger { display: none; width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--stroke); background: rgba(255,255,255,.05); color: #fff; place-items: center; }

.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat {
  --accent: #2bd8c6;
  padding: 20px; border-radius: var(--r-lg);
  background: var(--glass-card); border: 1px solid var(--stroke-soft);
  display: flex; align-items: center; gap: 16px;
  transition: transform var(--t) var(--ease), box-shadow var(--t) var(--ease);
}
.stat:hover { transform: translateY(-4px); box-shadow: var(--sh-card); }
.stat .s-ico { width: 54px; height: 54px; border-radius: 16px; display: grid; place-items: center; color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, rgba(10,16,34,.4)); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); }
.stat .s-ico svg { width: 26px; height: 26px; }
.stat .s-num { font-family: var(--font-en); font-size: 1.8rem; font-weight: 700; color: #fff; line-height: 1; }
.stat .s-label { color: var(--tx-muted); font-size: .82rem; margin-top: 4px; }

.panel-block { margin-top: 22px; padding: 20px; border-radius: var(--r-lg); background: var(--glass-card); border: 1px solid var(--stroke-soft); }
.panel-block h3 { margin: 0 0 16px; font-size: 1.1rem; }

.table-wrap { overflow-x: auto; border-radius: var(--r-md); border: 1px solid var(--stroke-soft); }
table.data { width: 100%; border-collapse: collapse; min-width: 640px; }
table.data th, table.data td { text-align: start; padding: 13px 16px; font-size: .85rem; }
table.data thead th { color: var(--tx-muted); font-weight: 600; background: rgba(255,255,255,.03); border-bottom: 1px solid var(--stroke-soft); font-size: .76rem; text-transform: uppercase; letter-spacing: .06em; }
table.data tbody tr { transition: background var(--t-fast); }
table.data tbody tr:hover { background: var(--glass-row); }
table.data tbody td { border-bottom: 1px solid var(--stroke-soft); color: var(--tx-2); }
table.data .u-cell { display: flex; align-items: center; gap: 10px; }
table.data .u-cell img { width: 32px; height: 32px; border-radius: 9px; }
.pill { padding: 3px 10px; border-radius: 999px; font-size: .72rem; font-weight: 700; font-family: var(--font-en); }
.pill.green { background: rgba(63,220,138,.15); color: #5fe6a0; }
.pill.gold  { background: rgba(255,207,90,.15); color: #ffd87a; }
.pill.red   { background: rgba(255,107,107,.15); color: #ff8a8a; }
.pill.blue  { background: rgba(88,182,255,.15); color: #8ccbff; }
.pill.purple{ background: rgba(155,130,255,.15); color: #b9a6ff; }

/* --------------------------------------------------------
   EMPTY STATE
   -------------------------------------------------------- */
.empty { text-align: center; padding: 50px 20px; color: var(--tx-muted); }
.empty svg { width: 54px; height: 54px; margin: 0 auto 14px; opacity: .5; }

/* OTP inputs */
.otp-inputs { display: flex; gap: 10px; justify-content: center; margin: 18px 0; direction: ltr; }
.otp-inputs input {
  width: 52px; height: 60px; text-align: center; font-size: 1.6rem; font-family: var(--font-en);
  border-radius: var(--r-sm); background: var(--glass-input); border: 1px solid var(--stroke); color: #fff;
  transition: border-color var(--t), box-shadow var(--t);
}
.otp-inputs input:focus { outline: none; border-color: var(--c-turquoise); box-shadow: 0 0 0 3px rgba(43,216,198,.18); }
.otp-timer { text-align: center; color: var(--tx-3); font-size: .85rem; }
.otp-timer b { font-family: var(--font-en); color: var(--c-turquoise); }

/* --------------------------------------------------------
   RESPONSIVE
   -------------------------------------------------------- */
@media (max-width: 1180px) {
  .home-panels { grid-template-columns: 1fr 1fr; }
  .home-panels .join-box { grid-column: 1 / -1; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 960px) {
  .catalog { grid-template-columns: repeat(2, 1fr); }
  .profile-grid { grid-template-columns: 1fr; }
  .admin-shell { grid-template-columns: 1fr; }
  .admin-side {
    position: fixed; inset: 0 auto 0 0; z-index: 150; width: 280px; height: 100vh;
    transform: translateX(-100%);
  }
  body[dir="rtl"] .admin-side { inset: 0 0 0 auto; transform: translateX(100%); }
  body.admin-open .admin-side { transform: translateX(0); }
  .admin-burger { display: grid; }
}
@media (max-width: 720px) {
  .home-panels { grid-template-columns: 1fr; }
  .post { grid-template-columns: 1fr; }
  .post .p-thumb { aspect-ratio: 16/7; }
  .avatar-pick { grid-template-columns: repeat(5, 1fr); }
}
@media (max-width: 560px) {
  .catalog { grid-template-columns: 1fr; }
  .stat-grid { grid-template-columns: 1fr; }
  .profile-stats { grid-template-columns: 1fr 1fr; }
}

/* ========================================================
   ADMIN — CRUD controls (toolbar, tables, forms, panels)
   ======================================================== */
.sec-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 4px; flex-wrap: wrap; }
.sec-count { font-size: .85rem; color: var(--tx-muted); font-weight: 600; }

.ico-btn.sm { width: 34px; height: 34px; border-radius: 10px; }
.ico-btn.sm svg { width: 17px; height: 17px; }
.ico-btn.danger:hover { color: #ff8a8a; border-color: rgba(255,107,107,.5); background: rgba(255,107,107,.1); }
.act-cell { white-space: nowrap; }
.act-cell .ico-btn { display: inline-grid; vertical-align: middle; margin-inline-start: 4px; }

.swatch { width: 16px; height: 16px; border-radius: 5px; display: inline-block; border: 1px solid var(--stroke-strong); flex: 0 0 auto; }
.muted-cell { color: var(--tx-muted); }

/* form layout inside modal */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-actions { display: flex; gap: 10px; margin-top: 6px; }
.color-row { display: flex; align-items: center; gap: 12px; }
.color-pick { width: 52px; height: 44px; padding: 4px; border-radius: var(--r-sm); border: 1px solid var(--stroke); background: var(--glass-input); cursor: pointer; }
.color-pick::-webkit-color-swatch-wrapper { padding: 0; }
.color-pick::-webkit-color-swatch { border: none; border-radius: 6px; }

.switch-row { display: flex; align-items: center; gap: 10px; margin: 4px 0 16px; cursor: pointer; font-size: .9rem; color: var(--tx-2); }
.switch-row input { width: 18px; height: 18px; accent-color: var(--c-turquoise); cursor: pointer; }

.price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.price-grid > div { display: flex; flex-direction: column; gap: 5px; }
.price-lab { font-size: .72rem; color: var(--tx-muted); font-family: var(--font-en); }

.mini-select { font-family: inherit; font-size: .8rem; padding: 5px 8px; border-radius: 8px; background: var(--glass-input); border: 1px solid var(--stroke); color: var(--tx-1); cursor: pointer; }
.mini-select:disabled { opacity: .5; cursor: not-allowed; }
.mini-select:focus { outline: none; border-color: var(--c-turquoise); }

/* key/value rows in view dialogs + settings */
.kv { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 11px 0; border-bottom: 1px solid var(--stroke-soft); }
.kv:last-child { border-bottom: none; }
.kv > span { color: var(--tx-muted); font-size: .85rem; }
.kv > b { color: var(--tx-1); font-size: .9rem; text-align: end; }
.kv.col { flex-direction: column; align-items: stretch; gap: 6px; }
.kv.col > p { margin: 0; color: var(--tx-2); line-height: 1.7; font-size: .9rem; }

/* media library */
.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 12px; }
.media-cell { aspect-ratio: 1; border-radius: var(--r-md); background: var(--glass-input); border: 1px solid var(--stroke-soft); display: grid; place-items: center; padding: 8px; transition: transform var(--t-fast), border-color var(--t-fast); }
.media-cell:hover { transform: translateY(-3px); border-color: var(--stroke-strong); }
.media-cell img { width: 100%; height: 100%; object-fit: contain; }
.media-cell.lg { max-width: 200px; aspect-ratio: auto; padding: 22px; }

/* roles */
.roles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.role-card { padding: 16px; border-radius: var(--r-md); background: var(--glass-input); border: 1px solid var(--stroke-soft); }
.role-top { margin-bottom: 12px; }
.role-perms { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.role-perms li { display: flex; align-items: center; gap: 8px; font-size: .84rem; color: var(--tx-2); }
.role-perms li svg { width: 16px; height: 16px; color: var(--c-turquoise); flex: 0 0 auto; }

/* logs */
.log-list { display: flex; flex-direction: column; }
.log-row { display: flex; align-items: center; gap: 12px; padding: 12px 4px; border-bottom: 1px solid var(--stroke-soft); }
.log-row:last-child { border-bottom: none; }
.log-ic { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: rgba(255,255,255,.05); color: var(--c-turquoise); flex: 0 0 auto; }
.log-ic svg { width: 17px; height: 17px; }
.log-t { flex: 1; font-size: .87rem; color: var(--tx-2); }
.log-d { font-size: .76rem; color: var(--tx-muted); }

/* settings toggles */
.set-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--stroke-soft); cursor: pointer; }
.set-row:last-child { border-bottom: none; }
.set-row b { display: block; font-size: .92rem; color: var(--tx-1); margin-bottom: 3px; }
.set-row span { font-size: .78rem; color: var(--tx-muted); }
.set-toggle { width: 20px; height: 20px; accent-color: var(--c-turquoise); cursor: pointer; flex: 0 0 auto; }

@media (max-width: 640px) {
  .grid-2, .roles-grid { grid-template-columns: 1fr; }
  .price-grid { grid-template-columns: 1fr; }
}

/* =========================================================
   إضافات: معرض صور العناصر + مدير الوسائط + مصفوفة الصلاحيات
   + تحذير file:// + صور الكتالوج + تنبيه إغلاق النماذج
   ========================================================= */

/* ----- معرض صور العنصر داخل نموذج المحتوى (#1) ----- */
.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 10px; margin-bottom: 10px; }
.gal-empty { grid-column: 1 / -1; padding: 16px; text-align: center; font-size: .82rem; color: var(--tx-muted);
  border: 1px dashed var(--stroke-soft); border-radius: var(--r-md); }
.gal-item { position: relative; aspect-ratio: 1; border-radius: var(--r-md); overflow: hidden;
  border: 1px solid var(--stroke-soft); background: var(--glass-input); }
.gal-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gal-item.is-primary { border-color: var(--a-green); box-shadow: 0 0 0 2px color-mix(in srgb, var(--a-green) 45%, transparent); }
.gal-tools { position: absolute; inset: auto 0 0 0; display: flex; justify-content: space-between; gap: 4px; padding: 4px;
  background: linear-gradient(to top, rgba(0,0,0,.55), transparent); opacity: 0; transition: opacity var(--t-fast); }
.gal-item:hover .gal-tools, .gal-item.is-primary .gal-tools { opacity: 1; }
.gal-btn { width: 26px; height: 26px; display: grid; place-items: center; border: none; cursor: pointer;
  border-radius: 8px; background: rgba(255,255,255,.16); color: #fff; }
.gal-btn svg { width: 14px; height: 14px; }
.gal-btn.on { background: var(--a-green); color: #06281a; }
.gal-btn.danger { background: rgba(255,90,90,.9); }
.gal-badge { position: absolute; top: 6px; inset-inline-start: 6px; font-size: .62rem; font-weight: 700;
  padding: 2px 7px; border-radius: 999px; background: var(--a-green); color: #06281a; }
.gal-add { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 6px; }
.gal-add .gal-url, .gal-add .media-url { flex: 1 1 200px; min-width: 0; }
.gal-upload { cursor: pointer; }
.gal-hint { font-size: .72rem; color: var(--tx-muted); margin: 0 0 4px; }

/* صورة مصغّرة في جدول المحتوى */
.row-thumb { width: 34px; height: 34px; border-radius: 9px; object-fit: cover; border: 1px solid var(--stroke-soft); flex: none; }

/* ----- مدير الوسائط: الأفاتارات والشعارات (#4) ----- */
.media-grid2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; margin-top: 6px; }
.media-card { border: 1px solid var(--stroke-soft); border-radius: var(--r-md); background: var(--glass-input);
  padding: 10px; display: flex; flex-direction: column; gap: 8px; transition: border-color var(--t-fast), opacity var(--t-fast); }
.media-card.off { opacity: .5; }
.media-card.is-primary { border-color: var(--a-green); box-shadow: 0 0 0 2px color-mix(in srgb, var(--a-green) 35%, transparent); }
.media-thumb { aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: var(--glass-card); display: grid; place-items: center; }
.media-thumb.lg { aspect-ratio: 16 / 9; }
.media-thumb img { width: 100%; height: 100%; object-fit: contain; }
.media-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.media-tag { font-size: .64rem; color: var(--tx-muted); padding: 2px 7px; border-radius: 999px; border: 1px solid var(--stroke-soft); }
.mini-switch { display: inline-flex; align-items: center; gap: 6px; font-size: .74rem; color: var(--tx-2); cursor: pointer; }
.mini-switch input { accent-color: var(--a-green); }

/* ----- مصفوفة الرتب والصلاحيات (#12) ----- */
.role-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.role-count { font-size: .76rem; color: var(--tx-muted); }
.perm-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.perm-row { display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid var(--stroke-soft); }
.perm-row:last-child { border-bottom: none; }
.perm-name { font-size: .8rem; color: var(--tx-2); line-height: 1.4; }
.perm-toggle { width: 30px; height: 30px; flex: none; display: grid; place-items: center; border-radius: 9px; cursor: pointer;
  border: 1px solid var(--stroke-soft); transition: transform var(--t-fast), background var(--t-fast); }
.perm-toggle svg { width: 15px; height: 15px; }
.perm-toggle.on { background: color-mix(in srgb, var(--a-green) 22%, transparent); border-color: var(--a-green); color: var(--a-green); }
.perm-toggle.off { background: color-mix(in srgb, #ff5a5a 16%, transparent); border-color: color-mix(in srgb, #ff5a5a 50%, transparent); color: #ff7a7a; }
.perm-toggle:not(:disabled):hover { transform: scale(1.08); }
.perm-toggle:disabled { cursor: default; opacity: .9; }

/* ----- تحذير فتح الموقع كملف file:// ----- */
.file-warn { position: sticky; top: 0; z-index: 60; display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 16px; background: color-mix(in srgb, var(--accent, #2bd8c6) 16%, #1a1d24);
  border-bottom: 1px solid var(--stroke-soft); color: var(--tx-1); font-size: .82rem; line-height: 1.6; }
.file-warn .fw-ic { flex: none; color: var(--c-turquoise, #2bd8c6); display: grid; place-items: center; }
.file-warn .fw-ic svg { width: 18px; height: 18px; }
.file-warn .fw-tx { flex: 1; }
.file-warn code { font-family: var(--font-en); background: rgba(0,0,0,.25); padding: 1px 6px; border-radius: 6px; direction: ltr; display: inline-block; }
.file-warn .fw-x { flex: none; background: none; border: none; color: var(--tx-2); cursor: pointer; display: grid; place-items: center; padding: 2px; }
.file-warn .fw-x svg { width: 16px; height: 16px; }

/* ----- صور الكتالوج (بطاقة + سلايدر التفاصيل) (#1) ----- */
.item-thumb .thumb-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.slide .slide-img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ----- تنبيه إغلاق نموذج (التقديم/التسجيل) (#9) ----- */
.form-closed { background: color-mix(in srgb, #ffcf5a 14%, transparent); border: 1px solid color-mix(in srgb, #ffcf5a 45%, transparent);
  color: var(--tx-1); border-radius: var(--r-md); padding: 12px 14px; margin-bottom: 16px; font-size: .85rem; text-align: center; }

/* ----- بطاقة تفاصيل الحساب (viewPlayer) + مودال عريض ----- */
.modal.modal-wide { max-width: 760px; }
.player-head { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.player-av { width: 62px; height: 62px; border-radius: 16px; object-fit: cover; border: 1px solid var(--stroke-soft); flex: none; }
.player-name { font-size: 1.15rem; font-weight: 800; color: var(--tx-1); margin-bottom: 6px; }
.player-head .pill { margin-inline-end: 6px; }
.detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px 16px; margin-bottom: 8px; }
.detail-grid .kv { display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 12px; background: var(--glass-input); border: 1px solid var(--stroke-soft); border-radius: var(--r-md); }
.detail-grid .kv span { font-size: .78rem; color: var(--tx-muted); }
.detail-grid .kv b { font-size: .86rem; color: var(--tx-1); text-align: end; word-break: break-word; }
.detail-grid .kv code { background: rgba(0,0,0,.28); padding: 2px 8px; border-radius: 7px; }
.hist-title { display: flex; align-items: center; gap: 8px; margin: 18px 0 10px; font-size: .95rem; color: var(--tx-1); }
.hist-title svg { width: 17px; height: 17px; color: var(--c-turquoise, #2bd8c6); }
.hist-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding: 10px 12px; margin-bottom: 6px;
  background: var(--glass-input); border: 1px solid var(--stroke-soft); border-radius: var(--r-md); }
.hist-row b { color: var(--tx-1); font-size: .84rem; }
.hist-row .muted-cell { flex: 1; min-width: 120px; }
table.data.mini { width: 100%; }
table.data.mini th, table.data.mini td { padding: 8px 10px; font-size: .8rem; }
