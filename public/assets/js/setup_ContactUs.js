"use strict";

// =====================================================================
// =====================================================================
// Send Message related matters

function responseSendMessage(divBlocker, response) {
  "use strict";

  var inputBlocker;
  var modal;

  inputBlocker = divBlocker;
  modal = inputBlocker.parentNode;

  if (response === "OK") {
    setupPopUpContent(
      "modal_display_with_button",
      "Thank you for your message!",
      "You will receive an acknowledgement e-mail with a copy of your message shortly.",
      false,
      false
    );
    displayPopUp(inputBlocker, "modal_display_with_button");
    clearInputField(modal);
  } else {
    setupPopUpContent(
      "modal_display_with_button",
      "Something is not right!",
      "Your message could not be sent.<br />Please try again.",
      true,
      true
    );
    displayPopUp(inputBlocker, "modal_display_with_button");
  }
}

function sendTheMessage(
  divBlocker,
  inputName,
  inputEmail,
  inputMaraId,
  inputMessage,
  tmpMessage
) {
  "use strict";

  var maraID;
  var data = {};

  maraID = inputMaraId;

  if (maraID.trim() === "") {
    maraID = "NA";
  }

  data.name = inputName;
  data.email = inputEmail;
  data.maraID = maraID;
  data.message = inputMessage;
  data.tmpMessage = tmpMessage;
  data.currentTimeStamp = getCurrentTimeStamp();

  /*
  $.ajax({
    type: "POST",
    async: true,
    data: JSON.stringify(data),
    contentType: "application/json",
    url: "/send_message_contact_us",
    success: function success(response) {
      responseSendMessage(divBlocker, response);
    },
  });
  */
}

function getReadyToSendMessage(obj) {
  "use strict";

  var theBtn;
  var modal;
  var returnVal = [];
  var Signals = [];
  var i;

  var inputNameObj;
  var inputName;
  var inputEmailObj;
  var inputEmail;
  var inputMaraIdObj;
  var inputMaraId;
  var inputMessageObj;
  var inputMessage;

  var divBlocker;
  var tmpMessage;

  theBtn = obj;
  modal = theBtn.parentNode.parentNode.parentNode;

  // Name
  inputNameObj = modal.getElementsByClassName("input_name")[0];
  inputName = inputNameObj.value;
  returnVal.push(isNameValid(inputName));
  returnVal[returnVal.length - 1].push(inputNameObj);
  Signals.push(returnVal[returnVal.length - 1][0]);

  // Email
  inputEmailObj = modal.getElementsByClassName("input_email")[0];
  inputEmail = inputEmailObj.value;
  returnVal.push(isEmailAddressValid(inputEmail));
  returnVal[returnVal.length - 1].push(inputEmailObj);
  Signals.push(returnVal[returnVal.length - 1][0]);

  // MARA ID - OPTIONAL
  inputMaraIdObj = modal.getElementsByClassName("input_id")[0];
  inputMaraId = inputMaraIdObj.value;
  inputMaraId = inputMaraId.trim();
  if (inputMaraId.length === 0) {
    returnVal.push([true, "", inputMaraIdObj]);
    Signals.push(returnVal[returnVal.length - 1][0]);
  } else {
    returnVal.push(isMARAidValid(inputMaraId));
    returnVal[returnVal.length - 1].push(inputMaraIdObj);
    Signals.push(returnVal[returnVal.length - 1][0]);
  }

  // Message
  inputMessageObj = modal.getElementsByClassName("input_textarea")[0];
  inputMessage = inputMessageObj.value;
  returnVal.push(isMessageValid(inputMessage));
  returnVal[returnVal.length - 1].push(inputMessageObj);
  Signals.push(returnVal[returnVal.length - 1][0]);

  // -----------------------------------------------------------------

  if (Signals.includes(false)) {
    for (i = 0; i < returnVal.length; i += 1) {
      if (!returnVal[i][0]) {
        returnVal[i][2].classList.add("signal_error");
        theBtn.blur();
      }
    }
  } else {
    theBtn.classList.add("active");
    divBlocker = showLoader(modal);
    tmpMessage = inputMessage.replace(/\n/g, "<br>\n");

    sendTheMessage(
      divBlocker,
      inputName,
      inputEmail,
      inputMaraId,
      inputMessage,
      tmpMessage
    );
  }
}

// =====================================================================
// =====================================================================
// Set all Send button click event

function setupSendMessageBtn() {
  "use strict";

  var theBtn;

  theBtn = document.getElementById("btn_send_message");
  theBtn.addEventListener("click", function () {
    getReadyToSendMessage(this);
  });
}
