/* eslint-disable strict */
/* eslint-disable camelcase */
/* eslint-disable func-names */

'use strict';

const nodemailer = require('nodemailer');
const services_database = require('./services_database');

// Create a SMTP transporter object
const transporter = nodemailer.createTransport(
  {
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      user: 'zaim.zazali@gmail.com',
      pass: 'Zaimkacak69!',
    },
    logger: false,
    debug: false, // include SMTP traffic in the logs
  },
  {
    // sender info
    from: 'No-Reply <maralondon.mailer@mara.gov.my>',
  }
);

function executeSending(message) {
  return new Promise(function (resolve, reject) {
    transporter.sendMail(message, (error) => {
      // only needed when using pooled connections
      transporter.close();
      if (error) {
        reject(new Error(error));
      } else {
        resolve('OK');
      }
    });
  });
}

module.exports = {
  async messageDetails(recipentEmails, MARAofficeEmails, subjectHeader, bodyHTML) {
    // Message object
    const message = {
      // Comma separated list of recipients
      to: recipentEmails,
      bcc: MARAofficeEmails,

      // Header
      subject: subjectHeader,

      // Content
      html: bodyHTML,
    };
    return message;
  },

  async send(message, sqlError, latestIndex) {
    try {
      await executeSending(message).catch(() => {
        if (sqlError !== null) {
          const sqlErrorStatement = sqlError.replace('INDEXNUM', latestIndex);
          services_database.removeData(sqlErrorStatement);
        }
        throw new Error();
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};
