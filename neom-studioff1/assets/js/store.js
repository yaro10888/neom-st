/* =========================================================
   Neom Studio — المخزن الدائم (مصدر الحقيقة الواحد)
   ---------------------------------------------------------
   - يقرأ البيانات الابتدائية من data.js عند أول فتح وينسخها إلى
     localStorage، ثم تصبح لوحة الإدارة هي مَن يضيف/يعدّل/يحذف فعليًا.
   - يربط NEOM.data.maps / systems / courses / posts بالنسخ المحفوظة،
     فيظهر أي تعديل من الإدارة على الموقع مباشرةً وبعد إعادة التحميل.
   - يحتفظ أيضًا بالطلبات (orders)، أكواد الخصم (discounts)، طلبات
     الانضمام (applications) والشكاوى (complaints).
   - يجب تحميله بعد data.js وقبل catalog.js / admin.js / cart.js …
   ========================================================= */
(function () {
  "use strict";
  const NEOM = (window.NEOM = window.NEOM || {});
  const data = (NEOM.data = NEOM.data || {});

  /* رقم إصدار البيانات: عند تغييره تُحدَّث البيانات الابتدائية فقط
     (المابات/الأنظمة/الدورات/المنشورات/الكوبونات) مع الحفاظ على بيانات
     المستخدم الحقيقية (الحسابات/الطلبات/الطلبات/الشكاوى). */
  const VERSION = "2026.1";
  const VKEY = "neom.dataVersion";
  const fresh = localStorage.getItem(VKEY) !== VERSION;

  const K = {
    maps: "neom.maps",
    systems: "neom.systems",
    courses: "neom.courses",
    posts: "neom.posts",
    orders: "neom.orders",
    discounts: "neom.discounts",
    applications: "neom.applications",
    complaints: "neom.complaints",
    accounts: "neom.accounts",
  };

  function read(key) {
    try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : null; }
    catch (e) { return null; }
  }
  function write(key, arr) {
    try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {}
  }

  /* أكواد الخصم الابتدائية (يمكن إدارتها من لوحة الإدارة → أكواد الخصم) */
  function defaultDiscounts() {
    return [
      { id: "dc-1", code: "WELCOME10", type: "percent", value: 10, active: true,
        label: { ar: "خصم ترحيبي 10%", en: "10% welcome discount" } },
      { id: "dc-2", code: "NEOM20", type: "percent", value: 20, active: true,
        label: { ar: "خصم 20% على كل المنتجات", en: "20% off everything" } },
      { id: "dc-3", code: "SAVE50", type: "fixed", value: { robux: 50, egp: 25, sar: 5 }, active: true,
        label: { ar: "خصم ثابت على الطلب", en: "Fixed amount off" } },
    ];
  }

  /* --- بذر مجموعات المحتوى من data.js (أول مرة أو عند تغيّر الإصدار) --- */
  function seedContent(name) {
    let cur = read(K[name]);
    if (!cur || fresh) { cur = (data[name] || []).slice(); write(K[name], cur); }
    data[name] = cur; // اجعل قُرّاء الموقع يرون النسخة المحفوظة الحيّة
  }
  ["maps", "systems", "courses", "posts"].forEach(seedContent);

  /* مجموعات تُنشأ فارغة وتُملأ بأفعال حقيقية (لا بيانات وهمية) */
  if (!read(K.orders)) write(K.orders, []);
  if (!read(K.applications)) write(K.applications, []);
  if (!read(K.complaints)) write(K.complaints, []);
  if (!read(K.discounts) || fresh) write(K.discounts, defaultDiscounts());

  if (fresh) localStorage.setItem(VKEY, VERSION);

  /* ----------------------------- API ----------------------------- */
  function emit(name) {
    try { document.dispatchEvent(new CustomEvent("neom:store", { detail: { name } })); } catch (e) {}
  }
  function list(name) { return read(K[name]) || []; }
  function persist(name, arr) {
    write(K[name], arr);
    if (name in data) data[name] = arr; // أبقِ مرآة data محدّثة للموقع
    emit(name);
  }
  function get(name, id) { return list(name).find((x) => x.id === id) || null; }
  function add(name, item) { const a = list(name); a.unshift(item); persist(name, a); return item; }
  function update(name, id, patch) {
    const a = list(name); const i = a.findIndex((x) => x.id === id);
    if (i < 0) return null;
    a[i] = Object.assign({}, a[i], patch);
    persist(name, a);
    return a[i];
  }
  function remove(name, id) { persist(name, list(name).filter((x) => x.id !== id)); }

  /* مولّد مُعرّفات تسلسلية: map-7, sys-7, dc-4 … */
  function nextId(name, prefix) {
    let max = 0;
    list(name).forEach((x) => { const m = /(\d+)\s*$/.exec(String(x.id || "")); if (m) max = Math.max(max, +m[1]); });
    return prefix + "-" + (max + 1);
  }

  /* ------------------------- accounts ---------------------------- */
  /* مشترك مع auth.js (نفس المفتاح neom.accounts) */
  function accounts() { return read(K.accounts) || []; }
  function saveAccounts(arr) { write(K.accounts, arr); emit("accounts"); }

  /* -------------------------- orders ----------------------------- */
  function orders() { return list("orders"); }
  function nextOrderNo() {
    let max = 1037;
    orders().forEach((o) => { const m = /(\d+)/.exec(String(o.id || "")); if (m) max = Math.max(max, +m[1]); });
    return "#" + (max + 1);
  }
  function addOrder(o) { return add("orders", o); }

  /* ------------------------- discounts --------------------------- */
  function discounts() { return list("discounts"); }
  function findDiscount(code) {
    if (!code) return null;
    const c = String(code).trim().toUpperCase();
    return discounts().find((d) => String(d.code).trim().toUpperCase() === c) || null;
  }

  /* يحسب الخصم على إجمالي متعدد العملات.
     يُعيد: { ok, reason, discount, amount:{robux,egp,sar} } */
  function applyDiscount(code, subtotal) {
    subtotal = subtotal || { robux: 0, egp: 0, sar: 0 };
    const d = findDiscount(code);
    if (!d) return { ok: false, reason: "notfound" };
    if (d.active === false) return { ok: false, reason: "inactive", discount: d };
    const amount = { robux: 0, egp: 0, sar: 0 };
    if (d.type === "percent") {
      ["robux", "egp", "sar"].forEach((k) => {
        amount[k] = Math.round((subtotal[k] || 0) * (Number(d.value) || 0) / 100);
      });
    } else {
      const v = d.value || {};
      ["robux", "egp", "sar"].forEach((k) => {
        amount[k] = Math.min(Number(v[k]) || 0, subtotal[k] || 0);
      });
    }
    return { ok: true, discount: d, amount };
  }

  /* وصف نصّي مختصر لقيمة الكود (للعرض في السلة/الإدارة) */
  function discountText(d, lang) {
    if (!d) return "";
    const ar = lang !== "en";
    if (d.type === "percent") return (Number(d.value) || 0) + "%";
    const v = d.value || {};
    const c = (NEOM.site && NEOM.site.currency) || { robux: "R$", egp: "ج.م", sar: "ر.س" };
    return `${v.robux || 0} ${c.robux} / ${v.egp || 0} ${c.egp} / ${v.sar || 0} ${c.sar}`;
  }

  NEOM.store = {
    K, VERSION,
    list, get, add, update, remove, persist, nextId,
    accounts, saveAccounts,
    orders, addOrder, nextOrderNo,
    applications: () => list("applications"),
    complaints: () => list("complaints"),
    discounts, findDiscount, applyDiscount, discountText,
  };
})();
