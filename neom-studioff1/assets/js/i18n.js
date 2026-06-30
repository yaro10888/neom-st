/* =========================================================
   Neom Studio — i18n (AR / EN), instant switch, no reload
   ========================================================= */
(function () {
  "use strict";

  const dict = {
    ar: {
      "nav.home": "الرئيسية", "nav.maps": "المابات", "nav.systems": "الأنظمة",
      "nav.courses": "دورات التعليم", "nav.apply": "تقديم", "nav.forum": "المنتدى",
      "nav.complaints": "الشكوى و الاقتراحات", "nav.profile": "الملف الشخصي",
      "nav.login": "تسجيل دخول", "nav.admin": "الإدارة",

      "btn.login": "تسجيل دخول", "btn.register": "صنع حساب جديد", "btn.viewAll": "عرض الكل",
      "btn.viewMaps": "عرض المابات", "btn.viewSystems": "عرض الأنظمة", "btn.viewCourses": "عرض الدورات",
      "btn.adminPanel": "لوحة الإدارة", "btn.sendComplaint": "إرسال شكوى", "btn.applyNow": "تقديم الآن",
      "btn.details": "عرض التفاصيل", "btn.buy": "شراء", "btn.download": "تحميل", "btn.enterMap": "الدخول إلى الماب",
      "btn.addCart": "إضافة للسلة", "btn.submit": "إرسال", "btn.save": "حفظ التغييرات", "btn.back": "رجوع للرئيسية",

      "hero.eyebrow": "مرحباً بك في",
      "hero.desc": "استديو Roblox متكامل يقدم لك أفضل المابات، الأنظمة، والتعلم لتطوير تجربتك الإبداعية!",

      "f.maps.t": "المابات", "f.maps.d": "استعرض جميع مابات الاستديو",
      "f.systems.t": "الأنظمة", "f.systems.d": "اكتشف الأنظمة المجانية والمدفوعة",
      "f.courses.t": "دورات التعليم", "f.courses.d": "تعلم وطور مهاراتك مع دوراتنا",
      "f.admin.t": "الإدارة", "f.admin.d": "لوحة تحكم شاملة للإدارة",
      "f.complaints.t": "الشكوى و الاقتراحات", "f.complaints.d": "شاركنا رأيك لتحسين تجربتك",

      "p.news": "أخبار الاستديو", "p.forum": "المنتدى",
      "join.tag": "جديد", "join.t": "تريد الانضمام لفريق الإدارة؟",
      "join.d": "قدّم طلبك الآن للانضمام إلى فريقنا المبدع",

      "w.views": "مشاهدة", "w.replies": "رد", "w.topics": "موضوع", "w.lastUpdate": "آخر تحديث",
      "w.visits": "زيارة", "w.lessons": "درس", "w.duration": "المدة", "w.free": "مجاني",
      "w.search": "ابحث...", "w.newest": "الأحدث", "w.oldest": "الأقدم", "w.mostViewed": "الأكثر مشاهدة",
      "w.mostReacted": "الأكثر تفاعلاً", "w.all": "الكل", "w.lang": "العربية",
      "w.downloads": "تحميل", "w.students": "طالب", "w.level": "المستوى",
      "w.noResults": "لا توجد نتائج مطابقة لبحثك", "w.results": "نتيجة", "w.from": "من",
      "tag.new": "جديد", "tag.update": "تحديث", "tag.contest": "مسابقة", "tag.course": "دورة",
      "tag.ann": "إعلان", "tag.ask": "سؤال", "tag.news": "أخبار",
      "btn.enter": "الدخول إلى الماب", "btn.enroll": "اشترك في الدورة", "btn.start": "ابدأ التعلّم",
      "cart.added": "تمت الإضافة إلى السلة", "cart.title": "سلة المشتريات", "cart.empty": "سلتك فارغة حاليًا",
      "cart.total": "الإجمالي", "cart.checkout": "إتمام الشراء", "cart.remove": "حذف",
      "cart.promo": "كود الخصم", "cart.promoPh": "أدخل كود الخصم هنا", "cart.apply": "تطبيق",
      "cart.subtotal": "المجموع الفرعي", "cart.discountLabel": "الخصم", "cart.removeCode": "إزالة الكود",
      "cart.invalid": "كود الخصم غير صحيح", "cart.inactive": "هذا الكود غير مُفعّل حاليًا",
      "cart.applied": "تم تطبيق الكود بنجاح", "cart.emptyCode": "اكتب كود الخصم أولًا",
      "filt.all": "الكل", "filt.free": "مجاني", "filt.paid": "مدفوع",
      "react.title": "التفاعلات", "auth.or": "أو",
      "footer.rights": "جميع الحقوق محفوظة", "footer.follow": "تابعنا على",

      "h.maps.t": "المابات", "h.maps.d": "استعرض جميع مابات الاستديو، شاهد التفاصيل وادخل مباشرة إلى عالمك المفضل.",
      "h.systems.t": "الأنظمة", "h.systems.d": "أنظمة جاهزة لـ Roblox Studio، مجانية ومدفوعة، بأسعار بالروبوكس والجنيه والريال.",
      "h.courses.t": "دورات التعليم", "h.courses.d": "تعلّم تطوير ألعاب Roblox من الصفر مع دورات احترافية بمستويات متدرجة.",
      "h.forum.t": "المنتدى", "h.forum.d": "آخر الأخبار والإعلانات والنقاشات، تفاعل مع المنشورات وشاركنا رأيك.",
      "h.apply.t": "التقديم لفريق الإدارة", "h.apply.d": "انضم إلى فريق Neom Studio المبدع، املأ النموذج بعناية وسنتواصل معك.",
      "h.complaints.t": "الشكاوى و الاقتراحات", "h.complaints.d": "رأيك يهمنا، أرسل شكوى أو اقتراحًا وسنراجعه في أقرب وقت.",
      "h.profile.t": "الملف الشخصي", "h.profile.d": "بياناتك، رتبتك، وإعدادات حسابك في مكان واحد.",
    },
    en: {
      "nav.home": "Home", "nav.maps": "Maps", "nav.systems": "Systems",
      "nav.courses": "Courses", "nav.apply": "Apply", "nav.forum": "Forum",
      "nav.complaints": "Support", "nav.profile": "Profile",
      "nav.login": "Sign in", "nav.admin": "Admin",

      "btn.login": "Sign in", "btn.register": "Create account", "btn.viewAll": "View all",
      "btn.viewMaps": "View maps", "btn.viewSystems": "View systems", "btn.viewCourses": "View courses",
      "btn.adminPanel": "Admin panel", "btn.sendComplaint": "Send message", "btn.applyNow": "Apply now",
      "btn.details": "View details", "btn.buy": "Buy", "btn.download": "Download", "btn.enterMap": "Enter map",
      "btn.addCart": "Add to cart", "btn.submit": "Submit", "btn.save": "Save changes", "btn.back": "Back home",

      "hero.eyebrow": "Welcome to",
      "hero.desc": "A complete Roblox studio bringing you the best maps, systems, and learning to grow your creative work.",

      "f.maps.t": "Maps", "f.maps.d": "Browse every studio map",
      "f.systems.t": "Systems", "f.systems.d": "Discover free and paid systems",
      "f.courses.t": "Courses", "f.courses.d": "Learn and level up your skills",
      "f.admin.t": "Admin", "f.admin.d": "A full management control panel",
      "f.complaints.t": "Support", "f.complaints.d": "Share feedback to improve your experience",

      "p.news": "Studio news", "p.forum": "Forum",
      "join.tag": "New", "join.t": "Want to join the team?",
      "join.d": "Apply now to join our creative crew",

      "w.views": "views", "w.replies": "replies", "w.topics": "topics", "w.lastUpdate": "Updated",
      "w.visits": "visits", "w.lessons": "lessons", "w.duration": "Duration", "w.free": "Free",
      "w.search": "Search...", "w.newest": "Newest", "w.oldest": "Oldest", "w.mostViewed": "Most viewed",
      "w.mostReacted": "Most reacted", "w.all": "All", "w.lang": "English",
      "w.downloads": "downloads", "w.students": "students", "w.level": "Level",
      "w.noResults": "No results match your search", "w.results": "results", "w.from": "of",
      "tag.new": "New", "tag.update": "Update", "tag.contest": "Contest", "tag.course": "Course",
      "tag.ann": "Announcement", "tag.ask": "Question", "tag.news": "News",
      "btn.enter": "Enter map", "btn.enroll": "Enroll", "btn.start": "Start learning",
      "cart.added": "Added to cart", "cart.title": "Shopping cart", "cart.empty": "Your cart is empty",
      "cart.total": "Total", "cart.checkout": "Checkout", "cart.remove": "Remove",
      "cart.promo": "Discount code", "cart.promoPh": "Enter discount code", "cart.apply": "Apply",
      "cart.subtotal": "Subtotal", "cart.discountLabel": "Discount", "cart.removeCode": "Remove code",
      "cart.invalid": "Invalid discount code", "cart.inactive": "This code is currently inactive",
      "cart.applied": "Code applied successfully", "cart.emptyCode": "Type a discount code first",
      "filt.all": "All", "filt.free": "Free", "filt.paid": "Paid",
      "react.title": "Reactions", "auth.or": "or",
      "footer.rights": "All rights reserved", "footer.follow": "Follow us",

      "h.maps.t": "Maps", "h.maps.d": "Browse every studio map, view the details and jump straight into your favourite world.",
      "h.systems.t": "Systems", "h.systems.d": "Ready-made Roblox Studio systems, free and paid, priced in Robux, EGP and SAR.",
      "h.courses.t": "Courses", "h.courses.d": "Learn Roblox game development from scratch with professional, leveled courses.",
      "h.forum.t": "Forum", "h.forum.d": "Latest news, announcements and discussions — react to posts and share your thoughts.",
      "h.apply.t": "Apply to the team", "h.apply.d": "Join the Neom Studio crew. Fill the form carefully and we'll reach out.",
      "h.complaints.t": "Support & ideas", "h.complaints.d": "Your voice matters. Send a complaint or suggestion and we'll review it soon.",
      "h.profile.t": "Profile", "h.profile.d": "Your data, rank, and account settings in one place.",
    },
  };

  const KEY = "neom.lang";
  let lang = localStorage.getItem(KEY) || "ar";

  const t = (k) => (dict[lang] && dict[lang][k]) || (dict.ar[k]) || k;

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.style.direction = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    document.querySelectorAll("[data-i18n-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-label")));
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  function setLang(l) {
    lang = l;
    localStorage.setItem(KEY, l);
    apply();
  }
  function toggle() { setLang(lang === "ar" ? "en" : "ar"); }

  window.NEOM = window.NEOM || {};
  window.NEOM.i18n = { get lang() { return lang; }, t, apply, setLang, toggle, dict };
})();
