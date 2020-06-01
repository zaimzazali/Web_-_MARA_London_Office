"use strict";

// =====================================================================
// =====================================================================
// To handle change in resolution @ orientation

// On Orientation change
$(window).on("orientationchange", function () {
  sideMenuAutoClose();
  orientationChange();
});

// On resize
$(window).resize(function () {
  sizeChange();
});
