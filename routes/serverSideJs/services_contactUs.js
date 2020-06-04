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
          resolve('Query Pass');
        }
      }
    );
  });
}

function startExecution(db, request) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let queryPassed = [];

      async function run() {
        // Step 1 - Record the enquiry
        await query1(transaction, request)
          .then(function () {
            queryPassed.push(true);
            console.log('Query 1 - Pass');
          })
          .catch(function () {
            queryPassed.push(false);
            console.log('Query 1 - Fail');
          });

        // Step 2 - Send acknowledgement email

        // Step 3 - To .commit() or .rollback()
        if (queryPassed.includes(false)) {
          reject(new Error('Transaction not commited'));
          return console.log('Transaction not commited');
        }

        await transaction.commit(function (err3) {
          if (err3) {
            reject(new Error(err3.message));
            return console.log('Transaction commit() failed. Rollback...', err3);
          }
          resolve('OK');
          return console.log('Transaction commit() was successful.');
        });
        return 0;
      }
      run();

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
