/* =========================================================
   Neom Studio — Cart (localStorage)
   - سلة مشتريات محفوظة في المتصفح.
   - قسم كود الخصم: إدخال + تطبيق + نص يوضّح صحة الكود + نص يوضّح
     قيمة الخصم الفعلية، ثم تطبيقه على الإجمالي.
   - عند إتمام الشراء يُسجَّل طلب حقيقي يظهر في لوحة الإدارة.
   ========================================================= */
(function () {
  "use strict";
  const NEOM = (window.NEOM = window.NEOM || {});
  const KEY = "neom.cart";
  const DKEY = "neom.cartDiscount"; // الكود المُطبّق حاليًا
  const ic = (n) => NEOM.icons[n] || "";
  const t = (k) => NEOM.i18n.t(k);
  const cur = () => NEOM.site.currency;
  const ar = () => NEOM.i18n.lang === "ar";

  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { items = []; }

  let appliedCode = localStorage.getItem(DKEY) || ""; // كود الخصم المحفوظ

  const save = () => localStorage.setItem(KEY, JSON.stringify(items));
  const saveCode = () => { if (appliedCode) localStorage.setItem(DKEY, appliedCode); else localStorage.removeItem(DKEY); };

  function updateBadge() {
    const b = document.getElementById("cartBadge");
    if (!b) return;
    b.textContent = String(items.length);
    b.classList.toggle("show", items.length > 0);
  }

  function priceChips(p) {
    if (!p) return `<span class="badge-free">${t("w.free")}</span>`;
    const c = cur();
    return `<span class="badge-price">${p.robux} ${c.robux}</span>
            <span class="badge-price">${p.egp} ${c.egp}</span>
            <span class="badge-price">${p.sar} ${c.sar}</span>`;
  }

  function subtotals() {
    return items.reduce(
      (a, it) => {
        if (it.prices) {
          a.robux += it.prices.robux || 0;
          a.egp += it.prices.egp || 0;
          a.sar += it.prices.sar || 0;
        }
        return a;
      },
      { robux: 0, egp: 0, sar: 0 }
    );
  }

  /* يُعيد حالة الخصم الحالية بناءً على الكود المُطبّق وإجمالي السلة */
  function discountState() {
    if (!appliedCode) return null;
    if (!NEOM.store || !NEOM.store.applyDiscount) return null;
    return NEOM.store.applyDiscount(appliedCode, subtotals());
  }

  function moneyTriple(o, strong) {
    const c = cur();
    const cls = strong ? ' style="background:var(--grad-btn);color:#fff"' : "";
    return `<span class="badge-price"${cls}>${o.robux} ${c.robux}</span>
            <span class="badge-price"${cls}>${o.egp} ${c.egp}</span>
            <span class="badge-price"${cls}>${o.sar} ${c.sar}</span>`;
  }

  /* قسم كود الخصم: حقل الإدخال + نص صحة الكود + نص قيمة الخصم */
  function promoHTML() {
    const ds = discountState();
    let statusLine = "";   // نص يوضّح هل الكود صحيح أم لا
    let discountLine = ""; // نص يوضّح الخصم الفعلي للكود
    let inputVal = appliedCode ? ` value="${appliedCode}"` : "";

    if (appliedCode) {
      if (ds && ds.ok) {
        const d = ds.discount;
        const label = NEOM.tx ? NEOM.tx(d.label) : (d.label && (d.label.ar || d.label.en)) || "";
        const valTxt = NEOM.store.discountText(d, NEOM.i18n.lang);
        statusLine = `<div class="promo-status ok">${ic("check")}
          <span>${t("cart.applied")} — <b>${d.code}</b>${label ? " · " + label : ""}</span></div>`;
        discountLine = `<div class="promo-discount">
            <span>${t("cart.discountLabel")}: <b>${valTxt}</b></span>
            <span class="promo-off">− ${moneyTriple(ds.amount)}</span>
          </div>`;
      } else {
        const reason = ds && ds.reason === "inactive" ? t("cart.inactive") : t("cart.invalid");
        statusLine = `<div class="promo-status bad">${ic("close")}<span>${reason}</span></div>`;
      }
    }

    return `<div class="promo">
        <label class="promo-label">${ic("coupon")}<span>${t("cart.promo")}</span></label>
        <div class="promo-row">
          <input class="input promo-input" id="promoInput" type="text" autocomplete="off"
                 placeholder="${t("cart.promoPh")}"${inputVal} />
          <button class="btn btn-primary btn-sm" id="promoApply">${t("cart.apply")}</button>
          ${appliedCode ? `<button class="btn btn-ghost btn-sm" id="promoClear" aria-label="${t("cart.removeCode")}">${ic("trash")}</button>` : ""}
        </div>
        ${statusLine}
        ${discountLine}
      </div>`;
  }

  function totalsBlockHTML() {
    const sub = subtotals();
    const ds = discountState();
    const hasDiscount = !!(ds && ds.ok && (ds.amount.robux || ds.amount.egp || ds.amount.sar));
    const c = cur();

    if (!hasDiscount) {
      return `<div class="info-row" style="border-top:1px solid var(--stroke);margin-top:8px;padding-top:16px">
          <div class="k" style="color:var(--tx-1);font-weight:700">${t("cart.total")}</div>
          <div class="item-prices">${moneyTriple(sub, true)}</div>
        </div>`;
    }

    const final = {
      robux: Math.max(0, sub.robux - ds.amount.robux),
      egp: Math.max(0, sub.egp - ds.amount.egp),
      sar: Math.max(0, sub.sar - ds.amount.sar),
    };
    return `<div style="border-top:1px solid var(--stroke);margin-top:8px;padding-top:14px">
        <div class="info-row" style="padding:6px 0">
          <div class="k" style="color:var(--tx-3)">${t("cart.subtotal")}</div>
          <div class="item-prices">${moneyTriple(sub)}</div>
        </div>
        <div class="info-row" style="padding:6px 0">
          <div class="k" style="color:var(--a-green,#4fd88a)">${t("cart.discountLabel")}</div>
          <div class="item-prices"><span class="badge-price" style="color:var(--a-green,#4fd88a)">− ${ds.amount.robux} ${c.robux}</span>
            <span class="badge-price" style="color:var(--a-green,#4fd88a)">− ${ds.amount.egp} ${c.egp}</span>
            <span class="badge-price" style="color:var(--a-green,#4fd88a)">− ${ds.amount.sar} ${c.sar}</span></div>
        </div>
        <div class="info-row" style="padding-top:10px">
          <div class="k" style="color:var(--tx-1);font-weight:800">${t("cart.total")}</div>
          <div class="item-prices">${moneyTriple(final, true)}</div>
        </div>
      </div>`;
  }

  function cartBodyHTML() {
    if (!items.length) {
      // سلة فارغة — أزل أي كود مُطبّق
      if (appliedCode) { appliedCode = ""; saveCode(); }
      return `<div class="empty">${ic("cart")}<p>${t("cart.empty")}</p>
        <a class="btn btn-ghost btn-sm" href="systems.html" data-close>${t("btn.viewSystems")}</a></div>`;
    }
    const rows = items
      .map(
        (it, i) => `<div class="info-row">
          <div class="k" style="color:var(--tx-1)">
            <span style="display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.05);color:${it.accent || "#2bd8c6"}">${ic(it.glyph || "system")}</span>
            <span>${it.name}</span>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div class="item-prices">${priceChips(it.prices)}</div>
            <button class="ico-btn" data-rm="${i}" aria-label="${t("cart.remove")}" style="width:34px;height:34px">${ic("trash")}</button>
          </div>
        </div>`
      )
      .join("");

    return `<div class="info-list" style="padding:0">${rows}</div>
      ${promoHTML()}
      ${totalsBlockHTML()}
      <div style="display:flex;gap:10px;margin-top:18px">
        <button class="btn btn-primary btn-block" id="checkoutBtn">${ic("bag")}<span>${t("cart.checkout")}</span></button>
      </div>`;
  }

  function openCart() {
    const box = NEOM.openModal(
      `<div class="modal-head"><h3>${t("cart.title")}</h3>
        <button class="modal-close" data-close aria-label="close">${ic("close")}</button></div>
       <div class="modal-body" id="cartBody">${cartBodyHTML()}</div>`,
      {}
    );
    bindCart(box);
  }

  function rerender(box) {
    const body = box.querySelector("#cartBody");
    if (body) { body.innerHTML = cartBodyHTML(); bindCart(box); }
  }

  function bindCart(box) {
    // حذف عنصر
    box.querySelectorAll("[data-rm]").forEach((b) =>
      b.addEventListener("click", () => {
        items.splice(+b.getAttribute("data-rm"), 1);
        save();
        updateBadge();
        rerender(box);
      })
    );

    // تطبيق كود الخصم
    const applyBtn = box.querySelector("#promoApply");
    const input = box.querySelector("#promoInput");
    if (applyBtn && input) {
      const apply = () => {
        const code = (input.value || "").trim();
        if (!code) { NEOM.toast(t("cart.emptyCode"), "info"); return; }
        const res = NEOM.store.applyDiscount(code, subtotals());
        appliedCode = code;
        saveCode();
        rerender(box);
        if (res.ok) NEOM.toast(t("cart.applied"), "ok");
        else NEOM.toast(res.reason === "inactive" ? t("cart.inactive") : t("cart.invalid"), "err");
      };
      applyBtn.addEventListener("click", apply);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } });
    }

    // إزالة الكود
    const clearBtn = box.querySelector("#promoClear");
    if (clearBtn)
      clearBtn.addEventListener("click", () => {
        appliedCode = "";
        saveCode();
        rerender(box);
      });

    // إتمام الشراء
    const co = box.querySelector("#checkoutBtn");
    if (co)
      co.addEventListener("click", async () => {
        const session = NEOM.getSession();
        if (!session) {
          NEOM.closeModal();
          NEOM.toast(ar() ? "لازم تسجّل دخول الأول عشان تكمّل الطلب" : "Please sign in to place your order", "err");
          setTimeout(() => (location.href = "login.html"), 1100);
          return;
        }
        if (!items.length) return;

        co.disabled = true;
        try {
          const sub = subtotals();
          const ds = discountState();
          const c = cur();
          const final = ds && ds.ok
            ? { robux: Math.max(0, sub.robux - ds.amount.robux), egp: Math.max(0, sub.egp - ds.amount.egp), sar: Math.max(0, sub.sar - ds.amount.sar) }
            : sub;

          const DB = window.NEOM_DB || null;
          if (DB) {
            // الوضع الحقيقي: صفوف في جدول orders بـ Supabase
            const { data: u } = await DB.auth.getUser();
            const uid = u && u.user ? u.user.id : null;
            const rows = items.map((it) => ({
              user_id: uid,
              item_title: it.name,
              item_type: it.type,
              qty: 1,
              price: (it.prices && it.prices.robux ? it.prices.robux + " R$" : ""),
              discount_code: appliedCode || null,
            }));
            const { error } = await DB.from("orders").insert(rows);
            if (error) { NEOM.toast(ar() ? "تعذّر إنشاء الطلب، حاول مجددًا" : "Couldn't place the order", "err"); co.disabled = false; return; }
          } else if (NEOM.store && NEOM.store.addOrder) {
            // الوضع المحلي: سجّل طلبًا حقيقيًا يظهر في لوحة الإدارة
            const accs = NEOM.store.accounts ? NEOM.store.accounts() : [];
            const acc = accs.find((a) => (a.email || "").toLowerCase() === (session.email || "").toLowerCase());
            const first = items[0] ? items[0].name : "";
            const itemLabel = items.length > 1 ? `${first} (+${items.length - 1})` : first;
            NEOM.store.addOrder({
              id: NEOM.store.nextOrderNo(),
              item: itemLabel,
              buyer: session.name || (session.email || "").split("@")[0],
              email: session.email || "",
              avatar: acc && acc.avatar ? acc.avatar : 1,
              a: acc && acc.avatar ? acc.avatar : 1,
              price: final.robux + " " + c.robux,
              priceFull: final,
              discountCode: appliedCode || null,
              status: "قيد المعالجة", statC: "gold",
              date: new Date().toLocaleDateString("en-CA").replace(/-/g, "/"),
              count: items.length,
            });
          }

          NEOM.closeModal();
          NEOM.toast(ar() ? "تم إنشاء طلبك بنجاح ✅ هنتواصل معك لإتمام الدفع" : "Order placed ✅ we'll contact you to complete payment", "ok", 4200);
          items = [];
          appliedCode = "";
          save();
          saveCode();
          updateBadge();
        } catch (e) {
          NEOM.toast(ar() ? "حدث خطأ غير متوقع" : "Unexpected error", "err");
          co.disabled = false;
        }
      });
  }

  NEOM.cart = {
    get items() { return items; },
    count: () => items.length,
    has: (id) => items.some((x) => x.id === id),
    add(item) {
      if (items.some((x) => x.id === item.id)) {
        NEOM.toast(ar() ? "العنصر موجود في السلة بالفعل" : "Already in your cart", "info");
        return;
      }
      items.push(item);
      save();
      updateBadge();
      NEOM.toast(t("cart.added"), "ok");
    },
    remove(id) { items = items.filter((x) => x.id !== id); save(); updateBadge(); },
    clear() { items = []; appliedCode = ""; save(); saveCode(); updateBadge(); },
    open: openCart,
  };

  function init() {
    updateBadge();
    const cartLink = document.getElementById("nav-cart");
    if (cartLink)
      cartLink.addEventListener("click", (e) => { e.preventDefault(); openCart(); });
    if (location.hash === "#cart") setTimeout(openCart, 350);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
