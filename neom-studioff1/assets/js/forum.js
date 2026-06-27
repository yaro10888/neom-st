/* =========================================================
   Neom Studio — Forum (posts + emoji reactions)
   Reactions toggle per-emoji (Discord style: one of each),
   persisted to localStorage. Search + sort. Re-renders on
   language change. In prod, reactions hit a reactions table.
   ========================================================= */
(function () {
  "use strict";
  const NEOM = window.NEOM;
  if (!NEOM) return;
  const ic = (n) => NEOM.icons[n] || "";
  const tx = (f) => NEOM.tx(f);
  const t = (k) => NEOM.i18n.t(k);
  const fmt = (n) => (n >= 1000 ? (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0) + "K" : String(n));

  const RKEY = "neom.reacts";
  let mine = {};
  try {
    mine = JSON.parse(localStorage.getItem(RKEY) || "{}");
  } catch (e) {
    mine = {};
  }
  const saveMine = () => localStorage.setItem(RKEY, JSON.stringify(mine));

  let state = { q: "", sort: "newest" };

  const SORTS = [
    { id: "newest", k: "w.newest" },
    { id: "oldest", k: "w.oldest" },
    { id: "mostViewed", k: "w.mostViewed" },
    { id: "mostReacted", k: "w.mostReacted" },
  ];

  const baseTotal = (p) => Object.values(p.reacts).reduce((a, b) => a + b, 0);

  function reactionsHTML(p) {
    const um = mine[p.id] || {};
    return NEOM.data.REACT_SET.map((emo) => {
      const base = p.reacts[emo] || 0;
      const on = !!um[emo];
      const count = base + (on ? 1 : 0);
      if (count === 0 && !on) {
        // still render a few zero reactions so users can add them
      }
      return `<button class="react ${on ? "on" : ""}" data-emo="${emo}" data-post="${p.id}">
        <span class="emo">${emo}</span><span class="cnt">${count}</span>
      </button>`;
    }).join("");
  }

  function postHTML(p) {
    const tags = p.tags.map((tg) => `<span class="tag ${tg.t}">${t(tg.k)}</span>`).join("");
    return `<article class="post card reveal" id="${p.id}">
      <div class="p-thumb">
        <div class="ph" style="background:radial-gradient(300px 160px at 30% 20%, color-mix(in srgb, ${p.accent} 45%, transparent), transparent 60%), linear-gradient(135deg,#1b2a4a,#2a1f50)"></div>
        <div class="glyph" style="color:color-mix(in srgb, ${p.accent} 85%, #fff)">${ic(p.glyph)}</div>
      </div>
      <div class="p-body">
        <div class="p-tags">${tags}</div>
        <h3>${tx(p.title)}</h3>
        <p class="p-excerpt">${tx(p.excerpt)}</p>
        <div class="p-meta">
          <span class="author"><img src="${p.author.avatar}" alt=""/>${p.author.name}</span>
          <span>${ic("calendar")}${p.date}</span>
          <span>${ic("eye")}${fmt(p.views)} ${t("w.views")}</span>
          <span>${ic("forum")}${p.replies} ${t("w.replies")}</span>
        </div>
        <div class="reactions">${reactionsHTML(p)}</div>
      </div>
    </article>`;
  }

  function getList() {
    let list = NEOM.data.posts.slice();
    const q = state.q.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [tx(p.title), p.title.ar, p.title.en, tx(p.excerpt), p.author.name].join(" ").toLowerCase().includes(q)
      );
    }
    switch (state.sort) {
      case "oldest":
        list.sort((a, b) => (a.date < b.date ? -1 : 1));
        break;
      case "mostViewed":
        list.sort((a, b) => b.views - a.views);
        break;
      case "mostReacted":
        list.sort((a, b) => baseTotal(b) - baseTotal(a));
        break;
      default:
        list.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return list;
  }

  function render() {
    const list = document.getElementById("forumList");
    if (!list) return;
    const data = getList();
    if (!data.length) {
      list.innerHTML = `<div class="empty">${ic("search")}<p>${t("w.noResults")}</p></div>`;
      return;
    }
    list.innerHTML = data.map(postHTML).join("");
    NEOM.observeReveal(list);
  }

  function onReact(btn) {
    const id = btn.getAttribute("data-post");
    const emo = btn.getAttribute("data-emo");
    mine[id] = mine[id] || {};
    const cntEl = btn.querySelector(".cnt");
    const post = NEOM.data.posts.find((p) => p.id === id);
    const base = (post && post.reacts[emo]) || 0;
    if (mine[id][emo]) {
      delete mine[id][emo];
      btn.classList.remove("on");
      cntEl.textContent = String(base);
    } else {
      mine[id][emo] = true;
      btn.classList.add("on", "pop");
      cntEl.textContent = String(base + 1);
      btn.addEventListener("animationend", () => btn.classList.remove("pop"), { once: true });
    }
    saveMine();
  }

  function buildSorts() {
    const wrap = document.getElementById("forumChips");
    if (!wrap) return;
    wrap.innerHTML = SORTS.map(
      (s) => `<button class="chip ${s.id === state.sort ? "active" : ""}" data-sort="${s.id}">${t(s.k)}</button>`
    ).join("");
    wrap.querySelectorAll("[data-sort]").forEach((b) =>
      b.addEventListener("click", () => {
        state.sort = b.getAttribute("data-sort");
        wrap.querySelectorAll(".chip").forEach((x) => x.classList.toggle("active", x === b));
        render();
      })
    );
  }

  function init() {
    const list = document.getElementById("forumList");
    if (!list) return;
    buildSorts();
    const s = document.getElementById("forumSearch");
    if (s)
      s.addEventListener("input", () => {
        state.q = s.value;
        render();
      });
    list.addEventListener("click", (e) => {
      const r = e.target.closest(".react");
      if (r) onReact(r);
    });
    render();
    document.addEventListener("langchange", () => {
      buildSorts();
      render();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
