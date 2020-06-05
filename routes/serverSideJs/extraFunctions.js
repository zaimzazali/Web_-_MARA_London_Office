/* eslint-disable func-names */
/* eslint-disable strict */

'use strict';

module.exports = {
  randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  decodeSingleQuote(input) {
    let theInput = input;
    theInput = theInput.replace(/''/g, "'");
    return theInput;
  },
  capitaliseWords(string) {
    return string.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },
};
