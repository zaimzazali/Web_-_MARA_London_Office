/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable strict */

'use strict';

const extraFunctions = require('./extraFunctions');

module.exports = {
  checkCookie(request) {
    return new Promise(function (resolve) {
      // Check if there is session cookie
      // If there is, auto-login the user
      if (request.session.sessionID) {
        console.log('Cookie session found');
        resolve('AUTO LOGIN');
      } else {
        console.log('No cookie session detected');
        resolve('STAY');
      }
    });
  },
  createCookie(request) {
    return new Promise(function (resolve) {
      // Check if session cookie already exist
      if (!request.session.sessionID) {
        request.session.sessionID = extraFunctions.randomString(50);
        console.log('Session cookie created');
        resolve('OK');
      } else {
        console.log('Cookie session has already set');
        resolve('STAY');
      }
    });
  },
  removeCookie(request) {
    return new Promise(function (resolve) {
      // Delete cookie session
      request.session = null;
      resolve('OK');
    });
  },
};
