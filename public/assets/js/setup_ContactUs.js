/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Send Message related matters

function responseSendMessage(divBlocker, response) {
  'use strict';

  var inputBlocker;
  var modal;

  inputBlocker = divBlocker;
  modal = inputBlocker.parentNode;

  if (response === 'OK') {
    setupPopUpContent(
      'modal_display_with_button',
      'Thank you for your message!',
      'You will receive an acknowledgement e-mail with a copy of your message shortly.',
      false,
      false
    );
    displayPopUp(inputBlocker, 'modal_display_with_button');
    clearInputField(modal);
  } else {
    setupPopUpContent(
      'modal_display_with_button',
      'Something is not right!',
      'Your message could not be sent.<br />Please try again.',
      true,
      true
    );
    displayPopUp(inputBlocker, 'modal_display_with_button');
  }
}

function sendTheMessage(params) {
  'use strict';

  /*
  0 - inputName
  1 - inputEmail
  2 - inputMaraId
  3 - inputMessage
  4 - tmpMessage
  5 - divBlocker
   */

  var maraID;
  var data = {};

  maraID = params[2];

  if (maraID.trim() === '') {
    maraID = 'NA';
  }

  data.name = params[0];
  data.email = params[1];
  data.maraID = maraID;
  data.message = params[3];
  data.tmpMessage = params[4];
  data.currentTimeStamp = getCurrentTimeStamp();

  $.ajax({
    type: 'POST',
    async: true,
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/send_message_contact_us',
    success: function success(response) {
      responseSendMessage(params[5], response);
    },
  });
}

function getReadyToSendMessage(obj) {
  'use strict';

  var theBtn;
  var modal;
  var returnVal = [];
  var Signals = [];
  var i;

  var params = [];
  var inputObj;
  var inputValue;

  var divBlocker;
  var tmpMessage;

  theBtn = obj;
  modal = theBtn.parentNode.parentNode.parentNode;

  // Name
  inputObj = modal.getElementsByClassName('input_name')[0];
  inputValue = inputObj.value;
  returnVal.push(isNameValid(inputValue));
  returnVal[returnVal.length - 1].push(inputObj);
  Signals.push(returnVal[returnVal.length - 1][0]);
  params.push(inputValue);

  // Email
  inputObj = modal.getElementsByClassName('input_email')[0];
  inputValue = inputObj.value;
  returnVal.push(isEmailAddressValid(inputValue));
  returnVal[returnVal.length - 1].push(inputObj);
  Signals.push(returnVal[returnVal.length - 1][0]);
  params.push(inputValue);

  // MARA ID - OPTIONAL
  inputObj = modal.getElementsByClassName('input_id')[0];
  inputValue = inputObj.value;
  inputValue = inputValue.trim();
  if (inputValue.length === 0) {
    returnVal.push([true, '', inputObj]);
    Signals.push(returnVal[returnVal.length - 1][0]);
    params.push('');
  } else {
    returnVal.push(isMARAidValid(inputValue));
    returnVal[returnVal.length - 1].push(inputObj);
    Signals.push(returnVal[returnVal.length - 1][0]);
    params.push(inputValue);
  }

  // Message
  inputObj = modal.getElementsByClassName('input_textarea')[0];
  inputValue = inputObj.value;
  returnVal.push(isMessageValid(inputValue));
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
    divBlocker = showLoader(modal);
    tmpMessage = inputValue.replace(/\n/g, '<br>\n');
    params.push(tmpMessage);
    params.push(divBlocker);

    sendTheMessage(params);
  }
}

// =====================================================================
// =====================================================================
// Set all Send button click event

function setupSendMessageBtn() {
  'use strict';

  var theBtn;

  theBtn = document.getElementById('btn_send_message');
  theBtn.addEventListener('click', function () {
    getReadyToSendMessage(this);
  });
}
