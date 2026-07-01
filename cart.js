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

  /* يزيد عدّادًا (زيارات/تحميلات) بهدوء دون إطلاق حدث إعادة الرسم */
  function incrSilent(name, id, field, by) {
    const a = list(name); const i = a.findIndex((x) => x.id === id);
    if (i < 0) return;
    a[i][field] = (a[i][field] || 0) + (by || 1);
    write(K[name], a);
    if (name in data) data[name] = a;
  }

  /* =============================== MEDIA =============================== */
  /* مكتبة الصور: صور رمزية للحسابات (مع تفعيل/إيقاف) + شعارات (مع اختيار النشط) */
  const MEDIA_KEY = "neom.media";
  function defaultMedia() {
    const avs = [];
    for (let i = 1; i <= 10; i++)
      avs.push({ id: "av-" + i, src: "assets/img/avatars/avatar-" + String(i).padStart(2, "0") + ".svg", label: "Avatar " + i, enabled: true, builtin: true });
    return { avatars: avs, logos: [{ id: "logo-1", src: "assets/img/logo.svg", label: "الشعار الأساسي", active: true, builtin: true }] };
  }
  function media() {
    let m = null;
    try { m = JSON.parse(localStorage.getItem(MEDIA_KEY)); } catch (e) {}
    if (!m || !Array.isArray(m.avatars) || !Array.isArray(m.logos)) { m = defaultMedia(); saveMedia(m); }
    return m;
  }
  function saveMedia(m) {
    try { localStorage.setItem(MEDIA_KEY, JSON.stringify(m)); } catch (e) { return false; }
    emit("media"); return true;
  }
  function enabledAvatars() { return media().avatars.filter((a) => a.enabled); }
  function avatarSrc(idOrIndex) {
    const m = media();
    // يقبل رقمًا (1..N) أو معرّفًا (av-3) أو مسارًا جاهزًا
    if (typeof idOrIndex === "string" && idOrIndex.indexOf("/") >= 0) return idOrIndex;
    let a = m.avatars.find((x) => x.id === ("av-" + idOrIndex) || x.id === idOrIndex);
    if (!a && typeof idOrIndex === "number") a = m.avatars[idOrIndex - 1];
    return (a && a.src) || m.avatars[0].src;
  }
  function activeLogo() { const l = media().logos.find((x) => x.active); return (l && l.src) || "assets/img/logo.svg"; }

  /* ========================= ROLES / PERMISSIONS ====================== */
  const PERMS_KEY = "neom.perms";
  const PERM_CATALOG = [
    { k: "content.create", ar: "إضافة المحتوى (مابات/أنظمة/دورات)" },
    { k: "content.edit", ar: "تعديل المحتوى" },
    { k: "content.delete", ar: "حذف المحتوى" },
    { k: "discounts.manage", ar: "إدارة أكواد الخصم" },
    { k: "posts.manage", ar: "إدارة منشورات المنتدى" },
    { k: "orders.manage", ar: "إدارة الطلبات" },
    { k: "players.manage", ar: "إدارة اللاعبين (تغيير الرتبة/الحذف)" },
    { k: "applications.view", ar: "متابعة طلبات الانضمام" },
    { k: "complaints.view", ar: "متابعة الشكاوى والاقتراحات" },
    { k: "media.manage", ar: "إدارة مكتبة الوسائط" },
    { k: "settings.manage", ar: "تعديل إعدادات الموقع" },
    { k: "roles.manage", ar: "تعديل الرتب والصلاحيات" },
    { k: "store.purchase", ar: "الشراء من المتجر" },
    { k: "forum.participate", ar: "المشاركة في المنتدى" },
    { k: "apply.submit", ar: "إرسال طلب انضمام" },
  ];
  function defaultPerms() {
    const all = PERM_CATALOG.map((p) => p.k);
    return {
      owner: all.slice(),
      admin: ["content.create", "content.edit", "content.delete", "discounts.manage", "posts.manage", "orders.manage", "applications.view", "complaints.view", "media.manage", "store.purchase", "forum.participate", "apply.submit"],
      member: ["store.purchase", "forum.participate", "apply.submit"],
    };
  }
  function perms() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem(PERMS_KEY)); } catch (e) {}
    if (!p || !Array.isArray(p.owner)) { p = defaultPerms(); savePerms(p); }
    p.owner = PERM_CATALOG.map((x) => x.k); // المالك يملك كل شيء دائمًا
    return p;
  }
  function savePerms(p) { try { localStorage.setItem(PERMS_KEY, JSON.stringify(p)); } catch (e) {} emit("perms"); }
  function hasPerm(role, key) {
    if (role === "owner") return true;
    const p = perms();
    return !!(p[role] && p[role].indexOf(key) >= 0);
  }
  function togglePerm(role, key, on) {
    if (role === "owner") return; // صلاحيات المالك ثابتة
    const p = perms();
    if (!Array.isArray(p[role])) p[role] = [];
    const i = p[role].indexOf(key);
    if (on && i < 0) p[role].push(key);
    if (!on && i >= 0) p[role].splice(i, 1);
    savePerms(p);
  }

  /* =============================== FLAGS ============================== */
  /* إعدادات الموقع (تُتحكم من لوحة الإدارة وتؤثر على الواجهة فورًا) */
  const FLAGS_KEY = "neom.flags";
  function defaultFlags() { return { registrationOpen: true, applyOpen: true, maintenance: false }; }
  function flags() {
    let f = {};
    try { f = JSON.parse(localStorage.getItem(FLAGS_KEY)) || {}; } catch (e) { f = {}; }
    return Object.assign(defaultFlags(), (NEOM.site && NEOM.site.flags) || {}, f);
  }
  function setFlag(k, v) {
    const f = flags(); f[k] = v;
    try { localStorage.setItem(FLAGS_KEY, JSON.stringify(f)); } catch (e) {}
    if (NEOM.site && NEOM.site.flags) NEOM.site.flags[k] = v;
    emit("flags");
  }

  NEOM.store = {
    K, VERSION,
    list, get, add, update, remove, persist, nextId, incrSilent,
    accounts, saveAccounts,
    orders, addOrder, nextOrderNo,
    applications: () => list("applications"),
    complaints: () => list("complaints"),
    discounts, findDiscount, applyDiscount, discountText,
    media, saveMedia, enabledAvatars, avatarSrc, activeLogo,
    PERM_CATALOG, perms, savePerms, hasPerm, togglePerm,
    flags, setFlag,
  };
})();
