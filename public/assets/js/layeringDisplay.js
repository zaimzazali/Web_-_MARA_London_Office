"use strict";

// =====================================================================
// =====================================================================
// Extra functions

function scrollToTop(modalObj) {
  "use strict";

  var overflowBody;
  var i;

  overflowBody = modalObj.getElementsByClassName("overflow_y");
  for (i = 0; i < overflowBody.length; i += 1) {
    overflowBody[i].scrollTop = 0;
  }
}

function backgroundBlurAdjuster(modalObj) {
  "use strict";

  var modal;
  var heightBackground;
  var heightDivBlocker;

  modal = modalObj;
  heightBackground = document.getElementById("container_background")
    .offsetHeight;
  heightDivBlocker =
    modal.parentNode.parentNode.parentNode.parentNode.offsetHeight;

  if (heightBackground < heightDivBlocker) {
    modal.parentNode.parentNode.parentNode.style.height =
      heightDivBlocker + "px";
  } else if (heightBackground > heightDivBlocker) {
    modal.parentNode.parentNode.parentNode.style.height =
      heightBackground + "px";
  }
}

// =====================================================================
// =====================================================================
// Opening

function performModalPopUp(modalObj, animationName) {
  "use strict";

  var modal;

  modal = modalObj;

  backgroundBlurAdjuster(modal);

  // If the modal is Sign Up, Handle MARA ID validation
  if (modal.id === "modal_sign_up") {
    normalValidate(modal);
    normalCheckBox(modal);
  }

  modal.parentNode.parentNode.parentNode.style.display = "block";
  modal.parentNode.parentNode.style.display = "block";
  document.getElementById("blur_blocker").style.display = "block";

  setTimeout(function () {
    document.getElementById("blur_blocker").classList.add("visible");
    modal.classList.add(animationName);
    modal.style.display = "inline-block";

    setTimeout(function () {
      scrollToTop(modal);
    }, 1);
  }, 1);
}

function openModal(btnObj, modalName, animationName, btnName) {
  "use strict";

  var modalObj;
  var btn;
  var blocker;
  var btns;
  var sideMenuVisibility;
  var i;

  btn = btnObj;
  try {
    btn.classList.add("active");
  } catch (err) {
    // Do nothing
  }

  modalObj = document.getElementById(modalName);

  clearInputField(modalObj);
  clearModalBlocker(modalObj);

  setTitleAndContent(btn, modalObj, btnName);

  btns = modalObj.getElementsByTagName("button");
  for (i = 0; i < btns.length; i += 1) {
    if (btns[i].classList.contains("active")) {
      btns[i].classList.remove("active");
    }
  }

  blocker = document.getElementById("blur_blocker");
  if (modalObj.parentNode.parentNode.id === "modals_holder_2") {
    blocker.style.zIndex = "510";
  }

  sideMenuVisibility = document.getElementById("side-menu").style.display;
  if (sideMenuVisibility === "block") {
    closeSideMenu("partial");
  }

  performModalPopUp(modalObj, animationName);
}

function bindClickOpen(flag, btnName, modalName, animationName) {
  "use strict";

  var btnObj;
  var i;

  switch (flag) {
    case "byClass":
      btnObj = document.getElementsByClassName(btnName);

      for (i = 0; i < btnObj.length; i += 1) {
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
      // Do Nothing
      break;
  }
}

// =====================================================================
// =====================================================================
// Closing

function executeLayerClose(params) {
  "use strict";

  /*
    Variables
    0 - modalName
    1 - counterAnim
    2 - animationName
    3 - timing
    4 - itemClassName
  */

  var removeBlockerBackground;
  var theTargetDiv;
  var modals;
  var availModal;
  var blockerBackground;
  var theObj;
  var toRemain;
  var i;

  removeBlockerBackground = false;
  theTargetDiv = document.getElementById(params[0]);

  modals = document.getElementsByClassName("type_modal");
  availModal = 0;
  for (i = 0; i < modals.length; i++) {
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

  blockerBackground = document.getElementById("blur_blocker");
  if (removeBlockerBackground) {
    blockerBackground.style.transitionDuration = params[3] / 1000 + "s";
    blockerBackground.classList.remove("visible");
  }

  theObj = document.getElementsByClassName(params[4]);
  for (i = 0; i < theObj.length; i++) {
    theObj[i].classList.remove("active");
  }

  theTargetDiv.classList.add(params[2]);
  toRemain = true;
  try {
    toRemain = theTargetDiv
      .getElementsByClassName("btn_popup")[0]
      .classList.contains("stay_remain");
  } catch (error) {
    // Do Nothing
  }

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

      // Login Blocker
      document.getElementsByClassName("modal_blocker")[0].style.display =
        "none";
    } else {
      modals = document.getElementsByClassName("type_modal");
      for (i = 0; i < modals.length; i++) {
        if (
          modals[i].style.display === "block" ||
          modals[i].style.display === "inline-block"
        ) {
          if (toRemain) {
            modals[i].getElementsByClassName("modal_blocker")[0].style.display =
              "none";
          } else {
            modals[i].getElementsByClassName("btn_exit")[0].click();
          }
        }
      }
    }
  }, (params[3] * 90) / 100);
}

function closeLayer(itemClassName, modalName, animationName) {
  "use strict";

  var timing;
  var counterAnim;

  switch (animationName) {
    case "slideUp":
      timing = 600;
      counterAnim = "slideDown";
      break;
    case "bounceOut":
      timing = 800;
      counterAnim = "bounceIn";
      break;
    case "jackInTheBoxOut":
      timing = 800;
      counterAnim = "jackInTheBox";
      break;
    default:
      // Do Nothing
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

  var theObj;

  try {
    theObj = document
      .getElementById(modalName)
      .getElementsByClassName("btn_exit");
    theObj[0].addEventListener("click", function () {
      closeLayer(objs, modalName, animationName);
    });
  } catch (error) {
    theObj = document
      .getElementById(modalName)
      .getElementsByClassName("btn_popup");
    theObj[0].addEventListener("click", function () {
      closeLayer(objs, modalName, animationName);
    });
  }
}

// =====================================================================
// =====================================================================
// New Tab

function openNewTab(indicator) {
  "use strict";

  var url;
  var win;

  switch (indicator) {
    case "facebook":
      url = "https://www.facebook.com/mara.london.uk/";
      win = window.open(url, "_blank");
      win.focus();
      break;
    case "ig":
      // Do Nothing
      break;
    case "linkedin":
      // Do Nothing
      break;
    default:
      // Do Nothing
      break;
  }
}

function bindOpenURL(objId, socmed) {
  "use strict";

  var theObj;

  theObj = document.getElementById(objId);
  theObj.addEventListener("click", function () {
    openNewTab(socmed);
  });
}
