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
          return console.log('Transaction commit() failed. Rollback...', err2);
        }
        resolve('OK');
        return console.log('Transaction commit() was successful.');
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
async function getHashedPassword(string) {
  try {
    const hashedPassword = await services_encryptor.ecryptString(string);
    console.log('Password Hashed');
    return hashedPassword;
  } catch (err) {
    console.log('Cannot hash password');
    return 'ERROR';
  }
}

function userRegistration(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let hashedPassword;

      // Step 1 - Insert User Details
      transaction.run(
        `INSERT INTO userDetails_list (userFullName, userEmail, userID) ` +
          `VALUES ('${request.body.name}', '${request.body.email}', '${request.body.maraID}')`,
        function (err1) {
          if (err1) {
            reject(new Error(err1.message));
            return console.log(err1.message);
          }
          console.log('Query Pass');

          run1();
        }
      );

      async function run1() {
        // Step 2 - Encrypt the password
        hashedPassword = await getHashedPassword(request.body.password);
        if (hashedPassword === 'ERROR') {
          reject(new Error(hashedPassword));
          return console.log(hashedPassword);
        }

        // Step 3 - Insert user password
        transaction.run(
          `INSERT INTO userPassword_list (userPassword, userID, needReset) ` +
            `VALUES ('${hashedPassword}', '${request.body.maraID}', 'NO')`,
          function (err3) {
            if (err3) {
              reject(new Error(err3.message));
              return console.log(err3.message);
            }
            return console.log('Query Pass');
          }
        );

        // Step 4 - Update user accessibility
        transaction.run(
          `UPDATE user_list SET isRegistered = 'YES', isAccountActive = 'YES',  userTypeCode = 1 ` +
            `WHERE userID = '${request.body.maraID}'`,
          function (err4) {
            if (err4) {
              reject(new Error(err4.message));
              return console.log(err4.message);
            }
            console.log('Query Pass');

            // To .commit() or .rollback()
            transaction.commit(function (err6) {
              if (err6) {
                reject(new Error(err6.message));
                return console.log('Transaction commit() failed. Rollback...', err6);
              }
              resolve('OK');
              return console.log('Transaction commit() was successful.');
            });
            // or transaction.rollback()
          }
        );

        // Step 5 - Send registration confirmation email
      }
    });
  });
}
/*
async function b(request) {
  let tableName = null;
  let sqlStatment = null;

  // Insert user details
  try {
    tableName = 'userDetails_list';
    sqlStatment =
      `INSERT INTO ${tableName} (userFullName, userMyKad, userEmail, userID) ` +
      `VALUES ('${request.body.name}', '${request.body.mykad}', '${request.body.email}',` +
      `'${request.body.maraID}')`;
    await services_database.insertData(sqlStatment);
  } catch (error) {
    throw new Error(error);
  }
*/
/*
  // Encrypt the password
  let hashedPassword = null;
  try {
    hashedPassword = await services_encryptor.ecryptString(request.body.password);
  } catch (error) {
    // Rollback - Delete user details
    await deleteUserDetails(request);
    throw new Error(error);
  }
*/
/*
  // Insert user password
  try {
    tableName = 'userPassword_list';
    sqlStatment =
      `INSERT INTO ${tableName} (userPassword, userID, needReset) ` +
      `VALUES ('${hashedPassword}', '${request.body.maraID}', 'NO')`;

    await services_database.insertData(sqlStatment);
  } catch (error) {
    // Rollback - Delete user details
    await deleteUserDetails(request);
    throw new Error(error);
  }
*/
/*
  // Update user accessibility
  try {
    tableName = 'user_list';
    sqlStatment =
      `UPDATE ${tableName} SET isRegistered = 'YES', isAccountActive = 'YES',  userTypeCode = 1 ` +
      `WHERE userID = '${request.body.maraID}'`;

    await services_database.updateData(sqlStatment);
  } catch (error) {
    // Rollback - Delete user password
    await deleteUserPassword(request);

    // Rollback - Delete user details
    await deleteUserDetails(request);
    throw new Error(error);
  }

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
  async checkMaraID(request) {
    try {
      const db = await services_database.openConnection();
      const flag = await IDchecker(db, request);
      await services_database.closeConnection(db);
      return flag;
    } catch (error) {
      throw new Error(error);
    }
  },
  async registerUser(request) {
    try {
      const db = await services_database.openConnection();
      const flag = await userRegistration(db, request);
      await services_database.closeConnection(db);
      return flag;
    } catch (error) {
      throw new Error(error);
    }
  },
};
