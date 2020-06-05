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
        if (request.session.state === 'in') {
          console.log('Cookie session found');
          resolve('AUTO LOGIN');
        } else {
          console.log('Old cookie session found');
          resolve('STAY');
        }
      } else {
        console.log('No cookie session detected');
        request.session.sessionID = extraFunctions.randomString(50);
        request.session.state = 'out';
        console.log('Session cookie created');
        resolve('STAY');
      }
    });
  },
  updateCookie(request) {
    return new Promise(function (resolve) {
      request.session.state = 'in';
      console.log('Cookie session has updated');
      resolve('OK');
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
