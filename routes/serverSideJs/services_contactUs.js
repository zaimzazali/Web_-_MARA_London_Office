/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable strict */

'use strict';

const services_database = require('./services_database');
// const services_mailer = require('./services_mailer');

/*
async function setupWholeEmail(request, emailBody, latestIndex) {
  const theMessage = await services_mailer.messageDetails(
    request.body.email,
    'zaim.zazali.2019@bristol.ac.uk',
    `[MARA London] REF: CU${`00000${latestIndex}`.slice(-5)} - Message Acknowledgement`,
    emailBody
  );
  return theMessage;
}

function setupEmailBody(request) {
  const emailBody =
    `<span><b>From:</b> ${request.body.name}</span><br/>` +
    `<span><b>Email:</b> ${request.body.email}</span><br/>` +
    `<span><b>Web:</b> ${request.body.web}</span><br/>` +
    `<br/>` +
    `<span><b>Message:</b></span><br/>` +
    `<span>${request.body.tmpMessage}</span>`;

  return emailBody;
}
*/

function startExecution(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      // Step 1 - Record the enquiry
      transaction.run(
        `INSERT INTO contactUs_messages (timeStampGMT0, senderName, senderEmail, senderMARAid, senderMessage) ` +
          `VALUES ('${request.body.currentTimeStamp}','${request.body.name}','${request.body.email}',` +
          `'${request.body.maraID}','${request.body.message}')`,
        function (err1) {
          if (err1) {
            reject(new Error(err1.message));
            return console.log(err1.message);
          }
          return console.log('Query Pass');
        }
      );

      // To .commit() or .rollback()
      transaction.commit(function (err3) {
        if (err3) {
          console.log('Transaction commit() failed. Rollback...', err);
          reject(new Error(err3.message));
        }
        console.log('Transaction commit() was successful.');
        resolve('OK');
      });

      /*
      // Step 2 - Send acknowledgement email
      transaction.run(
        `INSERT INTO contactUs_messages (timeStampGMT0, senderName, senderEmail, senderMARAid, senderMessage) ` +
          `VALUES ('${request.body.currentTimeStamp}','${request.body.name}','${request.body.email}',` +
          `'${request.body.maraID}','${request.body.message}')`,
        function (err2) {
          if (err2) {
            reject(new Error(err2.message));
            return console.log(err2.message);
          }

          // To .commit() or .rollback()
          transaction.commit(function (err3) {
            if (err3) {
              console.log('Transaction commit() failed. Rollback...', err);
              reject(new Error(err3.message));
            }
            console.log('Transaction commit() was successful.');
            resolve('OK');
          });
          // or transaction.rollback()
        }
      );
      */
    });
  });
}

module.exports = {
  async sendEmail(request) {
    try {
      const db = await services_database.openConnection();
      await startExecution(db, request);
    } catch (error) {
      throw new Error(error);
    }
  },
};
