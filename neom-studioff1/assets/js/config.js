/* =========================================================
   Neom Studio — Global config, icons & route map
   Loaded first on every page. Exposes window.NEOM.
   ========================================================= */
(function () {
  "use strict";

  /* ---- SVG icon library (outline, premium, thin) ---- */
  const P = (d, extra = "") =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;

  const icons = {
    home: P('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>'),
    map: P('<path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z"/><path d="M9 4v13M15 6.5v13"/>'),
    system: P('<path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z"/><path d="m12 7.5 4 2.3v4.4L12 16.5l-4-2.3V9.8l4-2.3Z"/>'),
    course: P('<path d="M12 4 2.5 9 12 14l9.5-5L12 4Z"/><path d="M6 11v4.5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5V11"/><path d="M21.5 9v5"/>'),
    apply: P('<path d="M21 3 3 11l6 2.5L11 21l4-7 6-11Z"/><path d="m9 13.5 6-6"/>'),
    forum: P('<path d="M4 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M20 9h0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-3-3"/>'),
    complaint: P('<path d="M4 5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M8 9h8M8 13h5"/>'),
    login: P('<path d="M14 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/>'),
    user: P('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
    users: P('<circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.4 3-5 6.5-5s6.5 1.6 6.5 5"/><path d="M16 5.2A3.4 3.4 0 0 1 16 12M17 15c2.8.4 4.5 1.9 4.5 5"/>'),
    cart: P('<path d="M3 4h2l2.2 11.4a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20.5 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>'),
    search: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>'),
    arrowL: P('<path d="M15 5l-7 7 7 7"/>'),
    arrowR: P('<path d="M9 5l7 7-7 7"/>'),
    chevL: P('<path d="M14 6l-6 6 6 6"/>'),
    chevR: P('<path d="M10 6l6 6-6 6"/>'),
    check: P('<path d="M5 12.5 10 17l9-10"/>'),
    eye: P('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'),
    clock: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
    shield: P('<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'),
    star: P('<path d="m12 3 2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.8 6.6 19.4l1.2-6L3.4 9.3l6-.7L12 3Z"/>'),
    bell: P('<path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9Z"/><path d="M10.5 20a2 2 0 0 0 3 0"/>'),
    inbox: P('<path d="M4 13h4l1.5 2.5h5L16 13h4"/><path d="M5 13 6.8 5.3A1.5 1.5 0 0 1 8.3 4h7.4a1.5 1.5 0 0 1 1.5 1.3L19 13v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5Z"/>'),
    globe: P('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.5 4 5.6 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.6-4-9s1.4-6.5 4-9Z"/>'),
    sun: P('<circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M19.4 4.6l-1.9 1.9M6.5 17.5l-1.9 1.9"/>'),
    moon: P('<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/>'),
    menu: P('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    close: P('<path d="m6 6 12 12M18 6 6 18"/>'),
    plus: P('<path d="M12 5v14M5 12h14"/>'),
    layers: P('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5M3 16.5l9 5 9-5"/>'),
    bag: P('<path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>'),
    ticket: P('<path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7Z"/><path d="M14 5v14"/>'),
    settings: P('<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.7.7v.1a2 2 0 1 1-4 0v-.2a1 1 0 0 0-1.7-.6l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0-.6-1.7H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .6-1.7l-.1-.1A2 2 0 1 1 7.5 4.6l.1.1a1 1 0 0 0 1.1.2H8.8a1 1 0 0 0 .6-.9V3.9a2 2 0 1 1 4 0v.2a1 1 0 0 0 1.7.6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1V8.8a1 1 0 0 0 .9.6h.2a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6Z"/>'),
    list: P('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'),
    chart: P('<path d="M4 4v16h16"/><path d="m7 14 3-4 3 3 4-6"/>'),
    image: P('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 18 5-4 4 3 3-2 4 3"/>'),
    flag: P('<path d="M5 21V4"/><path d="M5 4h11l-1.5 3L16 10H5"/>'),
    dashboard: P('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/>'),
    coupon: P('<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"/><path d="M9 10h.01M12 12h.01M15 14h.01"/>'),
    whatsapp: P('<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/><path d="M8.5 8.5c-.3 1.8 2.4 5 4.2 5.8.8.3 1.6-.4 2-1l-1.8-1.2-.9.7c-.8-.4-1.7-1.3-2-2.1l.7-.8L9.5 8c-.3 0-.8 0-1 .5Z"/>'),
    mail: P('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>'),
    lock: P('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    discord: P('<path d="M19 6.5A16 16 0 0 0 15 5l-.3.6a12 12 0 0 1 3 1.5C15.5 7 13.8 6.6 12 6.6s-3.5.4-5.7 1.5a12 12 0 0 1 3-1.5L9 5a16 16 0 0 0-4 1.5C2.8 9.8 2.2 13 2.5 16.2A16 16 0 0 0 7 18.5l.6-1a9 9 0 0 1-1.6-.8l.4-.3c3 1.4 6.2 1.4 9.2 0l.4.3a9 9 0 0 1-1.6.8l.6 1a16 16 0 0 0 4.5-2.3c.4-3.7-.5-6.9-2.6-9.7Z"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/>'),
    twitter: P('<path d="M4 4l7 9.2L4.4 20H7l5-5.4L16 20h4l-7.3-9.6L19.6 4H17l-4.6 5L8.7 4H4Z" fill="currentColor" stroke="none"/>'),
    youtube: P('<rect x="3" y="6" width="18" height="12" rx="3"/><path d="m11 9 4 3-4 3V9Z" fill="currentColor" stroke="none"/>'),
    tiktok: P('<path d="M14 4c.4 2.6 2 4.2 4.5 4.5v3c-1.6 0-3.1-.5-4.5-1.4V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .7 0 1 .1v3.1a2.5 2.5 0 1 0 1.5 2.3V4H14Z"/>'),
    sparkle: P('<path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 9 9M15 15l2.7 2.7M17.7 6.3 15 9M9 15l-2.7 2.7"/>'),
    download: P('<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/>'),
    edit: P('<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m14 6 4 4"/>'),
    trash: P('<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/>'),
    info: P('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    pin: P('<path d="M9 4h6l-1 5 3 3-5 1v6l-1-1-1-6-5-1 3-3-1-5Z"/>'),
    play: P('<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none"/>'),
    calendar: P('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>'),
  };

  /* ---- Route map: drives nav + the /path chips the user asked for ---- */
  const routes = [
    { id: "nav-home",       key: "home",       path: "/home",       file: "index.html",      icon: "home" },
    { id: "nav-maps",       key: "maps",       path: "/maps",       file: "maps.html",       icon: "map" },
    { id: "nav-systems",    key: "systems",    path: "/systems",    file: "systems.html",    icon: "system" },
    { id: "nav-courses",    key: "courses",    path: "/courses",    file: "courses.html",    icon: "course" },
    { id: "nav-apply",      key: "apply",      path: "/apply",      file: "apply.html",      icon: "apply" },
    { id: "nav-forum",      key: "forum",      path: "/forum",      file: "forum.html",      icon: "forum" },
    { id: "nav-complaints", key: "complaints", path: "/complaints", file: "complaints.html", icon: "complaint" },
  ];

  /* extra (non-navbar) routes for breadcrumbs / titles */
  const extraRoutes = {
    "login.html":    { key: "login",    path: "/login" },
    "register.html": { key: "register", path: "/register" },
    "profile.html":  { key: "profile",  path: "/profile" },
    "admin.html":    { key: "admin",    path: "/admin" },
  };

  const site = {
    name: "Neom studio",
    year: 2026,
    currency: { robux: "R$", egp: "ج.م", sar: "ر.س" },
    socials: {
      discord: "https://discord.gg/rNrggJDuRA",
      twitter: "https://x.com/bwsd47386",
      youtube: "https://www.youtube.com/channel/UCawtayPyfRrJPafVJ5oYQMQ",
    },
    /* demo flags an admin would toggle in Settings */
    flags: { applyOpen: true, registrationOpen: true, maintenance: false },
  };

  window.NEOM = { icons, routes, extraRoutes, site, P };
})();
