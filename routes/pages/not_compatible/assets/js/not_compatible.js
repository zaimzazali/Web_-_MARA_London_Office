"use strict";

// "IE8 and Below" got some weird errors, so I tried with 'new' instead
window.onload = new (function () {
  start();
})();

function start() {
  setButtons();
}

function setButtons() {
  var theObj;

  // Chrome
  theObj = document.getElementById("link_chrome");
  theObj.onclick = function () {
    openURL("https://www.google.com/chrome/");
  };

  // Firefox
  theObj = document.getElementById("link_firefox");
  theObj.onclick = function () {
    openURL("https://www.mozilla.org/en-GB/firefox/new/");
  };

  // Opera
  theObj = document.getElementById("link_opera");
  theObj.onclick = function () {
    openURL("https://www.opera.com/");
  };
}

function openURL(urlString) {
  window.open(urlString, "_blank");
}
