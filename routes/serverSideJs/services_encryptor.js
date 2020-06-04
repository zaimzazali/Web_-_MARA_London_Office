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
  ecryptString(input) {
    return new Promise(function (resolve, reject) {
      async function run() {
        await beginEncryption(input)
          .then(function (result) {
            resolve(result);
          })
          .catch(function (error) {
            reject(new Error(error));
          });
      }
      run();
    });
  },

  compareString(string, hashedString) {
    return new Promise(function (resolve, reject) {
      async function run() {
        await beginComparing(string, hashedString)
          .then(function (result) {
            resolve(result);
          })
          .catch(function (error) {
            reject(new Error(error));
          });
      }
      run();
    });
  },
};
