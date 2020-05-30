/* eslint-disable strict */

'use strict';

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function setupForgetButton() {
  bindClickOpen('byID', 'span_forget', 'modal_forget_pass', 'bounceIn');
  bindClickClose('span_forget', 'modal_forget_pass', 'bounceOut');
}
