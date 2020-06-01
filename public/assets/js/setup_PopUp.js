"use strict";

// =====================================================================
// =====================================================================
// Set Pop Up modal content

function setupPopUpContent(
  divName,
  stringTitle,
  stringContent,
  isError,
  toRemain
) {
  "use strict";

  var popUpModal;
  var theBtn;

  popUpModal = document.getElementById(divName);
  popUpModal.getElementsByClassName("modal_title")[0].innerHTML = stringTitle;
  popUpModal.getElementsByClassName("modal_body")[0].innerHTML =
    "<span>" + stringContent + "</span>";
  theBtn = popUpModal.getElementsByClassName("btn_popup")[0];

  // Header
  if ((!isError && toRemain) || isError) {
    popUpModal
      .getElementsByClassName("modal_header")[0]
      .classList.add("text_red");
  } else {
    popUpModal
      .getElementsByClassName("modal_header")[0]
      .classList.remove("text_red");
  }

  // Body
  if (isError) {
    theBtn.classList.add("btn_red");
    theBtn.innerHTML = "CLOSE";
    popUpModal
      .getElementsByClassName("modal_body")[0]
      .classList.add("text_red");
  } else {
    theBtn.innerHTML = "OK";
    popUpModal
      .getElementsByClassName("modal_body")[0]
      .classList.remove("text_red");
  }

  if (toRemain) {
    theBtn.classList.add("stay_remain");
  } else {
    theBtn.classList.remove("stay_remain");
  }
}

function displayPopUp(inputBlocker, divName) {
  "use strict";

  var divBlocker;
  var modalObj;
  var modalLayer;

  divBlocker = inputBlocker;
  divBlocker.getElementsByClassName("modal_loader")[0].style.display = "none";

  modalObj = document.getElementById(divName);
  modalLayer = modalObj.parentNode.parentNode;

  modalLayer.style.display = "block";
  modalObj.classList.add("bounceIn");
  modalObj.style.display = "inline-block";
}

// =====================================================================
// =====================================================================
// Set Pop Up modal close event

function setupPopUp() {
  "use strict";

  bindClickClose(null, "modal_display_with_button", "bounceOut");
}
