(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("js-ready");

  const splashCopy = document.body.classList.contains("page-robocon")
    ? "规则写在场上"
    : document.body.classList.contains("page-team")
      ? "找个工位，开始做"
      : "让机器先动起来";
  const splashSeenKey = "initial-intro-seen";
  let splash;
  try {
    splash = sessionStorage.getItem(splashSeenKey) ? null : document.createElement("div");
    if (splash) sessionStorage.setItem(splashSeenKey, "1");
  } catch {
    splash = document.createElement("div");
  }
  if (splash && !reduceMotion) {
    splash.className = "intro-splash";
    splash.setAttribute("aria-hidden", "true");
    splash.innerHTML = `<div class="splash-half splash-orange"></div><div class="splash-half splash-blue"></div><div class="splash-copy"><span>INITIAL / ROBOCON</span><strong>${splashCopy}</strong></div><img class="splash-logo" src="assets/team-logo.png" alt=""><img class="splash-robot splash-ghost splash-ghost-orange" src="assets/robot-cutout.png" alt=""><img class="splash-robot splash-ghost splash-ghost-blue" src="assets/robot-cutout.png" alt=""><img class="splash-robot" src="assets/robot-cutout.png" alt="">`;
    document.body.prepend(splash);
    window.setTimeout(() => splash.classList.add("is-dismissed"), 2400);
  }

  const boot = () => document.body.classList.add("is-booted");
  if (reduceMotion) {
    boot();
  } else {
    requestAnimationFrame(() => requestAnimationFrame(boot));
  }

  const sectionIds = ["about", "learn", "life", "faq", "join"];
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')].filter(
    (a) => a.getAttribute("href") !== "#top"
  );

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const match = link.getAttribute("href") === `#${id}`;
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] }
    );
    sections.forEach((sec) => io.observe(sec));
  }

  const QQ_GROUP = "1098311500";
  const noteEl = document.querySelector("[data-copy-note]");
  let noteTimer = 0;

  const showNote = (text, tone = "ok") => {
    if (!noteEl) return;
    noteEl.hidden = false;
    noteEl.textContent = text;
    noteEl.dataset.tone = tone;
    window.clearTimeout(noteTimer);
    noteTimer = window.setTimeout(() => {
      noteEl.hidden = true;
    }, 3200);
  };

  const copyText = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fall through */
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  };

  const copyBtn = document.querySelector("[data-copy-qq]");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const group = copyBtn.getAttribute("data-qq") || QQ_GROUP;
      const ok = await copyText(group);
      showNote(ok ? `群号 ${group} 已复制` : `复制失败，请手动记下群号 ${group}`, ok ? "ok" : "warn");
    });
  }

  const qqNumber = document.querySelector("[data-qq-number]");
  if (qqNumber) {
    const activate = async () => {
      const group = qqNumber.textContent.trim() || QQ_GROUP;
      const ok = await copyText(group);
      showNote(ok ? `群号 ${group} 已复制` : `请手动复制：${group}`, ok ? "ok" : "warn");
    };
    qqNumber.addEventListener("click", activate);
    qqNumber.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  }
})();
