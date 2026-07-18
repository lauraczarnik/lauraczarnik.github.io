/* Motor de idiomas del sitio: aplica window.SITE_I18N a los elementos [data-i18n*]. */
(function () {
  var LANG_KEY = "site_lang";
  var DEFAULT_LANG = "es";
  var SUPPORTED = ["es", "en", "pl"];

  function getLang() {
    var stored = null;
    try { stored = localStorage.getItem(LANG_KEY); } catch (e) {}
    return SUPPORTED.indexOf(stored) !== -1 ? stored : DEFAULT_LANG;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyLang(lang);
  }

  function resolve(dict, key) {
    return key.split(".").reduce(function (acc, part) {
      return acc && typeof acc === "object" ? acc[part] : undefined;
    }, dict);
  }

  function applyLang(lang) {
    var dict = (window.SITE_I18N && window.SITE_I18N[lang]) ||
               (window.SITE_I18N && window.SITE_I18N[DEFAULT_LANG]);
    if (!dict) return;

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = resolve(dict, el.getAttribute("data-i18n"));
      if (val != null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var val = resolve(dict, el.getAttribute("data-i18n-html"));
      if (val != null) el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        pair = pair.trim();
        if (!pair) return;
        var idx = pair.indexOf(":");
        if (idx === -1) return;
        var attr = pair.slice(0, idx).trim();
        var key = pair.slice(idx + 1).trim();
        var val = resolve(dict, key);
        if (val != null) el.setAttribute(attr, val);
      });
    });

    document.querySelectorAll(".lang-switcher [data-lang]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  function init() {
    applyLang(getLang());
    document.querySelectorAll(".lang-switcher [data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        setLang(btn.getAttribute("data-lang"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
