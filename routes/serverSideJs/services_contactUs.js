/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable strict */

'use strict';

const services_database = require('./services_database');
const services_mailer = require('./services_mailer');

// =====================================================================
// =====================================================================
// Email

function emailing(inputValues) {
  return new Promise(function (resolve, reject) {
    // Setting up the parameters
    const emailData = {};
    emailData.refNumber = inputValues[0];
    emailData.senderName = inputValues[1];
    emailData.senderEmail = inputValues[2];
    emailData.senderMARAid = inputValues[3];
    emailData.senderTmpMessage = inputValues[4];

    const params = {
      Destination: {
        ToAddresses: [inputValues[2]],
      },
      Source: services_mailer.getSystemMailer(),
      Template: 'template_contact_us',
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
// Contact Us

function query1(transaction, request) {
  return new Promise(function (resolve, reject) {
    transaction.run(
      `INSERT INTO contactUs_messages (timeStampGMT0, senderName, senderEmail, senderMARAid, senderMessage) ` +
        `VALUES ('${request.body.currentTimeStamp}','${request.body.name}','${request.body.email}',` +
        `'${request.body.maraID}','${request.body.message}')`,
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

function startExecution(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      const queryPassed = [];

      async function run() {
        // Step 1 - Record the enquiry
        let rowID;
        await query1(transaction, request)
          .then(function (result) {
            queryPassed.push(true);
            rowID = result;
            console.log('Query 1 - Pass');
          })
          .catch(function () {
            queryPassed.push(false);
            console.log('Query 1 - Fail');
          });

        // Step 2 - Send the Acknowledgement Email
        const inputValues = [];
        inputValues.push(`00000${rowID}`.slice(-5));
        inputValues.push(request.body.name);
        inputValues.push(request.body.email);
        inputValues.push(request.body.maraID);
        inputValues.push(request.body.tmpMessage);

        await emailing(inputValues)
          .then(function () {
            queryPassed.push(true);
            console.log('Send Email - Pass');
          })
          .catch(function () {
            queryPassed.push(false);
            console.log('Send Email - Fail');
          });

        // Step 3 - To .commit() or .rollback()
        if (queryPassed.includes(false)) {
          reject(new Error('Contact Us - Transaction not commited'));
          return console.log('Contact Us - Transaction not commited');
        }
        await transaction.commit(function (error) {
          if (error) {
            reject(new Error(error.message));
            return console.log('Contact Us - Transaction commit() failed. Rollback...', error);
          }
          resolve('OK');
          return console.log('Contact Us - Transaction commit() was successful.');
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
  sendEmail(request) {
    return new Promise(function (resolve, reject) {
      async function run() {
        let db;
        await services_database
          .openConnection()
          .then(async function (result1) {
            db = result1;
            await startExecution(db, request)
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
