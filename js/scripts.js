window.addEventListener('DOMContentLoaded', function () {

  // Timer 
  const deadline = '2022-06-19';

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60);
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      timeInterval = setInterval(updateClock, 1000);
    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }


  }
  setClock('.timer', deadline);

  // Modal windows

  const navBtn = document.querySelectorAll('.nav-btn');

  navBtn.forEach(function (e) {
    e.addEventListener('click', function () {
      this.classList.add('active');
    });
  });
  document.querySelectorAll('.btn-nav-close').forEach(function (e) {
    e.addEventListener('click', function () {
      navBtn.forEach(function (e) {
        e.classList.remove('active');
      });
    });
  });

  // Stars
  const starsWrapper = document.getElementById('starsWrapper'),
    context = starsWrapper.getContext('2d'),
    stars = [];

  function initStars() {
    const banner = document.getElementById('stars');
    starsWrapper.width = banner.offsetWidth;
    starsWrapper.height = banner.offsetHeight;
    for (i = 0; i < 250; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random(),
        change: .15,
      })
    }
  }

  function updateStars() {
    for (const star of stars) {
      if (star.size < 0.1) {
        star.change = 0.1;
      } else if (star.size > 0.9) {
        star.change = -0.1;
      }
      star.size += star.change;
    }
  }

  function renderStars() {
    const {
      width,
      height
    } = starsWrapper;
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      context.beginPath();
      context.arc(star.x * width, star.y * height, star.size * 3, 0, 2 * Math.PI, false);
      context.fillStyle = 'white';
      context.fill();
    }
  }

  function twinkleStars() {
    updateStars();
    renderStars();
  }

  initStars();
  setInterval(twinkleStars, 100);

  // Cursor

  // Falling Sakura leaves
  (function ($) {
    var lastTime = 0;
    var vendors = ['webkit', 'o', 'ms', 'moz', ''];
    var vendorCount = vendors.length;
    for (var x = 0; x < vendorCount && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] +
        'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
    $.fn.prefixedEvent = function (type, callback) {
      for (var x = 0; x < vendorCount; ++x) {
        if (!vendors[x]) {
          type = type.toLowerCase();
        }
        el = (this instanceof jQuery ? this[0] : this);
        el.addEventListener(vendors[x] + type, callback, false);
      }
      return this;
    };

    function elementInViewport(el) {

      if (el instanceof jQuery) {
        el = el[0];
      }
      var rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    function randomArrayElem(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    $.fn.sakura = function (event, options) {
      var target = this.selector == "" ? $('body') : this;
      var defaults = {
        blowAnimations: ['blow-soft-left', 'blow-medium-left', 'blow-soft-right',
          'blow-medium-right'
        ],
        className: 'sakura',
        fallSpeed: 1,
        maxSize: 150,
        minSize: 25,
        newOn: 2000,
        swayAnimations: ['sway-0', 'sway-1', 'sway-2', 'sway-3', 'sway-4', 'sway-5', 'sway-6',
          'sway-7', 'sway-8'
        ]
      };
      var options = $.extend({}, defaults, options);
      if (typeof event === 'undefined' || event === 'start') {
        target.css({
          'overflow-x': 'hidden'
        });
        var petalCreator = function () {
          if (target.data('sakura-anim-id')) {
            setTimeout(function () {
              requestAnimationFrame(petalCreator);
            }, options.newOn);
          }
          var blowAnimation = randomArrayElem(options.blowAnimations);
          var swayAnimation = randomArrayElem(options.swayAnimations);
          var fallTime = ((document.documentElement.clientHeight * 0.007) + Math.round(Math
            .random() * 5)) * options.fallSpeed;
          var animations =
            'fall ' + fallTime + 's linear 0s 1' + ', ' +
            blowAnimation + ' ' + (((fallTime > 30 ? fallTime : 30) - 20) + randomInt(0,
              20)) + 's linear 0s infinite' + ', ' +
            swayAnimation + ' ' + randomInt(2, 4) + 's linear 0s infinite';
          var petal = $('<div class="' + options.className + '" />');
          var height = randomInt(options.minSize, options.maxSize);
          var width = height - Math.floor(randomInt(0, options.minSize) / 3);
          petal.prefixedEvent('AnimationEnd', function () {
              if (!elementInViewport(this)) {
                $(this).remove();
              }
            })
            .prefixedEvent('AnimationIteration', function (ev) {
              if (
                (
                  $.inArray(ev.animationName, options.blowAnimations) != -1 ||
                  $.inArray(ev.animationName, options.swayAnimations) != -1
                ) &&
                !elementInViewport(this)
              ) {
                $(this).remove();
              }
            })
            .css({
              '-webkit-animation': animations,
              animation: animations,
              'border-radius': randomInt(options.maxSize, (options.maxSize + Math
                .floor(Math.random() * 10))) + 'px ' + randomInt(1, Math.floor(
                width / 4)) + 'px',
              height: height + 'px',
              left: (Math.random() * document.documentElement.clientWidth - 100) +
                'px',
              'margin-top': (-(Math.floor(Math.random() * 20) + 15)) + 'px',
              width: width + 'px'
            });
          target.append(petal);
        };
        target.data('sakura-anim-id', requestAnimationFrame(petalCreator));
      } else if (event === 'stop') {
        var animId = target.data('sakura-anim-id');
        if (animId) {
          cancelAnimationFrame(animId);
          target.data('sakura-anim-id', null);
        }
        setTimeout(function () {
          $('.' + options.className).remove();
        }, (options.newOn + 50));
      }
    };
  }(jQuery));
  $(document).ready(function () {
    $('.sakura-section').sakura();
  });
  // Slider

  function project_carouselInit() {
    $(".owl-carousel.project-active").owlCarousel({
      dots: false,
      loop: true,
      margin: 0,
      stagePadding: 0,
      autoplay: true,
      autoplayTimeout: 1500,
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 1.3,
        },
        576: {
          items: 2,
        },
        768: {
          items: 2,
        },
        1200: {
          items: 4,
        },
        1340: {
          items: 3.2,
        },
      },

    });
    $(window).scroll(function (e) {
      var scrolled_val = $(document).scrollTop().valueOf();
      $('.owl-stage').css({
        'transform': 'translate3d(' + (-4260 - scrolled_val) + 'px,0px,0px)'
      });
    });
  }
  project_carouselInit();
});