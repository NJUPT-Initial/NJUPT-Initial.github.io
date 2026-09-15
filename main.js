(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("js-ready");

  const splashCopy = document.body.classList.contains("page-robocon")
    ? "规则写在场上"
    : document.body.classList.contains("page-team")
      ? "找个工位，开始做"
      : "让机器先动起来";
  const splashSeenKey = "initial-intro-seen";
  let splash = null;
  let splashTimer = 0;
  let splashLocked = false;

  const buildSplash = () => {
    if (splash || reduceMotion) return;
    splash = document.createElement("div");
    splash.className = "intro-splash";
    splash.setAttribute("aria-hidden", "true");
    splash.innerHTML = `<div class="splash-half splash-orange"></div><div class="splash-half splash-blue"></div><div class="splash-grid"></div><img class="splash-logo" src="assets/team-logo.svg" alt="NJUPT Initial 队徽"><div class="splash-robot-wrap"><img class="splash-robot splash-ghost splash-ghost-orange" src="assets/robot-cutout.png" alt=""><img class="splash-robot splash-ghost splash-ghost-blue" src="assets/robot-cutout.png" alt=""><img class="splash-robot" src="assets/robot-cutout.png" alt=""></div><div class="splash-name"><span>NJUPT / INITIAL</span><strong>${splashCopy}</strong><small>ROBOCON ROBOTICS TEAM</small></div><div class="splash-gear-field" aria-hidden="true"><i class="gear gear-large"></i><i class="gear gear-small"></i><i class="gear gear-ring"></i><i class="gear gear-ticks"></i><i class="gear gear-core"></i><span class="gear-label">SYSTEM / READY</span><span class="gear-status gear-status-a">MOTOR ONLINE</span><span class="gear-status gear-status-b">FIELD TEST / 2026</span><span class="gear-readout">04 : 26 : 07</span></div><div class="splash-scroll"><span>SCROLL</span><i></i></div>`;
    document.body.prepend(splash);
  };

  const playSplash = () => {
    if (reduceMotion || splashLocked) return;
    buildSplash();
    splashLocked = true;
    document.body.classList.add("intro-active");
    splash.classList.remove("is-dismissed", "is-revealing");
    window.clearTimeout(splashTimer);
  };

  const revealSplash = () => {
    if (!splash || splash.classList.contains("is-dismissed")) return;
    splash.classList.add("is-revealing");
    window.clearTimeout(splashTimer);
    splashTimer = window.setTimeout(() => {
      splash.classList.add("is-dismissed");
      splashLocked = false;
      document.body.classList.remove("intro-active");
    }, 1450);
  };

  const seen = (() => {
    try { return sessionStorage.getItem(splashSeenKey) === "1"; } catch { return false; }
  })();
  if (!seen && !reduceMotion) {
    try { sessionStorage.setItem(splashSeenKey, "1"); } catch { /* continue without persistence */ }
    playSplash();
  }

  window.addEventListener("wheel", (event) => {
    if (reduceMotion) return;
    const direction = event.deltaY > 0 ? "down" : "up";
    const atTop = window.scrollY <= 8;
    if (direction === "up" && atTop && !splashLocked) {
      playSplash();
    } else if (direction === "down" && splash && !splash.classList.contains("is-dismissed")) {
      revealSplash();
    }
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener("touchstart", (event) => {
    touchStartY = event.touches[0]?.clientY || 0;
  }, { passive: true });
  window.addEventListener("touchmove", (event) => {
    if (!splashLocked || reduceMotion) return;
    const currentY = event.touches[0]?.clientY || touchStartY;
    if (touchStartY - currentY > 12) {
      event.preventDefault();
      revealSplash();
    } else {
      event.preventDefault();
    }
  }, { passive: false });

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
