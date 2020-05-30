/* eslint-disable strict */
/* eslint-disable camelcase */

'use strict';

const services_database = require('./services_database');
const extraFunctions = require('./extraFunctions');
const services_encryptor = require('./services_encryptor');
const services_mailer = require('./services_mailer');

async function revertPassword(request, previousPassword) {
  const tableName = 'userPassword_list';
  const sqlStatment =
    `UPDATE ${tableName} SET userPassword = '${previousPassword}', needReset = 'NO' ` +
    `WHERE userID = '${request.body.maraID}'`;
  await services_database.updateData(sqlStatment);
}

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

async function deleteUserOldPassword(request) {
  const tableName = 'historyPassword_list';
  const sqlStatment =
    `DELETE FROM ${tableName} WHERE ` +
    `timeStampGMT0 = '${request.body.currentTimeStamp}' AND userID = '${request.body.maraID}'`;
  await services_database.removeData(sqlStatment);
}

async function resetPass(request) {
  let tableName = null;
  let sqlStatment = null;
  let returnJson1 = null;
  let returnJson2 = null;

  try {
    tableName = 'view_userAccount';
    sqlStatment =
      `SELECT account_is_active, password FROM ${tableName} ` +
      `WHERE user_ID = '${request.body.maraID}'`;
    returnJson1 = await services_database.selectData(sqlStatment);
  } catch (error) {
    throw new Error(error);
  }

  if (Object.keys(returnJson1).length === 1) {
    try {
      tableName = 'view_userDetails';
      sqlStatment = `SELECT full_name, email FROM ${tableName} WHERE user_ID = '${request.body.maraID}'`;
      returnJson2 = await services_database.selectData(sqlStatment);
    } catch (error) {
      throw new Error(error);
    }
  }

  if (Object.keys(returnJson2).length === 1) {
    // Check if email entered is synced with the ID
    let userName = null;
    let emailDB = null;
    let emailInput = null;
    let randomPassword = null;

    try {
      userName = extraFunctions.decodeSingleQuote(decodeURIComponent(returnJson2[0].full_name));
      emailDB = extraFunctions.decodeSingleQuote(decodeURIComponent(returnJson2[0].email));
      emailInput = extraFunctions.decodeSingleQuote(decodeURIComponent(request.body.email));
    } catch (error) {
      throw new Error(error);
    }

    let toProceed = false;
    let previousPassword = null;
    if (
      emailDB === emailInput ||
      request.body.maraID === 'test_student_01' ||
      request.body.maraID === 'test_student_02' ||
      request.body.maraID === 'test_student_03'
    ) {
      previousPassword = returnJson1[0].password;
      toProceed = true;
    }

    if (toProceed && returnJson1[0].account_is_active === 'YES') {
      let hashedPassword = null;
      try {
        randomPassword = extraFunctions.randomString(10);
        hashedPassword = await services_encryptor.ecryptString(randomPassword);
      } catch (error) {
        throw new Error(error);
      }

      // Record the forgotten password in the log for audit purposes
      try {
        tableName = 'historyPassword_list';
        sqlStatment =
          `INSERT INTO ${tableName} (timeStampGMT0, userID, previousPassword) ` +
          `VALUES ('${request.body.currentTimeStamp}','${request.body.maraID}','${previousPassword}')`;
        await services_database.insertData(sqlStatment);
      } catch (error) {
        throw new Error(error);
      }

      // Update the new password in the list and update flag to force reset password
      try {
        tableName = 'userPassword_list';
        sqlStatment =
          `UPDATE ${tableName} SET userPassword = '${hashedPassword}', needReset = 'YES' ` +
          `WHERE userID = '${request.body.maraID}'`;
        await services_database.updateData(sqlStatment);
      } catch (error) {
        // Rollback - Delete record of old password
        await deleteUserOldPassword(request);
        throw new Error(error);
      }

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

module.exports = {
  async resetPassword(request) {
    try {
      await resetPass(request);
    } catch (error) {
      throw new Error(error);
    }
  },
};
