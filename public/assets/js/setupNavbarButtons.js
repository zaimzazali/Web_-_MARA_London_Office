"use strict";

function setupNavbarButtons() {
  var obj = null;

  // About
  bindClickOpen("byClass", "btn_about", "modal_about", "jackInTheBox");
  bindClickClose("btn_nav", "modal_about", "jackInTheBoxOut");

  // Contact Us
  bindClickOpen("byClass", "btn_contact", "modal_contact_us", "bounceIn");
  bindClickClose("btn_nav", "modal_contact_us", "bounceOut");

  // Sign Up
  bindClickOpen("byClass", "btn_signup", "modal_sign_up", "bounceIn");
  bindClickClose("btn_nav", "modal_sign_up", "bounceOut");
}
