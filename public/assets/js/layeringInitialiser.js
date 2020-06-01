"use strict";

// To reset all layers
function layersReset() {
  "use strict";

  var theLayers;
  var i;

  theLayers = document.getElementsByClassName("type_layer");
  for (i = 0; i < theLayers.length; i += 1) {
    theLayers[i].style.display = "none";
  }
}

// To reset all modal layering
function modalsReset() {
  "use strict";

  var theModals;
  var i;

  theModals = document.getElementsByClassName("type_modal");
  for (i = 0; i < theModals.length; i += 1) {
    theModals[i].style.display = "none";
  }
}

function resetter() {
  "use strict";

  layersReset();
  modalsReset();
}
