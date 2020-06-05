/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Input Fields related events

function normalBackgrounColor(obj) {
  'use strict';

  var inputFieldObj;

  inputFieldObj = obj;
  if (inputFieldObj.classList.contains('signal_error')) {
    inputFieldObj.classList.remove('signal_error');
  } else if (inputFieldObj.classList.contains('signal_ok')) {
    inputFieldObj.classList.remove('signal_ok');
  }
}

function clearInputField(modal) {
  'use strict';

  var inputField;
  var i;

  inputField = modal.getElementsByClassName('input_default_style ');
  for (i = 0; i < inputField.length; i += 1) {
    inputField[i].value = '';
    normalBackgrounColor(inputField[i]);
  }
}

function clearModalBlocker(modal) {
  'use strict';

  var modalObj;

  modalObj = modal;

  try {
    modalObj.getElementsByClassName('modal_blocker')[0].style.display = 'none';
  } catch (error) {
    // Do Nothing
  }
}

// =====================================================================
// =====================================================================
// Set all Input Field focus event

function setupInputField() {
  'use strict';

  var inputFields;
  var i;

  inputFields = document.getElementsByClassName('input_default_style');

  for (i = 0; i < inputFields.length; i += 1) {
    inputFields[i].addEventListener('focus', function () {
      normalBackgrounColor(this);
    });
  }
}

// =====================================================================
// =====================================================================
// Set all Input Field focus event

function setupPressEnter(modal, btn) {
  'use strict';

  var inputFields;
  var i;

  inputFields = modal.getElementsByClassName('input_field');
  for (i = 0; i < inputFields.length; i += 1) {
    inputFields[i].addEventListener('keyup', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        btn.click();
      }
    });
  }
}
