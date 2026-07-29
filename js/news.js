$(function () {
  const $carousel = $(".news-slider");
  const $carouselWrapper = $carousel.closest(".owl-carousel-wrapper");
  const $navButtons = $carouselWrapper.find(".custom-prev, .custom-next");
  const totalEntries = $carousel.children(".card").length;
  const maxItems = Math.max(1, totalEntries);

  const responsiveConfig = {
    0: { items: 1 },
    992: { items: Math.min(2, maxItems) },
    1200: { items: Math.min(3, maxItems) },
  };

  $carousel.owlCarousel({
    loop: false,
    margin: 16,
    nav: false,
    responsive: responsiveConfig,
    autoplay: false,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    rewind: false,
  });

  function updateNavVisibility() {
    $navButtons.hide();
  }

  $carouselWrapper.find(".custom-next").on("click", function () {
    $carousel.trigger("next.owl.carousel");
  });

  $carouselWrapper.find(".custom-prev").on("click", function () {
    $carousel.trigger("prev.owl.carousel");
  });

  updateNavVisibility();
  $(window).on("resize", updateNavVisibility);
});
