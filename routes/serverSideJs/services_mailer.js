/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable strict */

'use strict';

const AWS = require('aws-sdk');

AWS.config.loadFromPath('./routes/aws/config.json');

module.exports = {
  triggerSendEmail(params) {
    return new Promise(function (resolve, reject) {
      // Create the promise and SES service object
      const sendPromise = new AWS.SES({ apiVersion: '2010-12-01' })
        .sendTemplatedEmail(params)
        .promise();

      // Handle promise's fulfilled/rejected states
      sendPromise
        .then(function (data) {
          console.log(data);
          resolve(data);
        })
        .catch(function (err) {
          console.error(err, err.stack);
          reject(err);
        });
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
