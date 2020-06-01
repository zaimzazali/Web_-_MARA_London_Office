/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Set Forget Button

function responseResetPassword(divBlocker, response) {
  'use strict';

  var inputBlocker;
  var modal;

  inputBlocker = divBlocker;
  modal = inputBlocker.parentNode;

  if (response === 'OK') {
    setupPopUpContent(
      'modal_display_with_button',
      'Your password has been reset!',
      'You will receive a new auto-generated password in an e-mail shorty.',
      false,
      false
    );
    displayPopUp(inputBlocker, 'modal_display_with_button');
    clearInputField(modal);
  } else {
    setupPopUpContent(
      'modal_display_with_button',
      'Something is not right!',
      'There was an error that occurred while resetting your password.<br />Please try again.',
      true,
      true
    );
    displayPopUp(inputBlocker, 'modal_display_with_button');
  }
}

function resetPassword(divBlocker, inputMARAid, inputEmail) {
  var data = {};
  data.maraID = inputMARAid;
  data.email = inputEmail;
  data.currentTimeStamp = getCurrentTimeStamp();

  /*
  $.ajax({
    type: "POST",
    async: true,
    data: JSON.stringify(data),
    contentType: "application/json",
    url: "/forget_password",
    success: function success(response) {
      responseResetPassword(divBlocker, response);
    },
  });
  */
}

function getReadyToResetPassword(modal, btn) {
  'use strict';

  var theBtn;
  var returnVal = [];
  var Signals = [];
  var modalObj;
  var i;

  var inputMARAidObj;
  var inputMARAid;
  var inputEmailObj;
  var inputEmail;

  var divBlocker;

  theBtn = btn;
  modalObj = modal;

  // MARA Reference Number
  inputMARAidObj = modalObj.getElementsByClassName('input_id')[0];
  inputMARAid = inputMARAidObj.value;

  if (inputMARAid === 'test_student_01') {
    returnVal.push([true, 'test_student_01']);
  } else if (inputMARAid === 'test_student_02') {
    returnVal.push([true, 'test_student_02']);
  } else if (inputMARAid === 'test_student_03') {
    returnVal.push([true, 'test_student_03']);
  } else {
    returnVal.push(isMARAidValid(inputMARAid));
  }

  inputMARAid = returnVal[returnVal.length - 1][1];
  returnVal[returnVal.length - 1].push(inputMARAidObj);
  Signals.push(returnVal[returnVal.length - 1][0]);

  // Email
  inputEmailObj = modalObj.getElementsByClassName('input_email')[0];
  inputEmail = inputEmailObj.value;
  returnVal.push(isEmailAddressValid(inputEmail));
  inputEmail = returnVal[returnVal.length - 1][1];
  returnVal[returnVal.length - 1].push(inputEmailObj);
  Signals.push(returnVal[returnVal.length - 1][0]);

  // -----------------------------------------------------------------

  if (Signals.includes(false)) {
    for (i = 0; i < returnVal.length; i += 1) {
      if (!returnVal[i][0]) {
        returnVal[i][2].classList.add('signal_error');
        theBtn.blur();
      }
    }
  } else {
    theBtn.classList.add('active');
    divBlocker = showLoader(modalObj);
    resetPassword(divBlocker, inputMARAid, inputEmail);
  }
}

function setupForgetButton() {
  'use strict';

  bindClickOpen('byID', 'span_forget', 'modal_forget_pass', 'bounceIn');
  bindClickClose('span_forget', 'modal_forget_pass', 'bounceOut');
}

// =====================================================================
// =====================================================================
// Set Forget Button click event

function setupForgetBtn() {
  'use strict';

  var modal;
  var theBtn;

  modal = document.getElementById('modal_forget_pass');
  theBtn = modal.querySelector('#btn_forget_password');
  theBtn.addEventListener('click', function () {
    getReadyToResetPassword(modal, this);
  });
}
