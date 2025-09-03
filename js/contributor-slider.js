$(function () {
  const $contributorCarousel = $(".contributor-slider");
  const responsiveConfig = {
    0: { items: 1 },
    600: { items: 2 },
    1000: { items: 5 },
  };
  $contributorCarousel.owlCarousel({
    loop: true,
    margin: 24,
    nav: false,
    responsive: responsiveConfig,
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
  });

  function getVisibleItems() {
    const winWidth = $(window).width();
    let visibleItems = 1;
    Object.keys(responsiveConfig)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((bp) => {
        if (winWidth >= bp) {
          visibleItems = responsiveConfig[bp].items;
        }
      });
    return visibleItems;
  }

  function updateNavVisibility() {
    const data = $contributorCarousel.data("owl.carousel");
    if (!data) return;
    const totalItems = data._items.length;
    const visibleItems = getVisibleItems();
    if (totalItems <= visibleItems) {
      $contributorCarousel.closest('.owl-carousel-wrapper').find(".custom-prev, .custom-next").hide();
    } else {
      $contributorCarousel.closest('.owl-carousel-wrapper').find(".custom-prev, .custom-next").show();
    }
  }

  $contributorCarousel.closest('.owl-carousel-wrapper').find(".custom-next").on("click", function () {
    $contributorCarousel.trigger("next.owl.carousel");
  });
  $contributorCarousel.closest('.owl-carousel-wrapper').find(".custom-prev").on("click", function () {
    $contributorCarousel.trigger("prev.owl.carousel");
  });
  updateNavVisibility();

  $(window).on("resize", updateNavVisibility);
});
