/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// PExtra functions

function toggleExpandAll() {
  'use strict';

  var obj;
  var i;

  obj = document.getElementsByClassName('right_side');
  for (i = 0; i < obj.length; i += 1) {
    if (obj[i].classList.contains('expand')) {
      obj[i].classList.remove('expand');
    } else {
      obj[i].classList.add('expand');
    }
  }
}

function forceRevert() {
  'use strict';

  var obj;
  var i;

  obj = document.getElementsByClassName('right_side');
  for (i = 0; i < obj.length; i += 1) {
    obj[i].classList.remove('expand');
  }
}

// =====================================================================
// =====================================================================
// Default theme.js
// With some tweaks

(function ($) {
  'use strict';

  var obj;
  var $anchor;

  // Toggle the side navigation
  $('#sidebarToggle, #sidebarToggleTop').on('click', function (e) {
    obj = document.getElementById('navbar_holder');

    if (obj.classList.contains('hide')) {
      obj.classList.remove('hide');
      setTimeout(function () {
        obj.classList.remove('fadeOut');
      }, 100);
      toggleExpandAll();
    } else {
      obj.classList.add('hide');
      obj.classList.add('fadeOut');
      toggleExpandAll();
    }
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function () {
    if ($(window).width() < 768) {
      document.getElementById('navbar_holder').classList.remove('hide');
      setTimeout(function () {
        document.getElementById('navbar_holder').classList.remove('fadeOut');
      }, 100);
      forceRevert();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function (e) {
    $anchor = $(this);
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: $($anchor.attr('href')).offset().top,
        },
        1000,
        'easeInOutExpo'
      );
    e.preventDefault();
  });
})(jQuery); // End of use strict
