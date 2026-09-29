(() => {
  document.documentElement.classList.add("js");

  const languageButton = document.querySelector("#language");
  const menuButton = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#site-menu");
  const siteHeader = document.querySelector(".site-header");
  const researchList = document.querySelector("#research-list");
  const researchItems = [...document.querySelectorAll("[data-research-item]")];
  const researchSearch = document.querySelector("#research-search");
  const researchSort = document.querySelector("#research-sort");
  const researchCount = document.querySelector("#research-count");
  const researchEmpty = document.querySelector("#research-empty");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  let language = "en";
  let activeFilter = "all";

  researchItems.forEach((item, index) => { item.dataset.originalOrder = index; });

  try {
    if (localStorage.getItem("research-homepage-language") === "zh") language = "zh";
  } catch {}

  function updateResearchList() {
    const query = researchSearch.value.trim().toLocaleLowerCase();
    const sortedItems = [...researchItems].sort((a, b) => {
      if (researchSort.value === "title") {
        return a.querySelector("h3").textContent.localeCompare(b.querySelector("h3").textContent, language === "zh" ? "zh-Hant" : "en");
      }
      return Number(b.dataset.year) - Number(a.dataset.year) || Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
    });

    let visibleCount = 0;
    sortedItems.forEach((item) => {
      researchList.append(item);
      const matchesFilter = activeFilter === "all" || item.dataset.type === activeFilter;
      const matchesQuery = !query || item.textContent.toLocaleLowerCase().includes(query);
      item.hidden = !(matchesFilter && matchesQuery);
      if (!item.hidden) visibleCount += 1;
    });

    researchEmpty.hidden = visibleCount !== 0;
    researchCount.textContent = language === "zh" ? `${visibleCount} 項研究` : `${visibleCount} research item${visibleCount === 1 ? "" : "s"}`;
  }

  function renderLanguage() {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
    document.querySelectorAll("[data-en][data-zh]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    document.querySelectorAll("[data-placeholder-en][data-placeholder-zh]").forEach((element) => {
      element.placeholder = element.dataset[`placeholder${language === "en" ? "En" : "Zh"}`];
    });
    languageButton.textContent = language === "en" ? "中文" : "English";
    languageButton.setAttribute("aria-label", language === "en" ? "切換至中文" : "Switch to English");
    updateResearchList();
  }

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    const symbol = menuButton.querySelector("[aria-hidden]");
    if (symbol) symbol.textContent = open ? "−" : "＋";
  }

  renderLanguage();
  languageButton.hidden = false;

  languageButton.addEventListener("click", () => {
    language = language === "en" ? "zh" : "en";
    renderLanguage();
    try { localStorage.setItem("research-homepage-language", language); } catch {}
  });

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-pressed", String(selected));
      });
      updateResearchList();
    });
  });
  researchSearch.addEventListener("input", updateResearchList);
  researchSort.addEventListener("change", updateResearchList);

  menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  menu.querySelectorAll("a[href^='#']").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const updateHeader = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const sectionLinks = [...menu.querySelectorAll("a[href^='#']")];
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const updateActiveSection = () => {
    const readingLine = window.scrollY + window.innerHeight * .28;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= readingLine) current = section;
    });
    sectionLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
    });
  };
  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection, { passive: true });
})();
