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
// Extra functions

function normalValidate(modal) {
  'use strict';

  var btn;

  btn = modal.querySelector('#btn_check');
  btn.classList.remove('signal_ok');
  btn.classList.remove('signal_error');
  btn.innerHTML = 'Validate';
}

function normalCheckBox(modal) {
  'use strict';

  var checkBox;

  checkBox = modal.querySelector('#check_accept');
  checkBox.checked = false;
  checkBox.parentNode.classList.remove('signal_error');
}

// =====================================================================
// =====================================================================
// Registration related matters

function responseCheckMARAid(theBtn, blocker, response, inputFieldObj, process) {
  'use strict';

  var currentBtn;
  var inputBlocker;
  var inputField;

  currentBtn = theBtn;
  inputBlocker = blocker;
  inputField = inputFieldObj;

  switch (response) {
    case 'OK':
      if (process === 'pre') {
        currentBtn.classList.add('signal_ok');
        inputField.classList.add('signal_ok');
        currentBtn.innerHTML = 'OK';
        inputBlocker.style.display = 'none';
      }
      break;

    case 'EXIST':
      currentBtn.innerHTML = 'Validate';
      setupPopUpContent(
        'modal_display_with_button',
        'Existing user!',
        'Our records say there is an active account associated with that MARA Reference Number.',
        false,
        true
      );
      if (process === 'pre') {
        displayPopUp(inputBlocker, 'modal_display_with_button');
      }
      break;

    case 'NOT EXIST':
      currentBtn.innerHTML = 'Validate';
      setupPopUpContent(
        'modal_display_with_button',
        'MARA ID not found!',
        "We could not find your MARA Reference Number.<br />Kindly reach us through 'Contact Us'.",
        false,
        true
      );
      if (process === 'pre') {
        displayPopUp(inputBlocker, 'modal_display_with_button');
      }
      break;

    case 'ERROR':
      currentBtn.classList.add('signal_error');
      inputField.classList.add('signal_error');
      currentBtn.innerHTML = 'ERROR';
      setupPopUpContent(
        'modal_display_with_button',
        'Something is not right!',
        'There was an error that occurred while looking for your MARA Reference Number.<br />Please try again.',
        true,
        true
      );
      if (process === 'pre') {
        displayPopUp(inputBlocker, 'modal_display_with_button');
      }
      break;

    default:
      break;
  }

  currentBtn.classList.remove('active');
  currentBtn.blur();
}

function validateMARAid(btn, modal, process) {
  'use strict';

  var modalObj;
  var theBtn;

  var inputFieldObj;
  var inputID;
  var feedback;

  var blocker;
  var data = {};

  modalObj = modal;
  theBtn = btn;

  inputFieldObj = modalObj.getElementsByClassName('input_id')[0];
  inputID = inputFieldObj.value;

  inputFieldObj.classList.remove('signal_error');
  theBtn.classList.remove('signal_error');

  // For Testing purposes.
  if (allowTesting) {
    if (
      inputID === 'test_student_00' ||
      inputID === 'test_student_01' ||
      inputID === 'test_student_02' ||
      inputID === 'test_student_03'
    ) {
      feedback = [true, inputID];
    }
  } else {
    feedback = isMARAidValid(inputID);
  }

  if (feedback[0]) {
    if (process === 'pre') {
      theBtn.classList.add('active');
      theBtn.innerHTML = 'Checking';

      blocker = modalObj.getElementsByClassName('modal_blocker')[0];
      blocker.getElementsByClassName('modal_loader')[0].style.display = 'block';
      blocker.style.display = 'block';
    }

    data.id = inputID;
    $.ajax({
      type: 'POST',
      async: true,
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/check_MARA_id',
      success: function success(response) {
        setTimeout(function () {
          responseCheckMARAid(theBtn, blocker, response, inputFieldObj, process);
        }, 500);
      },
    });
  } else {
    inputFieldObj.classList.add('signal_error');
    theBtn.blur();
  }
}

function responseRegisterUser(divBlocker, response) {
  'use strict';

  var inputBlocker;
  var modal;

  inputBlocker = divBlocker;
  modal = inputBlocker.parentNode;

  if (response === 'OK') {
    normalValidate(modal);
    normalCheckBox(modal);
    setupPopUpContent(
      'modal_display_with_button',
      'Thank you for registering!',
      'You will receive a confirmation e-mail of your account registration shortly.',
      false,
      false
    );
    displayPopUp(inputBlocker, 'modal_display_with_button');
    clearInputField(modal);
  } else {
    setupPopUpContent(
      'modal_display_with_button',
      'Something is not right!',
      'There was an error that occurred during the registration.<br />Please try again.',
      true,
      true
    );
    displayPopUp(inputBlocker, 'modal_display_with_button');
  }
}

function registerMe(params) {
  'use strict';

  /*
  0 - MARAid
  1 - inputName
  2 - inputEmail
  3 - inputPassword
  4 - divBlocker
  */

  var data = {};

  data.maraID = params[0];
  data.name = params[1];
  data.email = params[2];
  data.password = params[3];

  $.ajax({
    type: 'POST',
    async: true,
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/register_user',
    success: function success(response) {
      responseRegisterUser(params[4], response);
    },
  });
}

function getReadyToRegister(modal, btn) {
  'use strict';

  var theBtn;
  var modalObj;
  var returnVal = [];
  var Signals = [];
  var i;

  var params = [];
  var inputObj;
  var inputValue;
  var inputPasswordSame;
  var checkBoxObj;

  var divBlocker;

  theBtn = btn;
  modalObj = modal;

  // MARA Reference Number
  validateMARAid(modal.querySelector('#btn_check'), modal, 'post');
  inputObj = modalObj.getElementsByClassName('input_id')[0];
  if (inputObj.classList.contains('signal_ok')) {
    returnVal.push([true, '']);
  } else {
    returnVal.push([false, '']);
  }
  returnVal[returnVal.length - 1].push(inputObj);
  Signals.push(returnVal[returnVal.length - 1][0]);
  params.push(inputObj.value);

  // Name
  inputObj = modalObj.getElementsByClassName('input_name')[0];
  inputValue = inputObj.value;
  returnVal.push(isNameValid(inputValue));
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

  // Password
  inputObj = modalObj.getElementsByClassName('input_password');
  inputValue = inputObj[0].value;
  returnVal.push(isPasswordValid(inputValue));
  inputValue = returnVal[returnVal.length - 1][1];
  returnVal[returnVal.length - 1].push(inputObj[0]);
  Signals.push(returnVal[returnVal.length - 1][0]);
  params.push(inputValue);

  // Confirm Password
  inputPasswordSame = inputObj[1].value;
  returnVal.push(isPasswordSame(inputPasswordSame, inputValue));
  returnVal[returnVal.length - 1].push(inputObj[1]);
  Signals.push(returnVal[returnVal.length - 1][0]);

  // Agreement T&C
  checkBoxObj = modalObj.querySelector('#check_accept');
  if (checkBoxObj.checked) {
    returnVal.push([true, '']);
  } else {
    returnVal.push([false, '']);
  }
  returnVal[returnVal.length - 1].push(checkBoxObj.parentNode);
  Signals.push(returnVal[returnVal.length - 1][0]);

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

    registerMe(params);
  }
}

// =====================================================================
// =====================================================================
// Set all clicking events

function setupRegisterBtn() {
  'use strict';

  var modal;
  var inputIdObj;
  var btnCheck;
  var checkObj;
  var theBtn;

  modal = document.getElementById('modal_sign_up');
  inputIdObj = modal.getElementsByClassName('input_id')[0];

  // MARA ID validator button
  btnCheck = modal.querySelector('#btn_check');
  btnCheck.addEventListener('click', function () {
    validateMARAid(this, modal, 'pre');
  });
  inputIdObj.addEventListener('focus', function () {
    normalValidate(modal);
  });

  // Check box
  checkObj = modal.querySelector('#check_accept');
  checkObj.addEventListener('click', function () {
    checkObj.parentNode.classList.remove('signal_error');
  });

  // Sign Up button
  theBtn = modal.querySelector('#btn_register');
  theBtn.addEventListener('click', function () {
    getReadyToRegister(modal, this);
  });
}
