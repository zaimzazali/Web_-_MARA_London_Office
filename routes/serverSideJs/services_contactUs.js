/* eslint-disable strict */
/* eslint-disable camelcase */

'use strict';

const services_database = require('./services_database');
const services_mailer = require('./services_mailer');

const tableName = 'contactUs_messages';

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

function setupErrorSQL() {
  const sqlStatment = `DELETE FROM ${tableName} WHERE refNum = INDEXNUM`;
  return sqlStatment;
}

function setupSQLstatement(request) {
  const sqlStatment =
    `INSERT INTO ${tableName} (timeStampGMT0, senderName, senderEmail, senderWebsite, senderMessage) ` +
    `VALUES ('${request.body.currentTimeStamp}','${request.body.name}','${request.body.email}',` +
    `'${request.body.web}','${request.body.message}')`;

  return sqlStatment;
}

module.exports = {
  async sendEmail(request) {
    try {
      // Record the data into database
      const sqlStatment = setupSQLstatement(request);
      const sqlError = setupErrorSQL();
      const latestIndex = await services_database.insertData(sqlStatment);
      // Send the acknowledgement
      const emailBody = setupEmailBody(request);
      const theMessage = await setupWholeEmail(request, emailBody, latestIndex);
      await services_mailer.send(theMessage, sqlError, latestIndex);
    } catch (error) {
      throw new Error(error);
    }
  },
};
