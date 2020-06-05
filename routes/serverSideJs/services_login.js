/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable strict */

'use strict';

const services_database = require('./services_database');
const services_encryptor = require('./services_encryptor');

// =====================================================================
// =====================================================================
// Log On - Inside Portal

function query1(transaction, request, session_ID, user_ID) {
  return new Promise(function (resolve, reject) {
    transaction.run(
      `INSERT INTO userLogin_list (sessionID, timeStampGMT0, userID) ` +
        `VALUES ('${session_ID}','${request.body.currentTimeStamp}','${user_ID}')`,
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve('Query Pass');
        }
      }
    );
  });
}

function setUserLogon(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let session_ID;
      let user_ID;
      const queryPassed = [];

      async function run() {
        session_ID = request.session.sessionID;
        user_ID = request.session.userID;

        // Step 1 - Insert login status into database
        await query1(transaction, request, session_ID, user_ID)
          .then(function () {
            queryPassed.push(true);
            console.log('Query 1 - Pass');
          })
          .catch(function () {
            queryPassed.push(false);
            console.log('Query 1 - Fail');
          });

        // Step 2 - To .commit() or .rollback()
        if (queryPassed.includes(false)) {
          reject(new Error('Log On - Transaction not commited'));
          return console.log('Log On - Transaction not commited');
        }
        await transaction.commit(function (error) {
          if (error) {
            reject(new Error(error.message));
            return console.log('Log On - Transaction commit() failed. Rollback...', error);
          }
          resolve('OK');
          return console.log('Log On - Transaction commit() was successful.');
        });
        return 0;
      }
      run();
    });
  });
}

// =====================================================================
// =====================================================================
// Log In - From Main Page

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
  setLogon(request) {
    return new Promise(function (resolve, reject) {
      async function run() {
        let db;
        await services_database
          .openConnection()
          .then(async function (result1) {
            db = result1;
            await setUserLogon(db, request)
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
};
