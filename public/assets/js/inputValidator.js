"use strict";

function encodeSingleQuote(input) {
  "use strict";

  var theInput;

  theInput = input;
  theInput = theInput.replace(/'/g, "''");
  return theInput;
}

function decodeSingleQuote(input) {
  "use strict";

  var theInput;

  theInput = input;
  theInput = theInput.replace(/''/g, "'");
  return theInput;
}

function isNameValid(input) {
  "use strict";

  var resultSignal;
  var theInput;

  try {
    theInput = input.toString();
    theInput = theInput.replace(/\s+/g, " ").trim();
    theInput = encodeURIComponent(theInput);
    theInput = encodeSingleQuote(theInput);

    if (theInput.length < 2) {
      resultSignal = [false, "Please enter your proper name!"];
      return resultSignal;
    }

    // If everything is okay
    resultSignal = [true, theInput];
  } catch (error) {
    resultSignal = [
      false,
      "There is something wrong during the name validation!",
    ];
  }

  return resultSignal;
}

function isEmailAddressValid(input) {
  "use strict";

  var resultSignal;
  var errorMessage_0;
  var theInput;
  var theInput2;
  var rgxp;
  var startIndex;

  errorMessage_0 = "Please ensure the e-mail address is correct!";

  try {
    theInput = input.toString();
    theInput = theInput.replace(/\s/g, "").trim();
    theInput = encodeURIComponent(theInput);
    theInput = encodeSingleQuote(theInput);

    // Checking the full length of the email input
    if (theInput.length < 5) {
      resultSignal = [false, errorMessage_0];
      return resultSignal;
    }

    rgxp = new RegExp(encodeURIComponent("@"), "g");

    if (
      theInput.indexOf(encodeURIComponent("@")) < 1 ||
      (theInput.match(rgxp) || []).length !== 1 ||
      theInput.indexOf(encodeURIComponent("@")) === theInput.length - 1
    ) {
      resultSignal = [false, errorMessage_0];
      return resultSignal;
    }

    // Checking the input after "@" in the email address
    startIndex = theInput.indexOf(encodeURIComponent("@"));
    theInput2 = theInput.substring(startIndex + 1);

    if (theInput2.length < 3) {
      resultSignal = [false, errorMessage_0];
      return resultSignal;
    }

    rgxp = new RegExp(encodeURIComponent("."), "g");

    if (
      theInput2.indexOf(encodeURIComponent(".")) < 1 ||
      (theInput2.match(rgxp) || []).length < 1 ||
      theInput2.indexOf(encodeURIComponent(".")) === theInput2.length - 1
    ) {
      resultSignal = [false, errorMessage_0];
      return resultSignal;
    }

    // If everything is okay
    resultSignal = [true, theInput];
  } catch (error) {
    resultSignal = [
      false,
      "There is something wrong during the email validation!",
    ];
  }

  return resultSignal;
}

function isMessageValid(input) {
  "use strict";

  var resultSignal;
  var theInput;

  try {
    theInput = input.toString();
    theInput = theInput.trim();

    if (theInput.length < 2) {
      resultSignal = [false, "Please enter your message!"];
      return resultSignal;
    }

    // If everything is okay
    resultSignal = [true, theInput];
  } catch (error) {
    resultSignal = [
      false,
      "There is something wrong during the message validation!",
    ];
  }

  return resultSignal;
}

function isMARAidValid(input) {
  "use strict";

  var resultSignal;
  var errorMessage_0;
  var theInput;

  errorMessage_0 = "Please ensure the MARA Reference Number is correct!";

  try {
    theInput = input.toString();
    theInput = theInput.trim();
    theInput = theInput.replace(/\s/g, "");

    if (theInput.replace(/\D/g, "").length !== theInput.length) {
      resultSignal = [false, errorMessage_0];
      return resultSignal;
    }

    theInput = theInput.replace(/\D/g, "");

    if (theInput.length < 9) {
      resultSignal = [false, errorMessage_0];
      return resultSignal;
    }

    // If everything is okay
    resultSignal = [true, theInput];
  } catch (error) {
    resultSignal = [
      false,
      "There is something wrong during the MARA Reference Number validation!",
    ];
  }

  return resultSignal;
}

function isPasswordValid(input) {
  "use strict";

  var resultSignal;
  var theInput;

  try {
    theInput = input.toString();

    if (theInput.length < 8) {
      resultSignal = [false, "Please ensure the password follows the rule!"];
      return resultSignal;
    }

    // If everything is okay
    resultSignal = [true, theInput];
  } catch (error) {
    resultSignal = [
      false,
      "There is something wrong during the Password validation!",
    ];
  }

  return resultSignal;
}

function isPasswordSame(input, inputOri) {
  "use strict";

  var resultSignal;
  var theInput;
  var theInputOri;

  try {
    theInput = input.toString();
    theInputOri = inputOri.toString();

    if (theInput !== theInputOri) {
      resultSignal = [false, "Please ensure the password is the same!"];
      return resultSignal;
    }

    // If everything is okay
    resultSignal = [true, ""];
  } catch (error) {
    resultSignal = [
      false,
      "There is something wrong during the Confirm Password validation!",
    ];
  }

  return resultSignal;
}
