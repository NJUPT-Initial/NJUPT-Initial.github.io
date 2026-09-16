(() => {
  "use strict";

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const splashSeenKey = "initial-intro-seen";
  const QQ_GROUP = "1098311500";
  let splash = null;
  let splashTimer = 0;
  let sloganTimer = 0;
  let splashLocked = false;
  let touchStartY = 0;
  let previousFocus = null;
  let inertTargets = [];

  const isReducedMotion = () => motionQuery.matches;
  const pageSlogan = document.body.classList.contains("page-robocon")
    ? "规则写在场上"
    : document.body.classList.contains("page-team")
      ? "来聊聊你想做的机器人"
      : "让机器先动起来";

  const readSeen = () => {
    try {
      return sessionStorage.getItem(splashSeenKey) === "1";
    } catch {
      return false;
    }
  };
  const writeSeen = () => {
    try {
      sessionStorage.setItem(splashSeenKey, "1");
    } catch {
      /* storage is optional */
    }
  };

  const setBackgroundInert = (locked) => {
    if (locked) {
      if (!previousFocus)
        previousFocus =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
      inertTargets = [...document.body.children]
        .filter((child) => child !== splash)
        .map((child) => ({
          child,
          inert: child.inert,
          hadInertAttribute: child.hasAttribute("inert"),
          ariaHidden: child.getAttribute("aria-hidden"),
        }));
      inertTargets.forEach(({ child }) => {
        child.inert = true;
        child.setAttribute("aria-hidden", "true");
      });
      return;
    }
    inertTargets.forEach(({ child, inert, hadInertAttribute, ariaHidden }) => {
      child.inert = inert;
      if (hadInertAttribute) child.setAttribute("inert", "");
      else child.removeAttribute("inert");
      if (ariaHidden === null) child.removeAttribute("aria-hidden");
      else child.setAttribute("aria-hidden", ariaHidden);
    });
    inertTargets = [];
    if (
      previousFocus &&
      document.contains(previousFocus) &&
      !previousFocus.hidden
    )
      previousFocus.focus({ preventScroll: true });
    previousFocus = null;
  };

  const buildSplash = () => {
    if (splash || isReducedMotion()) return;
    splash = document.createElement("div");
    splash.className = "intro-splash";
    splash.setAttribute("role", "dialog");
    splash.setAttribute("aria-modal", "true");
    splash.setAttribute("aria-label", "NJUPT Initial 入口");
    splash.setAttribute("aria-describedby", "intro-splash-slogan");
    splash.setAttribute("tabindex", "-1");
    splash.innerHTML = `
      <div class="splash-slogan" id="intro-splash-slogan" aria-hidden="false">
        <span>NJUPT / INITIAL</span>
        <strong>先让它动起来</strong>
        <small>南京邮电大学机器人战队<br>ROBOCON / 2026</small>
      </div>
      <div class="splash-stage">
        <div class="splash-half splash-orange" aria-hidden="true"></div>
        <div class="splash-half splash-blue" aria-hidden="true"></div>
        <div class="splash-grid" aria-hidden="true"></div>
        <img class="splash-logo" src="assets/team-logo.svg" alt="NJUPT Initial 队徽">
        <div class="splash-robot-wrap" aria-hidden="true">
          <img class="splash-robot splash-ghost splash-ghost-orange" src="assets/robot-cutout.png" alt="">
          <img class="splash-robot splash-ghost splash-ghost-blue" src="assets/robot-cutout.png" alt="">
          <img class="splash-robot" src="assets/robot-cutout.png" alt="">
        </div>
        <div class="splash-name">
          <span>NJUPT / 南京邮电大学</span>
          <strong id="intro-splash-title">INITIAL</strong>
          <small>机器人战队 · ROBOCON</small>
          <em class="splash-tagline">${pageSlogan}</em>
        </div>
        <button class="splash-gear-field" type="button" aria-pressed="false" aria-label="互动齿轮界面，点击加速">
          <span class="gear-assembly" aria-hidden="true">
            <span class="gear gear-large"></span>
            <span class="gear gear-small"></span>
            <span class="gear gear-ring"></span>
            <span class="gear gear-ticks"></span>
            <span class="gear gear-scan"></span>
            <span class="gear gear-core"></span>
          </span>
          <span class="gear-label">机械 · 硬件 · 电控 · 算法</span>
          <span class="gear-hint">点击加速</span>
        </button>
      </div>`;
    document.body.prepend(splash);
    const stage = splash.querySelector(".splash-stage");
    stage.inert = true;
    stage.setAttribute("aria-hidden", "true");

    const gearField = splash.querySelector(".splash-gear-field");
    const resetGearParallax = () => {
      gearField.style.setProperty("--gear-x", "0deg");
      gearField.style.setProperty("--gear-y", "0deg");
    };
    gearField.addEventListener("pointermove", (event) => {
      const rect = gearField.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      gearField.style.setProperty("--gear-x", `${x * 7}deg`);
      gearField.style.setProperty("--gear-y", `${y * -7}deg`);
    });
    gearField.addEventListener("pointerleave", resetGearParallax);
    const gearHint = gearField.querySelector(".gear-hint");
    gearField.addEventListener("click", () => {
      const boosted = !gearField.classList.contains("is-boosted");
      gearField.classList.toggle("is-boosted", boosted);
      gearField.setAttribute("aria-pressed", String(boosted));
      gearField.setAttribute(
        "aria-label",
        boosted ? "互动齿轮界面，点击恢复转速" : "互动齿轮界面，点击加速",
      );
      if (gearHint)
        gearHint.textContent = boosted ? "点击恢复转速" : "点击加速";
    });
    splash
      .querySelector(".splash-scroll")
      ?.addEventListener("click", revealSplash);
    splash.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        const stageActive = !stage.inert;
        const focusable = stageActive
          ? [...splash.querySelectorAll("button:not([disabled])")]
          : [];
        if (!focusable.length) {
          event.preventDefault();
          splash.focus({ preventScroll: true });
        } else {
          const index = focusable.indexOf(document.activeElement);
          const next = event.shiftKey
            ? index <= 0
              ? focusable.length - 1
              : index - 1
            : index === focusable.length - 1
              ? 0
              : index + 1;
          event.preventDefault();
          focusable[next].focus({ preventScroll: true });
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        revealSplash();
        return;
      }
      if (
        (event.key === "Enter" || event.key === " ") &&
        event.target !== gearField
      ) {
        event.preventDefault();
        revealSplash();
      }
    });
  };

  const destroySplash = () => {
    window.clearTimeout(splashTimer);
    window.clearTimeout(sloganTimer);
    splashTimer = 0;
    sloganTimer = 0;
    splashLocked = false;
    document.body.classList.remove("intro-active");
    setBackgroundInert(false);
    if (splash) {
      splash.classList.add("is-dismissed");
      splash.setAttribute("aria-hidden", "true");
      splash.inert = true;
      splash.remove();
      splash = null;
    }
  };

  const playSplash = () => {
    if (isReducedMotion() || splashLocked) return;
    if (splash) destroySplash();
    buildSplash();
    if (!splash) return;
    splashLocked = true;
    document.body.classList.add("intro-active");
    previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    splash.removeAttribute("aria-hidden");
    splash.inert = false;
    splash.focus({ preventScroll: true });
    setBackgroundInert(true);
    void splash.offsetWidth;
    sloganTimer = window.setTimeout(() => {
      if (!splash || !splashLocked) return;
      splash.classList.add("is-ready");
      splash
        .querySelector(".splash-slogan")
        ?.setAttribute("aria-hidden", "true");
      const stage = splash.querySelector(".splash-stage");
      stage.inert = false;
      stage.removeAttribute("aria-hidden");
    }, 1800);
  };

  const revealSplash = () => {
    if (!splash || !splashLocked || splash.classList.contains("is-revealing"))
      return;
    splash.classList.add("is-ready", "is-revealing");
    splash.querySelector(".splash-slogan")?.setAttribute("aria-hidden", "true");
    const stage = splash.querySelector(".splash-stage");
    stage.inert = false;
    stage.removeAttribute("aria-hidden");
    window.clearTimeout(sloganTimer);
    window.clearTimeout(splashTimer);
    splashTimer = window.setTimeout(() => {
      writeSeen();
      destroySplash();
    }, 1450);
  };

  const unlockForReducedMotion = () => {
    if (!isReducedMotion()) return;
    destroySplash();
  };

  if (!readSeen() && !isReducedMotion()) playSplash();
  else if (isReducedMotion()) unlockForReducedMotion();

  window.addEventListener(
    "wheel",
    (event) => {
      if (isReducedMotion()) return;
      if (splashLocked) {
        event.preventDefault();
        if (event.deltaY > 0) revealSplash();
      } else if (event.deltaY < 0 && window.scrollY <= 8) playSplash();
    },
    { passive: false },
  );
  window.addEventListener(
    "touchstart",
    (event) => {
      touchStartY = event.touches[0]?.clientY || 0;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (event) => {
      if (!splashLocked || isReducedMotion()) return;
      const currentY = event.touches[0]?.clientY || touchStartY;
      event.preventDefault();
      if (touchStartY - currentY > 18) revealSplash();
    },
    { passive: false },
  );

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
      /* use textarea fallback */
    }
    const beforeFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    let textarea;
    try {
      textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.readOnly = true;
      textarea.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textarea?.remove();
      if (beforeFocus && document.contains(beforeFocus))
        beforeFocus.focus({ preventScroll: true });
    }
  };
  const copyBtn = document.querySelector("[data-copy-qq]");
  if (copyBtn)
    copyBtn.addEventListener("click", async () => {
      const group = copyBtn.getAttribute("data-qq") || QQ_GROUP;
      const copied = await copyText(group);
      showNote(
        copied ? `群号 ${group} 已复制` : `复制失败，请手动记下群号 ${group}`,
        copied ? "ok" : "warn",
      );
    });
  const qqNumber = document.querySelector("[data-qq-number]");
  if (qqNumber) {
    const activate = async () => {
      const group = qqNumber.textContent.trim() || QQ_GROUP;
      const copied = await copyText(group);
      showNote(
        copied ? `群号 ${group} 已复制` : `请手动复制：${group}`,
        copied ? "ok" : "warn",
      );
    };
    qqNumber.addEventListener("click", activate);
  }

  const handleMotionChange = (event) => {
    if (event.matches) unlockForReducedMotion();
  };
  if (motionQuery.addEventListener)
    motionQuery.addEventListener("change", handleMotionChange);
  else motionQuery.addListener?.(handleMotionChange);
})();
