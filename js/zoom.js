$(function () {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  $(".panzoom-container").each(function () {
    const panzoomElement = this;

    const panzoom = Panzoom(panzoomElement, {
      maxScale: 4,
      minScale: 1,
      contain: "outside",
      panOnlyWhenZoomed: true,
    });

    if (isTouchDevice) {
      panzoomElement.parentElement.addEventListener(
        "wheel",
        panzoom.zoomWithWheel,
        { passive: false }
      );

      panzoomElement.parentElement.addEventListener("touchstart", () => {}, {
        passive: false,
      });
    }
  });
});
