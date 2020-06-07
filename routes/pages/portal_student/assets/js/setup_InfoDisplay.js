/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Front-End related

function changeDisplay(result) {
  'use strict';

  document.getElementById('logon_name').innerHTML = result.full_name;
  document.getElementById('logon_maraiID').innerHTML = result.user_ID;
}

function setDisplayInfo() {
  'use strict';

  $.ajax({
    type: 'POST',
    async: true,
    url: '/set_display',
    success: function success(result) {
      if (!result) {
        return 0;
      }
      changeDisplay(result);

      showWebPage();

      return 0;
    },
  });
}
