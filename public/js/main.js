(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const themeButtons = document.querySelectorAll(".theme-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  const themeKey = "shunature-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  // --- Loader Animation ("鯨" -> "と" -> "ネガ" @ 0.25s intervals) ---
  const loaderOverlay = document.querySelector("#loader-overlay");
  if (loaderOverlay) {
    const char1 = loaderOverlay.querySelector(".char-1");
    const char2 = loaderOverlay.querySelector(".char-2");
    const char3 = loaderOverlay.querySelector(".char-3");

    setTimeout(() => { char1?.classList.add("show"); }, 250);
    setTimeout(() => { char2?.classList.add("show"); }, 500);
    setTimeout(() => { char3?.classList.add("show"); }, 750);
    setTimeout(() => {
      loaderOverlay.classList.add("fade-out");
    }, 1150);
  }

  // --- Theme Controller ---
  function setTheme(theme, save = true) {
    const current = theme === "dark" ? "dark" : "light";
    root.dataset.theme = current;
    themeButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(current === "dark"));
      btn.setAttribute(
        "aria-label",
        current === "dark" ? "ライトテーマに切り替え" : "ダークテーマに切り替え"
      );
    });
    if (save) {
      try { localStorage.setItem(themeKey, current); } catch (_) {}
    }
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(themeKey);
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {}
    return systemTheme.matches ? "dark" : "light";
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  });

  systemTheme.addEventListener?.("change", (e) => {
    try { if (localStorage.getItem(themeKey)) return; } catch (_) {}
    setTheme(e.matches ? "dark" : "light", false);
  });

  // --- Mobile Drawer Menu ---
  function closeMenu() {
    if (!menu || !menuButton) return;
    menu.dataset.open = "false";
    menu.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "メニューを開く");
    menuButton.textContent = "MENU";
    body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!menu || !menuButton) return;
    menu.dataset.open = "true";
    menu.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "メニューを閉じる");
    menuButton.textContent = "CLOSE";
    body.classList.add("menu-open");
    menu.querySelector("a")?.focus();
  }

  menuButton?.addEventListener("click", () => {
    menu?.dataset.open === "true" ? closeMenu() : openMenu();
  });

  menu?.addEventListener("click", (e) => {
    if (e.target === menu || e.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // --- Tag Filter Engine ---
  const filterBtns = document.querySelectorAll(".tag-filter-btn");
  const articleItems = document.querySelectorAll(".article-item");

  if (filterBtns.length > 0 && articleItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTag = btn.dataset.tag;
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        articleItems.forEach((item) => {
          if (targetTag === "all") {
            item.removeAttribute("hidden");
          } else {
            const itemTags = (item.dataset.tags || "").split(",").map((t) => t.trim());
            if (itemTags.includes(targetTag)) {
              item.removeAttribute("hidden");
            } else {
              item.setAttribute("hidden", "true");
            }
          }
        });
      });
    });
  }

  // --- Contact Modal ---
  const contactModal = document.querySelector("#contact-modal");
  const contactClose = contactModal?.querySelector(".contact-close");
  const contactOptions = contactModal?.querySelectorAll(".contact-option") || [];
  const contactTriggers = document.querySelectorAll(".modal-trigger");

  function openContactModal(e) {
    if (e) e.preventDefault();
    if (!contactModal) return;
    contactModal.showModal();
    contactClose?.focus();
  }

  function closeContactModal() {
    if (!contactModal?.open) return;
    contactModal.close();
  }

  contactTriggers.forEach((trigger) => {
    trigger.addEventListener("click", openContactModal);
  });

  contactClose?.addEventListener("click", closeContactModal);

  contactModal?.addEventListener("click", (e) => {
    if (!contactModal.open) return;
    const rect = contactModal.getBoundingClientRect();
    const inDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right;
    if (!inDialog) closeContactModal();
  });

  contactOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const subject = option.dataset.subject || "";
      const query = subject ? `?subject=${encodeURIComponent(subject)}` : "";
      closeContactModal();
      window.location.href = `mailto:contact@ffnet.work${query}`;
    });
  });

  // Initialize
  setTheme(getInitialTheme(), false);
})();
