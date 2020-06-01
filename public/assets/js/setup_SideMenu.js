"use strict";

// =====================================================================
// =====================================================================
// Set Side Menu

function displayBlocker() {
  "use strict";

  var blurBlocker;

  blurBlocker = document.getElementById("blur_blocker");

  document.getElementById("holder_layers").style.display = "block";
  blurBlocker.style.display = "block";

  setTimeout(function () {
    blurBlocker.classList.add("visible");
  }, 10);
}

function hideBlocker() {
  "use strict";

  var blurBlocker;

  blurBlocker = document.getElementById("blur_blocker");
  blurBlocker.classList.remove("visible");

  setTimeout(function () {
    blurBlocker.style.display = "none";
    document.getElementById("holder_layers").style.display = "none";
  }, 500);
}

function bindOpenMenu() {
  "use strict";

  var toggleButton;
  var sideMenu;

  toggleButton = document.getElementById("navbar_toggle");
  sideMenu = document.getElementById("side-menu");
  toggleButton.addEventListener("click", function () {
    sideMenu.style.display = "block";
    setTimeout(function () {
      displayBlocker();
      sideMenu.classList.add("side-menu-visible");
    }, 1);
  });
}

function closeSideMenu(indicator) {
  "use strict";

  var sideMenu;
  var toggleBlocker;

  sideMenu = document.getElementById("side-menu");
  toggleBlocker = document.getElementById("toggle_blocker");
  toggleBlocker.style.display = "block";
  if (indicator === "full") {
    hideBlocker();
  }
  sideMenu.classList.remove("side-menu-visible");
  setTimeout(function () {
    sideMenu.style.display = "none";
    setTimeout(function () {
      toggleBlocker.style.display = "none";
    }, 1000);
  }, 500);
}

function bindCloseMenu() {
  "use strict";

  var sideMenu;
  var closeButton;

  sideMenu = document.getElementById("side-menu");
  closeButton = sideMenu.getElementsByClassName("close")[0];

  closeButton.addEventListener("click", function () {
    closeSideMenu("full");
  });
}

function setupSideMenu() {
  "use strict";

  bindOpenMenu();
  bindCloseMenu();
}

// =====================================================================
// =====================================================================
// Set Side Menu buttons

function set_button_Collapsed() {
  "use strict";

  var holder_btn;
  var btn;
  var i;

  holder_btn = document
    .getElementById("holder_button_nav_group_2")
    .getElementsByClassName("holder_button_nav");

  btn = document
    .getElementById("holder_button_nav_group_2")
    .getElementsByClassName("btn_nav");

  for (i = 0; i < holder_btn.length; i += 1) {
    holder_btn[i].classList.add("div_btn_collapsed");
    btn[i].classList.add("btn_collapsed");

    if (btn[i].classList.contains("btn_important")) {
      btn[i].classList.add("text_bold");
    }
  }
}

// =====================================================================
// =====================================================================
// Handling some matters related to screen size and rotation

// Handler - Screen Orientation change while Side Menu opens
function sideMenuAutoClose() {
  "use strict";

  var heightBackground;
  var sideMenu;

  heightBackground = document.getElementById("container_background")
    .offsetHeight;

  if (heightBackground >= 768) {
    sideMenu = document.getElementById("side-menu");
    if (sideMenu.style.display === "block") {
      document.getElementById("holder_layers").style.display = "none";
      sideMenu.style.display = "none";
      closeSideMenu("full");
    }
  }
}

// Handler - Screen Orientation Change
function orientationChange() {
  "use strict";

  var heightBackground;
  var heightDivBlocker;

  setTimeout(function () {
    heightBackground = document.getElementById("container_background")
      .offsetHeight;
    heightDivBlocker = document.getElementById("container_body").offsetHeight;

    if (document.getElementById("holder_layers").style.display === "block") {
      document.getElementById("holder_layers").style.height = "auto";
      if (heightBackground < heightDivBlocker) {
        document.getElementById("holder_layers").style.height =
          heightDivBlocker + "px";
      } else if (heightBackground > heightDivBlocker) {
        document.getElementById("holder_layers").style.height =
          heightBackground + "px";
      }
    }
  }, 10);
}

// Handler -  Screen Resolution Change
function sizeChange() {
  "use strict";

  var heightBackground;
  var heightDivBlocker;

  if (window.orientation != currentOrientation) {
    currentOrientation = window.orientation;
  } else {
    setTimeout(function () {
      heightBackground = document.getElementById("container_background")
        .offsetHeight;
      heightDivBlocker = document.getElementById("container_body").offsetHeight;

      if (document.getElementById("holder_layers").style.display === "block") {
        document.getElementById("holder_layers").style.height = "auto";
        if (heightBackground < heightDivBlocker) {
          document.getElementById("holder_layers").style.height =
            heightDivBlocker + "px";
        } else if (heightBackground > heightDivBlocker) {
          document.getElementById("holder_layers").style.height =
            heightBackground + "px";
        }
      }
    }, 100);
  }
}
