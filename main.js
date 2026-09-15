(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("js-ready");

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

  const openQqGroup = (group) => {
    // Desktop QQ / 手机 QQ 通用唤起；未安装时会静默失败，由调用方提示
    const schemes = [
      `mqqwpa://im/chat?chat_type=group&uin=${group}&src_type=web&version=1`,
      `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${group}&card_type=group&source=qrcode`,
    ];
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;width:0;height:0;border:0;visibility:hidden";
    iframe.src = schemes[0];
    document.body.appendChild(iframe);
    window.setTimeout(() => {
      window.location.href = schemes[0];
    }, 80);
    window.setTimeout(() => {
      iframe.remove();
    }, 1500);
  };

  const joinBtn = document.querySelector("[data-join-qq]");
  if (joinBtn) {
    joinBtn.addEventListener("click", async () => {
      const group = joinBtn.getAttribute("data-qq") || QQ_GROUP;
      const copied = await copyText(group);
      openQqGroup(group);
      showNote(
        copied
          ? `已复制群号 ${group}。若 QQ 未自动打开，请打开 QQ → 添加群 → 粘贴群号。`
          : `请打开 QQ 搜索群号 ${group} 加入。`,
        "ok"
      );
    });
  }

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
