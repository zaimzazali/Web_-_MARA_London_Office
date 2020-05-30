"use strict";

// =====================================================================
// =====================================================================
// Related to browser's compatibility

function checkBootstrapCompatibility() {
  var flexWrap = document.createElement("p").style.flexWrap;
  if (flexWrap === undefined) {
    return false;
  }
  return true;
}

function showWebPage() {
  setTimeout(function () {
    window.scrollTo(0, 0);
    document.getElementById("container_fixed_layers").style.display = "none";
    document.getElementById("loading_page").style.display = "none";
  }, 1000);
}

// =====================================================================
// =====================================================================

function start() {
  var isCompatible = false;
  isCompatible = checkBootstrapCompatibility();

  if (isCompatible) {
    // General setup
    resetter();

    // Setup items in copyright section
    setupItemsCopyrights();

    // Setup Side Menu
    setupSideMenu();
    set_button_Collapsed();

    // Setup buttons in navbar section
    setupNavbarButtons();

    // Forget Password setup
    setupForgetButton();

    // Setup pop-up modals
    setupPopUp();

    /*
    // Contact Us setup
    setupNavButtons();
    setupSpans();
    setupPolicyItems();
    setupCollapseNavbar();
    setupInputField();

    // Sign Up setup
    setupSendMessageBtn();

    // Forget Password setup
    setupRegisterBtn();

    // Login setup
    setupForgetBtn();

    // Pop Up Modal - Button setup
    setupLoginBtn();

    bindClickBtnPopUp();

    checkCookie();
 */
    showWebPage();
  } else {
    // Redirect to Not Compatible page
    window.location.replace("/not_compatible");
  }
}

// Polyfill at the very beginning
if (window.addEventListener) {
  addEventListener("load", start);
} else {
  attachEvent("onload", start);
}

// =====================================================================
// =====================================================================
// To handle change in resolution @ orientation

// On Orientation change
$(window).on("orientationchange", function () {
  sideMenuAutoClose();
  orientationChange();
});

// On resize
$(window).resize(function () {
  sizeChange();
});

// =====================================================================
// =====================================================================
// Page transition

function changePage() {
  var container = document.getElementById("container_fixed_layers");
  var loading_page = container.querySelector("#loading_page");

  container.querySelector("#initial_loader").style.display = "none";
  loading_page.style.opacity = "0";

  container.style.display = "block";
  loading_page.style.display = "block";
  setTimeout(function () {
    loading_page.style.opacity = "1";
  }, 1);
}
