/* =========================================================
   Neom Studio — Auth (register + login) — LIVE
   - Real accounts via Supabase when configured (window.NEOM_DB).
   - Instant sign-up: NO email code / OTP. The moment the name,
     email and WhatsApp are confirmed unique, the account is
     created and the user is signed in.
   - Falls back to a local store if Supabase isn't connected yet,
     so the site still works for preview.
   ========================================================= */
(function () {
  "use strict";
  const NEOM = window.NEOM;
  if (!NEOM) return;
  const DB = () => window.NEOM_DB || null;
  const ic = (n) => NEOM.icons[n] || "";
  const ar = () => NEOM.i18n.lang === "ar";

  /* --------------------------- helpers --------------------------- */
  function setErr(field, on, msg) {
    if (!field) return;
    field.classList.toggle("invalid", on);
    const e = field.querySelector(".err");
    if (e && msg) e.textContent = msg;
  }
  const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };
  const fieldOf = (id) => {
    const el = document.getElementById(id);
    return el ? el.closest(".field") : null;
  };
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const isPhone = (s) => /^[0-9+\-\s]{8,}$/.test(s);

  // remember emails used on this device (Discord/Steam-style autocomplete)
  function knownEmails() {
    try { return JSON.parse(localStorage.getItem("neom.knownEmails")) || []; }
    catch (e) { return []; }
  }
  function rememberEmail(email) {
    const list = knownEmails().filter((e) => e !== email);
    list.unshift(email);
    localStorage.setItem("neom.knownEmails", JSON.stringify(list.slice(0, 6)));
  }

  // local fallback account store (only used when Supabase isn't connected)
  function localAccounts() {
    try { return JSON.parse(localStorage.getItem("neom.accounts")) || []; }
    catch (e) { return []; }
  }
  function saveLocalAccount(acc) {
    const list = localAccounts();
    list.push(acc);
    localStorage.setItem("neom.accounts", JSON.stringify(list));
  }

  function finishLogin(session) {
    NEOM.setSession(session);
    if (session.email) rememberEmail(session.email);
    NEOM.toast(ar() ? "تم الدخول بنجاح! جارٍ تحويلك…" : "Signed in! Redirecting…", "ok");
    setTimeout(() => (location.href = "profile.html"), 900);
  }

  /* ========================== REGISTER ========================== */
  function initRegister(form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      const need = (id, cond, msg) => {
        const bad = !cond;
        setErr(fieldOf(id), bad, msg);
        if (bad) ok = false;
      };
      const name = val("regName"), email = val("regEmail"), pass = val("regPass");
      const phone = val("regPhone");
      need("regName", name.length >= 2, ar() ? "الاسم مطلوب" : "Name is required");
      need("regEmail", isEmail(email), ar() ? "بريد إلكتروني غير صحيح" : "Invalid email");
      need("regPass", pass.length >= 6, ar() ? "كلمة المرور 6 أحرف على الأقل" : "Min 6 characters");
      need("regPass2", val("regPass2") === pass && val("regPass2").length > 0, ar() ? "كلمتا المرور غير متطابقتين" : "Passwords don't match");
      need("regPhone", isPhone(phone), ar() ? "رقم واتساب غير صحيح" : "Invalid WhatsApp number");
      const countryEl = document.getElementById("regCountry");
      const country = countryEl ? countryEl.value : "";
      need("regCountry", !!country, ar() ? "اختر الدولة" : "Select a country");

      if (!ok) {
        NEOM.toast(ar() ? "يرجى تصحيح الحقول المميزة" : "Please fix the highlighted fields", "err");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      try {
        if (DB()) {
          // ---- REAL account (instant, no email code) ----
          // 1) check the name + phone aren't already used (RPC; skipped if not installed)
          try {
            const { data: nameTaken, error: e1 } = await DB().rpc("name_exists", { p_name: name });
            if (!e1 && nameTaken) return failField("regName", ar() ? "هذا الاسم مستخدم بالفعل" : "Name already taken");
            const { data: phoneTaken, error: e2 } = await DB().rpc("phone_exists", { p_phone: phone });
            if (!e2 && phoneTaken) return failField("regPhone", ar() ? "هذا الرقم مستخدم بالفعل" : "Number already used");
          } catch (chk) { /* RPC not installed yet — email uniqueness still enforced below */ }

          // 2) create the account (instant)
          const { data, error } = await DB().auth.signUp({
            email, password: pass,
            options: { data: { name, whatsapp: phone, country } },
          });
          if (error) {
            const m = (error.message || "").toLowerCase();
            if (m.includes("already") || m.includes("registered") || m.includes("exists")) {
              setErr(fieldOf("regEmail"), true, ar() ? "هذا البريد مستخدم بالفعل" : "Email already in use");
              NEOM.toast(ar() ? "هذا البريد مستخدم بالفعل" : "Email already in use", "err");
            } else if (m.includes("database")) {
              // trigger/DB problem — usually search_path or missing tables
              NEOM.toast(ar() ? "في مشكلة بإعداد قاعدة البيانات — شغّل سكربت الإصلاح في SQL Editor" : "Database setup issue — run the fix SQL", "err", 6000);
            } else {
              NEOM.toast(error.message || (ar() ? "تعذّر إنشاء الحساب" : "Could not create account"), "err");
            }
            return;
          }
          if (data && data.session) {
            finishLogin({ name, email, role: "member" });
          } else {
            // signUp succeeded but no session => email confirmation still ON in the dashboard
            NEOM.toast(
              ar()
                ? "تم إنشاء الحساب. لتفعيل الدخول الفوري أوقف Confirm email من إعدادات Supabase."
                : "Account created. Turn OFF 'Confirm email' in Supabase for instant sign-in.",
              "info", 6000
            );
          }
        } else {
          // ---- LOCAL fallback (no Supabase yet) ----
          const accs = localAccounts();
          if (accs.some((a) => a.email.toLowerCase() === email.toLowerCase()))
            return failField("regEmail", ar() ? "هذا البريد مستخدم بالفعل" : "Email already in use");
          if (accs.some((a) => a.name.toLowerCase() === name.toLowerCase()))
            return failField("regName", ar() ? "هذا الاسم مستخدم بالفعل" : "Name already taken");
          if (accs.some((a) => a.whatsapp === phone))
            return failField("regPhone", ar() ? "هذا الرقم مستخدم بالفعل" : "Number already used");
          const role = name.toLowerCase() === "yaro" || email.split("@")[0].toLowerCase() === "yaro" ? "owner" : "member";
          const joined = new Date().toLocaleDateString("en-CA").replace(/-/g, "/");
          saveLocalAccount({ name, email, whatsapp: phone, country, password: pass, role, avatar: 1, xp: 0, joined, status: "active" });
          finishLogin({ name, email, role });
        }
      } catch (err) {
        NEOM.toast(ar() ? "حدث خطأ غير متوقع" : "Unexpected error", "err");
      } finally {
        if (btn) btn.disabled = false;
      }

      function failField(id, msg) {
        setErr(fieldOf(id), true, msg);
        NEOM.toast(msg, "err");
        if (btn) btn.disabled = false;
      }
    });

    // live confirm-match feedback
    const p2 = document.getElementById("regPass2");
    if (p2)
      p2.addEventListener("input", () => {
        if (!p2.value) return;
        setErr(fieldOf("regPass2"), p2.value !== val("regPass"), ar() ? "كلمتا المرور غير متطابقتين" : "Passwords don't match");
      });
  }

  /* ============================ LOGIN =========================== */
  function initLogin(form) {
    const input = document.getElementById("logAccount");
    const sug = document.getElementById("logSuggest");
    let activeIdx = -1;
    let current = [];

    function renderSug() {
      if (!input || !sug) return;
      const q = input.value.trim().toLowerCase();
      current = knownEmails().filter((em) => !q || em.toLowerCase().includes(q)).slice(0, 6);
      if (!current.length) { sug.classList.remove("show"); return; }
      activeIdx = -1;
      sug.innerHTML = current
        .map((em, i) => `<button type="button" data-i="${i}">
            <span class="ico-mini">${ic("mail")}</span>
            <span>${em}</span>
          </button>`)
        .join("");
      sug.classList.add("show");
      sug.querySelectorAll("button").forEach((b) =>
        b.addEventListener("click", () => {
          input.value = current[+b.getAttribute("data-i")];
          sug.classList.remove("show");
          input.focus();
        })
      );
    }

    if (input && sug) {
      input.addEventListener("input", renderSug);
      input.addEventListener("focus", renderSug);
      input.addEventListener("keydown", (e) => {
        const btns = [...sug.querySelectorAll("button")];
        if (!sug.classList.contains("show") || !btns.length) return;
        if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = (activeIdx + 1) % btns.length; }
        else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = (activeIdx - 1 + btns.length) % btns.length; }
        else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); btns[activeIdx].click(); return; }
        else if (e.key === "Escape") { sug.classList.remove("show"); return; }
        else return;
        btns.forEach((b, i) => b.classList.toggle("active", i === activeIdx));
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest("#logSuggest") && e.target !== input) sug.classList.remove("show");
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = val("logAccount");
      const pass = val("logPass");
      let ok = true;
      if (!isEmail(email)) { setErr(fieldOf("logAccount"), true, ar() ? "ادخل بريدك الإلكتروني" : "Enter your email"); ok = false; }
      else setErr(fieldOf("logAccount"), false);
      if (pass.length < 1) { setErr(fieldOf("logPass"), true, ar() ? "أدخل كلمة المرور" : "Enter your password"); ok = false; }
      else setErr(fieldOf("logPass"), false);
      if (!ok) return;

      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;

      try {
        if (DB()) {
          const { data, error } = await DB().auth.signInWithPassword({ email, password: pass });
          if (error || !data || !data.session) {
            NEOM.toast(ar() ? "البريد أو كلمة المرور غير صحيحة" : "Wrong email or password", "err");
            return;
          }
          // pull the profile (name + role) for the session
          let name = email.split("@")[0], role = "member";
          try {
            const { data: prof } = await DB().from("profiles").select("name, role").eq("id", data.user.id).single();
            if (prof) { name = prof.name || name; role = prof.role || role; }
          } catch (e) {}
          finishLogin({ name, email, role });
        } else {
          const acc = localAccounts().find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === pass);
          if (!acc) { NEOM.toast(ar() ? "البريد أو كلمة المرور غير صحيحة" : "Wrong email or password", "err"); return; }
          finishLogin({ name: acc.name, email: acc.email, role: acc.role || "member" });
        }
      } catch (err) {
        NEOM.toast(ar() ? "حدث خطأ غير متوقع" : "Unexpected error", "err");
      } finally {
        if (btn) btn.disabled = false;
      }
    });

    // forgot password
    const forgot = document.getElementById("logForgot");
    if (forgot)
      forgot.addEventListener("click", (e) => {
        e.preventDefault();
        const box = NEOM.openModal(
          `<div class="modal-head"><h3>${ar() ? "استعادة كلمة المرور" : "Reset password"}</h3>
            <button class="modal-close" data-close aria-label="close">${ic("close")}</button></div>
          <div class="modal-body">
            <div class="field"><label>${ar() ? "البريد الإلكتروني" : "Email"}</label>
              <div class="input-wrap"><input class="input" id="fpEmail" type="email" placeholder="you@example.com"/><span class="i-ico">${ic("mail")}</span></div>
            </div>
            <button class="btn btn-primary btn-block" id="fpSend">${ar() ? "إرسال رابط الاستعادة" : "Send reset link"}</button>
          </div>`,
          { sm: true }
        );
        box.querySelector("#fpSend").addEventListener("click", async () => {
          const em = box.querySelector("#fpEmail").value.trim();
          if (!isEmail(em)) { NEOM.toast(ar() ? "أدخل بريدًا صحيحًا" : "Enter a valid email", "err"); return; }
          if (DB()) { try { await DB().auth.resetPasswordForEmail(em); } catch (e) {} }
          NEOM.closeModal();
          NEOM.toast(ar() ? "تم إرسال رابط الاستعادة" : "Reset link sent", "ok");
        });
      });
  }

  /* إذا أوقفت الإدارة تسجيل الحسابات: عطّل النموذج واعرض تنبيهًا */
  function gateRegister(form) {
    const open = !NEOM.store || NEOM.store.flags().registrationOpen !== false;
    if (open) return;
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    form.querySelectorAll("input,select,textarea").forEach((el) => (el.disabled = true));
    if (!form.querySelector(".form-closed")) {
      const n = document.createElement("div");
      n.className = "form-closed";
      n.textContent = ar() ? "تسجيل الحسابات الجديدة متوقف حاليًا." : "New registrations are currently closed.";
      form.prepend(n);
    }
  }

  function init() {
    const reg = document.getElementById("registerForm");
    const log = document.getElementById("loginForm");
    if (reg) { initRegister(reg); gateRegister(reg); }
    if (log) initLogin(log);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
