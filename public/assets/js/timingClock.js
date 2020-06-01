"use strict";

// Get current timestamp with desired format
function getCurrentTimeStamp() {
  "use strict";

  var dt;
  var dformat;

  dt = new Date();
  dformat = ""
    .concat(
      [
        "0000".concat(dt.getFullYear()).slice(-4),
        "0".concat(dt.getMonth() + 1).slice(-2),
        "0".concat(dt.getDate()).slice(-2),
      ].join("-"),
      " "
    )
    .concat(
      [
        "0".concat(dt.getHours()).slice(-2),
        "0".concat(dt.getMinutes()).slice(-2),
        "0".concat(dt.getSeconds()).slice(-2),
      ].join(":")
    );

  return dformat;
}
