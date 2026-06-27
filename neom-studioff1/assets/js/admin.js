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
  const av = (n) => `assets/img/avatars/avatar-${String(n || 1).padStart(2, "0")}.svg`;
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const escA = (s) => esc(s).replace(/"/g, "&quot;");
  const today = () => new Date().toLocaleDateString("en-CA").replace(/-/g, "/");
  const fmt = (n) => Number(n || 0).toLocaleString("en-US");
  const numOf = (el) => (el && el.value !== "" ? Number(el.value) : 0);
  const cut = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

  function getPath(o, path) { return path.split(".").reduce((a, k) => (a == null ? a : a[k]), o); }
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
    const accs = store.accounts();
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
    const accs = store.accounts();
    const ords = store.orders();
    const revenue = ords.reduce((a, o) => a + orderRobux(o), 0);
    return {
      players: accs.length,
      orders: ords.length,
      revenue,
      posts: store.list("posts").length,
      maps: store.list("maps").length,
      systems: store.list("systems").length,
      courses: store.list("courses").length,
      apps: store.applications().length,
      complaints: store.complaints().length,
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
    wireFormDynamics(box);
    const form = box.querySelector("#cmsForm");
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

  /* ربط السلوك الديناميكي داخل النموذج (لون/مجاني) */
  function wireFormDynamics(box) {
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
    const body = rows.length ? rows.map((it) => `<tr>
        <td><div class="u-cell">${swatch(it.accent)}<b>${esc(it.name && it.name.ar)}</b></div></td>
        <td>${esc(cut(it.desc && it.desc.ar, 46))}</td>
        <td style="font-family:var(--font-en)">${fmt(it[ckey])}</td>
        <td>${tagPill(it.tags)}</td>
        <td>${priceCell(it)}</td>
        <td style="font-family:var(--font-en)">${esc(it.updated || "")}</td>
        <td class="act-cell">
          <button class="ico-btn sm" data-edit="${type}:${it.id}" aria-label="تعديل">${ic("edit")}</button>
          <button class="ico-btn sm danger" data-del="${type}:${it.id}" aria-label="حذف">${ic("trash")}</button>
        </td></tr>`).join("") : emptyRow(7, "لا يوجد عناصر بعد — اضغط «إضافة» لإنشاء أول عنصر.");
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
    const accs = store.accounts();
    const me = (NEOM.getSession() || {}).email || "";
    const roleOpt = (cur) => ["owner", "admin", "member"].map((r) =>
      `<option value="${r}" ${r === cur ? "selected" : ""}>${ROLE_AR[r]}</option>`).join("");
    const body = accs.length ? accs.map((a) => {
      const mine = (a.email || "").toLowerCase() === me.toLowerCase();
      return `<tr>
        <td><div class="u-cell"><img src="${av(a.avatar)}" alt=""/><b>${esc(a.name)}</b></div></td>
        <td style="font-family:var(--font-en);direction:ltr">${esc(a.email)}</td>
        <td><select class="mini-select" data-role="${escA(a.email)}" ${mine ? "disabled title='لا يمكن تغيير رتبتك'" : ""}>${roleOpt(a.role || "member")}</select></td>
        <td style="font-family:var(--font-en)">${esc(a.joined || "")}</td>
        <td><span class="pill ${a.status === "banned" ? "red" : "green"}">${a.status === "banned" ? "محظور" : "نشط"}</span></td>
        <td class="act-cell">
          <button class="ico-btn sm danger" data-del-acc="${escA(a.email)}" ${mine ? "disabled" : ""} aria-label="حذف">${ic("trash")}</button>
        </td></tr>`;
    }).join("") : emptyRow(6, "لا يوجد لاعبون مسجّلون بعد. عند إنشاء حساب جديد سيظهر هنا.");
    return bar(`اللاعبون: ${accs.length}`, "") +
      `<div class="panel-block"><div class="table-wrap"><table class="data">
        <thead><tr><th>اللاعب</th><th>البريد</th><th>الرتبة</th><th>الانضمام</th><th>الحالة</th><th></th></tr></thead>
        <tbody>${body}</tbody></table></div></div>`;
  }

  /* =============================== الطلبات ===================== */
  const ORDER_STATES = [["قيد المعالجة", "gold"], ["مكتمل", "green"], ["ملغي", "red"]];
  function ordersSection() {
    const ords = store.orders();
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
    const rows = store.applications();
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
    const a = store.applications().find((x) => x.id === id);
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
    const rows = store.complaints();
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
    const m = store.complaints().find((x) => x.id === id);
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
    const ords = store.orders().slice(0, 5);
    const accs = store.accounts().slice(0, 5);
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
  function mediaHTML() {
    const items = [];
    for (let i = 1; i <= 8; i++) items.push(av(i));
    return `<div class="panel-block"><h3>مكتبة الصور الرمزية</h3>
        <p class="muted-cell" style="margin:0 0 14px">الصور المتاحة للحسابات داخل الموقع.</p>
        <div class="media-grid">${items.map((src) => `<div class="media-cell"><img src="${src}" alt=""/></div>`).join("")}</div>
      </div>
      <div class="panel-block"><h3>الشعار</h3>
        <div class="media-cell lg"><img src="assets/img/logo.svg" alt="logo"/></div>
      </div>`;
  }

  /* ======================== الرتب والصلاحيات ================== */
  function rolesHTML() {
    const card = (name, cls, perms) => `<div class="role-card">
      <div class="role-top"><span class="pill ${cls}">${name}</span></div>
      <ul class="role-perms">${perms.map((p) => `<li>${ic("check")}<span>${p}</span></li>`).join("")}</ul></div>`;
    return `<div class="panel-block"><h3>الرتب وصلاحياتها</h3>
      <div class="roles-grid">
        ${card("مالك", "purple", ["إدارة كل المحتوى", "إدارة اللاعبين والرتب", "إدارة الطلبات والأكواد", "تعديل إعدادات الموقع"])}
        ${card("مشرف", "blue", ["إضافة وتعديل المحتوى", "متابعة الطلبات والشكاوى", "نشر إعلانات المنتدى"])}
        ${card("عضو", "gold", ["تصفّح المحتوى", "الشراء من المتجر", "المشاركة في المنتدى", "إرسال طلب انضمام"])}
      </div>
      <p class="muted-cell" style="margin-top:14px">لتغيير رتبة لاعب، افتح قسم «اللاعبون» واختر الرتبة من القائمة.</p>
    </div>`;
  }

  /* ============================== السجلّات ==================== */
  function logsHTML() {
    const events = [];
    store.orders().slice(0, 6).forEach((o) => events.push({ d: o.date, ic: "bag", t: `طلب جديد ${o.id} — ${o.item}` }));
    store.accounts().slice(0, 6).forEach((a) => events.push({ d: a.joined, ic: "user", t: `انضمام عضو — ${a.name}` }));
    store.applications().slice(0, 4).forEach((a) => events.push({ d: a.date, ic: "apply", t: `طلب انضمام — ${a.name}` }));
    store.complaints().slice(0, 4).forEach((m) => events.push({ d: m.date, ic: "complaint", t: `رسالة — ${m.title}` }));
    events.sort((x, y) => String(y.d || "").localeCompare(String(x.d || "")));
    const body = events.length ? events.slice(0, 20).map((e) => `<div class="log-row">
        <span class="log-ic">${ic(e.ic)}</span>
        <span class="log-t">${esc(e.t)}</span>
        <span class="log-d" style="font-family:var(--font-en)">${esc(e.d || "")}</span>
      </div>`).join("") : `<div class="empty">${ic("list")}<p>لا يوجد نشاط بعد.</p></div>`;
    return `<div class="panel-block"><h3>آخر النشاطات</h3><div class="log-list">${body}</div></div>`;
  }

  /* ============================== الإعدادات =================== */
  const FLAG_KEY = "neom.flags";
  function loadFlags() {
    let f = {};
    try { f = JSON.parse(localStorage.getItem(FLAG_KEY)) || {}; } catch (e) { f = {}; }
    return Object.assign({}, NEOM.site.flags, f);
  }
  function saveFlag(key, val) {
    const f = loadFlags(); f[key] = val;
    try { localStorage.setItem(FLAG_KEY, JSON.stringify(f)); } catch (e) {}
    NEOM.site.flags[key] = val;
  }
  function settingsHTML() {
    const f = loadFlags();
    const row = (key, label, desc) => `<label class="set-row">
      <div><b>${label}</b><span>${desc}</span></div>
      <input type="checkbox" class="set-toggle" data-flag="${key}" ${f[key] ? "checked" : ""}/>
    </label>`;
    const usingSupa = !!(window.NEOM_USE_SUPABASE === true);
    return `<div class="panel-block"><h3>إعدادات عامة</h3>
        ${row("registrationOpen", "تسجيل الحسابات", "السماح بإنشاء حسابات جديدة")}
        ${row("applyOpen", "استقبال طلبات الانضمام", "إظهار نموذج «انضم إلينا»")}
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

      const del = e.target.closest("[data-del]");
      if (del) {
        const [name, id] = del.getAttribute("data-del").split(":");
        confirmDel(() => { store.remove(name, id); NEOM.toast("تم الحذف", "ok"); });
        return;
      }
      const delAcc = e.target.closest("[data-del-acc]");
      if (delAcc && !delAcc.disabled) {
        const email = delAcc.getAttribute("data-del-acc");
        confirmDel(() => {
          store.saveAccounts(store.accounts().filter((a) => (a.email || "").toLowerCase() !== email.toLowerCase()));
          NEOM.toast("تم حذف الحساب", "ok");
        });
        return;
      }
    });

    main.addEventListener("change", (e) => {
      const role = e.target.closest("[data-role]");
      if (role) {
        const email = role.getAttribute("data-role"); const val = role.value;
        const accs = store.accounts();
        const i = accs.findIndex((a) => (a.email || "").toLowerCase() === email.toLowerCase());
        if (i >= 0) { accs[i].role = val; store.saveAccounts(accs); NEOM.toast("تم تحديث الرتبة", "ok"); paintIdentity(); }
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
      const flag = e.target.closest("[data-flag]");
      if (flag) { saveFlag(flag.getAttribute("data-flag"), flag.checked); NEOM.toast("تم حفظ الإعداد", "ok"); return; }
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
