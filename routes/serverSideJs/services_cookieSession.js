/* eslint-disable strict */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */

'use strict';

const services_database = require('./services_database');
const extraFunctions = require('./extraFunctions');

module.exports = {
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
  removeCookie(request, response) {
    request.session = null;
  },
};
