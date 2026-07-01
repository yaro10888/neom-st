/* =========================================================
   Neom Studio — Core UI (runs on every page)
   Renders the navbar (with /route chips + ids) and footer,
   wires the mobile menu, scroll state, language toggle, and
   provides toast + modal + ripple + reveal helpers.
   ========================================================= */
(function () {
  "use strict";
  const NEOM = (window.NEOM = window.NEOM || {});
  const I = () => NEOM.i18n;
  const ic = (n) => NEOM.icons[n] || "";
  /* الشعار النشط من مكتبة الوسائط (يديره المالك من لوحة الإدارة → الوسائط) */
  const logoSrc = () => (NEOM.store && NEOM.store.activeLogo && NEOM.store.activeLogo()) || "assets/img/logo.svg";

  /* --------------------------- SESSION --------------------------- */
  /* single source of truth for "is the user logged in" across pages */
  NEOM.getSession = function () {
    try { return JSON.parse(localStorage.getItem("neom.session")) || null; }
    catch (e) { return null; }
  };
  NEOM.setSession = function (obj) {
    localStorage.setItem("neom.session", JSON.stringify(obj));
  };
  NEOM.clearSession = async function () {
    localStorage.removeItem("neom.session");
    localStorage.removeItem("neom.profile");
    localStorage.removeItem("neom.locks");
    if (window.NEOM_DB) { try { await window.NEOM_DB.auth.signOut(); } catch (e) {} }
  };

  /* ---------------------------- THEME ---------------------------- */
  NEOM.getTheme = function () {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  };
  NEOM.applyTheme = function (theme) {
    if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    try { localStorage.setItem("neom.theme", theme); } catch (e) {}
    // swap any theme-toggle icon: sun shown in dark (→go light), moon in light (→go dark)
    document.querySelectorAll("[data-theme-icon]").forEach((el) => {
      el.innerHTML = theme === "light" ? ic("moon") : ic("sun");
    });
  };
  NEOM.toggleTheme = function () {
    NEOM.applyTheme(NEOM.getTheme() === "light" ? "dark" : "light");
  };

  /* ---- which page are we on? drives the active nav link ---- */
  function currentFile() {
    let p = (location.pathname.split("/").pop() || "").trim();
    if (!p) p = "index.html";
    return p;
  }

  /* ---------------------------- NAVBAR --------------------------- */
  function navAccountHTML() {
    const s = NEOM.getSession();
    const isStaff = s && (s.role === "owner" || s.role === "admin");
    const adminBtn = isStaff
      ? `<a class="ico-btn" id="nav-admin" href="admin.html" aria-label="لوحة الإدارة" title="لوحة الإدارة">${ic("shield")}</a>`
      : "";
    if (s && s.name) {
      const nm = s.name.length > 14 ? s.name.slice(0, 13) + "…" : s.name;
      return `${adminBtn}<a class="btn btn-primary btn-sm nav-login" id="nav-login" href="profile.html">
        ${ic("user")}<span>${nm}</span>
      </a>`;
    }
    return `<a class="btn btn-primary btn-sm nav-login" id="nav-login" href="login.html">
      ${ic("login")}<span data-i18n="btn.login">${I().t("btn.login")}</span>
    </a>`;
  }

  function navHTML() {
    const file = currentFile();
    const links = NEOM.routes
      .map((rt) => {
        const active = rt.file === file ? " is-active" : "";
        return `<li><a id="${rt.id}" class="nav-link${active}" href="${rt.file}" data-route="${rt.path}">
          <span class="nl-top">${ic(rt.icon)}<span data-i18n="nav.${rt.key}">${I().t("nav." + rt.key)}</span></span>
          <span class="nl-path">${rt.path}</span>
        </a></li>`;
      })
      .join("");

    return `<div class="nav-wrap" id="navWrap">
      <nav class="nav" aria-label="القائمة الرئيسية">
        <a class="brand" id="nav-brand" href="index.html" data-route="/home">
          <img src="${logoSrc()}" alt="Neom studio" />
          <b>Neom studio</b>
        </a>
        <ul class="nav-links" id="navLinks">${links}</ul>
        <div class="nav-actions">
          <button class="ico-btn" id="themeBtn" aria-label="Theme">
            <span data-theme-icon>${ic(NEOM.getTheme() === "light" ? "moon" : "sun")}</span>
          </button>
          <button class="ico-btn" id="langBtn" data-i18n-label="w.lang" aria-label="Language">
            ${ic("globe")}<span class="lang-tag" id="langTag">${I().lang.toUpperCase()}</span>
          </button>
          <a class="ico-btn" id="nav-cart" href="systems.html#cart" aria-label="Cart">
            ${ic("cart")}<span class="cart-badge" id="cartBadge" data-cart-count>0</span>
          </a>
          ${navAccountHTML()}
        </div>
        <button class="nav-toggle" id="navToggle" aria-label="القائمة" aria-expanded="false">
          ${ic("menu")}
        </button>
      </nav>
    </div>`;
  }

  /* ---------------------------- FOOTER --------------------------- */
  function footerCol(titleKey, items) {
    const lis = items
      .map((it) => `<li><a href="${it.f}" ${it.k ? `data-i18n="${it.k}"` : ""}>${it.k ? I().t(it.k) : it.label}</a></li>`)
      .join("");
    return `<div class="footer-col"><h4 data-i18n="${titleKey}">${I().t(titleKey)}</h4><ul>${lis}</ul></div>`;
  }

  function footerHTML() {
    const s = NEOM.site;
    const social = (key, href) =>
      `<a class="social-btn" href="${href}" aria-label="${key}" target="_blank" rel="noopener">${ic(key)}</a>`;
    return `<footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <a class="brand" href="index.html"><img src="${logoSrc()}" alt="Neom studio"/><b>Neom studio</b></a>
            <p data-i18n="hero.desc">${I().t("hero.desc")}</p>
            <div class="socials">
              ${social("discord", s.socials.discord)}
              ${social("twitter", s.socials.twitter)}
              ${social("youtube", s.socials.youtube)}
            </div>
          </div>
          ${footerCol("nav.maps", [
            { f: "maps.html", k: "nav.maps" },
            { f: "systems.html", k: "nav.systems" },
            { f: "courses.html", k: "nav.courses" },
          ])}
          ${footerCol("nav.forum", [
            { f: "forum.html", k: "nav.forum" },
            { f: "apply.html", k: "nav.apply" },
            { f: "complaints.html", k: "nav.complaints" },
          ])}
          ${footerCol("nav.login", [
            { f: "login.html", k: "nav.login" },
            { f: "register.html", k: "btn.register" },
            { f: "profile.html", k: "nav.profile" },
          ])}
        </div>
        <div class="footer-bottom">
          <span class="copy">${s.name} ${s.year} © <span data-i18n="footer.rights">جميع الحقوق محفوظة</span></span>
          <div class="socials">
            <span class="label" data-i18n="footer.follow">تابعنا على</span>
            ${social("discord", s.socials.discord)}
            ${social("twitter", s.socials.twitter)}
            ${social("youtube", s.socials.youtube)}
          </div>
        </div>
      </div>
    </footer>`;
  }

  /* ----------------------- TOAST (notifications) ----------------- */
  function ensureToastStack() {
    let st = document.querySelector(".toast-stack");
    if (!st) {
      st = document.createElement("div");
      st.className = "toast-stack";
      document.body.appendChild(st);
    }
    return st;
  }
  NEOM.toast = function (msg, type = "ok", ms = 3200) {
    const st = ensureToastStack();
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = `<span class="dot"></span><span>${msg}</span>`;
    st.appendChild(el);
    setTimeout(() => {
      el.classList.add("leaving");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, ms);
  };

  /* --------------------------- MODAL ----------------------------- */
  let modalEl = null;
  function ensureModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement("div");
    modalEl.className = "modal-overlay";
    modalEl.innerHTML = `<div class="modal" role="dialog" aria-modal="true"></div>`;
    document.body.appendChild(modalEl);
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) NEOM.closeModal();
    });
    return modalEl;
  }
  NEOM.openModal = function (html, opts = {}) {
    const ov = ensureModal();
    const box = ov.querySelector(".modal");
    box.className = "modal" + (opts.sm ? " modal-sm" : "") + (opts.wide ? " modal-wide" : "");
    box.innerHTML = html;
    requestAnimationFrame(() => ov.classList.add("open"));
    document.body.style.overflow = "hidden";
    box.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", NEOM.closeModal));
    return box;
  };
  NEOM.closeModal = function () {
    if (!modalEl) return;
    modalEl.classList.remove("open");
    document.body.style.overflow = "";
  };

  /* --------------------------- RIPPLE ---------------------------- */
  function attachRipples(scope) {
    (scope || document).addEventListener("click", (e) => {
      const btn = e.target.closest(".btn");
      if (!btn || btn.disabled) return;
      const rect = btn.getBoundingClientRect();
      const r = document.createElement("span");
      r.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = size + "px";
      r.style.left = e.clientX - rect.left - size / 2 + "px";
      r.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(r);
      r.addEventListener("animationend", () => r.remove(), { once: true });
    });
  }

  /* ----------------------- REVEAL ON SCROLL ---------------------- */
  NEOM.observeReveal = function (root) {
    const els = (root || document).querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  };

  /* ----------------------------- WIRE ---------------------------- */
  function wireNav() {
    const wrap = document.getElementById("navWrap");
    const toggle = document.getElementById("navToggle");
    const langBtn = document.getElementById("langBtn");

    // scroll state
    const onScroll = () => {
      if (!wrap) return;
      wrap.classList.toggle("scrolled", window.scrollY > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // mobile menu
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.innerHTML = open ? ic("close") : ic("menu");
      });
    }
    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("menu-open")) return;
      if (e.target.closest("#navLinks") || e.target.closest("#navToggle")) return;
      document.body.classList.remove("menu-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = ic("menu");
      }
    });

    // language toggle
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        I().toggle();
        const tag = document.getElementById("langTag");
        if (tag) tag.textContent = I().lang.toUpperCase();
      });
    }

    // theme toggle (light / dark)
    const themeBtn = document.getElementById("themeBtn");
    if (themeBtn) themeBtn.addEventListener("click", () => NEOM.toggleTheme());
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      NEOM.closeModal();
      document.body.classList.remove("menu-open");
    }
  });

  /* --------------------------- BOOTSTRAP ------------------------- */
  function mount(id, html) {
    const el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  /* fill any <span data-icon="map"></span> placeholders in static markup */
  NEOM.injectIcons = function (root) {
    (root || document).querySelectorAll("[data-icon]").forEach((el) => {
      if (el.dataset.iconDone) return;
      el.innerHTML = ic(el.getAttribute("data-icon"));
      el.dataset.iconDone = "1";
    });
  };

  function renderNav() {
    const existing = document.getElementById("navWrap");
    if (existing) existing.outerHTML = navHTML();
    else mount("nav-mount", navHTML());
    NEOM.injectIcons(document);
    NEOM.applyTheme(NEOM.getTheme());
    wireNav();
    attachRipples(document);
    I().apply();
  }

  /* In live mode, make the navbar reflect the REAL Supabase session
     (fixes the login buttons still showing after you sign in). */
  async function syncSession() {
    const DB = window.NEOM_DB;
    if (!DB) return;
    try {
      const { data } = await DB.auth.getSession();
      const sess = data && data.session;
      const local = NEOM.getSession();
      if (sess && sess.user) {
        let name = local && local.name ? local.name : (sess.user.email ? sess.user.email.split("@")[0] : "");
        let role = local && local.role ? local.role : "member";
        try {
          const { data: prof } = await DB.from("profiles").select("name, role").eq("id", sess.user.id).single();
          if (prof) { name = prof.name || name; role = prof.role || role; }
        } catch (e) {}
        const changed = !local || local.email !== sess.user.email || local.name !== name || local.role !== role;
        if (changed) {
          NEOM.setSession({ name, email: sess.user.email, role });
          renderNav();
        }
      } else if (local) {
        // signed out on the server but a stale flag remains locally
        localStorage.removeItem("neom.session");
        renderNav();
      }
    } catch (e) {}
  }

  /* تحذير: عند فتح الموقع كملف (file://) بعض المتصفحات تعزل التخزين بين
     الصفحات، فلا تظهر الحسابات/الطلبات في لوحة الإدارة. الحل: تشغيل خادم
     محلي بسيط (نفس الأصل) فيُحفظ كل شيء ويظهر بشكل صحيح. */
  function fileProtocolWarning() {
    if (location.protocol !== "file:") return;
    try { if (sessionStorage.getItem("neom.fileWarn") === "off") return; } catch (e) {}
    const bar = document.createElement("div");
    bar.className = "file-warn";
    bar.innerHTML =
      `<span class="fw-ic">${ic("info")}</span>
       <span class="fw-tx">لتخزين الحسابات والطلبات وظهورها في لوحة الإدارة، شغّل الموقع عبر خادم محلي بدل فتحه كملف. مثال: افتح مجلد المشروع في الطرفية ونفّذ <code>python3 -m http.server 8000</code> ثم افتح <code>http://localhost:8000</code></span>
       <button class="fw-x" aria-label="إغلاق">${ic("close")}</button>`;
    document.body.insertBefore(bar, document.body.firstChild);
    bar.querySelector(".fw-x").addEventListener("click", () => {
      bar.remove();
      try { sessionStorage.setItem("neom.fileWarn", "off"); } catch (e) {}
    });
  }

  function init() {
    // inject nav + footer into their placeholders
    mount("nav-mount", navHTML());
    mount("footer-mount", footerHTML());

    NEOM.injectIcons(document);
    NEOM.applyTheme(NEOM.getTheme()); // populate theme-toggle icon(s)
    wireNav();
    attachRipples(document);
    I().apply(); // localize everything that was just rendered
    NEOM.observeReveal(document);
    fileProtocolWarning();

    syncSession(); // refresh nav from the real session (live mode)

    // keep lang tag in sync if language changes elsewhere
    document.addEventListener("langchange", () => {
      const tag = document.getElementById("langTag");
      if (tag) tag.textContent = I().lang.toUpperCase();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
