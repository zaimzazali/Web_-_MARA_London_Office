function set_button_Collapsed() {
  "use strict";

  var holder_btn = document
    .getElementById("holder_button_nav_group_2")
    .getElementsByClassName("holder_button_nav");

  var btn = document
    .getElementById("holder_button_nav_group_2")
    .getElementsByClassName("btn_nav");

  for (var i = 0; i < holder_btn.length; i += 1) {
    holder_btn[i].classList.add("div_btn_collapsed");
    btn[i].classList.add("btn_collapsed");

    if (btn[i].classList.contains("btn_important")) {
      btn[i].classList.add("text_bold");
    }
  }
}

function displayBlocker() {
  "use strict";

  var blurBlocker = document.getElementById("holder_layers");
  blurBlocker.style.display = "block";

  setTimeout(function () {
    blurBlocker.classList.add("visible");
  }, 1);
}

function hideBlocker() {
  "use strict";

  var blurBlocker = document.getElementById("holder_layers");
  blurBlocker.classList.remove("visible");

  setTimeout(function () {
    blurBlocker.style.display = "none";
  }, 500);
}

function bindOpenMenu() {
  "use strict";

  var toggleButton = document.getElementById("navbar_toggle");
  var sideMenu = document.getElementById("side-menu");
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

  var sideMenu = document.getElementById("side-menu");
  var toggleBlocker = document.getElementById("toggle_blocker");
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

  var sideMenu = document.getElementById("side-menu");
  var closeButton = sideMenu.getElementsByClassName("close")[0];

  closeButton.addEventListener("click", function () {
    closeSideMenu("full");
  });
}

function setupSideMenu() {
  "use strict";

  bindOpenMenu();
  bindCloseMenu();
}

function sideMenuAutoClose() {
  "use strict";

  var sideMenu = document.getElementById("side-menu");
  if (sideMenu.style.display === "block") {
    document.getElementById("holder_layers").style.display = "none";
    sideMenu.style.display = "none";
    closeSideMenu("full");
  }
}

function orientationChange() {
  setTimeout(function () {
    var heightBackground = document.getElementById("container_background")
      .offsetHeight;
    var heightDivBlocker = document.getElementById("container_body")
      .offsetHeight;

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

var currentOrientation = window.orientation;

function sizeChange() {
  if (window.orientation != currentOrientation) {
    currentOrientation = window.orientation;
  } else {
    setTimeout(function () {
      var heightBackground = document.getElementById("container_background")
        .offsetHeight;
      var heightDivBlocker = document.getElementById("container_body")
        .offsetHeight;

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
