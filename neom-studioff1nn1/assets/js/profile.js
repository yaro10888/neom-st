/* =========================================================
   Neom Studio — Profile (UI prototype)
   Avatar picker (10), animated XP bar, and the spec's
   change-cooldowns: name every 20d, WhatsApp every 7d,
   password every 20d. Cooldowns are tracked in localStorage
   for the demo; production enforces them server-side.
   ========================================================= */
(function () {
  "use strict";
  const NEOM = window.NEOM;
  if (!NEOM) return;
  if (!document.getElementById("profilePage")) return;
  const ic = (n) => NEOM.icons[n] || "";
  const ar = () => NEOM.i18n.lang === "ar";
  const DAY = 86400000;

  const COOLDOWN = { name: 20, whatsapp: 7, password: 20 }; // days

  const store = (k, d) => {
    try {
      return JSON.parse(localStorage.getItem(k)) || d;
    } catch (e) {
      return d;
    }
  };
  let profile = store("neom.profile", {
    name: (store("neom.session", {}).name) || "Player",
    email: "",
    whatsapp: "",
    country: ar() ? "—" : "—",
    role: ar() ? "عضو" : "Member",
    avatar: 1,
    since: new Date().toLocaleDateString("en-CA").replace(/-/g, "/"),
    xp: 0,        // total XP points (Level = xp/100 + 1)
    posts: 0,
    likes: 0,
  });
  let locks = store("neom.locks", {}); // {name: ts, whatsapp: ts, password: ts}

  const saveProfile = () => localStorage.setItem("neom.profile", JSON.stringify(profile));
  const saveLocks = () => localStorage.setItem("neom.locks", JSON.stringify(locks));
  const avPath = (n) => (NEOM.store && NEOM.store.avatarSrc) ? NEOM.store.avatarSrc(n) : `assets/img/avatars/avatar-${String(n).padStart(2, "0")}.svg`;

  /* في الوضع المحلي: اعكس تعديلات الملف الشخصي على الحساب المحفوظ
     حتى تظهر للإدارة (الاسم/الواتساب/الأفاتار/كلمة المرور). */
  function syncAccount(patch) {
    try {
      if (window.NEOM_DB) return; // الوضع الحقيقي يتكفّل بالحفظ في Supabase
      if (!NEOM.store || !NEOM.store.accounts) return;
      const accs = NEOM.store.accounts();
      const email = (profile.email || "").toLowerCase();
      const i = accs.findIndex((a) => (a.email || "").toLowerCase() === email);
      if (i < 0) return;
      accs[i] = Object.assign({}, accs[i], patch);
      NEOM.store.saveAccounts(accs);
    } catch (e) {}
  }

  let UID = null; // Supabase user id when signed in for real
  function roleLabel(r) {
    const map = ar()
      ? { owner: "المالك", admin: "مشرف", member: "عضو" }
      : { owner: "Owner", admin: "Admin", member: "Member" };
    return map[r] || r;
  }

  function daysLeft(key) {
    const last = locks[key];
    if (!last) return 0;
    const passed = (Date.now() - last) / DAY;
    return Math.max(0, Math.ceil(COOLDOWN[key] - passed));
  }

  /* ----------------------------- RENDER -------------------------- */
  function renderCard() {
    const av = document.getElementById("pfAvatar");
    if (av) av.src = avPath(profile.avatar);
    const nm = document.getElementById("pfName");
    if (nm) nm.textContent = profile.name;
    const role = document.getElementById("pfRole");
    if (role) role.innerHTML = `${ic("shield")}<span>${profile.role}</span>`;

    // Level + progress derived from total XP points (100 XP per level)
    const xp = profile.xp || 0;
    const level = Math.floor(xp / 100) + 1;
    const pct = xp % 100;
    const bar = document.getElementById("pfBar");
    if (bar) requestAnimationFrame(() => (bar.style.width = pct + "%"));
    const xpv = document.getElementById("pfXp");
    if (xpv) xpv.textContent = pct + "%";

    // live stats (real values; zero for a brand-new account)
    const setStat = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setStat("pfPosts", profile.posts || 0);
    setStat("pfPoints", xp);
    setStat("pfLikes", profile.likes || 0);
    setStat("pfLevel", "Lv." + level);
  }

  function lockNote(key) {
    const d = daysLeft(key);
    if (d <= 0) return "";
    return `<span class="locked-note">${ic("clock")} ${ar() ? "متاح بعد " + d + " يوم" : "in " + d + "d"}</span>`;
  }

  function renderInfo() {
    const list = document.getElementById("pfInfo");
    if (!list) return;
    const rows = [
      { k: "name", icon: "user", label: ar() ? "اسم الحساب" : "Account name", v: profile.name, edit: true },
      { k: "email", icon: "mail", label: ar() ? "البريد الإلكتروني" : "Email", v: profile.email, edit: false },
      { k: "whatsapp", icon: "whatsapp", label: ar() ? "رقم واتساب" : "WhatsApp", v: profile.whatsapp, edit: true },
      { k: "password", icon: "lock", label: ar() ? "كلمة المرور" : "Password", v: "••••••••", edit: true },
      { k: "country", icon: "globe", label: ar() ? "الدولة" : "Country", v: profile.country, edit: false },
      { k: "since", icon: "calendar", label: ar() ? "عضو منذ" : "Member since", v: profile.since, edit: false },
    ];
    list.innerHTML =
      `<h3>${ar() ? "معلومات الحساب" : "Account info"}</h3>` +
      rows
        .map(
          (r) => `<div class="info-row">
            <span class="k">${ic(r.icon)}<span>${r.label}</span></span>
            <span style="display:flex;align-items:center;gap:8px">
              <span class="v">${r.v}</span>
              ${r.edit ? lockNote(r.k) : ""}
              ${r.edit ? `<button class="ico-btn" data-edit="${r.k}" aria-label="edit" style="width:34px;height:34px">${ic("edit")}</button>` : ""}
            </span>
          </div>`
        )
        .join("");
    list.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openEdit(b.getAttribute("data-edit"))));
  }

  function renderPicker() {
    const pick = document.getElementById("avatarPick");
    if (!pick) return;
    const avs = (NEOM.store && NEOM.store.enabledAvatars) ? NEOM.store.enabledAvatars() : [];
    const list = avs.length ? avs : Array.from({ length: 10 }, (_, i) => ({ id: "av-" + (i + 1), src: avPath(i + 1) }));
    const isSel = (a) => a.id === profile.avatar || a.id === ("av-" + profile.avatar);
    pick.innerHTML = list
      .map((a) => `<button data-av="${a.id}" class="${isSel(a) ? "sel" : ""}"><img src="${a.src}" alt=""/></button>`)
      .join("");
    pick.querySelectorAll("[data-av]").forEach((b) =>
      b.addEventListener("click", () => {
        profile.avatar = b.getAttribute("data-av");
        saveProfile();
        syncAccount({ avatar: profile.avatar });
        const DB = window.NEOM_DB || null;
        if (DB && UID) DB.from("profiles").update({ avatar: profile.avatar }).eq("id", UID).then(() => {});
        pick.querySelectorAll("button").forEach((x) => x.classList.toggle("sel", x === b));
        renderCard();
        NEOM.toast(ar() ? "تم تحديث الصورة الرمزية" : "Avatar updated", "ok");
      })
    );
  }

  /* ------------------------------ EDIT --------------------------- */
  function openEdit(key) {
    const left = daysLeft(key);
    if (left > 0) {
      NEOM.toast(
        ar() ? `لا يمكن التغيير الآن، متاح بعد ${left} يوم` : `Locked — available in ${left} days`,
        "err"
      );
      return;
    }
    const labels = {
      name: ar() ? "تغيير اسم الحساب" : "Change account name",
      whatsapp: ar() ? "تغيير رقم واتساب" : "Change WhatsApp",
      password: ar() ? "تغيير كلمة المرور" : "Change password",
    };
    const cd = COOLDOWN[key];
    const body =
      key === "password"
        ? `<div class="field"><label>${ar() ? "كلمة المرور الجديدة" : "New password"}</label>
             <div class="input-wrap"><input class="input" id="edVal" type="password"/><span class="i-ico">${ic("lock")}</span></div></div>
           <div class="field"><label>${ar() ? "تأكيد كلمة المرور" : "Confirm password"}</label>
             <div class="input-wrap"><input class="input" id="edVal2" type="password"/><span class="i-ico">${ic("lock")}</span></div></div>`
        : `<div class="field"><label>${labels[key]}</label>
             <div class="input-wrap"><input class="input" id="edVal" value="${key === "name" ? profile.name : key === "whatsapp" ? profile.whatsapp : ""}"/><span class="i-ico">${ic(key === "whatsapp" ? "whatsapp" : "user")}</span></div></div>`;

    const box = NEOM.openModal(
      `<div class="modal-head"><h3>${labels[key]}</h3>
        <button class="modal-close" data-close aria-label="close">${ic("close")}</button></div>
      <div class="modal-body">
        ${body}
        <p class="field hint" style="margin:-6px 0 14px;color:var(--a-gold)">${ic("info")} ${ar() ? `يمكن تغيير هذا الحقل مرة كل ${cd} يوم` : `Can be changed once every ${cd} days`}</p>
        <button class="btn btn-primary btn-block" id="edSave">${ic("check")}<span>${ar() ? "حفظ" : "Save"}</span></button>
      </div>`,
      { sm: true }
    );

    box.querySelector("#edSave").addEventListener("click", () => {
      const v = (box.querySelector("#edVal").value || "").trim();
      if (key === "password") {
        const v2 = (box.querySelector("#edVal2").value || "").trim();
        if (v.length < 6) return NEOM.toast(ar() ? "كلمة المرور قصيرة جدًا" : "Password too short", "err");
        if (v !== v2) return NEOM.toast(ar() ? "كلمتا المرور غير متطابقتين" : "Passwords don't match", "err");
      } else if (v.length < 2) {
        return NEOM.toast(ar() ? "قيمة غير صالحة" : "Invalid value", "err");
      }
      if (key === "name") profile.name = v;
      if (key === "whatsapp") profile.whatsapp = v;
      locks[key] = Date.now();
      saveProfile();
      saveLocks();
      // اعكس التعديل على الحساب المحفوظ (الوضع المحلي)
      (function () {
        const patch = {};
        if (key === "name") patch.name = v;
        if (key === "whatsapp") patch.whatsapp = v;
        if (key === "password") patch.password = v;
        syncAccount(patch);
      })();

      // persist to Supabase when signed in for real
      const DB = window.NEOM_DB || null;
      if (DB && UID) {
        if (key === "name") DB.from("profiles").update({ name: v }).eq("id", UID).then(() => {});
        if (key === "whatsapp") DB.from("profiles").update({ whatsapp: v }).eq("id", UID).then(() => {});
        if (key === "password") DB.auth.updateUser({ password: v }).then(() => {});
      }
      // keep the navbar name in sync
      if (key === "name") {
        const s = NEOM.getSession() || {};
        s.name = v;
        NEOM.setSession(s);
      }

      NEOM.closeModal();
      renderInfo();
      renderCard();
      NEOM.toast(ar() ? "تم الحفظ بنجاح" : "Saved successfully", "ok");
    });
  }

  function renderAll() {
    renderCard();
    renderInfo();
    renderPicker();
  }

  function wireLogout() {
    const lo = document.getElementById("logoutBtn");
    if (lo)
      lo.addEventListener("click", async () => {
        await NEOM.clearSession();
        NEOM.toast(ar() ? "تم تسجيل الخروج" : "Signed out", "ok");
        setTimeout(() => (location.href = "index.html"), 700);
      });
  }

  async function bootstrap() {
    const DB = window.NEOM_DB || null;
    if (DB) {
      // real mode: profile page requires a signed-in user
      try {
        const { data: u } = await DB.auth.getUser();
        if (!u || !u.user) { location.href = "login.html"; return; }
        UID = u.user.id;
        profile.email = u.user.email || profile.email;
        // real join date from the auth account
        if (u.user.created_at) {
          const d = new Date(u.user.created_at);
          profile.since = d.toLocaleDateString("en-CA").replace(/-/g, "/");
        }
        const { data: prof } = await DB.from("profiles").select("*").eq("id", UID).single();
        if (prof) {
          if (prof.name) profile.name = prof.name;
          if (prof.whatsapp) profile.whatsapp = prof.whatsapp;
          if (prof.country) profile.country = prof.country;
          if (prof.role) profile.role = roleLabel(prof.role);
          if (prof.avatar) profile.avatar = prof.avatar;
          profile.xp = prof.xp != null ? prof.xp : 0;
          if (prof.created_at) profile.since = new Date(prof.created_at).toLocaleDateString("en-CA").replace(/-/g, "/");
        }
        // real post count for this user
        try {
          const { count } = await DB.from("posts").select("id", { count: "exact", head: true }).eq("author_id", UID);
          profile.posts = count || 0;
        } catch (e) { profile.posts = 0; }
        saveProfile();
      } catch (e) {}
    } else {
      // local fallback: hydrate from the current session + the saved account
      const s = (NEOM.getSession && NEOM.getSession()) || null;
      if (s) {
        if (s.name) profile.name = s.name;
        if (s.email) profile.email = s.email;
        if (s.role) profile.role = roleLabel(s.role);
      }
      // pull the rest from the matching local account (whatsapp/country/avatar/join date)
      try {
        const accs = (NEOM.store && NEOM.store.accounts && NEOM.store.accounts()) || [];
        const me = s && s.email ? accs.find((a) => (a.email || "").toLowerCase() === s.email.toLowerCase()) : null;
        if (me) {
          if (me.whatsapp) profile.whatsapp = me.whatsapp;
          if (me.country) profile.country = me.country;
          if (me.avatar) profile.avatar = me.avatar;
          if (me.joined) profile.since = me.joined;
          if (me.xp != null) profile.xp = me.xp;
        }
      } catch (e) {}
    }
    renderAll();
    wireLogout();
  }

  bootstrap();
  document.addEventListener("langchange", () => {
    renderInfo();
    renderPicker();
  });
})();
