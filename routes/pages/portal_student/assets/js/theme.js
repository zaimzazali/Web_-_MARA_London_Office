/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Extra functions

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

  var $anchor;

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
