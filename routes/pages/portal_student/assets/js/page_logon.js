/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Extra Functions

function getCurrentTimeStamp() {
  var dt = new Date();
  var dformat = ''
    .concat(
      [
        '0000'.concat(dt.getFullYear()).slice(-4),
        '0'.concat(dt.getMonth() + 1).slice(-2),
        '0'.concat(dt.getDate()).slice(-2),
      ].join('-'),
      ' '
    )
    .concat(
      [
        '0'.concat(dt.getHours()).slice(-2),
        '0'.concat(dt.getMinutes()).slice(-2),
        '0'.concat(dt.getSeconds()).slice(-2),
      ].join(':')
    );
  return dformat;
}

// =====================================================================
// =====================================================================
// Related to logon functionalities

function setUserLog() {
  'use strict';

  var data = {};
  data.currentTimeStamp = getCurrentTimeStamp();

  $.ajax({
    type: 'POST',
    async: true,
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/logon',
    success: function success() {
      // Do Nothing
    },
  });
}
