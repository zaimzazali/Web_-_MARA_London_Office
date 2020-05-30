"use strict";

function layersReset() {
  var theLayers = document.getElementsByClassName("type_layer");

  for (var i = 0; i < theLayers.length; i += 1) {
    theLayers[i].style.display = "none";
  }
}

function modalsReset() {
  var theModals = document.getElementsByClassName("type_modal");

  for (var i = 0; i < theModals.length; i += 1) {
    theModals[i].style.display = "none";
  }
}

function resetter() {
  layersReset();
  modalsReset();
}
