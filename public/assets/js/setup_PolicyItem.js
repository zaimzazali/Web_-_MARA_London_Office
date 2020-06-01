/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable strict */

'use strict';

// Setting up the items in the policy section
function setupPolicyItems() {
  'use strict';

  // Disclaimer
  bindClickOpen('byID', 'item_disclaimer', 'modal_display_only', 'slideDown');
  bindClickClose('policy_item item_clickable', 'modal_display_only', 'slideUp');

  // Privacy Policy
  bindClickOpen('byID', 'item_privacy_policy', 'modal_display_only', 'slideDown');
  bindClickClose('policy_item item_clickable', 'modal_display_only', 'slideUp');

  // Social Media
  // Facebook
  bindOpenURL('link_fb', 'facebook');

  // Terms & Conditions
  bindClickOpen('byID', 'item_tnc', 'modal_display_only', 'slideDown');
  bindClickClose(null, 'modal_display_only', 'slideUp');
}
