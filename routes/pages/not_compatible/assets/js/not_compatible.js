/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable strict */

'use strict';

function openURL(urlString) {
  'use strict';

  window.open(urlString, '_blank');
}

function setButtons() {
  'use strict';

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
  'use strict';

  setButtons();
}

// "IE8 and Below" got some weird errors, so I tried with 'new' instead
window.onload = new (function () {
  start();
})();
