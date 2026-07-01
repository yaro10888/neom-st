/* =========================================================
   Neom Studio — Components
   ========================================================= */

/* --------------------------------------------------------
   BUTTONS
   -------------------------------------------------------- */
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 24px;
  border-radius: var(--r-pill);
  font-weight: 600;
  font-size: .95rem;
  line-height: 1;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  isolation: isolate;
  transition: transform var(--t) var(--ease), box-shadow var(--t) var(--ease), filter var(--t) var(--ease), background var(--t) var(--ease), border-color var(--t) var(--ease);
}
.btn svg { width: 18px; height: 18px; }
.btn:active { transform: scale(.96); }

.btn-primary { background: var(--grad-btn); box-shadow: var(--glow-btn); }
.btn-primary:hover { transform: translateY(-2px); filter: saturate(1.15) brightness(1.05); box-shadow: 0 16px 40px -12px rgba(74,160,232,.8); }

.btn-ghost {
  background: rgba(255,255,255,.05);
  border: 1px solid var(--stroke);
  color: var(--tx-1);
}
.btn-ghost:hover { transform: translateY(-2px); border-color: var(--stroke-strong); background: rgba(255,255,255,.09); box-shadow: var(--glow-btn); }

.btn-sm { padding: 9px 18px; font-size: .85rem; }
.btn-block { width: 100%; }
.btn[disabled] { opacity: .55; cursor: not-allowed; transform: none !important; box-shadow: none; }

/* outlined per-accent small button (used on section cards) */
.btn-outline {
  padding: 9px 20px;
  border-radius: var(--r-pill);
  border: 1.4px solid var(--accent, var(--c-turquoise));
  color: var(--accent, var(--c-turquoise));
  background: color-mix(in srgb, var(--accent, #2bd8c6) 10%, transparent);
  font-weight: 600; font-size: .85rem;
  transition: background var(--t) var(--ease), color var(--t) var(--ease), box-shadow var(--t) var(--ease), transform var(--t) var(--ease);
}
.btn-outline:hover { background: var(--accent, #2bd8c6); color: #07121f; box-shadow: 0 0 22px -2px color-mix(in srgb, var(--accent,#2bd8c6) 70%, transparent); transform: translateY(-2px); }

/* ripple element injected by JS */
.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  background: rgba(255,255,255,.45);
  animation: ripple .6s var(--ease-out);
  pointer-events: none;
  z-index: -1;
}
@keyframes ripple { to { transform: scale(2.6); opacity: 0; } }

/* --------------------------------------------------------
   GLASS CARD (generic)
   -------------------------------------------------------- */
.card {
  position: relative;
  border-radius: var(--r-lg);
  background: var(--glass-card);
  border: 1px solid var(--stroke-soft);
  -webkit-backdrop-filter: blur(var(--blur-card));
  backdrop-filter: blur(var(--blur-card));
  box-shadow: var(--sh-card);
  transition: transform var(--t) var(--ease), box-shadow var(--t) var(--ease), border-color var(--t) var(--ease);
}
.card-hover:hover {
  transform: translateY(-6px) scale(1.025);
  border-color: color-mix(in srgb, var(--accent, #2bd8c6) 45%, transparent);
  box-shadow: var(--sh-pop), 0 0 30px -6px color-mix(in srgb, var(--accent,#2bd8c6) 55%, transparent);
}

/* --------------------------------------------------------
   SECTION FEATURE CARD (home "المابات / الأنظمة..." cards)
   -------------------------------------------------------- */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}
.feature {
  --accent: var(--c-turquoise);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 26px 18px 22px;
}
.feature .f-icon {
  width: 70px; height: 70px;
  border-radius: 20px;
  display: grid; place-items: center;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, rgba(10,16,34,.5));
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  box-shadow: inset 0 0 22px -8px color-mix(in srgb, var(--accent) 60%, transparent);
  transition: transform var(--t) var(--ease), box-shadow var(--t) var(--ease);
}
.feature .f-icon svg { width: 34px; height: 34px; }
.feature:hover .f-icon { transform: translateY(-4px) rotate(-4deg); box-shadow: inset 0 0 22px -8px color-mix(in srgb, var(--accent) 60%, transparent), 0 0 24px -4px color-mix(in srgb, var(--accent) 70%, transparent); }
.feature h3 { color: var(--accent); margin: 0; font-size: 1.12rem; }
.feature p { color: var(--tx-3); font-size: .86rem; margin: 0; line-height: 1.55; min-height: 2.7em; }
.feature .btn-outline { margin-top: 4px; }

/* accent variants */
.feature.acc-teal   { --accent: #2bd8c6; }
.feature.acc-purple { --accent: #9b82ff; }
.feature.acc-green  { --accent: #4fd88a; }
.feature.acc-gold   { --accent: #ffcf5a; }
.feature.acc-pink   { --accent: #ff7eb0; }
.feature.acc-blue   { --accent: #58b6ff; }

/* --------------------------------------------------------
   BADGES / TAGS / CHIPS
   -------------------------------------------------------- */
.tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px;
  border-radius: var(--r-pill);
  font-size: .74rem; font-weight: 700;
  border: 1px solid color-mix(in srgb, var(--tagc, #2bd8c6) 40%, transparent);
  color: var(--tagc, #2bd8c6);
  background: color-mix(in srgb, var(--tagc, #2bd8c6) 14%, transparent);
  white-space: nowrap;
}
.tag.t-update  { --tagc: #f0a23a; }
.tag.t-contest { --tagc: #4fd88a; }
.tag.t-course  { --tagc: #b07bff; }
.tag.t-news    { --tagc: #58b6ff; }
.tag.t-new     { --tagc: #9b82ff; }

.badge-free {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 11px; border-radius: var(--r-pill);
  background: rgba(63,220,138,.16);
  border: 1px solid rgba(63,220,138,.5);
  color: #5fe6a0; font-weight: 700; font-size: .74rem;
}
.badge-price {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 11px; border-radius: var(--r-pill);
  background: rgba(255,255,255,.06);
  border: 1px solid var(--stroke);
  color: var(--tx-1); font-family: var(--font-en); font-weight: 600; font-size: .78rem;
}

/* --------------------------------------------------------
   SECTION HEADER (title + view all)
   -------------------------------------------------------- */
.sec { margin-top: clamp(40px, 6vw, 80px); }
.sec-head {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  margin-bottom: 22px;
}
.sec-head h2 { margin: 0; }
.sec-head .eyebrow { color: var(--tx-muted); font-size: .8rem; letter-spacing: .14em; text-transform: uppercase; font-family: var(--font-en); }
.link-all {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--c-turquoise); font-size: .85rem; font-weight: 600;
  transition: gap var(--t) var(--ease), color var(--t);
}
.link-all svg { width: 16px; height: 16px; }
.link-all:hover { gap: 11px; color: #5ef0dd; }

/* --------------------------------------------------------
   INPUTS / FORMS
   -------------------------------------------------------- */
.field { margin-bottom: 16px; }
.field > label { display: block; font-size: .85rem; color: var(--tx-2); margin-bottom: 7px; font-weight: 600; }
.field .hint { font-size: .72rem; color: var(--tx-muted); margin-top: 6px; }
.field .err { font-size: .74rem; color: #ff8a8a; margin-top: 6px; display: none; }
.field.invalid .err { display: block; }
.field.invalid .input { border-color: rgba(255,107,107,.6); }

.input, .select, .textarea {
  width: 100%;
  padding: 13px 15px;
  border-radius: var(--r-sm);
  background: var(--glass-input);
  border: 1px solid var(--stroke);
  color: var(--tx-1);
  font-size: .95rem;
  transition: border-color var(--t) var(--ease), box-shadow var(--t) var(--ease), background var(--t);
}
.input::placeholder, .textarea::placeholder { color: var(--tx-muted); }
.input:focus, .select:focus, .textarea:focus {
  outline: none;
  border-color: color-mix(in srgb, var(--c-turquoise) 70%, transparent);
  box-shadow: 0 0 0 3px rgba(43,216,198,.16), var(--glow-teal);
  background: rgba(10,16,34,.6);
}
.textarea { resize: vertical; min-height: 120px; line-height: 1.7; }
.input-wrap { position: relative; }
.input-wrap .i-ico { position: absolute; inset-inline-end: 14px; top: 50%; transform: translateY(-50%); color: var(--tx-muted); width: 18px; height: 18px; pointer-events: none; }
.input-wrap .input { padding-inline-end: 42px; }
.char-count { font-size: .72rem; color: var(--tx-muted); text-align: end; margin-top: 6px; font-family: var(--font-en); }
.char-count.warn { color: var(--a-gold); }

.checkbox { display: flex; align-items: center; gap: 9px; cursor: pointer; font-size: .88rem; color: var(--tx-2); }
.checkbox input { width: 18px; height: 18px; accent-color: var(--c-turquoise); }

/* --------------------------------------------------------
   AUTH CARD (login / register)
   -------------------------------------------------------- */
.auth-shell {
  min-height: calc(100vh - var(--nav-h) - 40px);
  display: grid; place-items: center;
  padding: 40px var(--gutter) 80px;
}
.auth-card {
  width: 100%;
  max-width: 560px;
  padding: clamp(26px, 4vw, 44px);
  border-radius: var(--r-xl);
}
.auth-card.wide { max-width: 760px; }
.auth-head { text-align: center; margin-bottom: 26px; }
.auth-head .logo-badge { width: 60px; height: 60px; margin: 0 auto 14px; }
.auth-head h1 { font-size: 1.7rem; margin-bottom: 6px; }
.auth-head p { color: var(--tx-3); margin: 0; font-size: .92rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.auth-foot { text-align: center; margin-top: 20px; font-size: .88rem; color: var(--tx-3); }
.auth-foot a { color: var(--c-turquoise); font-weight: 600; }

/* autocomplete suggestion list (login smart search) */
.suggest {
  position: absolute; z-index: 30; inset-inline: 0; top: calc(100% + 6px);
  background: rgba(12,18,38,.96);
  border: 1px solid var(--stroke);
  border-radius: var(--r-sm);
  box-shadow: var(--sh-pop);
  overflow: hidden;
  display: none;
}
.suggest.show { display: block; }
.suggest button {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 10px 14px; text-align: start; color: var(--tx-2);
  transition: background var(--t-fast);
}
.suggest button:hover, .suggest button.active { background: rgba(255,255,255,.07); color: #fff; }
.suggest button img { width: 30px; height: 30px; border-radius: 9px; }
.suggest mark { background: transparent; color: var(--c-turquoise); font-weight: 700; }

/* --------------------------------------------------------
   MODAL
   -------------------------------------------------------- */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  display: grid; place-items: center;
  padding: 24px;
  background: rgba(6,10,26,.6);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  opacity: 0; visibility: hidden;
  transition: opacity var(--t) var(--ease), visibility var(--t);
}
.modal-overlay.open { opacity: 1; visibility: visible; }
.modal {
  width: 100%; max-width: 680px; max-height: 88vh; overflow: auto;
  border-radius: var(--r-xl);
  background: var(--glass-card-2);
  border: 1px solid var(--stroke);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  box-shadow: var(--sh-pop);
  transform: translateY(20px) scale(.97);
  transition: transform var(--t) var(--ease-out);
}
.modal-overlay.open .modal { transform: none; }
.modal-sm { max-width: 460px; }
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding: 22px 24px 0; }
.modal-head h3 { margin: 0; font-size: 1.25rem; }
.modal-body { padding: 18px 24px 24px; }
.modal-close {
  width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
  border: 1px solid var(--stroke); background: rgba(255,255,255,.05);
  color: var(--tx-2); display: grid; place-items: center;
  transition: background var(--t), color var(--t), transform var(--t);
}
.modal-close:hover { background: rgba(255,255,255,.1); color: #fff; transform: rotate(90deg); }

/* --------------------------------------------------------
   TOASTS
   -------------------------------------------------------- */
.toast-stack {
  position: fixed; top: 18px; inset-inline: 0; z-index: 300;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  pointer-events: none;
  padding-inline: 16px;
}
.toast {
  pointer-events: auto;
  display: flex; align-items: center; gap: 11px;
  padding: 12px 18px;
  border-radius: var(--r-pill);
  background: rgba(14,20,42,.92);
  border: 1px solid var(--stroke);
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
  box-shadow: var(--sh-pop);
  color: var(--tx-1); font-size: .9rem; font-weight: 600;
  transform: translateY(-18px); opacity: 0;
  animation: toastIn .4s var(--ease-out) forwards;
  max-width: min(92vw, 460px);
}
.toast .dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.toast.ok    .dot { background: #4fd88a; box-shadow: 0 0 10px #4fd88a; }
.toast.err   .dot { background: #ff6b6b; box-shadow: 0 0 10px #ff6b6b; }
.toast.info  .dot { background: #58b6ff; box-shadow: 0 0 10px #58b6ff; }
.toast.leaving { animation: toastOut .35s var(--ease) forwards; }
@keyframes toastIn  { to { transform: none; opacity: 1; } }
@keyframes toastOut { to { transform: translateY(-18px); opacity: 0; } }

/* spinner inside buttons */
.spin {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
  animation: spin .7s linear infinite; display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 620px) {
  .feature-grid { grid-template-columns: 1fr 1fr; }
  .form-row { grid-template-columns: 1fr; }
}
@media (max-width: 420px) {
  .feature-grid { grid-template-columns: 1fr; }
}

/* email autocomplete icon (login) */
.suggest .ico-mini { display: inline-grid; place-items: center; color: var(--tx-muted); flex-shrink: 0; }
.suggest .ico-mini svg { width: 18px; height: 18px; }

/* ============================ Cart promo (discount code) ============================ */
.promo {
  margin-top: 16px;
  padding: 14px;
  border: 1px solid var(--stroke);
  border-radius: 14px;
  background: rgba(255, 255, 255, .03);
}
.promo-label {
  display: flex; align-items: center; gap: 8px;
  font-size: .86rem; font-weight: 600; color: var(--tx-2);
  margin-bottom: 10px;
}
.promo-label svg { width: 18px; height: 18px; color: var(--c-turquoise); }
.promo-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.promo-input { flex: 1 1 150px; min-width: 0; text-transform: uppercase; letter-spacing: .04em; font-family: var(--font-en); }
.promo-row .btn { flex: 0 0 auto; }
.promo-status {
  display: flex; align-items: center; gap: 8px;
  margin-top: 12px; font-size: .84rem; font-weight: 600;
  padding: 9px 12px; border-radius: 10px;
}
.promo-status svg { width: 16px; height: 16px; flex: 0 0 auto; }
.promo-status.ok  { color: var(--a-green); background: rgba(79, 216, 138, .12); border: 1px solid rgba(79, 216, 138, .35); }
.promo-status.bad { color: #ff6b6b;       background: rgba(255, 107, 107, .12); border: 1px solid rgba(255, 107, 107, .35); }
.promo-status b { font-family: var(--font-en); }
.promo-discount {
  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
  margin-top: 10px; font-size: .85rem; color: var(--tx-2);
}
.promo-discount b { color: var(--a-green); font-family: var(--font-en); }
.promo-off { display: inline-flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.promo-off .badge-price { background: rgba(79, 216, 138, .14); color: var(--a-green); }
