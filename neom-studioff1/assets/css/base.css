/* =========================================================
   Neom Studio — Base
   ========================================================= */

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }

body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--font-ar);
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--tx-2);
  background: var(--bg-0);
  background-image: var(--bg-grad);
  background-attachment: fixed;
  overflow-x: hidden;
  direction: rtl;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

/* numbers, latin, prices use Poppins for a crisp premium look */
.en, .num, time, .price, .stat-num, .badge-en { font-family: var(--font-en); }

h1, h2, h3, h4 { color: var(--tx-1); margin: 0 0 .6em; line-height: 1.25; font-weight: 700; }
h1 { font-size: var(--fs-h1); }
h2 { font-size: var(--fs-h2); }
h3 { font-size: var(--fs-h3); }
p  { margin: 0 0 1em; }

a { color: inherit; text-decoration: none; }

img, svg { max-width: 100%; display: block; }

button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }

input, textarea, select { font-family: inherit; }

::selection { background: rgba(43, 216, 198, .35); color: #fff; }

:focus-visible {
  outline: 2px solid var(--c-turquoise);
  outline-offset: 3px;
  border-radius: 6px;
}

/* ---- Ambient background glow orbs (very slow drift) ---- */
.ambient {
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  overflow: hidden;
}
.ambient span {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: .35;
  animation: drift 26s var(--ease) infinite alternate;
}
.ambient span:nth-child(1){ width:420px; height:420px; left:-80px; top:-60px; background:#3ad8d0; }
.ambient span:nth-child(2){ width:520px; height:520px; right:-120px; top:-80px; background:#a06bff; animation-duration:32s; }
.ambient span:nth-child(3){ width:360px; height:360px; left:30%; bottom:-120px; background:#56b6ff; animation-duration:38s; opacity:.22; }

@keyframes drift {
  from { transform: translate3d(0,0,0) scale(1); }
  to   { transform: translate3d(40px,30px,0) scale(1.12); }
}

/* ---- Scrollbar ---- */
::-webkit-scrollbar { width: 11px; height: 11px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: linear-gradient(#2bd8c6, #8b6bf0);
  border-radius: 999px;
  border: 3px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover { background: linear-gradient(#3ae8d6, #9b7bff); background-clip: padding-box; }

/* ---- Shared helpers ---- */
.container { width: 100%; max-width: var(--maxw); margin-inline: auto; padding-inline: var(--gutter); }
.gradient-text {
  background: var(--grad-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.muted { color: var(--tx-muted); }
.center { text-align: center; }
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

/* reveal-on-scroll baseline (JS adds .in) */
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s var(--ease-out), transform .7s var(--ease-out); }
.reveal.in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
  .reveal { opacity: 1; transform: none; }
}
