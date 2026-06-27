/* =========================================================
   Neom Studio — Layout (navbar, hero, footer)
   ========================================================= */

/* --------------------------------------------------------
   NAVBAR
   -------------------------------------------------------- */
.nav-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 14px var(--gutter) 0;
}
.nav {
  max-width: var(--maxw);
  margin-inline: auto;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 10px 18px;
  border-radius: var(--r-lg);
  background: var(--glass-nav);
  border: 1px solid var(--stroke-soft);
  -webkit-backdrop-filter: blur(var(--blur-nav)) saturate(140%);
  backdrop-filter: blur(var(--blur-nav)) saturate(140%);
  box-shadow: var(--sh-soft);
  transition: background var(--t) var(--ease), box-shadow var(--t) var(--ease), padding var(--t) var(--ease), border-color var(--t) var(--ease);
}
.nav-wrap.scrolled .nav {
  background: rgba(16, 24, 46, 0.62);
  border-color: var(--stroke);
  box-shadow: var(--sh-card);
  padding-block: 8px;
}

/* brand (far right in RTL) */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  order: 3;
}
.brand img { width: 38px; height: 38px; filter: drop-shadow(0 0 10px rgba(120,200,255,.5)); }
.brand b {
  font-family: var(--font-en);
  font-weight: 600;
  font-size: 1.18rem;
  color: var(--tx-1);
  letter-spacing: .2px;
}

/* nav links */
.nav-links {
  order: 2;
  display: flex;
  align-items: stretch;
  gap: 4px;
  margin-inline: auto;
  list-style: none;
  padding: 0;
}
.nav-link {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 6px 12px;
  border-radius: 14px;
  color: var(--tx-3);
  transition: color var(--t) var(--ease), background var(--t) var(--ease);
}
.nav-link .nl-top { display: flex; align-items: center; gap: 7px; font-size: .95rem; font-weight: 600; white-space: nowrap; }
.nav-link svg { width: 17px; height: 17px; opacity: .9; }
/* the route-path chip the user asked for */
.nav-link .nl-path {
  font-family: var(--font-en);
  font-size: .62rem;
  letter-spacing: .3px;
  color: var(--tx-muted);
  opacity: .7;
  transition: color var(--t) var(--ease), opacity var(--t) var(--ease);
}
.nav-link:hover { color: var(--tx-1); background: rgba(255,255,255,.05); }
.nav-link:hover .nl-path { opacity: 1; }

/* active underline indicator */
.nav-link::after {
  content: "";
  position: absolute;
  left: 14px; right: 14px; bottom: 1px;
  height: 2.5px;
  border-radius: 3px;
  background: var(--grad-btn);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform var(--t) var(--ease-out);
  box-shadow: 0 0 10px rgba(74,160,232,.7);
}
.nav-link:hover::after { transform: scaleX(.6); }
.nav-link.is-active { color: var(--tx-1); }
.nav-link.is-active .nl-top { background: var(--grad-text); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.nav-link.is-active .nl-top svg { -webkit-text-fill-color: initial; color: var(--c-turquoise); }
.nav-link.is-active::after { transform: scaleX(1); }
.nav-link.is-active .nl-path { color: var(--c-turquoise); opacity: 1; }

/* right-side cluster (login / profile) far left in RTL */
.nav-actions { order: 1; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

/* mobile toggle */
.nav-toggle {
  order: 1;
  display: none;
  width: 44px; height: 44px;
  border-radius: 12px;
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.05);
  align-items: center; justify-content: center;
}
.nav-toggle svg { width: 22px; height: 22px; color: var(--tx-1); }

/* --------------------------------------------------------
   HERO
   -------------------------------------------------------- */
.hero {
  position: relative;
  margin: clamp(16px, 2.4vw, 28px) var(--gutter) 0;
}
.hero-card {
  position: relative;
  max-width: var(--maxw);
  margin-inline: auto;
  overflow: hidden;
  border-radius: var(--r-xl);
  border: 1px solid var(--stroke);
  background:
    radial-gradient(900px 500px at 18% 10%, rgba(60,200,210,.28), transparent 55%),
    radial-gradient(900px 600px at 100% 0%, rgba(150,110,240,.32), transparent 55%),
    linear-gradient(120deg, rgba(40,70,130,.55), rgba(60,40,110,.5));
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: var(--sh-card);
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: 20px;
  padding: clamp(22px, 3vw, 40px);
  min-height: 420px;
}
/* wave pattern on the right edge */
.hero-card .hero-pattern {
  position: absolute;
  inset: 0 0 0 auto;
  width: 46%;
  pointer-events: none;
  opacity: .5;
  mix-blend-mode: screen;
  animation: wavePan 20s linear infinite;
}
@keyframes wavePan {
  0%   { transform: translateX(0) scale(1.04); }
  50%  { transform: translateX(-22px) scale(1.08); }
  100% { transform: translateX(0) scale(1.04); }
}

.hero-copy { position: relative; z-index: 2; }
.hero-eyebrow { color: var(--tx-2); font-size: clamp(1.1rem,1.6vw,1.5rem); font-weight: 600; margin-bottom: .1em; }
.hero-title {
  font-family: var(--font-en);
  font-weight: 700;
  font-size: var(--fs-display);
  line-height: 1.02;
  margin: 0 0 .35em;
  background: var(--grad-text);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 4px 30px rgba(120,200,255,.35));
}
.hero-desc { color: var(--tx-2); max-width: 46ch; margin-bottom: 1.8em; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

.hero-visual {
  position: relative;
  z-index: 1;
  animation: floaty 7s ease-in-out infinite;
  will-change: transform;
}
.hero-visual .hero-scene { width: 100%; height: auto; border-radius: 20px; filter: drop-shadow(0 30px 60px rgba(10,14,40,.6)); }
@keyframes floaty {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-14px); }
}

/* --------------------------------------------------------
   FOOTER
   -------------------------------------------------------- */
.footer {
  margin-top: clamp(60px, 8vw, 110px);
  border-top: 1px solid var(--stroke-soft);
  background: linear-gradient(180deg, rgba(10,16,36,.0), rgba(10,16,36,.35));
}
.footer-top {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 30px;
  padding-block: clamp(36px, 5vw, 60px);
}
.footer-brand { display: flex; flex-direction: column; gap: 12px; max-width: 34ch; }
.footer-brand .brand b { font-size: 1.3rem; }
.footer-brand p { color: var(--tx-3); font-size: var(--fs-sm); margin: 0; }
.footer-col h4 { font-size: .95rem; color: var(--tx-1); margin-bottom: 14px; }
.footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 9px; }
.footer-col a { color: var(--tx-3); font-size: var(--fs-sm); transition: color var(--t-fast); }
.footer-col a:hover { color: var(--c-turquoise); }

.footer-bottom {
  border-top: 1px solid var(--stroke-soft);
  padding-block: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.footer-bottom .copy { color: var(--tx-muted); font-size: var(--fs-sm); }
.socials { display: flex; align-items: center; gap: 12px; }
.socials .label { color: var(--tx-3); font-size: var(--fs-sm); }
.social-btn {
  width: 40px; height: 40px;
  border-radius: 12px;
  border: 1px solid var(--stroke);
  background: rgba(255,255,255,.04);
  display: grid; place-items: center;
  color: var(--tx-2);
  transition: transform var(--t) var(--ease), color var(--t), border-color var(--t), background var(--t);
}
.social-btn svg { width: 19px; height: 19px; }
.social-btn:hover { transform: translateY(-3px); color: #fff; border-color: var(--stroke-strong); background: rgba(255,255,255,.08); box-shadow: var(--glow-btn); }

/* --------------------------------------------------------
   RESPONSIVE
   -------------------------------------------------------- */
@media (max-width: 1080px) {
  .hero-card { grid-template-columns: 1fr; text-align: center; }
  .hero-desc { margin-inline: auto; }
  .hero-actions { justify-content: center; }
  .hero-visual { order: -1; max-width: 520px; margin-inline: auto; }
  .hero-card .hero-pattern { display: none; }
  .footer-top { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 920px) {
  .nav-links {
    position: fixed;
    inset: 0 0 0 auto;
    width: min(86vw, 360px);
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    margin: 0;
    padding: calc(var(--nav-h) + 26px) 18px 26px;
    background: rgba(12, 18, 38, 0.9);
    -webkit-backdrop-filter: blur(24px);
    backdrop-filter: blur(24px);
    border-inline-start: 1px solid var(--stroke);
    transform: translateX(100%);
    transition: transform var(--t) var(--ease-out);
    overflow-y: auto;
  }
  body.menu-open .nav-links { transform: translateX(0); }
  .nav-link { flex-direction: row; justify-content: space-between; padding: 12px 14px; border-radius: 12px; }
  .nav-link .nl-top { font-size: 1rem; }
  .nav-link::after { display: none; }
  .nav-link.is-active { background: rgba(255,255,255,.06); }
  .nav-toggle { display: flex; }
}

@media (max-width: 560px) {
  .footer-top { grid-template-columns: 1fr; }
  .brand b { font-size: 1rem; }
}

/* --------------------------------------------------------
   NAV ACTION BUTTONS (lang / cart / login)
   -------------------------------------------------------- */
.ico-btn {
  position: relative;
  width: 42px; height: 42px;
  display: grid; place-items: center;
  border-radius: 12px;
  border: 1px solid var(--stroke-soft);
  background: rgba(255,255,255,.04);
  color: var(--tx-2);
  transition: color var(--t) var(--ease), background var(--t) var(--ease), border-color var(--t) var(--ease), transform var(--t) var(--ease);
}
.ico-btn svg { width: 20px; height: 20px; }
.ico-btn:hover { color: #fff; border-color: var(--stroke-strong); background: rgba(255,255,255,.08); transform: translateY(-2px); }
.ico-btn .lang-tag { position: absolute; bottom: -3px; inset-inline-end: -3px; font-family: var(--font-en); font-size: .56rem; font-weight: 700; background: var(--grad-btn); color: #fff; padding: 1px 5px; border-radius: 999px; line-height: 1.4; box-shadow: var(--glow-btn); }
.cart-badge {
  position: absolute; top: -6px; inset-inline-end: -6px;
  min-width: 18px; height: 18px; padding: 0 5px;
  display: none; align-items: center; justify-content: center;
  font-family: var(--font-en); font-size: .66rem; font-weight: 700;
  background: var(--grad-btn); color: #fff; border-radius: 999px; box-shadow: var(--glow-btn);
}
.cart-badge.show { display: flex; }
.nav-login { white-space: nowrap; }
@media (max-width: 560px) {
  .nav-login span { display: none; }
  .nav-login { width: 42px; height: 42px; padding: 0; justify-content: center; }
}
