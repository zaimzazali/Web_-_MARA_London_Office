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
};
