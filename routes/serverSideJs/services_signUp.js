/* eslint-disable strict */
/* eslint-disable camelcase */

'use strict';

const services_database = require('./services_database');
const services_encryptor = require('./services_encryptor');
const services_mailer = require('./services_mailer');
const extraFunctions = require('./extraFunctions');

async function IDchecker(request) {
  try {
    const tableName = 'view_userAccount';
    const sqlStatment = `SELECT user_is_registered FROM ${tableName} WHERE user_ID = '${request.body.id}'`;
    const hasRegistered = await services_database.selectData(sqlStatment);
    let flag = null;
    if (Object.keys(hasRegistered).length === 0) {
      flag = 'NOT EXIST';
    } else if (hasRegistered[0].user_is_registered === 'NO') {
      flag = 'OK';
    } else {
      flag = 'EXIST';
    }
    return flag;
  } catch (error) {
    throw new Error(error);
  }
}

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

async function revokeUserAccessibility(request) {
  const tableName = 'user_list';
  const sqlStatment =
    `UPDATE ${tableName} SET isRegistered = 'NO', isAccountActive = 'NO',  userTypeCode = 0 ` +
    `WHERE userID = '${request.body.maraID}'`;
  await services_database.updateData(sqlStatment);
}

async function deleteUserPassword(request) {
  const tableName = 'userPassword_list';
  const sqlStatment = `DELETE FROM ${tableName} WHERE userID = '${request.body.maraID}'`;
  await services_database.removeData(sqlStatment);
}

async function deleteUserDetails(request) {
  const tableName = 'userDetails_list';
  const sqlStatment = `DELETE FROM ${tableName} WHERE userID = '${request.body.maraID}'`;
  await services_database.removeData(sqlStatment);
}

async function userRegistration(request) {
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

  // Encrypt the password
  let hashedPassword = null;
  try {
    hashedPassword = await services_encryptor.ecryptString(request.body.password);
  } catch (error) {
    // Rollback - Delete user details
    await deleteUserDetails(request);
    throw new Error(error);
  }

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

module.exports = {
  async checkMaraID(request) {
    try {
      const flag = await IDchecker(request);
      return flag;
    } catch (error) {
      throw new Error(error);
    }
  },
  async registerUser(request) {
    try {
      await userRegistration(request);
    } catch (error) {
      throw new Error(error);
    }
  },
};
