/*jslint browser:true, devel: true, this: true, long: true, unordered: true */
/*global google, jQuery, mobile_menu_title, hero_full_screen, map_canvas_id, map_color, map_initial_zoom, map_initial_latitude, map_initial_longitude, map_markers */

var Neela;

(function ($) {
  "use strict";

  Neela = {
    initialized: false,
    heroFullScreen: hero_full_screen,
    mapCanvasId: map_canvas_id,
    mapColor: map_color,
    mapInitialLatitude: map_initial_latitude,
    mapInitialLongitude: map_initial_longitude,
    mapInitialZoom: map_initial_zoom,
    mapMarkers: map_markers,
    mobMenuFlag: false,
    mobileMenuTitle: mobile_menu_title,

    init: function () {
      var $_self = this;

      if ($_self.initialized) {
        return;
      }

      $_self.initialized = true;
      $_self.build();
      $_self.events();
    },

    build: function () {
      var $_self = this;

      /**
       * Create Neela Style elements
       */
      $_self.neelaStyle();

      /**
       * Preloader
       */
      $_self.preloader();

      /**
       * Dinamically create the menu for mobile devices
       */
      $_self.createMobileMenu();

      /**
       * Fit hero to screen size
       */
      $_self.heroHeight();

      /**
       * Initialize Google Maps and populate with pin locations
       */
      $_self.googleMap();

      /**
       * Initiate Parallax
       */
      $_self.parallaxBg();
    },

    events: function () {
      var $_self = this;
      var isLoadedAnim;

      /**
       * Functions called on window resize
       */
      $_self.windowResize();

      /**
       * Capture object events
       */
      $_self.objEvents();

      /**
       * Animate elements on scrolling
       */
      isLoadedAnim = setInterval(function () {
        if (/loaded|complete/.test(document.readyState)) {
          clearInterval(isLoadedAnim);
          $_self.animateElems();
        }
      }, 10);
    },

    neelaStyle: function () {
      $(".neela-style, .btn.btn-primary, .btn.btn-light, .btn.btn-dark").prepend(
        '<span class="h-lines"></span><span class="v-lines"></span>'
      );
    },

    preloader: function () {
      var isLoaded = setInterval(function () {
        if (/loaded|complete/.test(document.readyState)) {
          clearInterval(isLoaded);
          $("#preloader").fadeOut(1000);
        }
      }, 10);
    },

    createMobileMenu: function (w) {
      var $_self = this;
      var $wrapper = $("#wrapper");
      var $navMobile;
      var etype;

      if ($.browser.mobile) {
        etype = "touchstart";
      } else {
        etype = "click";
      }

      if (w !== null) {
        w = $(window).innerWidth();
      }

      if (w <= 975 && !$_self.mobMenuFlag) {
        $("body").prepend('<nav class="nav-mobile"><i class="fa fa-times"></i><h2>' + $_self.mobileMenuTitle + "</h2><ul></ul></nav>");

        $(".nav-mobile > ul").html($(".nav").html());

        $(".nav-mobile b, .nav-mobile .nav-logo").remove();

        $(".nav-mobile ul.dropdown-menu").removeClass().addClass("dropdown-mobile");

        if ($(".navbar > a.btn").length) {
          $(".navbar > a.btn").each(function () {
            $(".nav-mobile").append($(this).clone());
          });

          $(".nav-mobile > a.btn").removeClass("btn-light").addClass("btn-primary btn-sm");
        }

        $navMobile = $(".nav-mobile");

        $("#nav-mobile-btn").on(etype, function (e) {
          e.stopPropagation();
          e.preventDefault();

          setTimeout(function () {
            $wrapper.addClass("open");
            $navMobile.addClass("open");
          }, 25);

          $(document).on(etype, function (e) {
            if (!$(e.target).hasClass("nav-mobile") && !$(e.target).parents(".nav-mobile").length) {
              $wrapper.removeClass("open");
              $navMobile.removeClass("open");
              $(document).off(etype);
            }
          });

          $(">i", $navMobile).on(etype, function () {
            $wrapper.removeClass("open");
            $navMobile.removeClass("open");
            $(document).off(etype);
          });
        });

        $_self.mobMenuFlag = true;

        $(".nav-mobile li a").on("click", function (event) {
          var navActive = $(this);
          var scroll = 0;

          if (navActive.attr("href") !== "#hero") {
            scroll = $(navActive.attr("href")).offset().top - 65;
          }

          $("html, body")
            .stop()
            .animate(
              {
                scrollTop: scroll
              },
              1500,
              "easeInOutExpo",
              function () {
                navActive.blur();
              }
            );

          $wrapper.removeClass("open");
          $navMobile.removeClass("open");
          $(document).off(etype);

          event.preventDefault();
        });
      }
    },

    heroHeight: function () {
      var $_self = this;

      if ($_self.heroFullScreen) {
        $("#hero").css({ minHeight: $(window).innerHeight() + "px" });

        $(window).resize(function () {
          var padding = parseInt($("#hero").css("padding-bottom")) + 70;
          var nextMargin = parseInt($("#hero").next("section").css("margin-top"));
          var wHeight = $(window).innerHeight() - padding;
          var cHeight = $("#hero >.container").height();
          var dif;
          var xtraMT = -10;

          if (nextMargin < 0 && !Number.isNaN(nextMargin)) {
            wHeight += nextMargin + padding;
          }

          dif = wHeight - cHeight;

          if ($(".nav-section.light").length) {
            xtraMT = 10;
          }

          if (dif > 0 && $(".v-center").length) {
            $("#hero >.container").css({ "margin-top": dif / 2 + xtraMT + "px" });
          }

          $("#hero").css({ minHeight: $(window).innerHeight() + "px" });
        });
      }
    },

    googleMap: function () {
      var $_self = this;
      var createMarker;
      var i = 0;

      if (
        $(`#${$_self.mapCanvasId}`).length === 0 ||
        $_self.mapMarkers === "undefined" ||
        $_self.mapMarkers.length === 0 ||
        window.google === undefined
      ) {
        return false;
      }

      let map;
      async function initMap() {
        const { Map } = await google.maps.importLibrary("maps");

        if (!/^\d|\.|-$/.test($_self.mapInitialLatitude) || !/^\d|\.|-$/.test($_self.mapInitialLongitude)) {
          $_self.mapInitialLatitude = $_self.mapMarkers[0].latitude;
          $_self.mapInitialLongitude = $_self.mapMarkers[0].longitude;
        }

        map = new Map(document.getElementById($_self.mapCanvasId), {
          center: { lat: $_self.mapInitialLatitude, lng: $_self.mapInitialLongitude },
          zoom: $_self.mapInitialZoom,
          scrollwheel: false,
          panControl: false,
          mapTypeControl: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          },
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
          },
          styles: [
            {
              stylers: [{ hue: $_self.mapColor }, { saturation: -75 }, { lightness: 5 }]
            },
            {
              featureType: "administrative",
              elementType: "labels.text.fill",
              stylers: [{ saturation: 20 }, { lightness: -70 }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ saturation: -50 }, { lightness: 40 }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ hue: $_self.mapColor }, { saturation: -100 }, { lightness: 0 }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ hue: $_self.mapColor }, { saturation: 5 }, { lightness: 5 }]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ saturation: 10 }, { lightness: 0 }]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ saturation: 0 }, { lightness: 20 }]
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ hue: $_self.mapColor }, { saturation: 30 }, { lightness: -30 }]
            }
          ]
        });

        $(".gmap").each(function () {
          createMarker = function (obj) {
            var lat = obj.latitude;
            var lng = obj.longitude;
            var icon = obj.icon;
            var info = obj.infoWindow;
            var infowindow = new google.maps.InfoWindow({
              content: '<div class="infoWindow">' + info + "</div>"
            });

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              map: map,
              anchor: 8,
              anchorPoint: new google.maps.Point(0, -50),
              shadow: "none",

              icon: new google.maps.MarkerImage(`/icons/${icon}.svg`, null, null, null, new google.maps.Size(24, 24))
            });

            google.maps.event.addListener(marker, "click", function () {
              infowindow.open(map, marker);
            });
          };

          while (i < $_self.mapMarkers.length) {
            createMarker($_self.mapMarkers[i]);
            i += 1;
          }
        });
      }

      initMap();
    },

    parallaxBg: function () {
      var $_self = this;

      if (!$.browser.mobile && $(window).innerWidth() > 992) {
        $(window).on("scroll", function () {
          var scrolled = $(window).scrollTop();

          $(".parallax-background").each(function () {
            var $elem = $(this);
            var initY = $elem.offset().top;
            var height = $elem.outerHeight();
            var visible = $_self.isInViewport(this);
            var diff;
            var ratio;

            if (visible) {
              diff = scrolled - initY;
              ratio = Math.round((diff / height) * 100);
              $elem.css("background-position", "center " + parseInt(-(ratio * (height / 250))) + "px");
            }
          });
        });
      } else {
        $(".parallax-background").css({
          "background-position": "50% 50%",
          "background-size": "cover",
          "background-attachment": "scroll"
        });
      }
    },

    isInViewport: function (elem) {
      var obj = elem.getBoundingClientRect();

      return (
        (obj.height > 0 || obj.width > 0) &&
        obj.bottom >= 0 &&
        obj.right >= 0 &&
        obj.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        obj.left <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    windowResize: function () {
      var $_self = this;

      $(window).resize(function () {
        var w = $(window).innerWidth();

        $_self.createMobileMenu(w);

        if ($(window).innerWidth() < 751) {
          $(".navbar > a.btn").addClass("btn-sm");
          $(".navbar > a.btn").width("auto");
        }
      });
    },

    objEvents: function () {
      //Fix buttons width (round to integer)
      $(".btn").each(function () {
        var $btn = $(this);
        var w = $btn.width();
        var xtr = 2;
        var len = $btn.text().split(" ").length;

        if (len > 2 || $btn.find("i").length !== 0) {
          xtr = 15;
        } else if (len > 1) {
          xtr = 8;
        }

        $btn.width(Math.round(w) + xtr);
      });

      //Slide map info on mouseenter map_canvas
      $("#map_canvas")
        .on("mouseenter", function () {
          $(".location-info").addClass("open");
        })
        .on("mouseleave", function () {
          $(".location-info").removeClass("open");
        });

      // Scroll effect of navigation logo and .scrollto buttons
      $(".scrollto").on("click", function (event) {
        var $navActive = $(this);
        var scroll = 0;
        var href = $navActive.attr("href");

        if (/#/.test(href) && $(href).length) {
          event.preventDefault();

          if (href !== "#hero") {
            scroll = $(href).offset().top - 65;
          }

          $("html, body")
            .stop()
            .animate(
              {
                scrollTop: scroll
              },
              0,
              "easeInOutExpo",
              function () {
                $navActive.blur();
              }
            );
        }
      });

      //Element V2 image handler
      if ($(".element-v2").length) {
        $(".element-v2").each(function () {
          var $elem = $(">.image", $(this));
          $elem.css({ "background-image": "url(" + $(">img", $elem).attr("src") + ")" });
          $(">img", $elem).hide();
        });
      }

      if ($(".overflow-image").length) {
        $(".overflow-image").each(function () {
          var $elem = $(this);
          $elem.css({ "background-image": "url(" + $(">img", $elem).attr("src") + ")" });
        });
      }

      if ($(".progress").length) {
        $(".progress").waypoint(
          function () {
            $(".progress").each(function () {
              $("> .progress-bar", $(this))
                .delay(300)
                .queue(function (next) {
                  var $elem = $(this);
                  $elem.css("width", $elem.attr("aria-valuenow") + "%");
                  next();
                });
            });
          },
          {
            triggerOnce: true,
            offset: "bottom-in-view"
          }
        );
      }
    },

    animateElems: function () {
      var animate = function () {
        $("[data-animation-delay]").each(function () {
          var $this = $(this);
          var s = $(window).scrollTop();
          var h = $(window).height();
          var d = parseInt($this.attr("data-animation-delay"), 10);
          var dir = $this.data("animation-direction");

          if (dir === undefined) {
            return false;
          }

          $this.addClass("animate-" + dir);

          $(document).ready(function () {
            if (s + h >= $this.offset().top) {
              if (Number.isNaN(d) || d === 0) {
                $this.removeClass("animate-" + dir).addClass("animation-" + dir);
              } else {
                setTimeout(function () {
                  $this.removeClass("animate-me").addClass("animation-" + dir);
                }, d);
              }
            }
          });
        });
      };

      if ($(window).innerWidth() >= 751) {
        $(window).scroll(function () {
          animate();
        });

        animate();
      } else {
        $("[data-animation-delay]").addClass("visible");
      }
    }
  };

  Neela.init();
})(jQuery);
