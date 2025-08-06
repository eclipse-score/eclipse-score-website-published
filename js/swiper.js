const swiper = new Swiper(".training-modules-swiper", {
  effect: "coverflow",
  loop: true,
  grabCursor: true,
  centeredSlides: true,
  // slidesPerView: 5,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 500,
    stretch: 0,
    depth: 3500,
    modifier: 0.12,
    // modifier: 0.14,
    // slideShadows: true,
  },
  navigation: false,
  // navigation: {
  //   nextEl: ".swiper-button-next",
  //   prevEl: ".swiper-button-prev",
  // },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
