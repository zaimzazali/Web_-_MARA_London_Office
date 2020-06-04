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

function query0(transaction, request) {
  return new Promise(function (resolve, reject) {
    transaction.all(
      `SELECT user_is_registered, account_is_active, account_type, password FROM view_userAccount ` +
        `WHERE user_ID = '${request.body.id}'`,
      function (err, rows) {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function toLogin(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let returnRow;
      let queryPassed = [];
      let flag;

      async function run() {
        // Step 1 - Select account related info of the User
        await query0(transaction, request)
          .then(function (result) {
            queryPassed.push(true);
            returnRow = result;
            console.log('Query 0 - Pass');
          })
          .catch(function () {
            queryPassed.push(false);
            console.log('Query 0 - Fail');
          });

        // Step 5 - To .commit() or .rollback()
        if (queryPassed.includes(false)) {
          reject(new Error('Transaction not commited'));
          return console.log('Transaction not commited');
        }

        await transaction.commit(function (err5) {
          if (err5) {
            reject(new Error(err5.message));
            return console.log('Transaction commit() failed. Rollback...', err5);
          }
          resolve('OK');
          return console.log('Transaction commit() was successful.');
        });

        if (returnRow.length === 1) {
          // Pass Through
        } else if (returnRow.length === 0) {
          flag = ['INVALID', null];
          resolve(flag);
          return 0;
        } else {
          flag = ['ERROR', null];
          reject(flag);
          return 0;
        }

        returnRow.forEach(async function (row) {
          // check if account is active
          if (row.user_is_registered === 'YES' && row.account_is_active === 'YES') {
            // Pass Through
          } else if (row.user_is_registered === 'YES' && row.account_is_active === 'NO') {
            flag = ['BLOCKED', null];
            resolve(flag);
            return 0;
          } else {
            flag = ['INACTIVE', null];
            resolve(flag);
            return 0;
          }

          // check whether password is correct
          let isSame;
          await services_encryptor
            .compareString(request.body.password, row.password)
            .then(function (result) {
              // queryPassed.push(true);
              isSame = result;
              console.log('Compare Hashes - Pass');
            })
            .catch(function () {
              // queryPassed.push(false);
              console.log('Compare Hashes - Fail');
            });

          if (isSame) {
            // Pass Through
            flag = ['OK', row.account_type];
            resolve(flag);
            return 0;
          }
          flag = ['INVALID', null];
          resolve(flag);
          return 0;

          /*
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
        */
        });
        return 0;
      }
      run();
    });
  });
}

async function a(request) {
  /*
  let tableName = null;
  let sqlStatment = null;
  let returnJson1 = null;
  let returnJson2 = null;
  */

  /*
  try {
    tableName = 'view_userAccount';
    sqlStatment =
      `SELECT user_is_registered, account_is_active, account_type, password FROM ${tableName} ` +
      `WHERE user_ID = '${request.body.id}'`;
    returnJson1 = await services_database.selectData(sqlStatment);
  } catch (error) {
    throw new Error(error);
  }
*/
  /*
  let toProceed = false;
  let flag = null;
  if (Object.keys(returnJson1).length === 1) {
    toProceed = true;
  } else if (Object.keys(returnJson1).length === 0) {
    flag = ['INVALID', null];
  } else {
    flag = ['ERROR', null];
  }
  */
  /*
  if (toProceed) {
    // check if account is active
    if (returnJson1[0].user_is_registered === 'YES' && returnJson1[0].account_is_active === 'YES') {
      
    } else if (
      returnJson1[0].user_is_registered === 'YES' &&
      returnJson1[0].account_is_active === 'NO'
    ) {
      flag = ['BLOCKED', null];
    } else {
      flag = ['INACTIVE', null];
    }
  }
  */

  return flag;
}

module.exports = {
  tryLogin(request) {
    return new Promise(function (resolve, reject) {
      async function run() {
        let db;
        await services_database
          .openConnection()
          .then(async function (result1) {
            db = result1;
            await toLogin(db, request)
              .then(function (result2) {
                resolve(result2);
                return result2;
              })
              .catch(function (error2) {
                reject(new Error(error2));
              })
              .finally(async function () {
                await services_database.closeConnection(db);
              });
          })
          .catch(function (error1) {
            reject(new Error(error1));
          });
      }
      run();
    });
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
