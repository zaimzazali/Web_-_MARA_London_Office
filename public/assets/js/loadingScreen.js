"use strict";

// =====================================================================
// =====================================================================
// Page transition

function changePage() {
  "use strict";

  var container;
  var loading_page;

  container = document.getElementById("container_fixed_layers");
  loading_page = container.querySelector("#loading_page");

  container.querySelector("#initial_loader").style.display = "none";
  loading_page.style.opacity = "0";

  container.style.display = "block";
  loading_page.style.display = "block";
  setTimeout(function () {
    loading_page.style.opacity = "1";
  }, 1);
}

// =====================================================================
// =====================================================================
// Modal loading

function showLoader(modal) {
  "use strict";

  var divBlocker;

  divBlocker = modal.getElementsByClassName("modal_blocker")[0];
  divBlocker.getElementsByClassName("modal_loader")[0].style.display = "block";
  divBlocker.style.display = "block";
  return divBlocker;
}

// =====================================================================
// =====================================================================
// Force - Blur Background

function forceBlurBackground() {
  "use strict";

  backgroundBlurAdjuster(document.getElementById("modal_display_with_button"));
  document.getElementById("holder_layers").style.display = "block";
  document.getElementById("blur_blocker").style.display = "block";
  setTimeout(function () {
    document.getElementById("blur_blocker").classList.add("visible");
  }, 1);
}
