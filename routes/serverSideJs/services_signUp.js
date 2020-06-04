/* eslint-disable strict */
/* eslint-disable camelcase */

'use strict';

const services_database = require('./services_database');
const services_encryptor = require('./services_encryptor');
// const services_mailer = require('./services_mailer');
const extraFunctions = require('./extraFunctions');

function IDchecker(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      // Step 1 - Select account registration status
      transaction.all(
        `SELECT user_is_registered FROM view_userAccount WHERE user_ID = '${request.body.id}'`,
        function (err1, rows) {
          if (err1) {
            reject(new Error(err1.message));
            return console.log(err1.message);
          }

          console.log('Query Pass');

          if (rows.length === 0) {
            resolve('NOT EXIST');
            return console.log('NOT EXIST');
          }
          if (rows.length > 1) {
            resolve('ERROR');
            return console.log('ERROR');
          }
          rows.forEach((row) => {
            if (row.user_is_registered === 'NO') {
              resolve('OK');
              return console.log('OK');
            }
            resolve('EXIST');
            return console.log('EXIST');
          });
        }
      );

      // To .commit() or .rollback()
      transaction.commit(function (err2) {
        if (err2) {
          reject(new Error(err2.message));
          return console.log('Transaction #1 commit() failed. Rollback...', err2);
        }
        resolve('OK');
        return console.log('Transaction #1 commit() was successful.');
      });
      // or automatically transaction.rollback()
    });
  });
}

/*
async function setupWholeEmail(request, emailBody) {
  const theMessage = services_mailer.messageDetails(
    extraFunctions.decodeSingleQuote(decodeURIComponent(request.body.email)), // to
    'zaim.zazali.2019@bristol.ac.uk', // bcc
    `[MARA London] - Thank you for Registering!`, // title of email
    emailBody
  );
  return theMessage;
}

function setupEmailBody(request) {
  const emailBody =
    `<span>Welcome aboard, ${extraFunctions.decodeSingleQuote(
      decodeURIComponent(request.body.name)
    )} !<br/><br/>` +
    `<span>Thank you for registering your details with us.<br/>` +
    `<span>We can confirm that we received them and you are all good to log into the MARA London portal.<br/><br/><br/>` +
    `<span>Link to MARA London Portal:</span>`;

  return emailBody;
}
*/

function getHashedPassword(string) {
  return new Promise(function (resolve, reject) {
    services_encryptor
      .ecryptString(string)
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(new Error(error));
      });
  });
}

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
      let queryPassed = [];

      async function run() {
        // Step 0 - Encrypt the password
        await getHashedPassword(request.body.password)
          .then(function (result) {
            queryPassed.push(true);
            hashedPassword = result;
          })
          .catch(function (err0) {
            queryPassed.push(false);
            reject(new Error(err0));
          });

        // Step 1 - Insert User Details
        await query1(transaction, request)
          .then(function () {
            queryPassed.push(true);
            console.log('Query 1 - Pass');
          })
          .catch(function (err1) {
            queryPassed.push(false);
            console.log('Query 1 - Fail');
            reject(new Error(err1));
          });

        // Step 2 - Insert user password
        await query2(transaction, request, hashedPassword)
          .then(function () {
            queryPassed.push(true);
            console.log('Query 2 - Pass');
          })
          .catch(function (err2) {
            queryPassed.push(false);
            console.log('Query 2 - Fail');
            reject(new Error(err2));
          });

        // Step 3 - Update user accessibility
        await query3(transaction, request)
          .then(function () {
            queryPassed.push(true);
            console.log('Query 3 - Pass');
          })
          .catch(function (err3) {
            queryPassed.push(false);
            console.log('Query 3 - Fail');
            reject(new Error(err3));
          });

        // Step 4 - Send registration confirmation email

        // Step 5 - To .commit() or .rollback()
        if (queryPassed.includes(false)) {
          reject(new Error('Transaction #2 not commited'));
          return console.log('Transaction #2 not commited');
        }

        await transaction.commit(function (err5) {
          if (err5) {
            reject(new Error(err5.message));
            return console.log('Transaction #2 commit() failed. Rollback...', err5);
          }
          resolve('OK');
          return console.log('Transaction #2 commit() was successful.');
        });
        return 0;
      }
      run();
    });
  });
}

/*
async function b(request) {
  let tableName = null;
  let sqlStatment = null;

  // Send registration confirmation email to user
  const emailBody = setupEmailBody(request);
  const theMessage = await setupWholeEmail(request, emailBody);
  try {
    await services_mailer.send(theMessage, null, null);
    if (request.body.maraID === 'test_student_00') {
      // Rollback - Revoke user accessibility
      await revokeUserAccessibility(request);

      // Rollback - Delete user password
      await deleteUserPassword(request);

      // Rollback - Delete user details
      await deleteUserDetails(request);
    }
  } catch (error) {
    // Rollback - Revoke user accessibility
    await revokeUserAccessibility(request);

    // Rollback - Delete user password
    await deleteUserPassword(request);

    // Rollback - Delete user details
    await deleteUserDetails(request);
    throw new Error(error);
  }
}
*/
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
