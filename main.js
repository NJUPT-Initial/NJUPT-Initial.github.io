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

  const copyBtn = document.querySelector("[data-copy-qq]");
  const copyNote = document.querySelector("[data-copy-note]");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const qq = copyBtn.getAttribute("data-qq") || "1098311500";
      try {
        await navigator.clipboard.writeText(qq);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = qq;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      if (copyNote) {
        copyNote.hidden = false;
        window.setTimeout(() => {
          copyNote.hidden = true;
        }, 2000);
      }
    });
  }
})();
