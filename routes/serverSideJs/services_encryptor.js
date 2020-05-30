/* eslint-disable strict */
/* eslint-disable func-names */

'use strict';

const bcrypt = require('bcrypt');

function beginEncryption(input) {
  return new Promise(function (resolve, reject) {
    try {
      const hashedPassword = bcrypt.hashSync(input, 10);
      resolve(hashedPassword);
    } catch (error) {
      reject(new Error(error));
    }
  });
}

function beginComparing(string, hashedString) {
  return new Promise(function (resolve, reject) {
    try {
      if (bcrypt.compareSync(string, hashedString)) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(new Error(error));
    }
  });
}

module.exports = {
  async ecryptString(input) {
    try {
      const hashedString = await beginEncryption(input);
      return hashedString;
    } catch (error) {
      throw new Error(error);
    }
  },
  async compareString(string, hashedString) {
    try {
      const flag = await beginComparing(string, hashedString);
      return flag;
    } catch (error) {
      throw new Error(error);
    }
  },
};
