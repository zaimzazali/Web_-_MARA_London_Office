/* eslint-disable strict */

'use strict';

/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable no-undef */

function openURL(urlString) {
  window.open(urlString, '_blank');
}

function setButtons() {
  var theObj;

  // Chrome
  theObj = document.getElementById('link_chrome');
  theObj.onclick = function () {
    openURL('https://www.google.com/chrome/');
  };

  // Firefox
  theObj = document.getElementById('link_firefox');
  theObj.onclick = function () {
    openURL('https://www.mozilla.org/en-GB/firefox/new/');
  };

  // Opera
  theObj = document.getElementById('link_opera');
  theObj.onclick = function () {
    openURL('https://www.opera.com/');
  };
}

function start() {
  setButtons();
}

// "IE8 and Below" got some weird errors, so I tried with 'new' instead
window.onload = new (function () {
  start();
})();
