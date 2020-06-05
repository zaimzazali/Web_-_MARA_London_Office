/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// Check if login cookie has already set
function checkCookie() {
  'use strict';

  $.ajax({
    type: 'POST',
    async: true,
    url: '/check_cookie',
    success: function success(response) {
      if (response === 'AUTO LOGIN') {
        window.location.replace('/portal_student');
      }
    },
  });
}
