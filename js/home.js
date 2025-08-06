$(function () {
  var myFullpage = new fullpage("#fullpage", {
    anchors: [
      "hero",
      "s-core-in-a-nutshell",
      "latest-news-events",
      "the-focus-of-s-core-are-safety-critical-in-car-components",
      "s-core-aims-to-build-up-all-sw-platform",
      "what-else-are-the-deliverables-of-s-core",
      "why-is-s-core-needed",
      "footer",
    ],
    navigation: true,
    slidesNavigation: true,
    scrollingSpeed: 1000,
    dragAndMove: true,
    controlArrows: false,
    lazyLoading: false,

    autoScrolling: true,
    fitToSection: true,
    scrollOverflow: true,
    scrollOverflowOptions: {
      scrollbars: true,
      fadeScrollbars: false,
      mouseWheel: true,
      interactiveScrollbars: true,
      bounce: false,
      momentum: true,
      deceleration: 0.002, // good smoothness
    },
  });
});
