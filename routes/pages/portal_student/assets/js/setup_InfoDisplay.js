/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Front-End related

async function changeDisplay(result) {
  'use strict';

  document.getElementById('logon_name').innerHTML = result.full_name;
  document.getElementById('logon_maraiID').innerHTML = result.user_ID;
}

async function setDisplayInfo() {
  'use strict';

  await $.ajax({
    type: 'POST',
    async: true,
    url: '/set_display',
    success: function success(result) {
      if (!result) {
        return result;
      }
      changeDisplay(result);
      return result;
    },
  });
}
