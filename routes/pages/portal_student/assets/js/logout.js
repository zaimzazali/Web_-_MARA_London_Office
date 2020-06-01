/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Logout related matters

function logoutUser() {
  'use strict';

  /*
  $.ajax({
    type: "POST",
    async: true,
    url: "/remove_cookie",
    success: function success() {
      // Redirect to Login page
      window.location.replace("/");
    },
    
  });
  */

}

// =====================================================================
// =====================================================================
// Set Logout Button click event

function setupLogOutBtn() {
  'use strict';

  var logoutBtn;

  logoutBtn = document.getElementById('btn_logout');
  logoutBtn.addEventListener('click', function () {
    logoutUser();
  });
}

// =====================================================================
// =====================================================================
// Events before page exit
