/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// =====================================================================
// =====================================================================
// Page transition

function changePage() {
  'use strict';

  var container;
  var loading_page;

  container = document.getElementById('container_fixed_layers');
  loading_page = container.querySelector('#loading_page');

  container.querySelector('#initial_loader').style.display = 'none';
  loading_page.style.opacity = '0';

  container.style.display = 'block';
  loading_page.style.display = 'block';
  setTimeout(function () {
    loading_page.style.opacity = '1';
  }, 1);
}

// =====================================================================
// =====================================================================
// Before Exit page
