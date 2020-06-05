/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// To create cookie session, if not exist
function checkCookie() {
  'use strict';

  $.ajax({
    type: 'POST',
    async: true,
    url: '/create_cookie',
    success: function success() {
      // Do Nothing
    },
  });
}
