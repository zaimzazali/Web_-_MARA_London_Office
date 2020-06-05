/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Related to browser's compatibility

function checkBootstrapCompatibility() {
  'use strict';

  var flexWrap;

  flexWrap = document.createElement('p').style.flexWrap;
  if (flexWrap === undefined) {
    return false;
  }
  return true;
}

function showWebPage() {
  'use strict';

  setTimeout(function () {
    document.getElementById('loading_page').classList.add('hide');
    setTimeout(function () {
      document.getElementById('loading_page').style.display = 'none';
    }, 500);
  }, 1000);
}

// =====================================================================
// =====================================================================

function start() {
  'use strict';

  var isCompatible;

  isCompatible = checkBootstrapCompatibility();

  if (isCompatible) {
    // Update cookie session
    updateCookie();

    // Check-In user into Login list
    setUserLog();

    // Setup side navbar
    setupSideNavbar();

    // Setup Logout Button
    setupLogOutBtn();

    window.scrollTo(0, 0);
    showWebPage();
  } else {
    // Redirect to Not Compatible page
    window.location.replace('/not_compatible');
  }
}

// Polyfill at the very beginning
if (window.addEventListener) {
  addEventListener('load', start);
} else {
  attachEvent('onload', start);
}
