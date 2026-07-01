/* =========================================================
   Neom Studio — Home page dynamic panels (news + forum)
   ========================================================= */
(function () {
  "use strict";
  const NEOM = window.NEOM;
  if (!NEOM) return;
  const ic = (n) => NEOM.icons[n] || "";
  const tx = (f) => NEOM.tx(f);
  const t = (k) => NEOM.i18n.t(k);

  function newsHTML() {
    return NEOM.data.news
      .map(
        (n) => `<a class="news-row reveal" id="${n.id}" href="forum.html">
          <div class="nr-body">
            <h4>${tx(n.title)}</h4>
            <p>${tx(n.desc)}</p>
          </div>
          <span class="tag ${n.tag.t}">${t(n.tag.k)}</span>
          <time>${n.date}</time>
        </a>`
      )
      .join("");
  }

  function forumHTML() {
    return NEOM.data.forumCats
      .map(
        (c) => `<a class="forum-row reveal" id="${c.id}" href="forum.html">
          <span class="fr-ico">${ic(c.icon)}</span>
          <div class="fr-body">
            <h4>${tx(c.title)}</h4>
            <p>${tx(c.desc)}</p>
          </div>
          <div class="fr-stats"><b>${c.topics}</b><span>${t("w.topics")}</span></div>
          <div class="fr-stats"><b>${c.replies}</b><span>${t("w.replies")}</span></div>
        </a>`
      )
      .join("");
  }

  function render() {
    const news = document.getElementById("newsRows");
    const forum = document.getElementById("forumRows");
    if (news) news.innerHTML = newsHTML();
    if (forum) forum.innerHTML = forumHTML();
    NEOM.observeReveal(document);
  }

  /* يخفي أزرار (إنشاء حساب/تسجيل الدخول) في الواجهة عندما يكون اللاعب
     مسجّلًا بالفعل، ويظهر بدلها زر «حسابي». (#10) */
  function applySessionUI() {
    const s = NEOM.getSession && NEOM.getSession();
    const actions = document.querySelector(".hero-actions");
    if (!actions) return;
    const reg = document.getElementById("hero-register");
    const log = document.getElementById("hero-login");
    if (s) {
      if (reg) reg.style.display = "none";
      if (log) log.style.display = "none";
      if (!document.getElementById("hero-profile")) {
        const a = document.createElement("a");
        a.className = "btn btn-primary";
        a.id = "hero-profile";
        a.href = "profile.html";
        a.innerHTML = `${ic("user")}<span>${NEOM.i18n.lang === "en" ? "My account" : "حسابي"}</span>`;
        actions.appendChild(a);
      }
    } else {
      if (reg) reg.style.display = "";
      if (log) log.style.display = "";
      const p = document.getElementById("hero-profile");
      if (p) p.remove();
    }
  }

  /* يخفي بطاقة «انضم لفريق الإدارة» في الصفحة الرئيسية إذا أوقفت
     الإدارة استقبال طلبات الانضمام. (#9) */
  function applyFlagsUI() {
    const open = !NEOM.store || NEOM.store.flags().applyOpen !== false;
    const join = document.getElementById("panel-join");
    if (join) join.style.display = open ? "" : "none";
  }

  function init() {
    applySessionUI();
    applyFlagsUI();
    document.addEventListener("neom:store", applyFlagsUI);
    if (!document.getElementById("newsRows") && !document.getElementById("forumRows")) return;
    render();
    document.addEventListener("langchange", () => { render(); applySessionUI(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
