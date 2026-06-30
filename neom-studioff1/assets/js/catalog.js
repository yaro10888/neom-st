/* =========================================================
   Neom Studio — Catalog (maps / systems / courses)
   One renderer drives all three listing pages. Reads the
   dataset name from #catGrid[data-type]. Provides search,
   filter chips, a detail modal with image slider, and
   add-to-cart. Re-renders on language change.
   ========================================================= */
(function () {
  "use strict";
  const NEOM = window.NEOM;
  if (!NEOM) return;
  const ic = (n) => NEOM.icons[n] || "";
  const tx = (f) => NEOM.tx(f);
  const t = (k) => NEOM.i18n.t(k);
  const cur = () => NEOM.site.currency;

  const fmt = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0) + "K";
    return String(n);
  };

  /* chip sets per type: {key, label-i18n, kind:'sort'|'filter'} */
  const CHIPS = {
    maps: [
      { id: "newest", k: "w.newest" },
      { id: "mostViewed", k: "w.mostViewed" },
    ],
    systems: [
      { id: "all", k: "filt.all" },
      { id: "free", k: "filt.free" },
      { id: "paid", k: "filt.paid" },
    ],
    courses: [
      { id: "all", k: "filt.all" },
      { id: "free", k: "filt.free" },
      { id: "paid", k: "filt.paid" },
    ],
  };

  let TYPE = null;
  let state = { q: "", chip: null };

  function priceChips(p) {
    if (!p) return `<span class="badge-free">${t("w.free")}</span>`;
    const c = cur();
    return `<span class="badge-price">${p.robux} ${c.robux}</span>
            <span class="badge-price">${p.egp} ${c.egp}</span>
            <span class="badge-price">${p.sar} ${c.sar}</span>`;
  }

  function metaHTML(it) {
    if (TYPE === "maps")
      return `<span>${ic("users")}${fmt(it.visits)} ${t("w.visits")}</span>
              <span>${ic("clock")}${it.updated}</span>`;
    if (TYPE === "systems")
      return `<span>${ic("download")}${fmt(it.downloads)} ${t("w.downloads")}</span>
              <span>${ic("clock")}${it.updated}</span>`;
    return `<span>${ic("users")}${fmt(it.students)} ${t("w.students")}</span>
            <span>${ic("course")}${it.lessons} ${t("w.lessons")}</span>`;
  }

  function actionLabel(it) {
    if (TYPE === "maps") return { k: "btn.enter", icon: "play" };
    if (TYPE === "systems") return it.isFree ? { k: "btn.download", icon: "download" } : { k: "btn.buy", icon: "cart" };
    return it.isFree ? { k: "btn.start", icon: "play" } : { k: "btn.enroll", icon: "cart" };
  }

  /* الصورة الأساسية للعنصر إن وُجدت (#1) */
  function primaryImg(it) {
    if (!it.images || !it.images.length) return null;
    const p = it.images.find((x) => x.primary) || it.images[0];
    return p ? p.src : null;
  }

  function cardHTML(it) {
    const tagTL = (it.tags && it.tags[0]) ? `<div class="badge-tl"><span class="tag ${it.tags[0].t}">${t(it.tags[0].k)}</span></div>` : "";
    const freeTR = (TYPE !== "maps" && it.isFree) ? `<div class="badge-tr"><span class="badge-free">${t("w.free")}</span></div>` : "";
    const prices = TYPE !== "maps" ? `<div class="item-prices">${priceChips(it.prices)}</div>` : "";
    const act = actionLabel(it);
    const img = primaryImg(it);
    const face = img
      ? `<img class="thumb-img" src="${img}" alt="" loading="lazy"/>`
      : `<div class="ph"></div><div class="glyph">${ic(it.glyph)}</div>`;
    return `<article class="item-card card card-hover reveal" id="${it.id}" style="--accent:${it.accent}">
      <div class="item-thumb" data-detail="${it.id}">
        ${face}
        ${tagTL}${freeTR}
      </div>
      <div class="item-body">
        <h3>${tx(it.name)}</h3>
        <p class="desc">${tx(it.desc)}</p>
        <div class="item-meta">${metaHTML(it)}</div>
        ${prices}
        <div class="item-foot">
          <button class="btn btn-ghost btn-sm" data-detail="${it.id}">${ic("eye")}<span>${t("btn.details")}</span></button>
          <button class="btn btn-primary btn-sm" data-action="${it.id}">${ic(act.icon)}<span>${t(act.k)}</span></button>
        </div>
      </div>
    </article>`;
  }

  function getList() {
    let list = (NEOM.data[TYPE] || []).slice();
    // search
    const q = state.q.trim().toLowerCase();
    if (q) {
      list = list.filter((it) => {
        const hay = [tx(it.name), it.name.ar, it.name.en, tx(it.desc)].join(" ").toLowerCase();
        return hay.includes(q);
      });
    }
    // chip
    const chip = state.chip;
    if (TYPE === "maps") {
      if (chip === "mostViewed") list.sort((a, b) => b.visits - a.visits);
      else list.sort((a, b) => (a.updated < b.updated ? 1 : -1)); // newest
    } else {
      if (chip === "free") list = list.filter((x) => x.isFree);
      else if (chip === "paid") list = list.filter((x) => !x.isFree);
    }
    return list;
  }

  function render() {
    const grid = document.getElementById("catGrid");
    if (!grid) return;
    const list = getList();
    if (!list.length) {
      grid.style.gridTemplateColumns = "1fr";
      grid.innerHTML = `<div class="empty">${ic("search")}<p>${t("w.noResults")}</p></div>`;
      return;
    }
    grid.style.gridTemplateColumns = "";
    grid.innerHTML = list.map(cardHTML).join("");
    NEOM.observeReveal(grid);
  }

  /* ----------------------------- DETAIL -------------------------- */
  function sliderHTML(it) {
    let imgs = (it.images && it.images.length) ? it.images.slice() : null;
    if (imgs) { const pi = imgs.findIndex((x) => x.primary); if (pi > 0) { const p = imgs.splice(pi, 1)[0]; imgs.unshift(p); } }
    const n = imgs ? imgs.length : 1;
    const slides = imgs
      ? imgs.map((im) => `<div class="slide"><img class="slide-img" src="${im.src}" alt="" loading="lazy"/></div>`).join("")
      : `<div class="slide"><div class="ph" style="--accent:${it.accent}"></div>
          <div class="glyph" style="color:color-mix(in srgb, ${it.accent} 80%, #fff)">${ic(it.glyph)}</div></div>`;
    const nav = (n > 1)
      ? `<button class="slider-btn prev" data-prev aria-label="prev">${ic("chevR")}</button>
         <button class="slider-btn next" data-next aria-label="next">${ic("chevL")}</button>
         <div class="slider-dots">${imgs.map((_, i) => `<b class="${i === 0 ? "on" : ""}" data-dot="${i}"></b>`).join("")}</div>`
      : "";
    return `<div class="slider" id="detSlider" data-count="${n}">
      <div class="slides" id="detSlides" style="--accent:${it.accent}">${slides}</div>
      ${nav}
    </div>`;
  }

  function detailHTML(it) {
    const act = actionLabel(it);
    const feats = (it.features || [])
      .map((f) => `<li>${ic("check")}<span>${tx(f)}</span></li>`)
      .join("");
    let metaLine = "";
    if (TYPE === "maps") metaLine = `<span>${ic("users")}${fmt(it.visits)} ${t("w.visits")}</span><span>${ic("clock")}${t("w.lastUpdate")} ${it.updated}</span>`;
    else if (TYPE === "systems") metaLine = `<span>${ic("download")}${fmt(it.downloads)} ${t("w.downloads")}</span><span>${ic("clock")}${it.updated}</span>`;
    else metaLine = `<span>${ic("users")}${fmt(it.students)} ${t("w.students")}</span><span>${ic("course")}${it.lessons} ${t("w.lessons")}</span><span>${ic("clock")}${it.duration}</span>`;

    const levelChip = (TYPE === "courses") ? `<span class="tag t-course">${t("w.level")}: ${tx(it.level)}</span>` : "";
    const prices = TYPE !== "maps" ? `<div class="detail-prices">${priceChips(it.prices)}</div>` : "";

    const secondaryBtn =
      TYPE === "systems" && !it.isFree
        ? `<button class="btn btn-ghost" data-cart="${it.id}">${ic("cart")}<span>${t("btn.addCart")}</span></button>`
        : TYPE === "courses" && !it.isFree
        ? `<button class="btn btn-ghost" data-cart="${it.id}">${ic("cart")}<span>${t("btn.addCart")}</span></button>`
        : "";

    return `<div class="modal-head">
        <h3>${tx(it.name)}</h3>
        <button class="modal-close" data-close aria-label="close">${ic("close")}</button>
      </div>
      <div class="modal-body">
        ${sliderHTML(it)}
        <div class="item-meta" style="margin:14px 0 6px">${metaLine}</div>
        <div class="post" style="display:block;background:none;border:none;padding:0">
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">${levelChip}</div>
          <p style="color:var(--tx-2);line-height:1.8;margin:0">${tx(it.desc)}</p>
        </div>
        ${feats ? `<ul class="feature-list">${feats}</ul>` : ""}
        ${prices}
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
          <button class="btn btn-primary" data-action="${it.id}">${ic(act.icon)}<span>${t(act.k)}</span></button>
          ${secondaryBtn}
        </div>
      </div>`;
  }

  function openDetail(id) {
    const it = (NEOM.data[TYPE] || []).find((x) => x.id === id);
    if (!it) return;
    // إحصاء حقيقي: زيارة فعلية للماب عند فتح التفاصيل (#6)
    if (TYPE === "maps" && NEOM.store && NEOM.store.incrSilent) NEOM.store.incrSilent("maps", id, "visits", 1);
    const box = NEOM.openModal(detailHTML(it));
    wireSlider(box);
    box.querySelectorAll("[data-action]").forEach((b) => b.addEventListener("click", () => doAction(id)));
    box.querySelectorAll("[data-cart]").forEach((b) => b.addEventListener("click", () => addToCart(id)));
  }

  function wireSlider(box) {
    const slides = box.querySelector("#detSlides");
    if (!slides) return;
    const n = slides.children.length || 1;
    const nextBtn = box.querySelector("[data-next]");
    const prevBtn = box.querySelector("[data-prev]");
    if (n <= 1 || !nextBtn || !prevBtn) return; // صورة واحدة/أيقونة: لا حاجة للتمرير
    const dots = box.querySelectorAll("[data-dot]");
    let i = 0;
    const rtl = document.documentElement.dir === "rtl";
    const go = (k) => {
      i = (k + n) % n;
      slides.style.transform = `translateX(${(rtl ? 1 : -1) * i * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle("on", j === i));
    };
    nextBtn.addEventListener("click", () => go(i + 1));
    prevBtn.addEventListener("click", () => go(i - 1));
    dots.forEach((d) => d.addEventListener("click", () => go(+d.getAttribute("data-dot"))));
  }

  function addToCart(id) {
    const it = (NEOM.data[TYPE] || []).find((x) => x.id === id);
    if (!it || !NEOM.cart) return;
    NEOM.cart.add({ id: it.id, name: tx(it.name), prices: it.prices, accent: it.accent, glyph: it.glyph, type: TYPE });
  }

  function doAction(id) {
    const it = (NEOM.data[TYPE] || []).find((x) => x.id === id);
    if (!it) return;
    const ar = NEOM.i18n.lang === "ar";
    const bump = (field) => { if (NEOM.store && NEOM.store.incrSilent) NEOM.store.incrSilent(TYPE, id, field, 1); };
    if (TYPE === "maps") {
      NEOM.toast(ar ? "جارٍ فتح الماب في Roblox…" : "Opening map in Roblox…", "info");
    } else if (TYPE === "systems") {
      if (it.isFree) { bump("downloads"); NEOM.toast(ar ? "بدأ تحميل النظام" : "Download started", "ok"); }
      else addToCart(id);
    } else {
      if (it.isFree) { bump("students"); NEOM.toast(ar ? "تم فتح الدورة، استمتع بالتعلّم!" : "Course opened — happy learning!", "ok"); }
      else addToCart(id);
    }
  }

  /* --------------------------- TOOLBAR --------------------------- */
  function buildChips() {
    const wrap = document.getElementById("catChips");
    if (!wrap) return;
    const set = CHIPS[TYPE] || [];
    if (!state.chip) state.chip = set[0] && set[0].id;
    wrap.innerHTML = set
      .map((c) => `<button class="chip ${c.id === state.chip ? "active" : ""}" data-chip="${c.id}">${t(c.k)}</button>`)
      .join("");
    wrap.querySelectorAll("[data-chip]").forEach((b) =>
      b.addEventListener("click", () => {
        state.chip = b.getAttribute("data-chip");
        wrap.querySelectorAll(".chip").forEach((x) => x.classList.toggle("active", x === b));
        render();
      })
    );
  }

  function wireSearch() {
    const s = document.getElementById("catSearch");
    if (!s) return;
    s.addEventListener("input", () => {
      state.q = s.value;
      render();
    });
  }

  function wireGridClicks() {
    const grid = document.getElementById("catGrid");
    if (!grid) return;
    grid.addEventListener("click", (e) => {
      const d = e.target.closest("[data-detail]");
      const a = e.target.closest("[data-action]");
      if (a) {
        e.stopPropagation();
        doAction(a.getAttribute("data-action"));
        return;
      }
      if (d) openDetail(d.getAttribute("data-detail"));
    });
  }

  function init() {
    const grid = document.getElementById("catGrid");
    if (!grid) return;
    TYPE = grid.getAttribute("data-type");
    if (!TYPE || !NEOM.data[TYPE]) return;
    buildChips();
    wireSearch();
    wireGridClicks();
    render();
    document.addEventListener("langchange", () => {
      buildChips();
      render();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
