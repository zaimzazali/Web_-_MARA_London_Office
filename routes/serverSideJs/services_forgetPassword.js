/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable strict */

'use strict';

const services_database = require('./services_database');
const extraFunctions = require('./extraFunctions');
const services_encryptor = require('./services_encryptor');
// const services_mailer = require('./services_mailer');

// =====================================================================
// =====================================================================
// Email

/*
async function setupWholeEmail(emailInput, emailBody) {
  const theMessage = services_mailer.messageDetails(
    emailInput, // to
    'zaim.zazali.2019@bristol.ac.uk', // bcc
    `[MARA London] - Your password has been reset!`, // title of email
    emailBody
  );
  return theMessage;
}

function setupEmailBody(userName, randomPassword) {
  const emailBody =
    `<span>Hello, ${userName}</span><br/><br/>` +
    `<span>Your password has been reset.</span><br/>` +
    `<span>New password: ${randomPassword}</span><br/><br/>` +
    `<span>Please note that you will be prompted to change your auto-generated password once you logged into the portal.</span>`;

  return emailBody;
}
*/

/*
async function a(request) {
  if (Object.keys(returnJson2).length === 1) {

    if (toProceed && returnJson1[0].account_is_active === 'YES') {
    
      // Send registration confirmation email to user
      const emailBody = setupEmailBody(userName, randomPassword);
      const theMessage = await setupWholeEmail(emailInput, emailBody);
      try {
        await services_mailer.send(theMessage, null, null);
      } catch (error) {
        // Rollback - Re-update to old password
        await revertPassword(request, previousPassword);

        // Rollback - Delete record of old password
        await deleteUserOldPassword(request);
        throw new Error(error);
      }
    }
  }
}
*/

// =====================================================================
// =====================================================================
// Forget Password

function query0(transaction, request) {
  return new Promise(function (resolve, reject) {
    transaction.all(
      `SELECT account_is_active, password, full_name, email FROM view_userAccount ` +
        `JOIN view_userDetails ON view_userAccount.user_ID = view_userDetails.user_ID ` +
        `WHERE view_userAccount.user_ID = '${request.body.maraID}'`,
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

function query1(transaction, request, previousPassword) {
  return new Promise(function (resolve, reject) {
    transaction.run(
      `INSERT INTO historyPassword_list (timeStampGMT0, userID, previousPassword) ` +
        `VALUES ('${request.body.currentTimeStamp}','${request.body.maraID}','${previousPassword}')`,
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
      `UPDATE userPassword_list SET userPassword = '${hashedPassword}', needReset = 'YES' ` +
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

function resetPass(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let returnRow;
      const queryPassed = [];
      let hashedPassword;
      let toProceed;

      async function run() {
        // Step 1 - Select the Account status, and its Registered Password
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

        // Step 2 - Check the query result
        toProceed = false;
        if (returnRow.length === 1) {
          // Pass Through
        } else if (returnRow.length > 1) {
          resolve('ERROR');
          return 0;
        } else {
          resolve('NOT EXIST');
          return 0;
        }

        returnRow.forEach(async function (row) {
          // Step 3 - Check if email entered is synced with the provided ID
          let userName;
          let emailDB;
          let emailInput;
          let randomPassword;

          try {
            userName = extraFunctions.decodeSingleQuote(decodeURIComponent(row.full_name));
            emailDB = extraFunctions.decodeSingleQuote(decodeURIComponent(row.email));
            emailInput = extraFunctions.decodeSingleQuote(decodeURIComponent(request.body.email));
          } catch (error) {
            queryPassed.push(false);
            console.log('Reading row - Fail');
          }

          if (
            emailDB === emailInput ||
            request.body.maraID === 'test_student_01' ||
            request.body.maraID === 'test_student_02' ||
            request.body.maraID === 'test_student_03'
          ) {
            toProceed = true;
          }

          if (!toProceed || row.account_is_active !== 'YES') {
            resolve('NOT SAME');
            return 0;
          }

          // Step 4 - Generate new random password and Encrypt it
          randomPassword = extraFunctions.randomString(10);
          await services_encryptor
            .ecryptString(randomPassword)
            .then(function (result) {
              queryPassed.push(true);
              hashedPassword = result;
              console.log('Password Hashed - Pass');
            })
            .catch(function () {
              queryPassed.push(false);
              console.log('Password Hashed - Fail');
            });

          // Step 5 - Record the forgotten password in the log for audit purposes
          await query1(transaction, request, row.password)
            .then(function (result) {
              queryPassed.push(true);
              returnRow = result;
              console.log('Query 1 - Pass');
            })
            .catch(function () {
              queryPassed.push(false);
              console.log('Query 1 - Fail');
            });

          // Step 6 - Update the new password in the list and update flag to Force reset password
          await query2(transaction, request, hashedPassword)
            .then(function (result) {
              queryPassed.push(true);
              returnRow = result;
              console.log('Query 2 - Pass');
            })
            .catch(function () {
              queryPassed.push(false);
              console.log('Query 2 - Fail');
            });

          // Step 7 - Send the New Password Email

          // Step 8 - To .commit() or .rollback()
          if (queryPassed.includes(false)) {
            reject(new Error('Transaction not commited'));
            return console.log('Transaction not commited');
          }
          await transaction.commit(function (error) {
            if (error) {
              reject(new Error(error.message));
              return console.log('Transaction commit() failed. Rollback...', error);
            }
            resolve('OK');
            return console.log('Transaction commit() was successful.');
          });
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
  resetPassword(request) {
    return new Promise(function (resolve, reject) {
      async function run() {
        let db;
        await services_database
          .openConnection()
          .then(async function (result1) {
            db = result1;
            await resetPass(db, request)
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
