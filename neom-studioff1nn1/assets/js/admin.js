/* =========================================================
   Neom Studio — لوحة الإدارة (CRUD حقيقي على المخزن المحلي)
   ---------------------------------------------------------
   - كل البيانات تأتي من NEOM.store (الذي يقرأ من data.js أول مرة
     ثم يحفظ في localStorage). أي إضافة/تعديل/حذف هنا تظهر على
     الموقع مباشرةً وبعد إعادة التحميل.
   - الإحصائيات حقيقية: تُحسب من الحسابات/الطلبات/المنشورات الفعلية.
   - لا توجد بيانات وهمية إطلاقًا.
   ========================================================= */
(function () {
  "use strict";
  const NEOM = window.NEOM;
  if (!NEOM) return;
  if (!document.getElementById("adminShell")) return;
  const store = NEOM.store;
  if (!store) return;

  const ic = (n) => (NEOM.icons && NEOM.icons[n]) || "";
  const c = NEOM.site.currency;
  const av = (n) => store.avatarSrc(n);
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const escA = (s) => esc(s).replace(/"/g, "&quot;");
  const today = () => new Date().toLocaleDateString("en-CA").replace(/-/g, "/");
  const fmt = (n) => Number(n || 0).toLocaleString("en-US");
  const numOf = (el) => (el && el.value !== "" ? Number(el.value) : 0);
  const cut = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

  function getPath(o, path) { return path.split(".").reduce((a, k) => (a == null ? a : a[k]), o); }

  /* ============================================================
     مصدر بيانات موحّد: يعمل سواء كانت البيانات محليّة (localStorage)
     أو سحابيّة (Supabase). قائمة اللاعبين والطلبات والانضمام والشكاوى
     تظهر في الحالتين. + إصلاح ذاتي: يضمن ظهور حسابك دائمًا.
     ============================================================ */
  const DB = () => window.NEOM_DB || null;
  const REMOTE = { on: false, accounts: [], orders: [], applications: [], complaints: [] };

  function mapProfile(r) {
    return {
      name: r.name, email: r.email, whatsapp: r.whatsapp, country: r.country,
      role: r.role || "member", avatar: r.avatar || 1, xp: r.xp || 0,
      joined: (r.created_at || "").slice(0, 10).replace(/-/g, "/"),
      status: r.status || "active", password: null, _uid: r.id, _remote: true,
    };
  }
  function mapOrder(r) {
    return {
      id: "#" + String(r.id || "").replace(/-/g, "").slice(0, 6), item: r.item_title || "",
      buyer: r.buyer_name || "", email: r.buyer_email || "", avatar: 1, count: r.qty || 1,
      price: r.price || "", priceFull: null, discountCode: r.discount_code || null,
      status: r.status || "pending", statC: "gold", date: (r.created_at || "").slice(0, 10),
      _uid: r.user_id || null, _remote: true,
    };
  }
  function mapApp(r) {
    return { id: r.id, name: r.name, role: r.role, reason: r.reason, experience: r.experience,
      whatsapp: r.whatsapp, discord: r.discord, date: (r.created_at || "").slice(0, 10), _remote: true };
  }
  function mapComplaint(r) {
    return { id: r.id, type: r.type, title: r.title, description: r.description,
      whatsapp: r.whatsapp, date: (r.created_at || "").slice(0, 10), _remote: true };
  }

  async function loadRemote() {
    const db = DB(); if (!db) { REMOTE.on = false; return; }
    REMOTE.on = true;
    const grab = async (table, mapper) => {
      try { const r = await db.from(table).select("*").order("created_at", { ascending: false }); return (r.data || []).map(mapper); }
      catch (e) { return []; }
    };
    // كل جدول يُجلب باستقلال حتى لا يُعطّل نقصُ جدولٍ ظهورَ الباقي (خاصة اللاعبين)
    REMOTE.accounts = await grab("profiles", mapProfile);
    REMOTE.orders = await grab("orders", mapOrder);
    REMOTE.applications = await grab("applications", mapApp);
    REMOTE.complaints = await grab("complaints", mapComplaint);
  }

  /* الإصلاح الذاتي (الوضع المحلي): لو كنت داخلًا بجلسة لكن حسابك غير موجود
     في قائمة الحسابات، أضِفه — فلا تظهر قائمة فارغة أبدًا وأنت مسجّل. */
  function selfHealLocal() {
    if (DB()) return;
    try {
      const s = NEOM.getSession(); if (!s || !s.email) return;
      const accs = store.accounts();
      const exists = accs.some((a) => (a.email || "").toLowerCase() === s.email.toLowerCase());
      if (!exists) {
        accs.push({ name: s.name || s.email.split("@")[0], email: s.email, whatsapp: "", country: "",
          password: null, role: s.role || "member", avatar: 1, xp: 0, joined: today(), status: "active" });
        store.saveAccounts(accs);
      }
    } catch (e) {}
  }

  /* الجوامع: تُرجع بيانات السحابة إن كانت مفعّلة، وإلا المحلية */
  const A = () => (REMOTE.on ? REMOTE.accounts : store.accounts());
  const O = () => (REMOTE.on ? REMOTE.orders : store.orders());
  const AP = () => (REMOTE.on ? REMOTE.applications : store.applications());
  const CO = () => (REMOTE.on ? REMOTE.complaints : store.complaints());
  const keyMatch = (a, key) => {
    const k = String(key || "").toLowerCase();
    return (a.email || "").toLowerCase() === k || String(a._uid || "").toLowerCase() === k || (a.name || "").toLowerCase() === k;
  };

  function setPath(o, path, v) {
    const ks = path.split("."); let cur = o;
    for (let i = 0; i < ks.length - 1; i++) {
      if (typeof cur[ks[i]] !== "object" || cur[ks[i]] == null) cur[ks[i]] = {};
      cur = cur[ks[i]];
    }
    cur[ks[ks.length - 1]] = v;
  }

  /* ---- التحكم بالوصول: المالك/المشرف فقط ---- */
  async function guard() {
    const deny = () => {
      NEOM.toast("هذه الصفحة مخصصة للإدارة فقط", "err");
      setTimeout(() => (location.href = "index.html"), 1200);
    };
    const DB = window.NEOM_DB || null;
    if (DB) {
      try {
        const { data: u } = await DB.auth.getUser();
        if (!u || !u.user) { deny(); return false; }
        const { data: prof } = await DB.from("profiles").select("role").eq("id", u.user.id).single();
        const role = prof && prof.role;
        if (role !== "owner" && role !== "admin") { deny(); return false; }
        return true;
      } catch (e) { deny(); return false; }
    }
    const s = NEOM.getSession();
    if (!s || (s.role !== "owner" && s.role !== "admin")) { deny(); return false; }
    return true;
  }

  /* ---- هوية المسؤول الحقيقية في الشريط العلوي (من الجلسة) ---- */
  const ROLE_AR = { owner: "مالك", admin: "مشرف", member: "عضو" };
  const ROLE_C = { owner: "purple", admin: "blue", member: "gold" };
  function curAccount() {
    const s = NEOM.getSession() || {};
    const accs = A();
    return accs.find((a) => (a.email || "").toLowerCase() === (s.email || "").toLowerCase()) || null;
  }
  function paintIdentity() {
    const s = NEOM.getSession() || {};
    const acc = curAccount();
    const nm = document.getElementById("adminWhoName");
    const rl = document.getElementById("adminWhoRole");
    const avx = document.getElementById("adminWhoAvatar");
    if (nm) nm.textContent = s.name || (acc && acc.name) || "مستخدم";
    if (rl) rl.textContent = ROLE_AR[s.role] || "عضو";
    if (avx) avx.src = av(acc && acc.avatar ? acc.avatar : 1);
  }

  /* ----------------------------- NAV ----------------------------- */
  const SIDE = [
    { grp: "عام", items: [
      { id: "dashboard", label: "لوحة التحكم", icon: "dashboard" },
      { id: "statistics", label: "الإحصائيات", icon: "chart" },
    ] },
    { grp: "المحتوى", items: [
      { id: "maps", label: "المابات", icon: "map" },
      { id: "systems", label: "الأنظمة", icon: "system" },
      { id: "courses", label: "الدورات", icon: "course" },
      { id: "media", label: "الوسائط", icon: "image" },
    ] },
    { grp: "المجتمع", items: [
      { id: "players", label: "اللاعبون", icon: "users" },
      { id: "forum", label: "المنتدى", icon: "forum" },
      { id: "applications", label: "طلبات الانضمام", icon: "apply" },
      { id: "complaints", label: "الشكاوى", icon: "complaint" },
    ] },
    { grp: "المتجر", items: [
      { id: "orders", label: "الطلبات", icon: "bag" },
      { id: "discounts", label: "أكواد الخصم", icon: "coupon" },
    ] },
    { grp: "النظام", items: [
      { id: "roles", label: "الرتب والصلاحيات", icon: "shield" },
      { id: "logs", label: "السجلات", icon: "list" },
      { id: "settings", label: "الإعدادات", icon: "settings" },
    ] },
  ];
  const TITLES = {
    dashboard: "لوحة التحكم", statistics: "الإحصائيات", maps: "إدارة المابات",
    systems: "إدارة الأنظمة", courses: "إدارة الدورات", media: "مكتبة الوسائط",
    players: "اللاعبون", forum: "إدارة المنتدى", applications: "طلبات الانضمام",
    complaints: "الشكاوى والاقتراحات", orders: "الطلبات", discounts: "أكواد الخصم",
    roles: "الرتب والصلاحيات", logs: "سجلّات النظام", settings: "إعدادات الموقع",
  };

  /* ------------------------- إحصائيات حقيقية --------------------- */
  function orderRobux(o) {
    if (o.priceFull && typeof o.priceFull.robux === "number") return o.priceFull.robux;
    const m = /(\d+)/.exec(String(o.price || "")); return m ? +m[1] : 0;
  }
  function realStats() {
    const accs = A();
    const ords = O();
    const revenue = ords.reduce((a, o) => a + orderRobux(o), 0);
    return {
      players: accs.length,
      orders: ords.length,
      revenue,
      posts: store.list("posts").length,
      maps: store.list("maps").length,
      systems: store.list("systems").length,
      courses: store.list("courses").length,
      apps: AP().length,
      complaints: CO().length,
    };
  }

  /* ----------------------------- عناصر مشتركة -------------------- */
  function sidebarHTML(active) {
    const groups = SIDE.map(
      (g) => `<div class="grp">${g.grp}</div>` +
        g.items.map(
          (it) => `<a href="#${it.id}" data-sec="${it.id}" class="${it.id === active ? "active" : ""}">
            ${ic(it.icon)}<span>${it.label}</span></a>`
        ).join("")
    ).join("");
    return `<div class="a-brand"><img src="assets/img/logo.svg" alt=""/><b>Neom Admin</b></div>
      <nav class="admin-nav">${groups}</nav>`;
  }
  function bar(countText, addBtn) {
    return `<div class="sec-bar">
      <span class="sec-count">${countText}</span>
      ${addBtn || ""}</div>`;
  }
  function emptyRow(cols, txt) {
    return `<tr><td colspan="${cols}"><div class="empty" style="padding:34px 12px">${ic("inbox")}
      <p style="margin:0">${txt}</p></div></td></tr>`;
  }
  function swatch(col) {
    return `<span class="swatch" style="background:${escA(col || "#2bd8c6")}"></span>`;
  }
  function tagPill(tags) {
    const t = tags && tags[0] && tags[0].t;
    if (!t) return `<span class="muted-cell">—</span>`;
    const map = { "t-new": ["جديد", "green"], "t-update": ["تحديث", "blue"], "t-course": ["دورة", "purple"], "t-contest": ["مسابقة", "gold"], "t-news": ["إعلان", "blue"] };
    const m = map[t] || [t, "blue"];
    return `<span class="pill ${m[1]}">${m[0]}</span>`;
  }
  function priceCell(item) {
    if (item.isFree || !item.prices) return `<span class="pill green">مجاني</span>`;
    return `<span style="font-family:var(--font-en)">${item.prices.robux} ${c.robux}</span>`;
  }

  /* ===============================================================
     محرّك النماذج (إضافة/تعديل) للمحتوى: مابات/أنظمة/دورات
     =============================================================== */
  const PREFIX = { maps: "map", systems: "sys", courses: "crs" };
  const GLYPH = { maps: "map", systems: "system", courses: "course" };
  const COUNT = { maps: ["visits", "عدد الزيارات"], systems: ["downloads", "عدد التحميلات"], courses: ["students", "عدد الطلاب"] };

  function fLabel(t) { return `<label>${t}</label>`; }
  function fText(key, label, val, ph) {
    return `<div class="field">${fLabel(label)}
      <input class="input" data-k="${key}" data-t="text" value="${escA(val)}" placeholder="${escA(ph || "")}"/></div>`;
  }
  function fNum(key, label, val) {
    return `<div class="field">${fLabel(label)}
      <input class="input" type="number" min="0" data-k="${key}" data-t="num" value="${val == null ? 0 : escA(val)}"/></div>`;
  }
  function fDate(key, label, val) {
    return `<div class="field">${fLabel(label)}
      <input class="input" data-k="${key}" data-t="text" value="${escA(val || today())}" placeholder="2026/06/27" style="font-family:var(--font-en)"/></div>`;
  }
  function fColor(val) {
    const v = val || "#2bd8c6";
    return `<div class="field">${fLabel("اللون المميّز")}
      <div class="color-row">
        <input type="color" class="color-pick" data-k="accent" data-t="text" value="${escA(v)}"/>
        <input class="input" data-color-text value="${escA(v)}" style="font-family:var(--font-en);max-width:140px"/>
      </div></div>`;
  }
  function fBi(base, label, item) {
    const a = (getPath(item, base + ".ar")) || "";
    const e = (getPath(item, base + ".en")) || "";
    return `<div class="grid-2">
      <div class="field">${fLabel(label + " (عربي)")}
        <input class="input" data-k="${base}.ar" data-t="text" value="${escA(a)}"/></div>
      <div class="field">${fLabel(label + " (English)")}
        <input class="input" data-k="${base}.en" data-t="text" value="${escA(e)}" dir="ltr"/></div>
    </div>`;
  }
  function fBiArea(base, label, item) {
    const a = (getPath(item, base + ".ar")) || "";
    const e = (getPath(item, base + ".en")) || "";
    return `<div class="grid-2">
      <div class="field">${fLabel(label + " (عربي)")}
        <textarea class="textarea" data-k="${base}.ar" data-t="text" style="min-height:84px">${esc(a)}</textarea></div>
      <div class="field">${fLabel(label + " (English)")}
        <textarea class="textarea" data-k="${base}.en" data-t="text" dir="ltr" style="min-height:84px">${esc(e)}</textarea></div>
    </div>`;
  }
  function fTags(item) {
    const cur = (item.tags && item.tags[0] && item.tags[0].t) || "";
    const opts = [["", "بدون"], ["t-new", "جديد"], ["t-update", "تحديث"], ["t-course", "دورة"], ["t-contest", "مسابقة"]];
    return `<div class="field">${fLabel("الوسم")}
      <select class="select" data-tags>${opts.map((o) => `<option value="${o[0]}" ${o[0] === cur ? "selected" : ""}>${o[1]}</option>`).join("")}</select></div>`;
  }
  function fFree(item) {
    const ck = item.isFree ? "checked" : "";
    return `<label class="switch-row"><input type="checkbox" data-k="isFree" data-t="bool" data-free ${ck}/>
      <span>منتج مجاني (بدون سعر)</span></label>`;
  }
  function fPrices(item) {
    const p = item.prices || {};
    const dis = item.isFree ? "disabled" : "";
    return `<div class="field" data-price-wrap>${fLabel("الأسعار")}
      <div class="price-grid">
        <div><span class="price-lab">${c.robux}</span><input class="input" type="number" min="0" data-price="robux" value="${p.robux || 0}" ${dis}/></div>
        <div><span class="price-lab">${c.egp}</span><input class="input" type="number" min="0" data-price="egp" value="${p.egp || 0}" ${dis}/></div>
        <div><span class="price-lab">${c.sar}</span><input class="input" type="number" min="0" data-price="sar" value="${p.sar || 0}" ${dis}/></div>
      </div></div>`;
  }
  function fFeatures(item) {
    const lines = (item.features || []).map((f) => `${f.ar || ""} | ${f.en || ""}`).join("\n");
    return `<div class="field">${fLabel("المميزات — سطر لكل ميزة بالشكل: عربي | English")}
      <textarea class="textarea" data-features style="min-height:96px" placeholder="حفظ تلقائي | Auto save">${esc(lines)}</textarea></div>`;
  }
  /* معرض صور العنصر: صور متعددة + اختيار صورة أساسية (#1) */
  function fImages() {
    return `<div class="field">${fLabel("صور العنصر — أضف عدة صور واختر الأساسية (الواجهة)")}
      <div class="gallery" data-gallery></div>
      <div class="gal-add">
        <input class="input gal-url" placeholder="ألصق رابط صورة https://..." />
        <button type="button" class="btn btn-ghost btn-sm" data-gal-addurl>${ic("plus")}<span>إضافة رابط</span></button>
        <label class="btn btn-ghost btn-sm gal-upload">${ic("image")}<span>رفع صورة</span>
          <input type="file" accept="image/*" multiple hidden data-gal-file /></label>
      </div>
      <p class="gal-hint">يُفضّل استخدام روابط صور خارجية. الرفع المباشر يخزّن الصورة داخل المتصفح وقد تمتلئ المساحة سريعًا.</p>
    </div>`;
  }
  function renderGallery(form) {
    const wrap = form.querySelector("[data-gallery]");
    if (!wrap) return;
    const imgs = form._images || [];
    if (!imgs.length) { wrap.innerHTML = `<div class="gal-empty">لا توجد صور بعد — الأيقونة واللون سيظهران كواجهة افتراضية.</div>`; return; }
    wrap.innerHTML = imgs.map((im, i) => `<div class="gal-item ${im.primary ? "is-primary" : ""}">
        <img src="${escA(im.src)}" alt="" loading="lazy"/>
        <div class="gal-tools">
          <button type="button" class="gal-btn ${im.primary ? "on" : ""}" data-gal-primary="${i}" title="تعيين كصورة أساسية">${ic("check")}</button>
          <button type="button" class="gal-btn danger" data-gal-del="${i}" title="حذف">${ic("trash")}</button>
        </div>
        ${im.primary ? `<span class="gal-badge">أساسية</span>` : ""}
      </div>`).join("");
  }
  function wireGallery(box) {
    const gal = box.querySelector("[data-gallery]");
    if (!gal) return;
    const form = box.querySelector("form");
    if (!Array.isArray(form._images)) form._images = [];
    const ensurePrimary = () => { const a = form._images; if (a.length && !a.some((x) => x.primary)) a[0].primary = true; };
    const addSrc = (src) => { if (!src) return; form._images.push({ src: src, primary: form._images.length === 0 }); ensurePrimary(); renderGallery(form); };
    const addUrlBtn = box.querySelector("[data-gal-addurl]");
    if (addUrlBtn) addUrlBtn.addEventListener("click", () => {
      const inp = box.querySelector(".gal-url"); const v = (inp.value || "").trim();
      if (!v) return; addSrc(v); inp.value = "";
    });
    const fileInp = box.querySelector("[data-gal-file]");
    if (fileInp) fileInp.addEventListener("change", () => {
      [].slice.call(fileInp.files).forEach((f) => {
        if (f.size > 600 * 1024) { NEOM.toast("الصورة كبيرة (>600KB) — استخدم رابطًا بدل الرفع", "err"); return; }
        const r = new FileReader(); r.onload = () => addSrc(r.result); r.readAsDataURL(f);
      });
      fileInp.value = "";
    });
    gal.addEventListener("click", (e) => {
      const p = e.target.closest("[data-gal-primary]");
      const d = e.target.closest("[data-gal-del]");
      if (p) { const i = +p.getAttribute("data-gal-primary"); form._images.forEach((x, j) => (x.primary = j === i)); renderGallery(form); }
      if (d) { const i = +d.getAttribute("data-gal-del"); form._images.splice(i, 1); ensurePrimary(); renderGallery(form); }
    });
    renderGallery(form);
  }

  function contentFormHTML(type, item) {
    const it = item || {};
    const [ckey, clabel] = COUNT[type];
    let body = fBi("name", "الاسم", it) + fBiArea("desc", "الوصف", it);
    if (type === "courses") body += fBi("level", "المستوى", it);
    body += `<div class="grid-2">${fColor(it.accent)}${fDate("updated", "تاريخ التحديث", it.updated)}</div>`;
    if (type === "courses") {
      body += `<div class="grid-2">${fNum(ckey, clabel, it[ckey])}${fNum("lessons", "عدد الدروس", it.lessons)}</div>`;
      body += `<div class="grid-2">${fText("duration", "المدة", it.duration, "4h 30m")}${fTags(it)}</div>`;
    } else {
      body += `<div class="grid-2">${fNum(ckey, clabel, it[ckey])}${fTags(it)}</div>`;
    }
    body += fText("link", "رابط المنتج (اختياري)", it.link, "https://www.roblox.com/...");
    body += fImages();
    if (type !== "maps") {
      body += fFree(it) + fPrices(it) + fFeatures(it);
    }
    return body;
  }

  function collectContent(type, form, old) {
    const o = Object.assign({}, old || {});
    form.querySelectorAll("[data-k]").forEach((el) => {
      const k = el.getAttribute("data-k");
      const t = el.getAttribute("data-t");
      let v;
      if (t === "num") v = el.value === "" ? 0 : Number(el.value);
      else if (t === "bool") v = el.checked;
      else v = (el.value || "").trim();
      setPath(o, k, v);
    });
    const tagSel = form.querySelector("[data-tags]");
    if (tagSel) { const tv = tagSel.value; o.tags = tv ? [{ t: tv, k: "tag." + tv.replace(/^t-/, "") }] : []; }
    const ft = form.querySelector("[data-features]");
    if (ft) {
      o.features = ft.value.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
        const p = l.split("|"); const a = (p[0] || "").trim(); const e = (p[1] || "").trim();
        return { ar: a, en: e || a };
      });
    }
    if (form.querySelector("[data-price-wrap]")) {
      if (o.isFree) o.prices = null;
      else o.prices = {
        robux: numOf(form.querySelector('[data-price="robux"]')),
        egp: numOf(form.querySelector('[data-price="egp"]')),
        sar: numOf(form.querySelector('[data-price="sar"]')),
      };
    }
    o.glyph = GLYPH[type];
    o.images = (form._images || []).slice();
    return o;
  }

  function validContent(o) {
    if (!o.name || !o.name.ar) return "الاسم بالعربي مطلوب";
    if (!o.desc || !o.desc.ar) return "الوصف بالعربي مطلوب";
    return "";
  }

  function openContentForm(type, id) {
    const item = id ? store.get(type, id) : null;
    const titleMap = { maps: "ماب", systems: "نظام", courses: "دورة" };
    const head = (id ? "تعديل " : "إضافة ") + titleMap[type];
    const html = `<div class="modal-head"><h3>${head}</h3>
        <button class="modal-close" data-close>${ic("close")}</button></div>
      <div class="modal-body"><form id="cmsForm" novalidate>
        ${contentFormHTML(type, item)}
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-sm">${ic("check")}<span>حفظ</span></button>
          <button type="button" class="btn btn-ghost btn-sm" data-close>إلغاء</button>
        </div>
      </form></div>`;
    const box = NEOM.openModal(html);
    const form = box.querySelector("#cmsForm");
    form._images = item && Array.isArray(item.images) ? item.images.map((x) => ({ src: x.src, primary: !!x.primary })) : [];
    wireFormDynamics(box);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const o = collectContent(type, form, item);
      const err = validContent(o);
      if (err) { NEOM.toast(err, "err"); return; }
      if (id) { store.update(type, id, o); NEOM.toast("تم حفظ التعديلات", "ok"); }
      else { o.id = store.nextId(type, PREFIX[type]); store.add(type, o); NEOM.toast("تمت الإضافة بنجاح", "ok"); }
      NEOM.closeModal();
    });
  }

  /* ربط السلوك الديناميكي داخل النموذج (لون/مجاني/معرض الصور) */
  function wireFormDynamics(box) {
    wireGallery(box);
    const pick = box.querySelector(".color-pick");
    const txt = box.querySelector("[data-color-text]");
    if (pick && txt) {
      pick.addEventListener("input", () => { txt.value = pick.value; });
      txt.addEventListener("input", () => { if (/^#[0-9a-fA-F]{6}$/.test(txt.value)) pick.value = txt.value; });
    }
    const free = box.querySelector("[data-free]");
    if (free) {
      const sync = () => box.querySelectorAll("[data-price]").forEach((i) => { i.disabled = free.checked; });
      free.addEventListener("change", sync); sync();
    }
    const typeSel = box.querySelector("[data-dtype]");
    if (typeSel) {
      const sync = () => {
        const fixed = typeSel.value === "fixed";
        const pr = box.querySelector("[data-dc-percent]");
        const fx = box.querySelector("[data-dc-fixed]");
        if (pr) pr.style.display = fixed ? "none" : "";
        if (fx) fx.style.display = fixed ? "" : "none";
      };
      typeSel.addEventListener("change", sync); sync();
    }
  }

  /* قسم محتوى عام (جدول + زر إضافة) */
  function contentSection(type) {
    const rows = store.list(type);
    const [ckey, clabel] = COUNT[type];
    const addBtn = `<button class="btn btn-primary btn-sm" data-add="${type}">${ic("plus")}<span>إضافة</span></button>`;
    const body = rows.length ? rows.map((it) => {
      const prim = (it.images && (it.images.find((x) => x.primary) || it.images[0]));
      const face = prim ? `<img class="row-thumb" src="${escA(prim.src)}" alt=""/>` : swatch(it.accent);
      return `<tr>
        <td><div class="u-cell">${face}<b>${esc(it.name && it.name.ar)}</b></div></td>
        <td>${esc(cut(it.desc && it.desc.ar, 46))}</td>
        <td style="font-family:var(--font-en)">${fmt(it[ckey])}</td>
        <td>${tagPill(it.tags)}</td>
        <td>${priceCell(it)}</td>
        <td style="font-family:var(--font-en)">${esc(it.updated || "")}</td>
        <td class="act-cell">
          <button class="ico-btn sm" data-edit="${type}:${it.id}" aria-label="تعديل">${ic("edit")}</button>
          <button class="ico-btn sm danger" data-del="${type}:${it.id}" aria-label="حذف">${ic("trash")}</button>
        </td></tr>`;
    }).join("") : emptyRow(7, "لا يوجد عناصر بعد — اضغط «إضافة» لإنشاء أول عنصر.");
    return bar(`العدد: ${rows.length}`, addBtn) +
      `<div class="panel-block"><div class="table-wrap"><table class="data">
        <thead><tr><th>الاسم</th><th>الوصف</th><th>${clabel}</th><th>الوسم</th><th>السعر</th><th>تحديث</th><th></th></tr></thead>
        <tbody>${body}</tbody></table></div></div>`;
  }

  /* =============================== أكواد الخصم =================== */
  function discountFormHTML(d) {
    const it = d || { type: "percent", active: true };
    const v = it.value || {};
    const head = (d ? "تعديل" : "إضافة") + " كود خصم";
    return `<div class="modal-head"><h3>${head}</h3>
        <button class="modal-close" data-close>${ic("close")}</button></div>
      <div class="modal-body"><form id="dcForm" novalidate>
        <div class="grid-2">
          <div class="field"><label>الكود</label>
            <input class="input" data-dc-code value="${escA(it.code || "")}" placeholder="WELCOME10" style="font-family:var(--font-en);text-transform:uppercase"/></div>
          <div class="field"><label>النوع</label>
            <select class="select" data-dtype>
              <option value="percent" ${it.type === "percent" ? "selected" : ""}>نسبة مئوية %</option>
              <option value="fixed" ${it.type === "fixed" ? "selected" : ""}>مبلغ ثابت</option>
            </select></div>
        </div>
        <div class="field" data-dc-percent><label>نسبة الخصم %</label>
          <input class="input" type="number" min="0" max="100" data-dc-pct value="${it.type === "percent" ? (it.value || 0) : 10}"/></div>
        <div class="field" data-dc-fixed><label>قيمة الخصم الثابتة</label>
          <div class="price-grid">
            <div><span class="price-lab">${c.robux}</span><input class="input" type="number" min="0" data-dc-fx="robux" value="${v.robux || 0}"/></div>
            <div><span class="price-lab">${c.egp}</span><input class="input" type="number" min="0" data-dc-fx="egp" value="${v.egp || 0}"/></div>
            <div><span class="price-lab">${c.sar}</span><input class="input" type="number" min="0" data-dc-fx="sar" value="${v.sar || 0}"/></div>
          </div></div>
        ${fBi("label", "وصف الكود", it)}
        <label class="switch-row"><input type="checkbox" data-dc-active ${it.active !== false ? "checked" : ""}/>
          <span>الكود مُفعّل</span></label>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-sm">${ic("check")}<span>حفظ</span></button>
          <button type="button" class="btn btn-ghost btn-sm" data-close>إلغاء</button>
        </div>
      </form></div>`;
  }
  function openDiscountForm(id) {
    const d = id ? store.get("discounts", id) : null;
    const box = NEOM.openModal(discountFormHTML(d));
    wireFormDynamics(box);
    box.querySelector("#dcForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const code = (box.querySelector("[data-dc-code]").value || "").trim().toUpperCase();
      if (!code) { NEOM.toast("اكتب الكود", "err"); return; }
      const type = box.querySelector("[data-dtype]").value;
      const o = {
        code, type,
        active: box.querySelector("[data-dc-active]").checked,
        label: {
          ar: (box.querySelector('[data-k="label.ar"]').value || "").trim(),
          en: (box.querySelector('[data-k="label.en"]').value || "").trim(),
        },
      };
      if (type === "percent") o.value = numOf(box.querySelector("[data-dc-pct]"));
      else o.value = {
        robux: numOf(box.querySelector('[data-dc-fx="robux"]')),
        egp: numOf(box.querySelector('[data-dc-fx="egp"]')),
        sar: numOf(box.querySelector('[data-dc-fx="sar"]')),
      };
      if (id) { store.update("discounts", id, o); NEOM.toast("تم حفظ الكود", "ok"); }
      else { o.id = store.nextId("discounts", "dc"); store.add("discounts", o); NEOM.toast("تمت إضافة الكود", "ok"); }
      NEOM.closeModal();
    });
  }
  function discountsSection() {
    const rows = store.discounts();
    const addBtn = `<button class="btn btn-primary btn-sm" data-add-dc>${ic("plus")}<span>كود جديد</span></button>`;
    const body = rows.length ? rows.map((d) => `<tr>
        <td style="font-family:var(--font-en);font-weight:700">${esc(d.code)}</td>
        <td>${d.type === "percent" ? "نسبة %" : "مبلغ ثابت"}</td>
        <td style="font-family:var(--font-en)">${esc(store.discountText(d))}</td>
        <td><span class="pill ${d.active !== false ? "green" : "red"}">${d.active !== false ? "مُفعّل" : "موقوف"}</span></td>
        <td>${esc(d.label && d.label.ar || "")}</td>
        <td class="act-cell">
          <button class="ico-btn sm" data-edit-dc="${d.id}" aria-label="تعديل">${ic("edit")}</button>
          <button class="ico-btn sm danger" data-del="discounts:${d.id}" aria-label="حذف">${ic("trash")}</button>
        </td></tr>`).join("") : emptyRow(6, "لا توجد أكواد — أنشئ أول كود خصم.");
    return bar(`الأكواد: ${rows.length}`, addBtn) +
      `<div class="panel-block"><div class="table-wrap"><table class="data">
        <thead><tr><th>الكود</th><th>النوع</th><th>القيمة</th><th>الحالة</th><th>الوصف</th><th></th></tr></thead>
        <tbody>${body}</tbody></table></div></div>`;
  }

  /* =============================== اللاعبون ===================== */
  function playersSection() {
    const accs = A();
    const me = (NEOM.getSession() || {}).email || "";
    const isOwner = (NEOM.getSession() || {}).role === "owner";
    const roleOpt = (cur) => ["owner", "admin", "member"].map((r) =>
      `<option value="${r}" ${r === cur ? "selected" : ""}>${ROLE_AR[r]}</option>`).join("");
    const body = accs.length ? accs.map((a) => {
      const mine = (a.email || "").toLowerCase() === me.toLowerCase();
      const lockRole = !isOwner || mine; // تغيير الرتبة للمالك فقط (وليس لنفسه)
      const key = a.email || a._uid || a.name;
      return `<tr>
        <td><div class="u-cell"><img src="${av(a.avatar)}" alt=""/><b>${esc(a.name)}</b></div></td>
        <td style="font-family:var(--font-en);direction:ltr">${esc(a.email)}</td>
        <td><select class="mini-select" data-role="${escA(key)}" ${lockRole ? "disabled" : ""} title="${isOwner ? (mine ? "لا يمكن تغيير رتبتك" : "") : "المالك فقط يغيّر الرتب"}">${roleOpt(a.role || "member")}</select></td>
        <td style="font-family:var(--font-en)">${esc(a.joined || "")}</td>
        <td><span class="pill ${a.status === "banned" ? "red" : "green"}">${a.status === "banned" ? "محظور" : "نشط"}</span></td>
        <td class="act-cell">
          <button class="ico-btn sm" data-view-player="${escA(key)}" aria-label="عرض التفاصيل" title="عرض كل المعلومات">${ic("eye")}</button>
          <button class="ico-btn sm danger" data-del-acc="${escA(key)}" ${(!isOwner || mine) ? "disabled" : ""} aria-label="حذف">${ic("trash")}</button>
        </td></tr>`;
    }).join("") : emptyRow(6, "لا يوجد لاعبون مسجّلون بعد. عند إنشاء حساب جديد سيظهر هنا.");
    const hint = isOwner ? "" : `<p class="muted-cell" style="margin-top:10px">المالك فقط يمكنه تغيير رتب اللاعبين أو حذفهم.</p>`;
    const srcTag = REMOTE.on ? `<span class="pill blue" style="margin-inline-start:8px">Supabase</span>` : "";
    const refresh = `<button class="btn btn-ghost btn-sm" data-refresh>${ic("refresh")}<span>تحديث</span></button>`;
    return bar(`اللاعبون: ${accs.length}${srcTag ? "" : ""}`, refresh) +
      `<div class="panel-block"><div class="table-wrap"><table class="data">
        <thead><tr><th>اللاعب</th><th>البريد</th><th>الرتبة</th><th>الانضمام</th><th>الحالة</th><th></th></tr></thead>
        <tbody>${body}</tbody></table></div>${hint}</div>`;
  }

  /* بطاقة تفاصيل الحساب الكاملة + سجل طلباته (يُفتح بزر العين) */
  function viewPlayer(key) {
    const k = String(key || "").toLowerCase();
    const a = A().find((x) => (x.email || "").toLowerCase() === k || String(x._uid || "").toLowerCase() === k || (x.name || "").toLowerCase() === k);
    if (!a) { NEOM.toast("تعذّر إيجاد الحساب", "err"); return; }

    const email = (a.email || "").toLowerCase();
    const name = (a.name || "").toLowerCase();
    const phone = (a.whatsapp || "").replace(/\s/g, "");
    const samePhone = (p) => phone && String(p || "").replace(/\s/g, "") === phone;

    const myOrders = O().filter((o) => (o.email && o.email.toLowerCase() === email) || (o.buyer && o.buyer.toLowerCase() === name) || (a._uid && o._uid === a._uid));
    const myApps = AP().filter((p) => (p.name && p.name.toLowerCase() === name) || samePhone(p.whatsapp));
    const myComplaints = CO().filter((m) => samePhone(m.whatsapp));

    const pw = a.password != null && a.password !== ""
      ? `<code style="font-family:var(--font-en);direction:ltr">${esc(a.password)}</code>`
      : (a._remote ? `<span class="muted-cell">مشفّرة على الخادم — غير قابلة للعرض</span>` : `<span class="muted-cell">— (بدون كلمة سر محفوظة)</span>`);

    const kv = (l, v) => `<div class="kv"><span>${l}</span><b>${v}</b></div>`;
    const kvR = (l, v) => `<div class="kv"><span>${l}</span><b style="font-family:var(--font-en);direction:ltr">${esc(v || "—")}</b></div>`;

    const ordersTbl = myOrders.length
      ? `<table class="data mini"><thead><tr><th>رقم</th><th>المنتج</th><th>السعر</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>
          ${myOrders.map((o) => `<tr><td style="font-family:var(--font-en)">${esc(o.id)}</td><td>${esc(o.item)}</td>
            <td style="font-family:var(--font-en)">${esc(o.price)}</td><td><span class="pill ${o.statC || "gold"}">${esc(o.status)}</span></td>
            <td style="font-family:var(--font-en)">${esc(o.date)}</td></tr>`).join("")}</tbody></table>`
      : `<p class="muted-cell">لا توجد طلبات شراء لهذا الحساب.</p>`;

    const appsTbl = myApps.length
      ? myApps.map((p) => `<div class="hist-row"><b>${esc(p.role || "طلب انضمام")}</b>
          <span class="muted-cell">${esc(cut(p.reason, 70))}</span>
          <span style="font-family:var(--font-en)">${esc(p.date || "")}</span></div>`).join("")
      : `<p class="muted-cell">لا توجد طلبات انضمام.</p>`;

    const compTbl = myComplaints.length
      ? myComplaints.map((m) => `<div class="hist-row"><b>${esc(CTYPE_AR[m.type] || m.type || "رسالة")} — ${esc(m.title)}</b>
          <span class="muted-cell">${esc(cut(m.description, 70))}</span>
          <span style="font-family:var(--font-en)">${esc(m.date || "")}</span></div>`).join("")
      : `<p class="muted-cell">لا توجد شكاوى أو اقتراحات.</p>`;

    NEOM.openModal(`<div class="modal-head"><h3>ملف الحساب — ${esc(a.name)}</h3>
        <button class="modal-close" data-close>${ic("close")}</button></div>
      <div class="modal-body">
        <div class="player-head">
          <img class="player-av" src="${av(a.avatar)}" alt=""/>
          <div><div class="player-name">${esc(a.name)}</div>
            <span class="pill ${ROLE_C[a.role] || "gold"}">${ROLE_AR[a.role] || a.role}</span>
            <span class="pill ${a.status === "banned" ? "red" : "green"}">${a.status === "banned" ? "محظور" : "نشط"}</span></div>
        </div>
        <div class="detail-grid">
          ${kvR("البريد الإلكتروني", a.email)}
          ${kvR("رقم واتساب", a.whatsapp)}
          ${kv("الدولة", esc(a.country || "—"))}
          ${kv("تاريخ الانضمام", `<span style="font-family:var(--font-en)">${esc(a.joined || "—")}</span>`)}
          ${kv("نقاط الخبرة (XP)", `<span style="font-family:var(--font-en)">${fmt(a.xp || 0)}</span>`)}
          ${kv("كلمة السر", pw)}
        </div>
        <h4 class="hist-title">${ic("bag")}<span>سجل الطلبات (${myOrders.length})</span></h4>
        <div class="table-wrap">${ordersTbl}</div>
        <h4 class="hist-title">${ic("apply")}<span>طلبات الانضمام (${myApps.length})</span></h4>
        ${appsTbl}
        <h4 class="hist-title">${ic("complaint")}<span>الشكاوى والاقتراحات (${myComplaints.length})</span></h4>
        ${compTbl}
        <div class="form-actions"><button class="btn btn-ghost btn-sm" data-close>إغلاق</button></div>
      </div>`, { wide: true });
  }

  /* =============================== الطلبات ===================== */
  const ORDER_STATES = [["قيد المعالجة", "gold"], ["مكتمل", "green"], ["ملغي", "red"]];
  function ordersSection() {
    const ords = O();
    const stOpt = (cur) => ORDER_STATES.map((s) => `<option value="${s[0]}" ${s[0] === cur ? "selected" : ""}>${s[0]}</option>`).join("");
    const body = ords.length ? ords.map((o) => `<tr>
        <td style="font-family:var(--font-en)">${esc(o.id)}</td>
        <td>${esc(o.item)}</td>
        <td><div class="u-cell"><img src="${av(o.a || o.avatar)}" alt=""/>${esc(o.buyer)}</div></td>
        <td style="font-family:var(--font-en)">${esc(o.price)}</td>
        <td>${o.discountCode ? `<span class="pill blue" style="font-family:var(--font-en)">${esc(o.discountCode)}</span>` : `<span class="muted-cell">—</span>`}</td>
        <td><select class="mini-select" data-status="${escA(o.id)}">${stOpt(o.status)}</select></td>
        <td style="font-family:var(--font-en)">${esc(o.date || "")}</td>
        <td class="act-cell"><button class="ico-btn sm danger" data-del="orders:${escA(o.id)}" aria-label="حذف">${ic("trash")}</button></td>
      </tr>`).join("") : emptyRow(8, "لا توجد طلبات بعد. عند إتمام عملية شراء من السلة سيظهر الطلب هنا.");
    return bar(`الطلبات: ${ords.length}`, "") +
      `<div class="panel-block"><div class="table-wrap"><table class="data">
        <thead><tr><th>رقم</th><th>المنتج</th><th>المشتري</th><th>السعر</th><th>كود</th><th>الحالة</th><th>التاريخ</th><th></th></tr></thead>
        <tbody>${body}</tbody></table></div></div>`;
  }

  /* =============================== المنتدى ===================== */
  function postFormHTML() {
    const it = {};
    return `<div class="modal-head"><h3>إعلان جديد</h3>
        <button class="modal-close" data-close>${ic("close")}</button></div>
      <div class="modal-body"><form id="postForm" novalidate>
        ${fBi("title", "العنوان", it)}
        ${fBiArea("excerpt", "النص", it)}
        ${fTags(it)}
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-sm">${ic("check")}<span>نشر</span></button>
          <button type="button" class="btn btn-ghost btn-sm" data-close>إلغاء</button>
        </div>
      </form></div>`;
  }
  function openPostForm() {
    const box = NEOM.openModal(postFormHTML());
    box.querySelector("#postForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const g = (k) => (box.querySelector(`[data-k="${k}"]`).value || "").trim();
      if (!g("title.ar")) { NEOM.toast("اكتب عنوان الإعلان", "err"); return; }
      const tv = box.querySelector("[data-tags]").value;
      const me = NEOM.getSession() || {};
      const acc = curAccount();
      store.add("posts", {
        id: store.nextId("posts", "post"),
        accent: "#2bd8c6", glyph: "bell", date: today(), views: 0, replies: 0,
        author: { name: me.name || "فريق نيوم", avatar: av(acc && acc.avatar ? acc.avatar : 1) },
        tags: tv ? [{ t: tv, k: "tag." + tv.replace(/^t-/, "") }] : [],
        title: { ar: g("title.ar"), en: g("title.en") || g("title.ar") },
        excerpt: { ar: g("excerpt.ar"), en: g("excerpt.en") || g("excerpt.ar") },
        reacts: { "❤️": 0, "😂": 0, "🔥": 0, "😍": 0, "👍": 0, "👏": 0, "😮": 0 },
      });
      NEOM.toast("تم نشر الإعلان", "ok");
      NEOM.closeModal();
    });
  }
  function forumSection() {
    const rows = store.list("posts");
    const addBtn = `<button class="btn btn-primary btn-sm" data-add-post>${ic("plus")}<span>إعلان جديد</span></button>`;
    const body = rows.length ? rows.map((p) => `<tr>
        <td><b>${esc(p.title && p.title.ar)}</b></td>
        <td><div class="u-cell"><img src="${escA(p.author && p.author.avatar || av(1))}" alt=""/>${esc(p.author && p.author.name)}</div></td>
        <td>${tagPill(p.tags)}</td>
        <td style="font-family:var(--font-en)">${fmt(p.views)}</td>
        <td style="font-family:var(--font-en)">${fmt(p.replies)}</td>
        <td style="font-family:var(--font-en)">${esc(p.date || "")}</td>
        <td class="act-cell"><button class="ico-btn sm danger" data-del="posts:${p.id}" aria-label="حذف">${ic("trash")}</button></td>
      </tr>`).join("") : emptyRow(7, "لا توجد منشورات. أنشئ أول إعلان رسمي.");
    return bar(`المنشورات: ${rows.length}`, addBtn) +
      `<div class="panel-block"><div class="table-wrap"><table class="data">
        <thead><tr><th>العنوان</th><th>الكاتب</th><th>الوسم</th><th>مشاهدات</th><th>ردود</th><th>التاريخ</th><th></th></tr></thead>
        <tbody>${body}</tbody></table></div></div>`;
  }

  /* ========================= طلبات الانضمام ==================== */
  function applicationsSection() {
    const rows = AP();
    const body = rows.length ? rows.map((a) => `<tr>
        <td><b>${esc(a.name)}</b></td>
        <td>${esc(a.role || "")}</td>
        <td style="font-family:var(--font-en);direction:ltr">${esc(a.whatsapp || "")}</td>
        <td style="font-family:var(--font-en);direction:ltr">${esc(a.discord || "—")}</td>
        <td>${esc(cut(a.reason, 50))}</td>
        <td style="font-family:var(--font-en)">${esc(a.date || "")}</td>
        <td class="act-cell">
          <button class="ico-btn sm" data-view-app="${a.id}" aria-label="عرض">${ic("eye")}</button>
          <button class="ico-btn sm danger" data-del="applications:${a.id}" aria-label="حذف">${ic("trash")}</button>
        </td></tr>`).join("") : emptyRow(7, "لا توجد طلبات انضمام بعد. الطلبات المُرسلة من صفحة «انضم إلينا» ستظهر هنا.");
    return bar(`الطلبات: ${rows.length}`, "") +
      `<div class="panel-block"><div class="table-wrap"><table class="data">
        <thead><tr><th>الاسم</th><th>المجال</th><th>واتساب</th><th>ديسكورد</th><th>السبب</th><th>التاريخ</th><th></th></tr></thead>
        <tbody>${body}</tbody></table></div></div>`;
  }
  function viewApplication(id) {
    const a = AP().find((x) => x.id === id);
    if (!a) return;
    const row = (l, v) => v ? `<div class="kv"><span>${l}</span><b>${esc(v)}</b></div>` : "";
    NEOM.openModal(`<div class="modal-head"><h3>طلب انضمام — ${esc(a.name)}</h3>
        <button class="modal-close" data-close>${ic("close")}</button></div>
      <div class="modal-body">
        ${row("المجال", a.role)}${row("واتساب", a.whatsapp)}${row("ديسكورد", a.discord)}
        ${row("الخبرة", a.experience)}
        <div class="kv col"><span>سبب الانضمام</span><p>${esc(a.reason)}</p></div>
        ${row("التاريخ", a.date)}
        <div class="form-actions"><button class="btn btn-ghost btn-sm" data-close>إغلاق</button></div>
      </div>`);
  }

  /* ============================ الشكاوى ======================== */
  const CTYPE_AR = { complaint: "شكوى", suggestion: "اقتراح", bug: "مشكلة تقنية", other: "أخرى" };
  function complaintsSection() {
    const rows = CO();
    const body = rows.length ? rows.map((m) => `<tr>
        <td><span class="pill blue">${esc(CTYPE_AR[m.type] || m.type || "—")}</span></td>
        <td><b>${esc(m.title)}</b></td>
        <td>${esc(cut(m.description, 60))}</td>
        <td style="font-family:var(--font-en);direction:ltr">${esc(m.whatsapp || "—")}</td>
        <td style="font-family:var(--font-en)">${esc(m.date || "")}</td>
        <td class="act-cell">
          <button class="ico-btn sm" data-view-cmp="${m.id}" aria-label="عرض">${ic("eye")}</button>
          <button class="ico-btn sm danger" data-del="complaints:${m.id}" aria-label="حذف">${ic("trash")}</button>
        </td></tr>`).join("") : emptyRow(6, "لا توجد رسائل بعد. الشكاوى والاقتراحات المُرسلة ستظهر هنا.");
    return bar(`الرسائل: ${rows.length}`, "") +
      `<div class="panel-block"><div class="table-wrap"><table class="data">
        <thead><tr><th>النوع</th><th>العنوان</th><th>الوصف</th><th>واتساب</th><th>التاريخ</th><th></th></tr></thead>
        <tbody>${body}</tbody></table></div></div>`;
  }
  function viewComplaint(id) {
    const m = CO().find((x) => x.id === id);
    if (!m) return;
    NEOM.openModal(`<div class="modal-head"><h3>${esc(m.title)}</h3>
        <button class="modal-close" data-close>${ic("close")}</button></div>
      <div class="modal-body">
        <div class="kv"><span>النوع</span><b>${esc(CTYPE_AR[m.type] || m.type)}</b></div>
        ${m.whatsapp ? `<div class="kv"><span>واتساب</span><b style="font-family:var(--font-en)">${esc(m.whatsapp)}</b></div>` : ""}
        <div class="kv col"><span>التفاصيل</span><p>${esc(m.description)}</p></div>
        <div class="kv"><span>التاريخ</span><b style="font-family:var(--font-en)">${esc(m.date || "")}</b></div>
        <div class="form-actions"><button class="btn btn-ghost btn-sm" data-close>إغلاق</button></div>
      </div>`);
  }

  /* ============================ لوحة التحكم ==================== */
  function statGrid(stats) {
    const cards = [
      { icon: "users", accent: "#2bd8c6", val: stats.players, label: "إجمالي اللاعبين" },
      { icon: "bag", accent: "#9b82ff", val: stats.orders, label: "الطلبات" },
      { icon: "coupon", accent: "#4fd88a", val: stats.revenue, label: "الإيرادات (R$)" },
      { icon: "forum", accent: "#ffcf5a", val: stats.posts, label: "منشورات المنتدى" },
    ];
    return `<div class="stat-grid">${cards.map((s) => `<div class="stat" style="--accent:${s.accent}">
      <div class="s-ico">${ic(s.icon)}</div>
      <div><div class="s-num" data-count="${s.val}">0</div><div class="s-label">${s.label}</div></div>
    </div>`).join("")}</div>`;
  }
  function dashboardHTML() {
    const stats = realStats();
    const ords = O().slice(0, 5);
    const accs = A().slice(0, 5);
    const orderRows = ords.length ? ords.map((o) => `<tr>
        <td style="font-family:var(--font-en)">${esc(o.id)}</td>
        <td>${esc(o.item)}</td>
        <td><div class="u-cell"><img src="${av(o.a || o.avatar)}" alt=""/>${esc(o.buyer)}</div></td>
        <td style="font-family:var(--font-en)">${esc(o.price)}</td>
        <td><span class="pill ${(ORDER_STATES.find((s) => s[0] === o.status) || [, "gold"])[1]}">${esc(o.status)}</span></td>
      </tr>`).join("") : emptyRow(5, "لا توجد طلبات بعد.");
    const playerRows = accs.length ? accs.map((a) => `<tr>
        <td><div class="u-cell"><img src="${av(a.avatar)}" alt=""/>${esc(a.name)}</div></td>
        <td><span class="pill ${ROLE_C[a.role] || "gold"}">${ROLE_AR[a.role] || "عضو"}</span></td>
        <td style="font-family:var(--font-en)">${esc(a.joined || "")}</td>
        <td><span class="pill ${a.status === "banned" ? "red" : "green"}">${a.status === "banned" ? "محظور" : "نشط"}</span></td>
      </tr>`).join("") : emptyRow(4, "لا يوجد لاعبون بعد.");
    return statGrid(stats) +
      `<div class="panel-block"><h3>أحدث الطلبات</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>رقم</th><th>المنتج</th><th>المشتري</th><th>السعر</th><th>الحالة</th></tr></thead>
          <tbody>${orderRows}</tbody></table></div></div>
      <div class="panel-block"><h3>أحدث اللاعبين</h3>
        <div class="table-wrap"><table class="data">
          <thead><tr><th>اللاعب</th><th>الرتبة</th><th>تاريخ الانضمام</th><th>الحالة</th></tr></thead>
          <tbody>${playerRows}</tbody></table></div></div>`;
  }

  /* ============================ الإحصائيات ==================== */
  function statisticsHTML() {
    const s = realStats();
    const sysFree = store.list("systems").filter((x) => x.isFree).length;
    const crsFree = store.list("courses").filter((x) => x.isFree).length;
    const dl = store.list("systems").reduce((a, x) => a + (x.downloads || 0), 0);
    const visits = store.list("maps").reduce((a, x) => a + (x.visits || 0), 0);
    const studs = store.list("courses").reduce((a, x) => a + (x.students || 0), 0);
    const mini = (icon, accent, val, label) => `<div class="stat" style="--accent:${accent}">
      <div class="s-ico">${ic(icon)}</div>
      <div><div class="s-num">${fmt(val)}</div><div class="s-label">${label}</div></div></div>`;
    return statGrid(s) +
      `<div class="panel-block"><h3>المحتوى</h3>
        <div class="stat-grid">
          ${mini("map", "#2bd8c6", s.maps, "عدد المابات")}
          ${mini("system", "#4fd88a", s.systems, "عدد الأنظمة")}
          ${mini("course", "#9b82ff", s.courses, "عدد الدورات")}
          ${mini("coupon", "#ffcf5a", store.discounts().length, "أكواد الخصم")}
        </div></div>
      <div class="panel-block"><h3>التفاعل</h3>
        <div class="stat-grid">
          ${mini("map", "#58b6ff", visits, "إجمالي زيارات المابات")}
          ${mini("download", "#4fd88a", dl, "إجمالي التحميلات")}
          ${mini("course", "#9b82ff", studs, "إجمالي الطلاب")}
          ${mini("apply", "#ff7eb0", s.apps, "طلبات الانضمام")}
        </div></div>
      <div class="panel-block"><h3>المجاني مقابل المدفوع</h3>
        <div class="kv"><span>أنظمة مجانية</span><b style="font-family:var(--font-en)">${sysFree} / ${s.systems}</b></div>
        <div class="kv"><span>دورات مجانية</span><b style="font-family:var(--font-en)">${crsFree} / ${s.courses}</b></div>
        <div class="kv"><span>رسائل/شكاوى</span><b style="font-family:var(--font-en)">${s.complaints}</b></div>
      </div>`;
  }

  /* ============================== الوسائط ===================== */
  /* (#4) إدارة الصور الرمزية للحسابات (إضافة/تفعيل/حذف) + الشعارات (إضافة/تنشيط) */
  function mediaHTML() {
    const m = store.media();
    const avs = m.avatars.map((a) => `<div class="media-card ${a.enabled ? "" : "off"}">
        <div class="media-thumb"><img src="${escA(a.src)}" alt=""/></div>
        <div class="media-row">
          <label class="mini-switch" title="${a.enabled ? "ظاهر للمستخدمين" : "مخفي"}">
            <input type="checkbox" data-av-toggle="${a.id}" ${a.enabled ? "checked" : ""}/><span>متاح</span></label>
          ${a.builtin ? `<span class="media-tag">أساسي</span>` : `<button class="ico-btn sm danger" data-av-del="${a.id}" aria-label="حذف">${ic("trash")}</button>`}
        </div>
      </div>`).join("");
    const logos = m.logos.map((l) => `<div class="media-card ${l.active ? "is-primary" : ""}">
        <div class="media-thumb lg"><img src="${escA(l.src)}" alt=""/></div>
        <div class="media-row">
          <button class="btn btn-sm ${l.active ? "btn-primary" : "btn-ghost"}" data-logo-active="${l.id}" ${l.active ? "disabled" : ""}>
            ${l.active ? "الشعار النشط" : "تنشيط"}</button>
          ${l.builtin ? `<span class="media-tag">أساسي</span>` : `<button class="ico-btn sm danger" data-logo-del="${l.id}" aria-label="حذف">${ic("trash")}</button>`}
        </div>
      </div>`).join("");
    return `<div class="panel-block">
        <div class="sec-bar"><h3 style="margin:0">الصور الرمزية للحسابات</h3>
          <div class="gal-add" style="margin:0">
            <input class="input media-url" data-av-url placeholder="رابط صورة رمزية https://..." />
            <button class="btn btn-ghost btn-sm" data-av-addurl>${ic("plus")}<span>إضافة</span></button>
            <label class="btn btn-ghost btn-sm gal-upload">${ic("image")}<span>رفع</span>
              <input type="file" accept="image/*" multiple hidden data-av-file/></label>
          </div></div>
        <p class="gal-hint" style="margin-top:0">فعّل أو أوقف أي صورة لتحديد ما يظهر للمستخدمين عند اختيار صورتهم. الصور المفعّلة فقط تظهر لهم.</p>
        <div class="media-grid2">${avs}</div>
      </div>
      <div class="panel-block">
        <div class="sec-bar"><h3 style="margin:0">شعارات الموقع</h3>
          <div class="gal-add" style="margin:0">
            <input class="input media-url" data-logo-url placeholder="رابط شعار https://..." />
            <button class="btn btn-ghost btn-sm" data-logo-addurl>${ic("plus")}<span>إضافة</span></button>
            <label class="btn btn-ghost btn-sm gal-upload">${ic("image")}<span>رفع</span>
              <input type="file" accept="image/*" hidden data-logo-file/></label>
          </div></div>
        <p class="gal-hint" style="margin-top:0">اختر الشعار النشط الذي يظهر في أعلى الموقع وفي التذييل.</p>
        <div class="media-grid2">${logos}</div>
      </div>`;
  }

  function mediaSave(m, okMsg) {
    if (store.saveMedia(m)) { if (okMsg) NEOM.toast(okMsg, "ok"); }
    else NEOM.toast("تعذّر الحفظ — مساحة المتصفح ممتلئة. استخدم روابط صور بدل الرفع المباشر", "err", 5000);
  }
  function mediaAddAvatar(src) {
    if (!src) return;
    const m = store.media();
    m.avatars.push({ id: "av-" + Date.now() + Math.floor(Math.random() * 99), src: src, label: "Avatar", enabled: true, builtin: false });
    mediaSave(m, "تمت إضافة الصورة");
  }
  function mediaToggleAvatar(id, on) { const m = store.media(); const a = m.avatars.find((x) => x.id === id); if (a) { a.enabled = on; mediaSave(m); } }
  function mediaDelAvatar(id) {
    const m = store.media(); m.avatars = m.avatars.filter((x) => x.id !== id);
    if (!m.avatars.some((x) => x.enabled) && m.avatars[0]) m.avatars[0].enabled = true;
    mediaSave(m, "تم الحذف");
  }
  function mediaAddLogo(src) {
    if (!src) return; const m = store.media();
    m.logos.push({ id: "logo-" + Date.now(), src: src, label: "شعار", active: false, builtin: false });
    mediaSave(m, "تمت إضافة الشعار");
  }
  function mediaActivateLogo(id) { const m = store.media(); m.logos.forEach((l) => (l.active = l.id === id)); mediaSave(m, "تم تنشيط الشعار"); }
  function mediaDelLogo(id) {
    const m = store.media(); const wasActive = (m.logos.find((x) => x.id === id) || {}).active;
    m.logos = m.logos.filter((x) => x.id !== id);
    if (wasActive && m.logos[0]) m.logos[0].active = true;
    mediaSave(m, "تم الحذف");
  }
  function readImageFiles(fileList, onSrc) {
    [].slice.call(fileList).forEach((f) => {
      if (f.size > 600 * 1024) { NEOM.toast("الصورة كبيرة (>600KB) — استخدم رابطًا بدل الرفع", "err"); return; }
      const r = new FileReader(); r.onload = () => onSrc(r.result); r.readAsDataURL(f);
    });
  }

  /* ======================== الرتب والصلاحيات ================== */
  /* (#12) لكل رتبة تظهر كل المميزات: علامة صح = مُفعّلة، منع = غير مُفعّلة.
     المالك فقط يمكنه التبديل؛ بقية الرتب ترى الحالة للقراءة فقط. */
  function rolesHTML() {
    const me = (NEOM.getSession() || {}).role;
    const isOwner = me === "owner";
    const P = store.perms();
    const N = store.PERM_CATALOG.length;
    const roles = [
      { key: "owner", ar: "مالك", cls: "purple" },
      { key: "admin", ar: "مشرف", cls: "blue" },
      { key: "member", ar: "عضو", cls: "gold" },
    ];
    const card = (r) => {
      const rows = store.PERM_CATALOG.map((perm) => {
        const granted = r.key === "owner" ? true : (P[r.key] || []).indexOf(perm.k) >= 0;
        const editable = isOwner && r.key !== "owner";
        const btn = `<button class="perm-toggle ${granted ? "on" : "off"}" ${editable ? `data-perm="${r.key}:${perm.k}"` : "disabled"} title="${granted ? "مُفعّلة" : "غير مُفعّلة"}">${granted ? ic("check") : ic("close")}</button>`;
        return `<li class="perm-row"><span class="perm-name">${perm.ar}</span>${btn}</li>`;
      }).join("");
      const count = r.key === "owner" ? N : (P[r.key] || []).length;
      return `<div class="role-card">
          <div class="role-top"><span class="pill ${r.cls}">${r.ar}</span>
            <span class="role-count" style="font-family:var(--font-en)">${count}/${N}</span></div>
          <ul class="perm-list">${rows}</ul></div>`;
    };
    const note = isOwner
      ? `اضغط على علامة الصح/المنع لتفعيل أو إلغاء أي ميزة لكل رتبة. صلاحيات المالك ثابتة. تغيير رتبة أي لاعب متاح للمالك فقط من قسم «اللاعبون».`
      : `المالك فقط يمكنه تعديل صلاحيات الرتب وتحديد رتب اللاعبين. هذا العرض للاطّلاع فقط: ✓ مُفعّلة، ✕ غير مُفعّلة.`;
    return `<div class="panel-block"><h3>الرتب والصلاحيات</h3>
        <div class="roles-grid">${roles.map(card).join("")}</div>
        <p class="muted-cell" style="margin-top:14px">${note}</p></div>`;
  }

  /* ============================== السجلّات ==================== */
  function logsHTML() {
    const events = [];
    O().slice(0, 6).forEach((o) => events.push({ d: o.date, ic: "bag", t: `طلب جديد ${o.id} — ${o.item}` }));
    A().slice(0, 6).forEach((a) => events.push({ d: a.joined, ic: "user", t: `انضمام عضو — ${a.name}` }));
    AP().slice(0, 4).forEach((a) => events.push({ d: a.date, ic: "apply", t: `طلب انضمام — ${a.name}` }));
    CO().slice(0, 4).forEach((m) => events.push({ d: m.date, ic: "complaint", t: `رسالة — ${m.title}` }));
    events.sort((x, y) => String(y.d || "").localeCompare(String(x.d || "")));
    const body = events.length ? events.slice(0, 20).map((e) => `<div class="log-row">
        <span class="log-ic">${ic(e.ic)}</span>
        <span class="log-t">${esc(e.t)}</span>
        <span class="log-d" style="font-family:var(--font-en)">${esc(e.d || "")}</span>
      </div>`).join("") : `<div class="empty">${ic("list")}<p>لا يوجد نشاط بعد.</p></div>`;
    return `<div class="panel-block"><h3>آخر النشاطات</h3><div class="log-list">${body}</div></div>`;
  }

  /* ============================== الإعدادات =================== */
  function settingsHTML() {
    const f = store.flags();
    const isOwner = (NEOM.getSession() || {}).role === "owner";
    const dis = isOwner ? "" : "disabled";
    const row = (key, label, desc) => `<label class="set-row">
      <div><b>${label}</b><span>${desc}</span></div>
      <input type="checkbox" class="set-toggle" data-flag="${key}" ${f[key] ? "checked" : ""} ${dis}/>
    </label>`;
    const usingSupa = !!(window.NEOM_USE_SUPABASE === true);
    const ownerNote = isOwner ? "" : `<p class="muted-cell" style="margin:0 0 10px">تعديل الإعدادات متاح للمالك فقط.</p>`;
    return `<div class="panel-block"><h3>إعدادات عامة</h3>
        ${ownerNote}
        ${row("registrationOpen", "تسجيل الحسابات", "السماح بإنشاء حسابات جديدة من صفحة التسجيل")}
        ${row("applyOpen", "استقبال طلبات الانضمام", "إظهار نموذج «انضم إلينا» وبطاقة التقديم في الرئيسية")}
        ${row("maintenance", "وضع الصيانة", "تنبيه الزوار بأن الموقع تحت الصيانة")}
      </div>
      <div class="panel-block"><h3>قاعدة البيانات</h3>
        <div class="kv"><span>الوضع الحالي</span><b>${usingSupa ? "Supabase (سحابي)" : "محلي على الجهاز"}</b></div>
        <p class="muted-cell" style="margin:6px 0 0">يعمل الموقع الآن محليًا بالكامل وكل البيانات تُحفظ على المتصفّح. لتفعيل المزامنة السحابية، اضبط
          <code style="font-family:var(--font-en)">NEOM_USE_SUPABASE = true</code> في ملف
          <code style="font-family:var(--font-en)">supabase-config.js</code> بعد إعداد الجداول وإيقاف Confirm email.</p>
      </div>`;
  }

  /* ============================== التوجيه ===================== */
  const SECTION = {
    dashboard: dashboardHTML,
    statistics: statisticsHTML,
    maps: () => contentSection("maps"),
    systems: () => contentSection("systems"),
    courses: () => contentSection("courses"),
    media: mediaHTML,
    players: playersSection,
    forum: forumSection,
    applications: applicationsSection,
    complaints: complaintsSection,
    orders: ordersSection,
    discounts: discountsSection,
    roles: rolesHTML,
    logs: logsHTML,
    settings: settingsHTML,
  };

  function animateCounters(scope) {
    scope.querySelectorAll("[data-count]").forEach((el) => {
      const target = +el.getAttribute("data-count");
      const dur = 1000, start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  let current = "dashboard";
  function renderMain(active) {
    current = active;
    const main = document.getElementById("adminContent");
    const title = document.getElementById("adminTitle");
    if (title) title.textContent = TITLES[active] || "لوحة التحكم";
    main.innerHTML = (SECTION[active] || SECTION.dashboard)();
    if (active === "dashboard" || active === "statistics") animateCounters(main);
  }
  function setActive(active) {
    const side = document.getElementById("adminSide");
    side.querySelectorAll("[data-sec]").forEach((a) => a.classList.toggle("active", a.getAttribute("data-sec") === active));
    renderMain(active);
    document.body.classList.remove("admin-open");
  }

  /* تفويض الأحداث داخل المحتوى (إضافة/تعديل/حذف/تغيير) */
  function wireDelegation() {
    const main = document.getElementById("adminContent");

    main.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) { openContentForm(add.getAttribute("data-add")); return; }
      const edit = e.target.closest("[data-edit]");
      if (edit) { const [t, id] = edit.getAttribute("data-edit").split(":"); openContentForm(t, id); return; }
      if (e.target.closest("[data-add-dc]")) { openDiscountForm(); return; }
      const edc = e.target.closest("[data-edit-dc]");
      if (edc) { openDiscountForm(edc.getAttribute("data-edit-dc")); return; }
      if (e.target.closest("[data-add-post]")) { openPostForm(); return; }
      const vapp = e.target.closest("[data-view-app]");
      if (vapp) { viewApplication(vapp.getAttribute("data-view-app")); return; }
      const vcmp = e.target.closest("[data-view-cmp]");
      if (vcmp) { viewComplaint(vcmp.getAttribute("data-view-cmp")); return; }
      const vpl = e.target.closest("[data-view-player]");
      if (vpl) { viewPlayer(vpl.getAttribute("data-view-player")); return; }
      if (e.target.closest("[data-refresh]")) {
        if (REMOTE.on) { loadRemote().then(() => renderMain(current)); NEOM.toast("جارٍ التحديث…", "info"); }
        else renderMain(current);
        return;
      }

      const del = e.target.closest("[data-del]");
      if (del) {
        const [name, id] = del.getAttribute("data-del").split(":");
        confirmDel(() => { store.remove(name, id); NEOM.toast("تم الحذف", "ok"); });
        return;
      }
      const delAcc = e.target.closest("[data-del-acc]");
      if (delAcc && !delAcc.disabled) {
        const key = delAcc.getAttribute("data-del-acc");
        confirmDel(async () => {
          if (REMOTE.on) {
            const db = DB(); const acc = REMOTE.accounts.find((x) => keyMatch(x, key));
            if (db && acc && acc._uid) {
              try { await db.from("profiles").update({ status: "banned" }).eq("id", acc._uid); } catch (e) {}
              NEOM.toast("لا يمكن حذف حساب سحابي من المتصفح — تم تعليمه كمحظور", "info", 5000);
              await loadRemote(); renderMain(current);
            }
          } else {
            store.saveAccounts(store.accounts().filter((a) => !keyMatch(a, key)));
            NEOM.toast("تم حذف الحساب", "ok");
          }
        });
        return;
      }

      /* ---- مكتبة الوسائط (#4) ---- */
      if (e.target.closest("[data-av-addurl]")) {
        const inp = main.querySelector("[data-av-url]"); const v = inp ? (inp.value || "").trim() : "";
        if (!v) { NEOM.toast("ألصق رابط صورة أولًا", "err"); return; }
        mediaAddAvatar(v); if (inp) inp.value = ""; return;
      }
      const avDel = e.target.closest("[data-av-del]");
      if (avDel) { mediaDelAvatar(avDel.getAttribute("data-av-del")); return; }
      if (e.target.closest("[data-logo-addurl]")) {
        const inp = main.querySelector("[data-logo-url]"); const v = inp ? (inp.value || "").trim() : "";
        if (!v) { NEOM.toast("ألصق رابط شعار أولًا", "err"); return; }
        mediaAddLogo(v); if (inp) inp.value = ""; return;
      }
      const lgAct = e.target.closest("[data-logo-active]");
      if (lgAct) { mediaActivateLogo(lgAct.getAttribute("data-logo-active")); return; }
      const lgDel = e.target.closest("[data-logo-del]");
      if (lgDel) { mediaDelLogo(lgDel.getAttribute("data-logo-del")); return; }

      /* ---- مصفوفة الصلاحيات (#12) — المالك فقط ---- */
      const pt = e.target.closest("[data-perm]");
      if (pt && !pt.disabled) {
        const parts = pt.getAttribute("data-perm").split(":");
        const role = parts[0], key = parts[1];
        store.togglePerm(role, key, !store.hasPerm(role, key));
        return; // المخزن يصدر حدثًا فيُعاد الرسم
      }
    });

    main.addEventListener("change", (e) => {
      const role = e.target.closest("[data-role]");
      if (role) {
        const key = role.getAttribute("data-role"); const val = role.value;
        if (REMOTE.on) {
          const db = DB(); const acc = REMOTE.accounts.find((x) => keyMatch(x, key));
          if (db && acc && acc._uid) {
            db.from("profiles").update({ role: val }).eq("id", acc._uid)
              .then(() => { acc.role = val; NEOM.toast("تم تحديث الرتبة", "ok"); paintIdentity(); })
              .catch(() => NEOM.toast("تعذّر تحديث الرتبة", "err"));
          }
        } else {
          const accs = store.accounts();
          const i = accs.findIndex((a) => keyMatch(a, key));
          if (i >= 0) { accs[i].role = val; store.saveAccounts(accs); NEOM.toast("تم تحديث الرتبة", "ok"); paintIdentity(); }
        }
        return;
      }
      const st = e.target.closest("[data-status]");
      if (st) {
        const id = st.getAttribute("data-status"); const val = st.value;
        const statC = (ORDER_STATES.find((s) => s[0] === val) || [, "gold"])[1];
        store.update("orders", id, { status: val, statC });
        NEOM.toast("تم تحديث حالة الطلب", "ok");
        return;
      }
      const av_t = e.target.closest("[data-av-toggle]");
      if (av_t) { mediaToggleAvatar(av_t.getAttribute("data-av-toggle"), av_t.checked); return; }
      const avFile = e.target.closest("[data-av-file]");
      if (avFile && avFile.files && avFile.files.length) { readImageFiles(avFile.files, mediaAddAvatar); avFile.value = ""; return; }
      const lgFile = e.target.closest("[data-logo-file]");
      if (lgFile && lgFile.files && lgFile.files.length) { readImageFiles(lgFile.files, mediaAddLogo); lgFile.value = ""; return; }

      const flag = e.target.closest("[data-flag]");
      if (flag) { store.setFlag(flag.getAttribute("data-flag"), flag.checked); NEOM.toast("تم حفظ الإعداد", "ok"); return; }
    });
  }

  function confirmDel(onYes) {
    const box = NEOM.openModal(`<div class="modal-head"><h3>تأكيد الحذف</h3>
        <button class="modal-close" data-close>${ic("close")}</button></div>
      <div class="modal-body">
        <p>هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذه الخطوة.</p>
        <div class="form-actions">
          <button class="btn btn-primary btn-sm" data-yes style="background:linear-gradient(135deg,#ff6b6b,#e23d3d);box-shadow:none">${ic("trash")}<span>حذف</span></button>
          <button class="btn btn-ghost btn-sm" data-close>إلغاء</button>
        </div>
      </div>`, { sm: true });
    box.querySelector("[data-yes]").addEventListener("click", () => { NEOM.closeModal(); onYes(); renderMain(current); });
  }

  /* ------------------------------ INIT --------------------------- */
  async function init() {
    if (!(await guard())) return;
    // حمّل بيانات السحابة إن كانت مفعّلة، وإلا أصلِح الحسابات المحلية
    if (DB()) { await loadRemote(); } else { selfHealLocal(); }
    paintIdentity();
    const side = document.getElementById("adminSide");
    let active = (location.hash || "#dashboard").slice(1);
    if (!TITLES[active]) active = "dashboard";

    side.innerHTML = sidebarHTML(active);
    renderMain(active);
    wireDelegation();

    side.addEventListener("click", (e) => {
      const a = e.target.closest("[data-sec]");
      if (!a) return;
      e.preventDefault();
      const id = a.getAttribute("data-sec");
      history.replaceState(null, "", "#" + id);
      setActive(id);
    });

    const burger = document.getElementById("adminBurger");
    if (burger) burger.addEventListener("click", () => document.body.classList.toggle("admin-open"));
    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("admin-open")) return;
      if (e.target.closest("#adminSide") || e.target.closest("#adminBurger")) return;
      document.body.classList.remove("admin-open");
    });

    /* إعادة الرسم عند أي تغيير في المخزن (من السلة مثلًا) إن لم يكن مصدره النموذج الحالي */
    document.addEventListener("neom:store", () => {
      if (!document.querySelector(".modal-overlay.open")) renderMain(current);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
