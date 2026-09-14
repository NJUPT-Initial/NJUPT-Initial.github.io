(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.body.classList.add("js-ready");

  // Boot sequence
  const boot = () => document.body.classList.add("is-booted");
  if (reduceMotion) {
    boot();
  } else {
    requestAnimationFrame(() => requestAnimationFrame(boot));
  }

  // Active nav section
  const sectionIds = ["about", "discipline", "rc-dog", "modes", "oss", "join"];
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

  // Mode grid
  const grid = document.querySelector("[data-mode-grid]");
  const detailId = document.querySelector("[data-detail-id]");
  const detailName = document.querySelector("[data-detail-name]");
  const detailDesc = document.querySelector("[data-detail-desc]");

  const selectMode = (cell) => {
    if (!grid || !cell) return;
    grid.querySelectorAll(".mode-cell").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn === cell ? "true" : "false");
    });
    const mode = cell.dataset.mode ?? "";
    const name = cell.dataset.name ?? "";
    const desc = cell.dataset.desc ?? "";
    if (detailId) detailId.textContent = `MODE ${mode.padStart(2, "0")}`;
    if (detailName) detailName.textContent = name;
    if (detailDesc) detailDesc.textContent = desc;
  };

  if (grid) {
    grid.addEventListener("click", (e) => {
      const cell = e.target.closest(".mode-cell");
      if (cell) selectMode(cell);
    });

    grid.addEventListener("focusin", (e) => {
      const cell = e.target.closest(".mode-cell");
      if (cell) selectMode(cell);
    });

    grid.addEventListener("keydown", (e) => {
      const cells = [...grid.querySelectorAll(".mode-cell")];
      const current = document.activeElement?.closest?.(".mode-cell");
      const idx = cells.indexOf(current);
      if (idx < 0) return;

      const cols = 3;
      let next = idx;
      if (e.key === "ArrowRight") next = Math.min(cells.length - 1, idx + 1);
      else if (e.key === "ArrowLeft") next = Math.max(0, idx - 1);
      else if (e.key === "ArrowDown") next = Math.min(cells.length - 1, idx + cols);
      else if (e.key === "ArrowUp") next = Math.max(0, idx - cols);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = cells.length - 1;
      else return;

      e.preventDefault();
      cells[next].focus();
      selectMode(cells[next]);
    });

    const selected = grid.querySelector('.mode-cell[aria-pressed="true"]') || grid.querySelector(".mode-cell");
    selectMode(selected);
  }
})();
