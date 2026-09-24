(() => {
  const button = document.querySelector("#language");
  let language = "en";
  try { if (localStorage.getItem("grad-application-language") === "zh") language = "zh"; } catch {}
  function render() {
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
    document.querySelectorAll("[data-en][data-zh]").forEach(el => { el.textContent = el.dataset[language]; });
    button.textContent = language === "en" ? "中文" : "English";
    button.setAttribute("aria-label", language === "en" ? "切換至中文" : "Switch to English");
  }
  render();
  button.hidden = false;
  button.addEventListener("click", () => {
    language = language === "en" ? "zh" : "en";
    render();
    try { localStorage.setItem("grad-application-language", language); } catch {}
  });
})();
