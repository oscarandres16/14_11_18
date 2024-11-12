// Template Name: Blessed
// Template URL: https://techpedia.co.uk/template/blessed
// Description: Wedding Theme
// Version: 1.0.0
(function (window, document, $, undefined) {
  "use strict";
  // ==========================================================
  // Detect mobile device and add class "is-mobile" to </body>
  // ==========================================================

  // Detect mobile device (Do not remove!!!)
  var isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Nokia|Opera Mini/i.test(
      navigator.userAgent
    )
      ? true
      : false;

  // Add class "is-mobile" to </body>
  if (isMobile) {
    $("body").addClass("is-mobile");
  }

  var Init = {
    i: function (e) {
      Init.s();
      Init.methods();
    },
    s: function (e) {
      (this._window = $(window)),
        (this._document = $(document)),
        (this._body = $("body")),
        (this._html = $("html"));
    },
    methods: function (e) {
      Init.w();
      Init.BackToTop();
      Init.smoothScroll();
      Init.preloader();
      Init.initializeSlick();
      Init.dropdown();
      Init.hamburgerMenu();
      Init.countUpInit(".countdown", "2018/11/14");
    },
    w: function (e) {
      this._window.on("load", Init.l).on("scroll", Init.res);
    },
    BackToTop: function () {
      var btn = $("#backto-top");
      $(window).on("scroll", function () {
        if ($(window).scrollTop() > 300) {
          btn.addClass("show");
        } else {
          btn.removeClass("show");
        }
      });
      btn.on("click", function (e) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          "300"
        );
      });
    },
    preloader: function () {
      setTimeout(function () {
        $("#preloader").hide("slow");
      }, 2000);
    },
    smoothScroll: function () {
      // =======================================================================================
      // Smooth Scrollbar
      // Source: https://github.com/idiotWu/smooth-scrollbar/
      // =======================================================================================

      if ($("body").hasClass("ui-smooth-scroll")) {
        // Not for mobile devices!
        if (!isMobile) {
          var Scrollbar = window.Scrollbar;

          // AnchorPlugin (URL with hash links load in the right position)
          // https://github.com/idiotWu/smooth-scrollbar/issues/440
          // ==================================
          class AnchorPlugin extends Scrollbar.ScrollbarPlugin {
            static pluginName = "anchor";

            onHashChange = () => {
              this.jumpToHash(window.location.hash);
            };

            onClick = (event) => {
              const { target } = event;
              if (target.tagName !== "A") {
                return;
              }
              const hash = target.getAttribute("href");
              if (!hash || hash.charAt(0) !== "#") {
                return;
              }
              this.jumpToHash(hash);
            };

            jumpToHash = (hash) => {
              if (!hash) {
                return;
              }
              const { scrollbar } = this;
              scrollbar.containerEl.scrollTop = 0;
              const target = document.querySelector(hash);
              if (target) {
                scrollbar.scrollIntoView(target, {
                  offsetTop:
                    parseFloat(target.getAttribute("data-offset")) || 0, // Change to set default offset
                });
              }
            };

            onInit() {
              this.jumpToHash(window.location.hash);
              window.addEventListener("hashchange", this.onHashChange);
              this.scrollbar.contentEl.addEventListener("click", this.onClick);
            }

            onDestory() {
              window.removeEventListener("hashchange", this.onHashChange);
              this.scrollbar.contentEl.removeEventListener(
                "click",
                this.onClick
              );
            }
          }

          // usage
          Scrollbar.use(AnchorPlugin);

          // Init Smooth Scrollbar
          // ======================
          Scrollbar.init(document.querySelector("#scroll-container"), {
            damping: 0.06,
            renderByPixel: true,
            continuousScrolling: true,
            alwaysShowTracks: true,
          });

          // 3rd party library setup
          // More info: https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.scrollerProxy()
          // ========================
          let scrollPositionX = 0,
            scrollPositionY = 0,
            bodyScrollBar = Scrollbar.init(
              document.getElementById("scroll-container")
            );

          bodyScrollBar.addListener(({ offset }) => {
            scrollPositionX = offset.x;
            scrollPositionY = offset.y;
          });

          bodyScrollBar.setPosition(0, 0);
          bodyScrollBar.track.xAxis.element.remove();

          // Enable regular scrollbar inside a smooth scrollbar (#scroll-container). IMPORTANT: use class "tt-overflow" on inside scroll elements!
          // ===================================================
          if ($(".tt-overflow").length) {
            // Determine if an element is scrollable
            $.fn.ttIsScrollable = function () {
              return (
                this[0].scrollWidth > this[0].clientWidth ||
                this[0].scrollHeight > this[0].clientHeight
              );
            };

            $(".tt-overflow").each(function () {
              var $this = $(this);
              if ($this.ttIsScrollable()) {
                $this.on("wheel", function (e) {
                  e.stopPropagation();
                });
              }
            });
          }

          // Prevent input[type=number] to scroll on focus
          // ==============================================
          $("input[type=number]").on("focus", function () {
            $(this).on("wheel", function (e) {
              e.stopPropagation();
            });
          });
        }
      }
    },
    dropdown: function () {
      const selectedAll = document.querySelectorAll(".wrapper-dropdown");

      selectedAll.forEach((selected) => {
        const optionsContainer = selected.children[2];
        const optionsList = selected.querySelectorAll(
          "div.wrapper-dropdown li"
        );

        selected.addEventListener("click", () => {
          let arrow = selected.children[1];

          if (selected.classList.contains("active")) {
            handleDropdown(selected, arrow, false);
          } else {
            let currentActive = document.querySelector(
              ".wrapper-dropdown.active"
            );

            if (currentActive) {
              let anotherArrow = currentActive.children[1];
              handleDropdown(currentActive, anotherArrow, false);
            }

            handleDropdown(selected, arrow, true);
          }
        });

        // update the display of the dropdown
        for (let o of optionsList) {
          o.addEventListener("click", () => {
            selected.querySelector(".selected-display").innerHTML = o.innerHTML;
          });
        }
      });

      // check if anything else ofther than the dropdown is clicked
      window.addEventListener("click", function (e) {
        if (e.target.closest(".wrapper-dropdown") === null) {
          closeAllDropdowns();
        }
      });

      // close all the dropdowns
      function closeAllDropdowns() {
        const selectedAll = document.querySelectorAll(".wrapper-dropdown");
        selectedAll.forEach((selected) => {
          const optionsContainer = selected.children[2];
          let arrow = selected.children[1];

          handleDropdown(selected, arrow, false);
        });
      }

      // open all the dropdowns
      function handleDropdown(dropdown, arrow, open) {
        if (open) {
          arrow.classList.add("rotated");
          dropdown.classList.add("active");
        } else {
          arrow.classList.remove("rotated");
          dropdown.classList.remove("active");
        }
      }
    },
    initializeSlick: function (e) {
      if ($(".events-slider").length) {
        $(".events-slider").slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          autoplay: true,
          cssEase: "linear",
          draggable: true,
          touchThreshold: 10,
          fade: true,
          autoplaySpeed: 3000,
          responsive: [
            {
              breakpoint: 575,
              settings: {
                slidesToShow: 1,
                arrows: false,
              },
            },
          ],
        });
      }
      if ($(".blogs-slider").length) {
        $(".blogs-slider").slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          autoplay: true,
          cssEase: "linear",
          draggable: true,
          autoplaySpeed: 3000,
          responsive: [
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 575,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
    },
    hamburgerMenu: function () {
      if ($(".hamburger-menu").length) {
        $(".hamburger-menu").on("click", function () {
          $(".bar").toggleClass("animate");
          $(".mobile-navar").toggleClass("active");
          return false;
        });
        $(".has-children").on("click", function () {
          $(this).children("ul").slideToggle("slow", "swing");
          $(".icon-arrow").toggleClass("open");
        });
      }
    },
    countdownInit: function (countdownSelector, countdownTime) {
      var eventCounter = $(countdownSelector);
      if (eventCounter.length) {
        eventCounter.countdown(countdownTime, function (e) {
          $(this).html(
            e.strftime(
              '<li><h4 class="number">%D</h4><h5 class="number-text">Days</h5></li>\
              <li><h4 class="number">%H</h4><h5 class="number-text">Hrs</h5></li>\
              <li><h4 class="number">%M</h4><h5 class="number-text">Min</h5></li>\
              <li><h4 class="number">%S</h4><h5 class="number-text">Sec</h5></li>'
            )
          );
        });
      }
    },
    countUpInit: function (countupSelector, startTime) {
      var eventCounter = $(countupSelector);
      if (eventCounter.length) {
        // Función para actualizar el contador cada segundo
        function updateCounter() {
          var now = new Date().getTime();
          var start = new Date(startTime).getTime();
          var elapsedTime = now - start;

          // Calcular días, horas, minutos y segundos transcurridos
          var days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
          var hours = Math.floor(
            (elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          var minutes = Math.floor(
            (elapsedTime % (1000 * 60 * 60)) / (1000 * 60)
          );
          var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

          // Actualizar el HTML con el tiempo transcurrido
          eventCounter.html(
            '<li><h4 class="number">' +
              days +
              '</h4><h5 class="number-text">Days</h5></li>' +
              '<li><h4 class="number">' +
              hours +
              '</h4><h5 class="number-text">Hrs</h5></li>' +
              '<li><h4 class="number">' +
              minutes +
              '</h4><h5 class="number-text">Min</h5></li>' +
              '<li><h4 class="number">' +
              seconds +
              '</h4><h5 class="number-text">Sec</h5></li>'
          );
        }

        // Actualizar cada segundo
        setInterval(updateCounter, 1000);
      }
    },
  };
  Init.i();
})(window, document, jQuery);
