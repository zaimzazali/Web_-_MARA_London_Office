"use strict";

function clearInputField(modal) {
  "use strict";

  var i = null;
  var inputField = modal.getElementsByClassName("input_field");

  for (i = 0; i < inputField.length; i += 1) {
    inputField[i].value = "";
  }

  var inputTextAreaField = modal.getElementsByClassName("input_textarea");

  for (i = 0; i < inputTextAreaField.length; i += 1) {
    inputTextAreaField[i].value = "";
  }
}

function scrollToTop(modalObj) {
  "use strict";

  var overflowBody = modalObj.getElementsByClassName("overflow_y");

  for (var i = 0; i < overflowBody.length; i += 1) {
    overflowBody[i].scrollTop = 0;
  }
}

function performModalPopUp(modalObj, animationName, timing) {
  "use strict";

  var heightBackground = document.getElementById("container_background")
    .offsetHeight;
  var heightDivBlocker =
    modalObj.parentNode.parentNode.parentNode.parentNode.offsetHeight;

  if (heightBackground < heightDivBlocker) {
    modalObj.parentNode.parentNode.parentNode.style.height =
      heightDivBlocker + "px";
  } else if (heightBackground > heightDivBlocker) {
    modalObj.parentNode.parentNode.parentNode.style.height =
      heightBackground + "px";
  }

  modalObj.parentNode.parentNode.parentNode.style.display = "block";
  modalObj.parentNode.parentNode.style.display = "block";
  document.getElementById("blur_blocker").style.display = "block";

  setTimeout(function () {
    document.getElementById("blur_blocker").classList.add("visible");
    modalObj.classList.add(animationName);
    modalObj.style.display = "inline-block";

    setTimeout(function () {
      scrollToTop(modalObj);
    }, 1);
  }, timing);
}

function openModal(btnObj, modalName, animationName, btnName) {
  "use strict";

  try {
    btnObj.classList.add("active");
  } catch (err) {
    // Do nothing
  }

  var modalObj = document.getElementById(modalName);
  var blocker = document.getElementById("blur_blocker");

  clearInputField(modalObj);

  setTitleAndContent(btnObj, modalObj, btnName);

  if (modalObj.parentNode.parentNode.id === "modals_holder_2") {
    blocker.style.zIndex = "510";
  }

  var sideMenuVisibility = document.getElementById("side-menu").style.display;
  var timing = 1;

  if (sideMenuVisibility === "block") {
    closeSideMenu("partial");
  }

  performModalPopUp(modalObj, animationName, timing);
}

function bindClickOpen(flag, btnName, modalName, animationName) {
  "use strict";

  var btnObj = null;

  switch (flag) {
    case "byClass":
      btnObj = document.getElementsByClassName(btnName);

      for (var i = 0; i < btnObj.length; i += 1) {
        btnObj[i].addEventListener("click", function () {
          openModal(this, modalName, animationName, btnName);
        });
      }

      break;

    case "byID":
      btnObj = document.getElementById(btnName);
      btnObj.addEventListener("click", function () {
        openModal(this, modalName, animationName, null);
      });
      break;

    default:
      break;
  }
}

// =====================================================================
// =====================================================================

function executeLayerClose(params) {
  "use strict";

  /*
    modalName,
    counterAnim,
    animationName,
    timing,
    itemClassName,
  */

  var removeBlockerBackground = false;
  var theTargetDiv = document.getElementById(params[0]);

  var modals = document.getElementsByClassName("type_modal");
  var availModal = 0;
  for (var i = 0; i < modals.length; i++) {
    if (
      modals[i].style.display === "block" ||
      modals[i].style.display === "inline-block"
    ) {
      availModal += 1;
    }
  }
  if (availModal === 1) {
    removeBlockerBackground = true;
  }

  var blockerBackground = document.getElementById("blur_blocker");
  if (removeBlockerBackground) {
    blockerBackground.style.transitionDuration = params[3] / 1000 + "s";
    blockerBackground.classList.remove("visible");
  }

  var theObj = document.getElementsByClassName(params[4]);
  for (var i = 0; i < theObj.length; i++) {
    theObj[i].classList.remove("active");
  }

  theTargetDiv.classList.add(params[2]);

  blockerBackground.style.zIndex = "400";

  setTimeout(function () {
    theTargetDiv.style.display = "none";
    theTargetDiv.classList.remove(params[1]);
    theTargetDiv.classList.remove(params[2]);

    theTargetDiv.parentNode.parentNode.style.display = "none";
    if (removeBlockerBackground) {
      blockerBackground.style.display = "none";
      blockerBackground.style.transitionDuration = "0.5s";

      theTargetDiv.parentNode.parentNode.parentNode.style.display = "none";
    }
  }, (params[3] * 90) / 100);
}

function closeLayer(itemClassName, modalName, animationName) {
  "use strict";

  switch (animationName) {
    case "slideUp":
      var timing = 600;
      var counterAnim = "slideDown";
      break;
    case "bounceOut":
      var timing = 800;
      var counterAnim = "bounceIn";
      break;
    case "jackInTheBoxOut":
      var timing = 800;
      var counterAnim = "jackInTheBox";
      break;
    default:
      // nothing
      break;
  }

  executeLayerClose([
    modalName,
    counterAnim,
    animationName,
    timing,
    itemClassName,
  ]);
}

function bindClickClose(objs, modalName, animationName) {
  "use strict";

  try {
    var theObj = document
      .getElementById(modalName)
      .getElementsByClassName("btn_exit");
    theObj[0].addEventListener("click", function () {
      closeLayer(objs, modalName, animationName);
    });
  } catch (error) {
    var theObj = document
      .getElementById(modalName)
      .getElementsByClassName("btn_popup");
    theObj[0].addEventListener("click", function () {
      closeLayer(objs, modalName, animationName);
    });
  }
}

// =====================================================================
// =====================================================================

function openNewTab(indicator) {
  "use strict";

  switch (indicator) {
    case "facebook":
      var url = "https://www.facebook.com/mara.london.uk/";
      var win = window.open(url, "_blank");
      win.focus();
      break;
    default:
      // nothing
      break;
  }
}

function bindOpenURL(objId, socmed) {
  "use strict";

  var theObj = document.getElementById(objId);
  theObj.addEventListener("click", function () {
    openNewTab(socmed);
  });
}

// =====================================================================
// =====================================================================
