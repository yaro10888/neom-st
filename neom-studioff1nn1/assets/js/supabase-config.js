/* =========================================================
   Neom Studio — إعدادات Supabase
   ---------------------------------------------------------
   غيّر القيمتين اللي تحت بس (الرابط والمفتاح) اللي نسختهم من:
   Supabase Dashboard → Settings → API

   1) SUPABASE_URL      = الـ "Project URL"
   2) SUPABASE_ANON_KEY = مفتاح "anon public" (الطويل اللي بيبدأ بـ eyJ...)

   ⚠️ ممنوع تحط هنا مفتاح "service_role" — ده سري وللسيرفر فقط.
   ========================================================= */

/* ---------------------------------------------------------
   وضع التشغيل:
   - false  ➜  الموقع يشتغل فورًا «محليًا» (يحفظ في المتصفح): التسجيل،
              الدخول، الطلبات، لوحة الإدارة، الكوبونات… كلها تعمل بدون
              أي إعداد سيرفر. (هذا هو الوضع الافتراضي الموصى به للتجربة)
   - true   ➜  يفعّل الاتصال الحقيقي بـ Supabase. فعّله فقط بعد أن:
              (1) تشغّل سكربت قاعدة البيانات في SQL Editor،
              (2) توقف خيار «Confirm email» من Authentication.
   --------------------------------------------------------- */
window.NEOM_USE_SUPABASE = false;

window.SUPABASE_URL = "https://jrihosicxsdxcsvdogrv.supabase.co";

window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyaWhvc2ljeHNkeGNzdmRvZ3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTY1NDQsImV4cCI6MjA5ODEzMjU0NH0.gAt6XDGbYIonjZPejPiPhQguDzNYvtqiQkkz0bR8k1E";
/* ---------------------------------------------------------
   التهيئة (تشتغل تلقائيًا فقط لو حمّلت مكتبة Supabase من CDN).
   لتفعيل الاتصال لاحقًا، ضِف هذا السطر في <head> الصفحات قبل هذا الملف:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   --------------------------------------------------------- */
(function () {
  "use strict";
  if (window.NEOM_USE_SUPABASE !== true) {
    // الوضع المحلي مفعّل — لا ننشئ عميل Supabase، وكل شيء يُحفظ في المتصفح.
    console.log("[Neom] الوضع المحلي مفعّل ✅ (كل البيانات تُحفظ في متصفحك)");
    return;
  }
  if (!window.supabase || !window.supabase.createClient) {
    // المكتبة لسه مش متحمّلة — هتتفعّل أول ما تضيف سطر الـ CDN فوق.
    return;
  }
  if (!window.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY.indexOf("eyJ") !== 0) {
    console.warn("[Neom] لسه محطّتش مفتاح anon الصحيح في supabase-config.js");
    return;
  }
  // عميل Supabase جاهز للاستخدام في باقي الموقع باسم: window.NEOM_DB
  window.NEOM_DB = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  console.log("[Neom] Supabase متصل ✅");
})();
