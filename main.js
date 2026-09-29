(() => {
  document.documentElement.classList.add("js");

  const languageButton = document.querySelector("#language");
  const menuButton = document.querySelector("#menu-toggle");
  const menu = document.querySelector("#site-menu");
  const siteHeader = document.querySelector(".site-header");
  let language = "en";

  try {
    if (localStorage.getItem("grad-application-language") === "zh") language = "zh";
  } catch {}

  function renderLanguage() {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
    document.querySelectorAll("[data-en][data-zh]").forEach((element) => {
      element.textContent = element.dataset[language];
    });
    languageButton.textContent = language === "en" ? "中文" : "English";
    languageButton.setAttribute("aria-label", language === "en" ? "切換至中文" : "Switch to English");
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
    try { localStorage.setItem("grad-application-language", language); } catch {}
  });

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
