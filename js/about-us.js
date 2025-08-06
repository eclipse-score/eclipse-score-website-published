$(function () {
  const $carousel = $(".about-us-slider");

  const responsiveConfig = {
    0: { items: 1 },
    992: { items: 2 },
    1200: { items: 3 },
  };

  const aboutOwl = $carousel.owlCarousel({
    loop: true,
    margin: 16,
    nav: false,
    responsive: responsiveConfig,
    autoplay: true,
    autoplayTimeout: 5000,
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
    const data = $carousel.data("owl.carousel");
    if (!data) return;

    const totalItems = data._items.length;
    const visibleItems = getVisibleItems();

    if (totalItems <= visibleItems) {
      $(".custom-prev, .custom-next").hide();
    } else {
      $(".custom-prev, .custom-next").show();
    }
  }

  $(".custom-next").on("click", function () {
    $carousel.trigger("next.owl.carousel");
  });

  $(".custom-prev").on("click", function () {
    $carousel.trigger("prev.owl.carousel");
  });

  updateNavVisibility();
  $(window).on("resize", updateNavVisibility);
});
