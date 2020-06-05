/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable strict */
/* eslint-disable camelcase */

'use strict';

const services_database = require('./services_database');
const services_encryptor = require('./services_encryptor');

/*
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
*/

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
      const queryPassed = [];
      let isSame;

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

        // Step 2 - To .commit() or .rollback()
        if (queryPassed.includes(false)) {
          reject(new Error('Login - Transaction not commited'));
          return console.log('Login - Transaction not commited');
        }
        await transaction.commit(function (error) {
          if (error) {
            reject(new Error(error.message));
            return console.log('Login - Transaction commit() failed. Rollback...', error);
          }
          resolve('OK');
          return console.log('Login - Transaction commit() was successful.');
        });

        // Step 3 - Check the query result
        if (returnRow.length === 1) {
          // Pass Through
        } else if (returnRow.length === 0) {
          resolve(['INVALID', null]);
          return 0;
        } else {
          resolve(['ERROR', null]);
          return 0;
        }

        returnRow.forEach(async function (row) {
          // Step 4 - Check whether the Account is Active
          if (row.user_is_registered === 'YES' && row.account_is_active === 'YES') {
            // Pass Through
          } else if (row.user_is_registered === 'YES' && row.account_is_active === 'NO') {
            resolve(['BLOCKED', null]);
            return 0;
          } else {
            resolve(['INACTIVE', null]);
            return 0;
          }

          // Step 5 - Check whether the provided Password is correct
          await services_encryptor
            .compareString(request.body.password, row.password)
            .then(function (result) {
              isSame = result;
              console.log('Compare Hashes - Pass');
            })
            .catch(function () {
              console.log('Compare Hashes - Fail');
            });

          // Step 6 - If same, Welcome!
          if (isSame) {
            // Pass Through
            resolve(['OK', row.account_type]);
            return 0;
          }
          resolve(['INVALID', null]);
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

// =====================================================================
// =====================================================================
// Modules

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
  /*
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
  */
};
