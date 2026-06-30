/* =========================================================
   Neom Studio — Design Tokens
   The single source of truth for the visual identity.
   Derived from the reference mockup: turquoise → sky → purple,
   glassmorphism, soft glow, rounded geometry.
   ========================================================= */

:root {
  /* ---- Brand gradient stops ---- */
  --c-turquoise: #2bd8c6;
  --c-sky:       #45a8e6;
  --c-purple:    #8b6bf0;
  --c-violet:    #a06bff;

  /* Signature gradients */
  --grad-brand:  linear-gradient(110deg, #2bd8c6 0%, #45a8e6 48%, #8b6bf0 100%);
  --grad-brand-soft: linear-gradient(110deg, #2bd8c6aa 0%, #45a8e6aa 50%, #8b6bf0aa 100%);
  --grad-text:   linear-gradient(100deg, #5ef0dd 0%, #7cc6ff 45%, #b79bff 100%);
  --grad-btn:    linear-gradient(120deg, #2bd8c6 0%, #4aa0e8 55%, #8b6bf0 100%);

  /* ---- Page background ---- */
  --bg-0:  #5a6fd8;            /* base periwinkle */
  --bg-grad: radial-gradient(1200px 700px at 12% -5%, #57d6d0 0%, transparent 45%),
             radial-gradient(1100px 800px at 100% 0%, #9a86ea 0%, transparent 50%),
             linear-gradient(160deg, #6678e0 0%, #7b78dd 45%, #9182d4 100%);

  /* ---- Glass surfaces ---- */
  --glass-nav:    rgba(36, 54, 92, 0.34);
  --glass-card:   rgba(20, 30, 56, 0.50);
  --glass-card-2: rgba(15, 22, 44, 0.58);
  --glass-panel:  rgba(13, 19, 40, 0.55);
  --glass-row:    rgba(255, 255, 255, 0.035);
  --glass-input:  rgba(10, 16, 34, 0.45);

  --stroke:       rgba(255, 255, 255, 0.14);
  --stroke-soft:  rgba(255, 255, 255, 0.08);
  --stroke-strong:rgba(255, 255, 255, 0.22);

  /* ---- Text ---- */
  --tx-1: #ffffff;
  --tx-2: #d6deff;
  --tx-3: #aab4e0;
  --tx-muted: #8c97c8;

  /* ---- Accents (per section) ---- */
  --a-teal:   #2bd8c6;
  --a-purple: #9b82ff;
  --a-green:  #4fd88a;
  --a-gold:   #ffcf5a;
  --a-pink:   #ff7eb0;
  --a-blue:   #58b6ff;
  --a-orange: #f0a23a;
  --a-red:    #ff6b6b;

  /* ---- Radius ---- */
  --r-xs: 10px;
  --r-sm: 14px;
  --r-md: 18px;
  --r-lg: 22px;
  --r-xl: 28px;
  --r-pill: 999px;

  /* ---- Blur ---- */
  --blur-card: 18px;
  --blur-nav: 22px;

  /* ---- Shadows / glow ---- */
  --sh-card:  0 18px 50px -20px rgba(8, 12, 30, 0.65);
  --sh-soft:  0 10px 30px -14px rgba(8, 12, 30, 0.55);
  --sh-pop:   0 30px 80px -28px rgba(6, 10, 26, 0.8);
  --glow-teal:   0 0 28px -4px rgba(43, 216, 198, 0.6);
  --glow-purple: 0 0 28px -4px rgba(155, 130, 255, 0.6);
  --glow-btn:    0 10px 30px -10px rgba(74, 160, 232, 0.65);

  /* ---- Type ---- */
  --font-ar: "Cairo", "Segoe UI", system-ui, sans-serif;
  --font-en: "Poppins", "Cairo", system-ui, sans-serif;

  --fs-display: clamp(2.6rem, 5.2vw, 4.4rem);
  --fs-h1: clamp(1.9rem, 3vw, 2.6rem);
  --fs-h2: clamp(1.35rem, 2vw, 1.7rem);
  --fs-h3: 1.12rem;
  --fs-body: 1rem;
  --fs-sm: 0.875rem;
  --fs-xs: 0.75rem;

  /* ---- Layout ---- */
  --maxw: 1320px;
  --gutter: clamp(16px, 3.4vw, 40px);
  --nav-h: 76px;

  /* ---- Motion ---- */
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --t-fast: 0.18s;
  --t: 0.32s;
  --t-slow: 0.6s;
}

/* =========================================================
   LIGHT THEME — same brand identity (turquoise→sky→purple),
   only the surfaces/text/background flip to a light palette.
   Activated by <html data-theme="light">. Dark stays default.
   ========================================================= */
[data-theme="light"] {
  /* page background: airy, with soft brand tints */
  --bg-0: #eaf0fb;
  --bg-grad:
    radial-gradient(1200px 700px at 12% -5%, #c5f1ec 0%, transparent 46%),
    radial-gradient(1100px 800px at 100% 0%, #ddd2ff 0%, transparent 52%),
    linear-gradient(160deg, #eef3fe 0%, #f2effc 48%, #f6f4fb 100%);

  /* glass surfaces become light/white translucent */
  --glass-nav:    rgba(255, 255, 255, 0.62);
  --glass-card:   rgba(255, 255, 255, 0.74);
  --glass-card-2: rgba(255, 255, 255, 0.82);
  --glass-panel:  rgba(255, 255, 255, 0.72);
  --glass-row:    rgba(28, 38, 74, 0.04);
  --glass-input:  rgba(255, 255, 255, 0.78);

  --stroke:        rgba(30, 42, 84, 0.12);
  --stroke-soft:   rgba(30, 42, 84, 0.07);
  --stroke-strong: rgba(30, 42, 84, 0.22);

  /* dark, readable text */
  --tx-1: #15203f;
  --tx-2: #344063;
  --tx-3: #586289;
  --tx-muted: #818bb0;

  /* darken the gradient-text so it stays readable on light bg */
  --grad-text: linear-gradient(100deg, #14b0a0 0%, #2f7fd6 45%, #6f4fe0 100%);

  /* softer, lighter shadows */
  --sh-card: 0 18px 50px -24px rgba(90, 100, 150, 0.35);
  --sh-soft: 0 10px 30px -16px rgba(90, 100, 150, 0.28);
  --sh-pop:  0 30px 80px -30px rgba(90, 100, 150, 0.40);
}

/* --- patch the literal-colour fills so light mode reads correctly --- */
[data-theme="light"] .btn-ghost { background: rgba(28,38,74,.04); }
[data-theme="light"] .btn-ghost:hover { background: rgba(28,38,74,.08); }

[data-theme="light"] .nav-link:hover,
[data-theme="light"] .nav-link.is-active,
[data-theme="light"] .ico-btn,
[data-theme="light"] .social-btn,
[data-theme="light"] .chip,
[data-theme="light"] .react,
[data-theme="light"] .mini-stat,
[data-theme="light"] .admin-nav a:hover,
[data-theme="light"] .admin-burger,
[data-theme="light"] .modal-close,
[data-theme="light"] .suggest button:hover,
[data-theme="light"] .suggest button.active,
[data-theme="light"] table.data thead th { background: rgba(28,38,74,.05); }

[data-theme="light"] .ico-btn:hover,
[data-theme="light"] .social-btn:hover,
[data-theme="light"] .react:hover,
[data-theme="light"] .modal-close:hover { background: rgba(28,38,74,.09); }

[data-theme="light"] .progress-bar { background: rgba(28,38,74,.10); }
[data-theme="light"] .slider-dots b { background: rgba(28,38,74,.30); }

/* dark tiles/inputs/dropdowns → light equivalents */
[data-theme="light"] .input,
[data-theme="light"] .select,
[data-theme="light"] .textarea { background: rgba(255,255,255,.82); }
[data-theme="light"] .suggest { background: #ffffff; }
[data-theme="light"] .admin-side { background: rgba(255,255,255,.72); }
[data-theme="light"] .feature .f-icon { background: color-mix(in srgb, var(--accent) 16%, #ffffff); }
[data-theme="light"] .forum-row .fr-ico { background: color-mix(in srgb, var(--accent, #58b6ff) 16%, #ffffff); }
[data-theme="light"] .stat .s-ico { background: color-mix(in srgb, var(--accent) 16%, #ffffff); }
[data-theme="light"] .btn-outline:hover { color: #ffffff; }
