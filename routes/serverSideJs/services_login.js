/* eslint-disable strict */
/* eslint-disable camelcase */

'use strict';

const services_database = require('./services_database');
const services_encryptor = require('./services_encryptor');

function setUserLogout(request) {
  const session_ID = request.session.sessionID;
  const user_ID = request.session.userID;

  const tableName = 'userLogin_list';
  const sqlStatment =
    `INSERT INTO ${tableName} (sessionID, timeStampGMT0, userID, userIsLoggedIn) ` +
    `VALUES ('${session_ID}','${request.body.currentTimeStamp}','${user_ID}', 'NO')`;
  services_database.insertData(sqlStatment);
}

async function setUserLogin(request) {
  try {
    const session_ID = request.session.sessionID;
    const user_ID = request.session.userID;

    const tableName = 'userLogin_list';
    const sqlStatment =
      `INSERT INTO ${tableName} (sessionID, timeStampGMT0, userID, userIsLoggedIn) ` +
      `VALUES ('${session_ID}','${request.body.currentTimeStamp}','${user_ID}', 'YES')`;
    await services_database.insertData(sqlStatment);
    return user_ID;
  } catch (error) {
    throw new Error(error);
  }
}

async function toLogin(request) {
  let tableName = null;
  let sqlStatment = null;
  let returnJson1 = null;
  let returnJson2 = null;

  try {
    tableName = 'view_userAccount';
    sqlStatment =
      `SELECT user_is_registered, account_is_active, account_type, password FROM ${tableName} ` +
      `WHERE user_ID = '${request.body.id}'`;
    returnJson1 = await services_database.selectData(sqlStatment);
  } catch (error) {
    throw new Error(error);
  }

  let toProceed = false;
  let flag = null;
  if (Object.keys(returnJson1).length === 1) {
    toProceed = true;
  } else if (Object.keys(returnJson1).length === 0) {
    flag = ['INVALID', null];
  } else {
    flag = ['ERROR', null];
  }

  if (toProceed) {
    // check if account is active
    if (returnJson1[0].user_is_registered === 'YES' && returnJson1[0].account_is_active === 'YES') {
      // check whether password is correct
      let isSame = null;
      try {
        isSame = await services_encryptor.compareString(
          request.body.password,
          returnJson1[0].password
        );
      } catch (error) {
        throw new Error(error);
      }

      if (isSame) {
        // Check if user is already logged in
        tableName = 'view_userLogin';
        sqlStatment =
          `SELECT log_activity, time_log FROM ${tableName} ` +
          `WHERE user_ID = '${request.body.id}'` +
          `ORDER BY time_log DESC LIMIT 1`;
        returnJson2 = await services_database.selectData(sqlStatment);
        if (Object.keys(returnJson2).length === 0) {
          flag = ['OK', returnJson1[0].account_type];
        } else if (returnJson2[0].log_activity === 'NO' || returnJson2[0].log_activity === null) {
          // Set data in server
          request.session.userID = request.body.id;
          flag = ['OK', returnJson1[0].account_type];
        } else {
          flag = ['LOGGED', null];
        }
      } else {
        flag = ['INVALID', null];
      }
    } else if (
      returnJson1[0].user_is_registered === 'YES' &&
      returnJson1[0].account_is_active === 'NO'
    ) {
      flag = ['BLOCKED', null];
    } else {
      flag = ['INACTIVE', null];
    }
  }

  return flag;
}

module.exports = {
  async tryLogin(request) {
    try {
      const flag = await toLogin(request);
      return flag;
    } catch (error) {
      throw new Error(error);
    }
  },
  async setLogon(request) {
    try {
      const data = await setUserLogin(request);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  },
  setLogout(request) {
    setUserLogout(request);
  },
};
