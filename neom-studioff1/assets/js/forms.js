/* =========================================================
   Neom Studio — Forms (apply + complaints) — UI prototype
   Live character counters, front-end validation and a demo
   submit (toast + reset). A real backend would persist these
   into the `applications` / `complaints` tables (spec Part 4).
   ========================================================= */
(function () {
  "use strict";
  const NEOM = window.NEOM;
  if (!NEOM) return;
  const ar = () => NEOM.i18n.lang === "ar";
  const DB = () => window.NEOM_DB || null;

  /* --------------------------- helpers --------------------------- */
  const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };
  const fieldOf = (id) => {
    const el = document.getElementById(id);
    return el ? el.closest(".field") : null;
  };
  function setErr(field, on, msg) {
    if (!field) return;
    field.classList.toggle("invalid", on);
    const e = field.querySelector(".err");
    if (e && msg) e.textContent = msg;
  }
  const isPhone = (s) => /^[0-9+\-\s]{8,}$/.test(s);

  /* ----------------- live character counters ----------------- */
  function wireCounters(scope) {
    scope.querySelectorAll("textarea[maxlength]").forEach((ta) => {
      const max = parseInt(ta.getAttribute("maxlength"), 10);
      const out = ta.closest(".field")?.querySelector(".char-count");
      if (!out) return;
      const upd = () => {
        const n = ta.value.length;
        out.textContent = n + " / " + max;
        out.classList.toggle("warn", n > max * 0.85);
      };
      ta.addEventListener("input", upd);
      upd();
    });
  }

  /* -------------------------- APPLY -------------------------- */
  function initApply(form) {
    wireCounters(form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      const need = (id, cond, msg) => {
        const bad = !cond;
        setErr(fieldOf(id), bad, msg);
        if (bad) ok = false;
      };
      need("appName", val("appName").length >= 2, ar() ? "الاسم مطلوب" : "Name is required");
      need("appReason", val("appReason").length >= 20, ar() ? "اكتب 20 حرفًا على الأقل" : "Write at least 20 characters");
      need("appExp", val("appExp").length >= 1, ar() ? "هذا الحقل مطلوب" : "This field is required");
      need("appWhatsapp", isPhone(val("appWhatsapp")), ar() ? "رقم واتساب غير صحيح" : "Invalid WhatsApp number");
      const role = document.getElementById("appRole");
      need("appRole", role && role.value, ar() ? "اختر المجال" : "Choose a role");

      if (!ok) {
        NEOM.toast(ar() ? "يرجى تصحيح الحقول المميزة" : "Please fix the highlighted fields", "err");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        if (DB()) {
          const { error } = await DB().from("applications").insert({
            name: val("appName"),
            role: role ? role.value : "",
            reason: val("appReason"),
            experience: val("appExp"),
            whatsapp: val("appWhatsapp"),
            discord: val("appDiscord"),
          });
          if (error) { NEOM.toast(ar() ? "تعذّر إرسال الطلب، حاول مجددًا" : "Couldn't send the application", "err"); return; }
        } else if (NEOM.store) {
          // الوضع المحلي: احفظ الطلب ليظهر في لوحة الإدارة → طلبات الانضمام
          NEOM.store.add("applications", {
            id: "app-" + Date.now(),
            name: val("appName"),
            role: role ? role.value : "",
            reason: val("appReason"),
            experience: val("appExp"),
            whatsapp: val("appWhatsapp"),
            discord: val("appDiscord"),
            status: "جديد",
            date: new Date().toLocaleDateString("en-CA").replace(/-/g, "/"),
          });
        }
        NEOM.toast(ar() ? "تم إرسال طلبك بنجاح! سنتواصل معك قريبًا" : "Application sent! We'll reach out soon", "ok");
        form.reset();
        wireCounters(form);
      } catch (err) {
        NEOM.toast(ar() ? "حدث خطأ غير متوقع" : "Unexpected error", "err");
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

  /* ------------------------ COMPLAINTS ----------------------- */
  function initComplaint(form) {
    wireCounters(form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      const need = (id, cond, msg) => {
        const bad = !cond;
        setErr(fieldOf(id), bad, msg);
        if (bad) ok = false;
      };
      const type = document.getElementById("cType");
      need("cType", type && type.value, ar() ? "اختر النوع" : "Choose a type");
      need("cTitle", val("cTitle").length >= 3, ar() ? "العنوان مطلوب" : "Title is required");
      need("cDesc", val("cDesc").length >= 15, ar() ? "اكتب 15 حرفًا على الأقل" : "Write at least 15 characters");
      if (val("cWhatsapp")) need("cWhatsapp", isPhone(val("cWhatsapp")), ar() ? "رقم واتساب غير صحيح" : "Invalid WhatsApp number");

      if (!ok) {
        NEOM.toast(ar() ? "يرجى تصحيح الحقول المميزة" : "Please fix the highlighted fields", "err");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      try {
        if (DB()) {
          const { error } = await DB().from("complaints").insert({
            type: type ? type.value : "",
            title: val("cTitle"),
            description: val("cDesc"),
            whatsapp: val("cWhatsapp"),
          });
          if (error) { NEOM.toast(ar() ? "تعذّر إرسال الرسالة، حاول مجددًا" : "Couldn't send the message", "err"); return; }
        } else if (NEOM.store) {
          // الوضع المحلي: احفظ الرسالة لتظهر في لوحة الإدارة → الشكاوى
          NEOM.store.add("complaints", {
            id: "cmp-" + Date.now(),
            type: type ? type.value : "",
            title: val("cTitle"),
            description: val("cDesc"),
            whatsapp: val("cWhatsapp"),
            status: "جديد",
            date: new Date().toLocaleDateString("en-CA").replace(/-/g, "/"),
          });
        }
        NEOM.toast(ar() ? "تم استلام رسالتك، شكرًا لك!" : "Your message was received, thank you!", "ok");
        form.reset();
        wireCounters(form);
      } catch (err) {
        NEOM.toast(ar() ? "حدث خطأ غير متوقع" : "Unexpected error", "err");
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }

  function init() {
    const apply = document.getElementById("applyForm");
    const comp = document.getElementById("complaintForm");
    if (apply) initApply(apply);
    if (comp) initComplaint(comp);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
