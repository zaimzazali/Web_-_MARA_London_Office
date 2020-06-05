/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// All login related matters

function responseLogin(modal, divBlocker, response) {
  'use strict';

  var modalObj;
  var inputBlocker;
  var btn;

  modalObj = modal;
  inputBlocker = divBlocker;
  btn = inputBlocker.parentNode.querySelector('#btn_login');

  switch (response[0]) {
    case 'OK':
      switch (response[1]) {
        case 'Student':
          changePage();
          setTimeout(function () {
            window.location.replace('/portal_student');
          }, 400);
          break;

        case 'Admin_00':
          // Do Nothing
          break;

        default:
          // Do Nothing
          break;
      }

      break;

    case 'LOGGED':
      forceBlurBackground();
      setupPopUpContent(
        'modal_display_with_button',
        'Account in use!',
        'It looks like your account is currently being used.<br />Please logout from all your devices first.',
        false,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      break;

    case 'INACTIVE':
      forceBlurBackground();
      setupPopUpContent(
        'modal_display_with_button',
        'Account is inactive!',
        "Please register yourself first through 'Sign Up' to activate your account.",
        false,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      clearInputField(modalObj);
      break;

    case 'BLOCKED':
      forceBlurBackground();
      setupPopUpContent(
        'modal_display_with_button',
        'Account is blocked!',
        "It looks like your account has been blocked by the system and could not log you in.<br />Kindly reach us through 'Contact Us'.",
        false,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      break;

    case 'INVALID':
      forceBlurBackground();
      setupPopUpContent(
        'modal_display_with_button',
        'Invalid login credentials!',
        'You may have inputted a wrong combination of your MARA Reference Number and Password.',
        false,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      clearInputField(modalObj);
      break;

    case 'ERROR':
      forceBlurBackground();
      setupPopUpContent(
        'modal_display_with_button',
        'Something is not right!',
        'There was an error that occurred while checking your login credentials.<br />Please try again.',
        true,
        true
      );
      displayPopUp(inputBlocker, 'modal_display_with_button');
      break;

    default:
      // Do Nothing
      break;
  }

  btn.classList.remove('active');
  btn.blur();
}

function getReadyToLogin(modal, btn) {
  'use strict';

  var modalObj;
  var inputID;
  var inputPass;

  var data = {};
  var theBtn;
  var divBlocker;

  modalObj = modal;
  inputID = modalObj.getElementsByClassName('input_id')[0].value.trim();
  inputPass = modalObj.getElementsByClassName('input_password')[0].value.trim();

  if (inputID.length > 0 && inputPass.length > 0) {
    data.id = inputID;
    data.password = inputPass;

    theBtn = btn;
    theBtn.classList.add('active');

    divBlocker = modalObj.getElementsByClassName('modal_blocker')[0];
    divBlocker.getElementsByClassName('modal_loader')[0].style.display = 'block';
    divBlocker.style.display = 'block';

    $.ajax({
      type: 'POST',
      async: true,
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/login',
      success: function success(response) {
        setTimeout(function () {
          responseLogin(modalObj, divBlocker, response);
        }, 500);
      },
    });
  }
}

// =====================================================================
// =====================================================================
// Set Login Button click event

function setupLoginBtn() {
  'use strict';

  var modal;
  var theBtn;
  var inputFields;
  var i;

  modal = document.getElementById('modal_login_form_holder');
  theBtn = modal.querySelector('#btn_login');
  theBtn.addEventListener('click', function () {
    getReadyToLogin(modal, this);
  });

  // Input field - Click Enter
  setupPressEnter(modal, theBtn);
}
