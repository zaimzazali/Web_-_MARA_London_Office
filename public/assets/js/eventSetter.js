/* eslint-disable strict */

'use strict';

/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable no-undef */

function clearInputField(modal) {
  'use strict';

  var i = null;
  var inputField = modal.getElementsByClassName('input_field');
  var inputTextAreaField = modal.getElementsByClassName('input_textarea');

  for (i = 0; i < inputField.length; i += 1) {
    inputField[i].value = '';
  }

  for (i = 0; i < inputTextAreaField.length; i += 1) {
    inputTextAreaField[i].value = '';
  }
}

function scrollToTop(modalObj) {
  'use strict';

  var i = 0;
  var overflowBody = modalObj.getElementsByClassName('overflow_y');

  for (i = 0; i < overflowBody.length; i += 1) {
    overflowBody[i].scrollTop = 0;
  }
}

function performModalPopUp(modalObj, animationName) {
  'use strict';

  var heightBackground = document.getElementById('container_background').offsetHeight;
  var heightDivBlocker = modalObj.parentNode.parentNode.parentNode.parentNode.offsetHeight;
  var modal = modalObj;

  if (heightBackground < heightDivBlocker) {
    modal.parentNode.parentNode.parentNode.style.height = heightDivBlocker + 'px';
  } else if (heightBackground > heightDivBlocker) {
    modal.parentNode.parentNode.parentNode.style.height = heightBackground + 'px';
  }

  modal.parentNode.parentNode.parentNode.style.display = 'block';
  modal.parentNode.parentNode.style.display = 'block';
  document.getElementById('blur_blocker').style.display = 'block';

  setTimeout(function () {
    document.getElementById('blur_blocker').classList.add('visible');
    modal.classList.add(animationName);
    modal.style.display = 'inline-block';

    setTimeout(function () {
      scrollToTop(modal);
    }, 1);
  }, 1);
}

function openModal(btnObj, modalName, animationName, btnName) {
  'use strict';

  var modalObj = document.getElementById(modalName);
  var blocker = document.getElementById('blur_blocker');
  var sideMenuVisibility = document.getElementById('side-menu').style.display;

  try {
    btnObj.classList.add('active');
  } catch (err) {
    // Do nothing
  }

  clearInputField(modalObj);

  setTitleAndContent(btnObj, modalObj, btnName);

  if (modalObj.parentNode.parentNode.id === 'modals_holder_2') {
    blocker.style.zIndex = '510';
  }

  if (sideMenuVisibility === 'block') {
    closeSideMenu('partial');
  }

  performModalPopUp(modalObj, animationName);
}

function bindClickOpen(flag, btnName, modalName, animationName) {
  'use strict';

  var i = 0;
  var btnObj = null;

  switch (flag) {
    case 'byClass':
      btnObj = document.getElementsByClassName(btnName);

      for (i = 0; i < btnObj.length; i += 1) {
        btnObj[i].addEventListener('click', function () {
          openModal(this, modalName, animationName, btnName);
        });
      }

      break;

    case 'byID':
      btnObj = document.getElementById(btnName);
      btnObj.addEventListener('click', function () {
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
  'use strict';

  /*
    modalName,
    counterAnim,
    animationName,
    timing,
    itemClassName,
  */

  var removeBlockerBackground = false;
  var theTargetDiv = document.getElementById(params[0]);
  var modals = document.getElementsByClassName('type_modal');
  var availModal = 0;
  var i = 0;
  var blockerBackground = document.getElementById('blur_blocker');
  var theObj = document.getElementsByClassName(params[4]);

  for (i = 0; i < modals.length; i += 1) {
    if (modals[i].style.display === 'block' || modals[i].style.display === 'inline-block') {
      availModal += 1;
    }
  }
  if (availModal === 1) {
    removeBlockerBackground = true;
  }

  if (removeBlockerBackground) {
    blockerBackground.style.transitionDuration = params[3] / 1000 + 's';
    blockerBackground.classList.remove('visible');
  }

  for (i = 0; i < theObj.length; i += 1) {
    theObj[i].classList.remove('active');
  }

  theTargetDiv.classList.add(params[2]);

  blockerBackground.style.zIndex = '400';

  setTimeout(function () {
    theTargetDiv.style.display = 'none';
    theTargetDiv.classList.remove(params[1]);
    theTargetDiv.classList.remove(params[2]);

    theTargetDiv.parentNode.parentNode.style.display = 'none';
    if (removeBlockerBackground) {
      blockerBackground.style.display = 'none';
      blockerBackground.style.transitionDuration = '0.5s';

      theTargetDiv.parentNode.parentNode.parentNode.style.display = 'none';
    }
  }, (params[3] * 90) / 100);
}

function closeLayer(itemClassName, modalName, animationName) {
  'use strict';

  var timing;
  var counterAnim;

  switch (animationName) {
    case 'slideUp':
      timing = 600;
      counterAnim = 'slideDown';
      break;
    case 'bounceOut':
      timing = 800;
      counterAnim = 'bounceIn';
      break;
    case 'jackInTheBoxOut':
      timing = 800;
      counterAnim = 'jackInTheBox';
      break;
    default:
      // nothing
      break;
  }

  executeLayerClose([modalName, counterAnim, animationName, timing, itemClassName]);
}

function bindClickClose(objs, modalName, animationName) {
  'use strict';

  var theObj;

  try {
    theObj = document.getElementById(modalName).getElementsByClassName('btn_exit');
    theObj[0].addEventListener('click', function () {
      closeLayer(objs, modalName, animationName);
    });
  } catch (error) {
    theObj = document.getElementById(modalName).getElementsByClassName('btn_popup');
    theObj[0].addEventListener('click', function () {
      closeLayer(objs, modalName, animationName);
    });
  }
}

// =====================================================================
// =====================================================================

function openNewTab(indicator) {
  'use strict';

  var url;
  var win;

  switch (indicator) {
    case 'facebook':
      url = 'https://www.facebook.com/mara.london.uk/';
      win = window.open(url, '_blank');
      win.focus();
      break;
    default:
      // nothing
      break;
  }
}

function bindOpenURL(objId, socmed) {
  'use strict';

  var theObj = document.getElementById(objId);
  theObj.addEventListener('click', function () {
    openNewTab(socmed);
  });
}

// =====================================================================
// =====================================================================
