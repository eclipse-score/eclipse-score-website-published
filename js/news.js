$(function () {
  const $carousel = $(".news-slider");
  const $carouselWrapper = $carousel.closest(".owl-carousel-wrapper");
  const $navButtons = $carouselWrapper.find(".custom-prev, .custom-next");

  const responsiveConfig = {
    0: { items: 1 },
    992: { items: 2 },
    1200: { items: 3 },
  };

  const newsOwl = $carousel.owlCarousel({
    loop: true,
    margin: 16,
    nav: false,
    responsive: responsiveConfig,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
  });

  function updateNavVisibility() {
    const data = $carousel.data("owl.carousel");
    if (!data) return;

    const totalItems = data._items.length;

    if (totalItems <= 1) {
      $navButtons.hide();
    } else {
      $navButtons.show();
    }
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
