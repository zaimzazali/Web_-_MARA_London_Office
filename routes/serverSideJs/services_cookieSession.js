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
        console.log('Session cookie found');
        resolve('AUTO LOGIN');
      } else {
        console.log('No session cookie detected');
        resolve('STAY');
      }
    });
  },
  createCookie(request) {
    return new Promise(function (resolve) {
      request.session.sessionID = extraFunctions.randomString(50);
      console.log('Session cookie created');
      resolve('OK');
    });
  },
  removeCookie(request) {
    return new Promise(function (resolve) {
      request.session = null;
      resolve('OK');
    });
  },
};

/*
  async checkCookie(request, response) {
    let flag = null;

    // Assign new sessionID if the client does not have it
    if (!request.session.sessionID) {
      request.session.sessionID = extraFunctions.randomString(50);
      flag = 'CREATED - maraSession';
    } else {
      // Check if user is already logged in
      const tableName = 'view_userLogin';
      const sqlStatment =
        `SELECT log_activity, time_log FROM ${tableName} ` +
        `WHERE session_ID = '${request.session.sessionID}'` +
        `ORDER BY time_log DESC LIMIT 1`;
      const returnJson1 = await services_database.selectData(sqlStatment);
      if (Object.keys(returnJson1).length === 0) {
        flag = 'CREATED - maraSession';
      } else if (returnJson1[0].log_activity === 'NO') {
        flag = 'AUTO_LOGIN';
      } else {
        request.session.sessionID = extraFunctions.randomString(50);
        flag = 'LOGGED';
      }
    }

    return flag;
  },
  */
