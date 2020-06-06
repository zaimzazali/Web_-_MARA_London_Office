/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable strict */

'use strict';

const AWS = require('aws-sdk');

const services_aws = require('./awsRelated');

// =====================================================================
// =====================================================================
// Mailer

module.exports = {
  triggerSendEmail(params) {
    return new Promise(function (resolve, reject) {
      let configObj;

      async function run() {
        // Get the AWS config object
        await services_aws.getConfigObj().then(function (result) {
          configObj = result;
        });

        // Create the promise and SES service object
        const sendPromise = new AWS.SES(configObj).sendTemplatedEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        await sendPromise
          .then(function (data) {
            console.log(data);
            resolve(data);
          })
          .catch(function (err) {
            console.error(err, err.stack);
            reject(err);
          });
      }
      run();
    });
  },
  getSystemMailer() {
    const systemEmailerSource = 'MARA London Mailer <zaim.zazali@gmail.com>';
    return systemEmailerSource;
  },
  getSystemReceiver() {
    const systemEmailerReceive = 'MARA London Mailer <zaim.zazali@gmail.com>';
    return systemEmailerReceive;
  },
};
