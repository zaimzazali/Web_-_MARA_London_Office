/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable strict */

'use strict';

const services_database = require('./services_database');
const services_encryptor = require('./services_encryptor');
const services_mailer = require('./services_mailer');
const extraFunctions = require('./extraFunctions');

// =====================================================================
// =====================================================================
// MARA ID Checker

function query0(transaction, request) {
  return new Promise(function (resolve, reject) {
    transaction.all(
      `SELECT user_is_registered FROM view_userAccount WHERE user_ID = '${request.body.id}'`,
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

function IDchecker(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let returnRow;
      const queryPassed = [];

      async function run() {
        // Step 1 - Select the registration status of the provided account
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
          reject(new Error('Check ID - Transaction not commited'));
          return console.log('Check ID - Transaction not commited');
        }
        await transaction.commit(function (error) {
          if (error) {
            reject(new Error(error.message));
            return console.log('Check ID - Transaction commit() failed. Rollback...', error);
          }
          return console.log('Check ID - Transaction commit() was successful.');
        });

        // Step 3 - Check the query result
        if (returnRow.length === 0) {
          resolve('NOT EXIST');
        } else if (returnRow.length > 1) {
          resolve('ERROR');
        } else {
          returnRow.forEach((row) => {
            if (row.user_is_registered === 'NO') {
              resolve('OK');
            }
            resolve('EXIST');
          });
        }
        return 0;
      }
      run();
    });
  });
}

// =====================================================================
// =====================================================================
// Email

function emailing(inputValues) {
  return new Promise(function (resolve, reject) {
    // Setting up the parameters
    const emailData = {};
    emailData.fullName = extraFunctions.capitaliseWords(inputValues[0]);
    emailData.maraLink = inputValues[1];

    const params = {
      Destination: {
        ToAddresses: [inputValues[2]],
      },
      Source: services_mailer.getSystemMailer(),
      Template: 'template_sign_up',
      TemplateData: JSON.stringify(emailData),
      ReplyToAddresses: [services_mailer.getSystemReceiver()],
    };

    services_mailer
      .triggerSendEmail(params)
      .then(function (result) {
        console.log(result);
        resolve(result);
      })
      .catch(function (err) {
        console.error(err, err.stack);
        reject(err);
      });
  });
}

// =====================================================================
// =====================================================================
// User Registration

function query1(transaction, request) {
  return new Promise(function (resolve, reject) {
    transaction.run(
      `INSERT INTO userDetails_list (userFullName, userEmail, userID) ` +
        `VALUES ('${request.body.name}', '${request.body.email}', '${request.body.maraID}')`,
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

function query2(transaction, request, hashedPassword) {
  return new Promise(function (resolve, reject) {
    transaction.run(
      `INSERT INTO userPassword_list (userPassword, userID, needReset) ` +
        `VALUES ('${hashedPassword}', '${request.body.maraID}', 'NO')`,
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

function query3(transaction, request) {
  return new Promise(function (resolve, reject) {
    transaction.run(
      `UPDATE user_list SET isRegistered = 'YES', isAccountActive = 'YES',  userTypeCode = 1 ` +
        `WHERE userID = '${request.body.maraID}'`,
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

function userRegistration(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let hashedPassword;
      const queryPassed = [];

      async function run() {
        // Account 'test_student_00' is set to be un-recorded
        // So that multiple registration can be done
        if (request.body.maraID !== 'test_student_00') {
          // Step 0 - Encrypt the provided password
          await services_encryptor
            .ecryptString(request.body.password)
            .then(function (result) {
              queryPassed.push(true);
              hashedPassword = result;
              console.log('Password Hashed - Pass');
            })
            .catch(function () {
              queryPassed.push(false);
              console.log('Password Hashed - Fail');
            });

          // Step 1 - Insert User Details
          await query1(transaction, request)
            .then(function () {
              queryPassed.push(true);
              console.log('Query 1 - Pass');
            })
            .catch(function () {
              queryPassed.push(false);
              console.log('Query 1 - Fail');
            });

          // Step 2 - Insert user password
          await query2(transaction, request, hashedPassword)
            .then(function () {
              queryPassed.push(true);
              console.log('Query 2 - Pass');
            })
            .catch(function () {
              queryPassed.push(false);
              console.log('Query 2 - Fail');
            });

          // Step 3 - Update user accessibility
          await query3(transaction, request)
            .then(function () {
              queryPassed.push(true);
              console.log('Query 3 - Pass');
            })
            .catch(function () {
              queryPassed.push(false);
              console.log('Query 3 - Fail');
            });
        }

        // Step 4 - Send the Registration Confirmation Email
        const inputValues = [];
        inputValues.push(extraFunctions.decodeSingleQuote(decodeURIComponent(request.body.name)));
        inputValues.push('https://www.google.com');
        inputValues.push(extraFunctions.decodeSingleQuote(decodeURIComponent(request.body.email)));

        await emailing(inputValues)
          .then(function () {
            queryPassed.push(true);
            console.log('Send Email - Pass');
          })
          .catch(function () {
            queryPassed.push(false);
            console.log('Send Email - Fail');
          });

        // Step 5 - To .commit() or .rollback()
        if (queryPassed.includes(false)) {
          reject(new Error('Register - Transaction not commited'));
          return console.log('Register - Transaction not commited');
        }
        await transaction.commit(function (error) {
          if (error) {
            reject(new Error(error.message));
            return console.log('Register - Transaction commit() failed. Rollback...', error);
          }
          resolve('OK');
          return console.log('Register - Transaction commit() was successful.');
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
  checkMaraID(request) {
    return new Promise(function (resolve, reject) {
      async function run() {
        let db;
        await services_database
          .openConnection()
          .then(async function (result1) {
            db = result1;
            await IDchecker(db, request)
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
  registerUser(request) {
    return new Promise(function (resolve, reject) {
      async function run() {
        let db;
        await services_database
          .openConnection()
          .then(async function (result1) {
            db = result1;
            await userRegistration(db, request)
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
