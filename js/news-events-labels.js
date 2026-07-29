(function () {
  const replacements = {
    "Upcoming Events": "Upcoming Eclipse Events",
    "Past Events": "Past Eclipse Events",
  };

  function replaceLabels(root) {
    if (!root) return;

    const elements = root.querySelectorAll("button, a, [role='button'], .btn, span, label");
    elements.forEach((el) => {
      const text = (el.textContent || "").trim();
      const replacement = replacements[text];
      if (replacement) {
        el.textContent = replacement;
      }
    });
  }

  function applyReplacements() {
    replaceLabels(document);

    document
      .querySelectorAll("efsc-event-filters, efsc-collection, efsc-event-list")
      .forEach((el) => {
        if (el.shadowRoot) {
          replaceLabels(el.shadowRoot);
        }
      });
  }

  function init() {
    applyReplacements();

    const observer = new MutationObserver(function () {
      applyReplacements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.setTimeout(applyReplacements, 1000);
    window.setTimeout(applyReplacements, 2500);
    window.setTimeout(applyReplacements, 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
