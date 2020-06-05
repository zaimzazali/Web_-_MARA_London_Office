/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

var allowTesting = true;

// =====================================================================
// =====================================================================
// Set Forget Button

function responseResetPassword(divBlocker, response) {
  'use strict';

  var inputBlocker;
  var modal;

  inputBlocker = divBlocker;
  modal = inputBlocker.parentNode;

  switch (response) {
    case 'OK':
      setupPopUpContent(
        'modal_display_with_button',
        'Your password has been reset!',
        'You will receive a new auto-generated password in an e-mail shorty.',
        false,
        false
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      clearInputField(modal);
      break;

    case 'NOT EXIST':
      setupPopUpContent(
        'modal_display_with_button',
        'MARA ID not found!',
        "We could not find your MARA Reference Number.<br />Kindly reach us through 'Contact Us'.",
        false,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      break;

    case 'INACTIVE':
      setupPopUpContent(
        'modal_display_with_button',
        'Account is inactive!',
        "Please register yourself first through 'Sign Up' to activate your account.",
        false,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      break;

    case 'NOT SAME':
      setupPopUpContent(
        'modal_display_with_button',
        'Wrong email address!',
        "The provided email address does not sync with our record.<br />Kindly reach us through 'Contact Us'.",
        false,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      break;

    case 'ERROR':
      setupPopUpContent(
        'modal_display_with_button',
        'Something is not right!',
        'There was an error that occurred while resetting your password.<br />Please try again.',
        true,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      break;

    default:
      // Do Nothing
      break;
  }
}

function resetPassword(params) {
  'use strict';

  /*
  0 - inputMARAid
  1 - inputEmail
  2 - divBlocker
  */

  var data = {};
  data.maraID = params[0];
  data.email = params[1];
  data.currentTimeStamp = getCurrentTimeStamp();

  $.ajax({
    type: 'POST',
    async: true,
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/forget_password',
    success: function success(response) {
      responseResetPassword(params[2], response);
    },
  });
}

function getReadyToResetPassword(modal, btn) {
  'use strict';

  var theBtn;
  var returnVal = [];
  var Signals = [];
  var modalObj;
  var i;

  var params = [];
  var inputObj;
  var inputValue;

  var divBlocker;

  theBtn = btn;
  modalObj = modal;

  // MARA Reference Number
  inputObj = modalObj.getElementsByClassName('input_id')[0];
  inputValue = inputObj.value;

  // For Testing purposes.
  if (allowTesting) {
    if (
      inputValue === 'test_student_01' ||
      inputValue === 'test_student_02' ||
      inputValue === 'test_student_03'
    ) {
      returnVal.push([true, inputValue]);
    } else {
      returnVal.push(isMARAidValid(inputValue));
    }
  } else {
    returnVal.push(isMARAidValid(inputValue));
  }

  inputValue = returnVal[returnVal.length - 1][1];
  returnVal[returnVal.length - 1].push(inputObj);
  Signals.push(returnVal[returnVal.length - 1][0]);
  params.push(inputValue);

  // Email
  inputObj = modalObj.getElementsByClassName('input_email')[0];
  inputValue = inputObj.value;
  returnVal.push(isEmailAddressValid(inputValue));
  inputValue = returnVal[returnVal.length - 1][1];
  returnVal[returnVal.length - 1].push(inputObj);
  Signals.push(returnVal[returnVal.length - 1][0]);
  params.push(inputValue);

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
    params.push(divBlocker);

    resetPassword(params);
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
  var inputFields;
  var i;

  modal = document.getElementById('modal_forget_pass');
  theBtn = modal.querySelector('#btn_forget_password');
  theBtn.addEventListener('click', function () {
    getReadyToResetPassword(modal, this);
  });

  // Input field - Click Enter
  setupPressEnter(modal, theBtn);
}
