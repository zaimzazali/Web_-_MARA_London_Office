/* eslint-disable strict */

'use strict';

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-var */

function layersReset() {
  var theLayers = document.getElementsByClassName('type_layer');
  var i = 0;

  for (i = 0; i < theLayers.length; i += 1) {
    theLayers[i].style.display = 'none';
  }
}

function modalsReset() {
  var theModals = document.getElementsByClassName('type_modal');
  var i = 0;

  for (i = 0; i < theModals.length; i += 1) {
    theModals[i].style.display = 'none';
  }
}

function resetter() {
  layersReset();
  modalsReset();
}
