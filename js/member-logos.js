/**
 * member-logos.js
 *
 * Fetches the member organizations for the Eclipse S-CORE project from the
 * Eclipse Foundation API and dynamically populates every `.contributor-slider`
 * Owl Carousel on the page.
 *
 * Falls back silently to the static logos already present in the HTML if the
 * API call fails or returns no usable data.
 *
 * API reference:
 *   https://membership.eclipse.org/api/projects/automotive.score/organizations
 */
(function ($) {
  "use strict";

  var ECLIPSE_API_URL =
    "https://membership.eclipse.org/api/projects/automotive.score/organizations";

  /** Milliseconds before giving up on the API request. */
  var API_TIMEOUT = 10000;

  var CAROUSEL_CONFIG = {
    loop: true,
    margin: 24,
    nav: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 5 },
    },
    autoplay: true,
    autoplayTimeout: 1000,
    autoplayHoverPause: true,
  };

  /**
   * Build an Owl Carousel item card for a single organization.
   *
   * @param {string} logoUrl   – absolute URL of the logo image
   * @param {string} orgName   – human-readable organization name (used as alt text)
   * @param {string|null} orgUrl – organization's website (wraps logo in a link when set)
   * @returns {string} HTML string for one carousel card
   */
  function buildCard(logoUrl, orgName, orgUrl) {
    var imgTag =
      '<img src="' +
      logoUrl +
      '" alt="' +
      $("<div>").text(orgName).html() +
      '" />';

    var inner = orgUrl
      ? '<a href="' +
        orgUrl +
        '" target="_blank" rel="noopener noreferrer">' +
        imgTag +
        "</a>"
      : imgTag;

    return (
      '<div class="card">' +
      '<div class="icon contributor-icon">' +
      inner +
      "</div>" +
      "</div>"
    );
  }

  /**
   * Derive a logo URL from an organization object returned by the API.
   * The API may supply the URL directly in several fields:
   * - logos.web (new API format)
   * - logo (old API format)
   * Or we can construct it from the numeric membership `id` using the
   * Eclipse Foundation's standard logo path.
   *
   * @param {Object} org
   * @returns {string|null}
   */
  function getLogoUrl(org) {
    if (org.logos && org.logos.web) return org.logos.web;
    if (org.logo) return org.logo;
    var id = parseInt(org.id, 10);
    if (!isNaN(id)) {
      return "https://www.eclipse.org/membership/logos/" + id + "-web.png";
    }
    return null;
  }

  /**
   * Return the organization's homepage URL from whichever field the API
   * happens to use.
   *
   * @param {Object} org
   * @returns {string|null}
   */
  function getOrgUrl(org) {
    return org.website || org.website_url || org.url || org.homepage_url || null;
  }

  /**
   * Normalize the API response to a plain array of organization objects.
   * The Eclipse Foundation API has returned arrays directly in some versions
   * and wrapped objects in others.
   *
   * @param {*} data – raw parsed JSON
   * @returns {Array}
   */
  function extractOrgs(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.organizations)) return data.organizations;
    if (data && Array.isArray(data.relations)) {
      return data.relations.map(function (r) {
        return r.organization || r;
      });
    }
    return [];
  }

  /**
   * Compute the number of visible carousel items for the current viewport,
   * using the same responsive breakpoints as CAROUSEL_CONFIG.
   *
   * @returns {number}
   */
  function getVisibleItems() {
    var winWidth = $(window).width();
    var visibleItems = 1;
    Object.keys(CAROUSEL_CONFIG.responsive)
      .map(Number)
      .sort(function (a, b) {
        return a - b;
      })
      .forEach(function (bp) {
        if (winWidth >= bp) {
          visibleItems = CAROUSEL_CONFIG.responsive[bp].items;
        }
      });
    return visibleItems;
  }

  /**
   * Show or hide prev/next navigation buttons depending on whether there are
   * more items than the carousel can display at once.
   *
   * @param {jQuery} $carousel
   */
  function updateNavVisibility($carousel) {
    var data = $carousel.data("owl.carousel");
    if (!data) return;
    var totalItems = data._items.length;
    var $wrapper = $carousel.closest(".owl-carousel-wrapper");
    if (totalItems <= getVisibleItems()) {
      $wrapper.find(".custom-prev, .custom-next").hide();
    } else {
      $wrapper.find(".custom-prev, .custom-next").show();
    }
  }

  /**
   * Destroy the existing Owl Carousel instance on $carousel, replace its
   * child content with the provided HTML string, and initialize a fresh
   * carousel.
   *
   * @param {jQuery} $carousel
   * @param {string} itemsHtml – concatenated HTML for all new `.card` items
   */
  function rebuildCarousel($carousel, itemsHtml) {
    // Tear down the existing Owl Carousel so we can safely replace children.
    if ($carousel.data("owl.carousel")) {
      $carousel.trigger("destroy.owl.carousel");
      $carousel.removeClass("owl-carousel owl-loaded owl-drag");
    }

    $carousel.html(itemsHtml);

    // Restore the class that Owl Carousel requires and initialize.
    $carousel.addClass("owl-carousel");
    $carousel.owlCarousel(CAROUSEL_CONFIG);

    // Wire up the custom prev/next buttons that are part of the site's markup.
    // Use .off("click") first to remove any handlers added by contributor-slider.js
    // so that a single button click advances the carousel exactly once.
    var $wrapper = $carousel.closest(".owl-carousel-wrapper");
    $wrapper.find(".custom-next").off("click").on("click", function () {
      $carousel.trigger("next.owl.carousel");
    });
    $wrapper.find(".custom-prev").off("click").on("click", function () {
      $carousel.trigger("prev.owl.carousel");
    });

    updateNavVisibility($carousel);
  }

  /**
   * Entry point – fetches organizations from the Eclipse Foundation API and,
   * on success, rebuilds every `.contributor-slider` on the page with the
   * retrieved logos.  On failure the page retains whatever static logos were
   * already rendered in the HTML.
   */
  $(function () {
    var $carousels = $(".contributor-slider");
    if (!$carousels.length) return;

    $.ajax({
      url: ECLIPSE_API_URL,
      dataType: "json",
      timeout: API_TIMEOUT,
      success: function (data) {
        var orgs = extractOrgs(data).filter(function (org) {
          return org && (org.logos && org.logos.web) || org.logo || !isNaN(parseInt(org.id, 10));
        });

        if (!orgs.length) return;

        var html = "";
        orgs.forEach(function (org) {
          var logoUrl = getLogoUrl(org);
          if (!logoUrl) return;
          html += buildCard(logoUrl, org.name || "", getOrgUrl(org));
        });

        if (!html) return;

        $carousels.each(function () {
          rebuildCarousel($(this), html);
        });

        // Use a namespaced event and unbind first so multiple successful calls
        // (e.g. during hot-reload in development) never stack up listeners.
        $(window)
          .off("resize.memberLogos")
          .on("resize.memberLogos", function () {
            $carousels.each(function () {
              updateNavVisibility($(this));
            });
          });
      },
      // On error: fall back silently to static logos already on the page.
    });
  });
})(jQuery);
