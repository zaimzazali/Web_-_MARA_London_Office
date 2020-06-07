/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-var */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// All side menu open-closing related matters

function closeDropDown() {
  'use strict';

  var dropDownIcons;
  var dropDownMenu;
  var i;

  if (document.getElementById('icon_down').style.display === 'block') {
    dropDownIcons = document.getElementsByClassName('icon_collapsed');

    // Toggle the icons
    for (i = 0; i < dropDownIcons.length; i += 1) {
      if (dropDownIcons[i].style.display === 'block') {
        dropDownIcons[i].style.display = 'none';
      } else {
        dropDownIcons[i].style.display = 'block';
      }
    }

    dropDownMenu = document.getElementById('collapseForms');
    if (dropDownMenu.classList.contains('visible')) {
      dropDownMenu.classList.remove('visible');
      setTimeout(function () {
        dropDownMenu.style.display = 'none';
      }, 500);
    } else {
      dropDownMenu.style.display = 'block';
      setTimeout(function () {
        dropDownMenu.classList.add('visible');
      }, 1);
    }
  }
}

function openDropDown(sideMenu) {
  'use strict';

  var dropDownIcons;
  var dropDownMenu;
  var i;

  dropDownIcons = sideMenu.getElementsByClassName('icon_collapsed');

  // Toggle the icons
  for (i = 0; i < dropDownIcons.length; i += 1) {
    if (window.getComputedStyle(dropDownIcons[i]).display === 'block') {
      dropDownIcons[i].style.display = 'none';
    } else {
      dropDownIcons[i].style.display = 'block';
    }
  }

  dropDownMenu = sideMenu.nextElementSibling.querySelector('#collapseForms');
  if (dropDownMenu.classList.contains('visible')) {
    dropDownMenu.classList.remove('visible');
    setTimeout(function () {
      dropDownMenu.style.display = 'none';
    }, 500);
  } else {
    dropDownMenu.style.display = 'block';
    setTimeout(function () {
      dropDownMenu.classList.add('visible');
    }, 1);
  }
}

function togglePanel(sideNavMenus, sideMenu) {
  'use strict';

  var menuIndex;
  var panels;
  var i;

  if (
    (!sideMenu.classList.contains('active') && !sideMenu.classList.contains('disabled')) ||
    sideMenu.classList.contains('multiChoice')
  ) {
    // Reset menu 'active'
    menuIndex = null;
    for (i = 0; i < sideNavMenus.length; i += 1) {
      if (sideNavMenus[i].classList.contains('active')) {
        sideNavMenus[i].classList.remove('active');
      }

      if (sideNavMenus[i] === sideMenu) {
        menuIndex = i;
      }
    }

    // Set clicked menu as 'active'
    sideMenu.classList.add('active');

    if (!sideMenu.classList.contains('multiChoice')) {
      // Reset panels
      panels = document.getElementsByClassName('panel_box');
      for (i = 0; i < panels.length; i += 1) {
        panels[i].style.display = 'none';
      }
      panels[menuIndex].style.display = 'block';
      closeDropDown();
      window.scrollTo(0, 0);
    } else {
      openDropDown(sideMenu);
    }
  }
}

// =====================================================================
// =====================================================================
// Set side menu click event

function setupSideNavbar() {
  'use strict';

  var sideNavMenus;
  var i;

  sideNavMenus = document.getElementsByClassName('sideNav clickable');
  for (i = 0; i < sideNavMenus.length; i += 1) {
    sideNavMenus[i].addEventListener('click', function () {
      togglePanel(sideNavMenus, this);
    });
  }
}

// =====================================================================
// =====================================================================
// Toggle Side Menu

function toggleExpandAll() {
  'use strict';

  var obj;
  var i;

  obj = document.getElementsByClassName('right_side');
  for (i = 0; i < obj.length; i += 1) {
    if (obj[i].classList.contains('expand')) {
      obj[i].classList.remove('expand');
    } else {
      obj[i].classList.add('expand');
    }
  }
}

function readyToToggleMenu(btn) {
  'use strict';

  var obj;

  obj = document.getElementById('navbar_holder');
  if (obj.classList.contains('hide')) {
    obj.classList.remove('hide');
    setTimeout(function () {
      obj.classList.remove('fadeOut');
    }, 100);
    toggleExpandAll();
  } else {
    obj.classList.add('hide');
    obj.classList.add('fadeOut');
    toggleExpandAll();
  }

  btn.blur();
}

function setupToggleSideMenu() {
  'use strict';

  var theBtn;

  theBtn = document.getElementById('sidebarToggleTop');
  theBtn.addEventListener('click', function () {
    readyToToggleMenu(this);
  });
}
