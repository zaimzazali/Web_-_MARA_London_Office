/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Global variable

var currentOrientation = window.orientation;

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
    window.scrollTo(0, 0);
    document.getElementById('container_fixed_layers').style.display = 'none';
    document.getElementById('loading_page').style.display = 'none';
  }, 1000);
}

// =====================================================================
// =====================================================================

function start() {
  'use strict';

  var isCompatible;

  isCompatible = checkBootstrapCompatibility();

  if (isCompatible) {
    // -------------------------------------
    // General setup
    resetter();

    // Setup items in copyright section
    setupPolicyItems();

    // Setup Side Menu
    setupSideMenu();
    set_button_Collapsed();

    // Setup buttons in navbar section
    setupNavbarButtons();

    // Forget Password setup
    setupForgetButton();

    // Setup pop-up modals
    setupPopUp();

    // Setup all input fields
    setupInputField();

    // -------------------------------------

    // Setup - Contact Us
    setupSendMessageBtn();

    // Setup - Forget Password
    setupForgetBtn();

    // Setup - Register
    setupRegisterBtn();

    // Setup - Login
    setupLoginBtn();

    // -------------------------------------

    // Check if there is cookie related to logon
    checkCookie();

    // -------------------------------------
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
