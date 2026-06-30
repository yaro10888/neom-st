/* =========================================================
   Neom Studio — البيانات الأساسية (Seed)
   ---------------------------------------------------------
   هذه هي البيانات «الابتدائية» للموقع. عند أول فتح يتم نسخها
   إلى مخزن دائم في المتصفح (assets/js/store.js)، وبعدها تصبح
   لوحة الإدارة هي مصدر الإضافة/التعديل/الحذف الفعلي. كل العناصر
   ثنائية اللغة { ar, en } وتُحلّ حسب اللغة عبر NEOM.tx().
   ========================================================= */
(function () {
  "use strict";
  const NEOM = (window.NEOM = window.NEOM || {});

  /* helper to resolve a {ar,en} field by current language */
  NEOM.tx = function (field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    const l = (NEOM.i18n && NEOM.i18n.lang) || "ar";
    return field[l] != null ? field[l] : field.ar;
  };

  const av = (n) => `assets/img/avatars/avatar-${String(n).padStart(2, "0")}.svg`;

  /* ---------------------------- MAPS ---------------------------- */
  const maps = [
    { id: "map-1", accent: "#2bd8c6", glyph: "map", images: [], visits: 0, updated: "2026/06/18", link: "", tags: [{ t: "t-new", k: "tag.new" }],
      name: { ar: "مدينة نيوم المستقبلية", en: "Neom Future City" },
      desc: { ar: "مدينة نيون ضخمة بمبانٍ ثلاثية الأبعاد وإضاءة ديناميكية وشوارع حية كاملة التفاصيل.", en: "A massive neon city with 3D buildings, dynamic lighting and fully detailed living streets." } },
    { id: "map-2", accent: "#58b6ff", glyph: "map", images: [], visits: 0, updated: "2026/06/12", link: "", tags: [],
      name: { ar: "جزيرة المغامرة", en: "Adventure Island" },
      desc: { ar: "جزيرة استوائية بمسارات سباحة ونخيل وكهوف سرية ومهام استكشاف ممتعة.", en: "A tropical island with swim trails, palms, secret caves and fun exploration quests." } },
    { id: "map-3", accent: "#9b82ff", glyph: "map", images: [], visits: 0, updated: "2026/05/30", link: "", tags: [{ t: "t-update", k: "tag.update" }],
      name: { ar: "محطة الفضاء أوميغا", en: "Omega Space Station" },
      desc: { ar: "محطة فضائية مدارية بانعدام جاذبية، غرف تحكم، ومناظر للكواكب من النوافذ.", en: "An orbital space station with zero-gravity zones, control rooms and planet views." } },
    { id: "map-4", accent: "#4fd88a", glyph: "map", images: [], visits: 0, updated: "2026/05/22", link: "", tags: [],
      name: { ar: "غابة الأشباح", en: "Haunted Forest" },
      desc: { ar: "غابة ضبابية مليئة بالأسرار والألغاز وأجواء رعب خفيفة مناسبة للجميع.", en: "A misty forest full of secrets, puzzles and light, family-friendly spooky vibes." } },
    { id: "map-5", accent: "#ffcf5a", glyph: "map", images: [], visits: 0, updated: "2026/06/05", link: "", tags: [{ t: "t-new", k: "tag.new" }],
      name: { ar: "حلبة السباق النيون", en: "Neon Racing Circuit" },
      desc: { ar: "حلبة سباقات سريعة بإضاءة نيون، منعطفات صعبة، وخطوط نهاية مثيرة.", en: "A fast neon racing circuit with tough corners and thrilling finish lines." } },
    { id: "map-6", accent: "#ff7eb0", glyph: "map", images: [], visits: 0, updated: "2026/05/15", link: "", tags: [],
      name: { ar: "قرية البكسل", en: "Pixel Village" },
      desc: { ar: "قرية لطيفة بأسلوب بكسل، متاجر صغيرة، وشخصيات قابلة للتفاعل.", en: "A cute pixel-style village with little shops and interactive characters." } },
  ];

  /* --------------------------- SYSTEMS -------------------------- */
  const systems = [
    { id: "sys-1", accent: "#2bd8c6", glyph: "system", images: [], downloads: 0, updated: "2026/06/16", isFree: false, link: "",
      prices: { robux: 250, egp: 120, sar: 25 }, tags: [{ t: "t-update", k: "tag.update" }],
      name: { ar: "نظام الاقتصاد المتكامل", en: "Full Economy System" },
      desc: { ar: "نظام عملات ومتجر وحقيبة وحفظ بيانات اللاعب، جاهز للربط بأي لعبة.", en: "Currency, shop, inventory and player-data saving, ready to plug into any game." },
      features: [{ ar: "حفظ تلقائي لبيانات اللاعب", en: "Automatic player-data saving" }, { ar: "متجر وحقيبة قابلة للتخصيص", en: "Customizable shop & inventory" }, { ar: "كود نظيف ومعلّق بالكامل", en: "Clean, fully-commented code" }] },
    { id: "sys-2", accent: "#4fd88a", glyph: "system", images: [], downloads: 0, updated: "2026/06/10", isFree: true, link: "",
      prices: null, tags: [{ t: "t-new", k: "tag.new" }],
      name: { ar: "نظام الدردشة المخصص", en: "Custom Chat System" },
      desc: { ar: "نظام محادثة بواجهة عصرية، رتب ملونة، وفلترة كلمات تلقائية.", en: "A modern chat UI with colored ranks and automatic word filtering." },
      features: [{ ar: "رتب وألوان قابلة للتعديل", en: "Editable ranks & colors" }, { ar: "فلترة كلمات تلقائية", en: "Automatic word filter" }, { ar: "متجاوب مع الجوال", en: "Mobile responsive" }] },
    { id: "sys-3", accent: "#9b82ff", glyph: "system", images: [], downloads: 0, updated: "2026/05/28", isFree: false, link: "",
      prices: { robux: 400, egp: 200, sar: 40 }, tags: [],
      name: { ar: "نظام القتال المتقدم", en: "Advanced Combat System" },
      desc: { ar: "نظام قتال بضربات متسلسلة، أسلحة، صحة، وتأثيرات بصرية احترافية.", en: "Combat with combos, weapons, health and pro visual effects." },
      features: [{ ar: "ضربات متسلسلة (Combo)", en: "Combo chains" }, { ar: "إدارة أسلحة وصحة", en: "Weapon & health manager" }, { ar: "تأثيرات بصرية جاهزة", en: "Ready-made VFX" }] },
    { id: "sys-4", accent: "#58b6ff", glyph: "system", images: [], downloads: 0, updated: "2026/06/02", isFree: true, link: "",
      prices: null, tags: [],
      name: { ar: "نظام الترحيب والقوائم", en: "Lobby & Menus System" },
      desc: { ar: "شاشة ترحيب، قوائم رئيسية، وإعدادات بأسلوب زجاجي أنيق.", en: "Welcome screen, main menus and settings in a sleek glass style." },
      features: [{ ar: "واجهات زجاجية جاهزة", en: "Ready glass UIs" }, { ar: "حركات انتقال ناعمة", en: "Smooth transitions" }, { ar: "سهل التخصيص", en: "Easy to customize" }] },
    { id: "sys-5", accent: "#ffcf5a", glyph: "system", images: [], downloads: 0, updated: "2026/05/19", isFree: false, link: "",
      prices: { robux: 300, egp: 150, sar: 30 }, tags: [{ t: "t-update", k: "tag.update" }],
      name: { ar: "نظام المهام اليومية", en: "Daily Quests System" },
      desc: { ar: "مهام يومية وأسبوعية مع مكافآت وتتبّع تقدّم اللاعب تلقائيًا.", en: "Daily & weekly quests with rewards and automatic progress tracking." },
      features: [{ ar: "مهام يومية وأسبوعية", en: "Daily & weekly quests" }, { ar: "نظام مكافآت مرن", en: "Flexible rewards" }, { ar: "تتبّع تقدّم تلقائي", en: "Auto progress tracking" }] },
    { id: "sys-6", accent: "#ff7eb0", glyph: "system", images: [], downloads: 0, updated: "2026/05/11", isFree: true, link: "",
      prices: null, tags: [],
      name: { ar: "نظام الإشعارات", en: "Notifications System" },
      desc: { ar: "إشعارات منبثقة أنيقة مع أصوات وأنواع متعددة (نجاح/خطأ/تنبيه).", en: "Elegant pop notifications with sounds and multiple types (ok/error/alert)." },
      features: [{ ar: "أنواع إشعارات متعددة", en: "Multiple notification types" }, { ar: "أصوات قابلة للتبديل", en: "Toggleable sounds" }, { ar: "خفيف وسريع", en: "Light & fast" }] },
  ];

  /* --------------------------- COURSES -------------------------- */
  const courses = [
    { id: "crs-1", accent: "#2bd8c6", glyph: "course", images: [], students: 0, lessons: 18, duration: "4h 30m", updated: "2026/06/14", isFree: true, link: "",
      level: { ar: "مبتدئ", en: "Beginner" }, prices: null, tags: [{ t: "t-course", k: "tag.course" }],
      name: { ar: "أساسيات Roblox Studio", en: "Roblox Studio Basics" },
      desc: { ar: "ابدأ من الصفر: الواجهة، الأدوات، وبناء أول عالم لك خطوة بخطوة.", en: "Start from zero: the interface, tools and building your first world step by step." },
      features: [{ ar: "18 درس فيديو", en: "18 video lessons" }, { ar: "ملفات مشاريع جاهزة", en: "Project files included" }, { ar: "شهادة إتمام", en: "Completion certificate" }] },
    { id: "crs-2", accent: "#9b82ff", glyph: "course", images: [], students: 0, lessons: 24, duration: "6h 10m", updated: "2026/06/08", isFree: false, link: "",
      level: { ar: "متوسط", en: "Intermediate" }, prices: { robux: 500, egp: 250, sar: 50 }, tags: [{ t: "t-course", k: "tag.course" }],
      name: { ar: "برمجة Lua الاحترافية", en: "Pro Lua Scripting" },
      desc: { ar: "تعمّق في لغة Lua: المتغيرات، الدوال، الأحداث، وبناء أنظمة كاملة.", en: "Dive into Lua: variables, functions, events and building full systems." },
      features: [{ ar: "24 درس عملي", en: "24 hands-on lessons" }, { ar: "تمارين وتحديات", en: "Exercises & challenges" }, { ar: "دعم في المنتدى", en: "Forum support" }] },
    { id: "crs-3", accent: "#58b6ff", glyph: "course", images: [], students: 0, lessons: 20, duration: "5h 00m", updated: "2026/05/26", isFree: false, link: "",
      level: { ar: "متقدّم", en: "Advanced" }, prices: { robux: 650, egp: 320, sar: 65 }, tags: [{ t: "t-course", k: "tag.course" }],
      name: { ar: "تصميم واجهات الألعاب (UI)", en: "Game UI Design" },
      desc: { ar: "صمّم واجهات احترافية: التخطيط، الألوان، الحركات، وتجربة المستخدم.", en: "Design pro UIs: layout, color, motion and user experience." },
      features: [{ ar: "20 درس تصميم", en: "20 design lessons" }, { ar: "مكتبة عناصر جاهزة", en: "Ready component library" }, { ar: "أمثلة واقعية", en: "Real-world examples" }] },
    { id: "crs-4", accent: "#4fd88a", glyph: "course", images: [], students: 0, lessons: 15, duration: "3h 40m", updated: "2026/06/01", isFree: true, link: "",
      level: { ar: "مبتدئ", en: "Beginner" }, prices: null, tags: [{ t: "t-course", k: "tag.course" }],
      name: { ar: "نشر وتسويق لعبتك", en: "Publish & Market Your Game" },
      desc: { ar: "تعلّم كيف تنشر لعبتك، تجذب اللاعبين، وتحقّق دخلًا منها.", en: "Learn how to publish your game, attract players and earn from it." },
      features: [{ ar: "15 درس مركّز", en: "15 focused lessons" }, { ar: "استراتيجيات تسويق", en: "Marketing strategies" }, { ar: "نصائح تحقيق الدخل", en: "Monetization tips" }] },
  ];

  /* ---------------------------- NEWS ---------------------------- */
  const news = [
    { id: "news-1", date: "2026/06/20", tag: { t: "t-update", k: "tag.update" },
      title: { ar: "تحديث جديد للأنظمة", en: "New systems update" },
      desc: { ar: "تم إضافة أنظمة جديدة وتحسينات للأداء.", en: "New systems added with performance improvements." } },
    { id: "news-2", date: "2026/06/15", tag: { t: "t-contest", k: "tag.contest" },
      title: { ar: "مسابقة تصميم مابات", en: "Map design contest" },
      desc: { ar: "شارك في مسابقة المابات واربح جوائز قيّمة.", en: "Join the map contest and win valuable prizes." } },
    { id: "news-3", date: "2026/06/10", tag: { t: "t-course", k: "tag.course" },
      title: { ar: "دورة تعليمية جديدة", en: "New learning course" },
      desc: { ar: "تعلم أساسيات البرمجة في Roblox Studio.", en: "Learn programming basics in Roblox Studio." } },
  ];

  /* ------------------------ FORUM CATEGORIES -------------------- */
  /* compact rows shown in the home "forum" panel — realistic numbers */
  const forumCats = [
    { id: "cat-1", icon: "forum",   topics: 0, replies: 0,
      title: { ar: "أخبار إعلانات الاستديو", en: "Studio announcements" },
      desc: { ar: "آخر الأخبار والتحديثات الرسمية", en: "Latest official news and updates" } },
    { id: "cat-2", icon: "info",    topics: 0, replies: 0,
      title: { ar: "مساعدة و دعم", en: "Help & support" },
      desc: { ar: "احصل على المساعدة من فريق الدعم والمجتمع", en: "Get help from the team and community" } },
    { id: "cat-3", icon: "sparkle", topics: 0, replies: 0,
      title: { ar: "اقتراحات و أفكار", en: "Suggestions & ideas" },
      desc: { ar: "شارك أفكارك واقتراحاتك لتطوير الاستديو", en: "Share ideas to improve the studio" } },
  ];

  /* --------------------------- FORUM POSTS ---------------------- */
  const REACT_SET = ["❤️", "😂", "🔥", "😍", "👍", "👏", "😮"];
  const r = (a, b, c, d, e, f, g) => ({ "❤️": a, "😂": b, "🔥": c, "😍": d, "👍": e, "👏": f, "😮": g });

  /* إعلانات رسمية من فريق الاستديو فقط، بأرقام واقعية لاستديو في بدايته */
  const posts = [
    { id: "post-1", accent: "#2bd8c6", glyph: "bell", date: "2026/06/21", views: 0, replies: 0,
      author: { name: "فريق نيوم", avatar: av(1) },
      tags: [{ t: "t-news", k: "tag.ann" }, { t: "t-new", k: "tag.new" }],
      title: { ar: "إطلاق الموسم الجديد من نيوم ستوديو!", en: "Neom Studio new season is live!" },
      excerpt: { ar: "يسعدنا الإعلان عن الموسم الجديد بمابات وأنظمة ودورات حصرية. اطّلع على كل التفاصيل وشاركنا رأيك في التعليقات.", en: "We're thrilled to announce the new season with exclusive maps, systems and courses. Check the details and share your thoughts." },
      reacts: r(0, 0, 0, 0, 0, 0, 0) },
    { id: "post-2", accent: "#4fd88a", glyph: "system", images: [], date: "2026/06/15", views: 0, replies: 0,
      author: { name: "فريق نيوم", avatar: av(1) },
      tags: [{ t: "t-update", k: "tag.update" }],
      title: { ar: "تحديث نظام الاقتصاد للإصدار 2.0", en: "Economy system v2.0 update" },
      excerpt: { ar: "إصدار جديد بميزات حفظ أسرع، واجهة متجر محسّنة، وإصلاحات لعدة مشاكل. حمّل التحديث الآن من صفحة الأنظمة.", en: "A new release with faster saving, an improved shop UI and several bug fixes. Grab it from the systems page." },
      reacts: r(0, 0, 0, 0, 0, 0, 0) },
    { id: "post-3", accent: "#ffcf5a", glyph: "star", date: "2026/06/09", views: 0, replies: 0,
      author: { name: "فريق نيوم", avatar: av(1) },
      tags: [{ t: "t-contest", k: "tag.contest" }],
      title: { ar: "انطلاق مسابقة تصميم المابات", en: "Map design contest is open" },
      excerpt: { ar: "ابدأ بتصميم مابك وشارك في المسابقة لتفوز بجوائز قيّمة وفرصة لعرض عملك على الصفحة الرئيسية. التفاصيل بالداخل.", en: "Start designing your map and join the contest to win prizes and get featured on the homepage. Details inside." },
      reacts: r(0, 0, 0, 0, 0, 0, 0) },
  ];

  /* -------------------- USERS (login autocomplete) -------------- */
  /* في الوضع المحلي تأتي اقتراحات الدخول من البريد المستخدم فعليًا على
     هذا الجهاز (knownEmails). نبدأ بقائمة فارغة — لا مستخدمين وهميين. */
  const users = [];

  NEOM.data = { maps, systems, courses, news, forumCats, posts, users, REACT_SET, av };
})();
