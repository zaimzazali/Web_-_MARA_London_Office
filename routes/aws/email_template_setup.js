/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable strict */

// --------------------------------------------------------------------------------------------------------------
// NOT IN USE - FOR REFERENCE ONLY
// --------------------------------------------------------------------------------------------------------------

'use strict';

const AWS = require('aws-sdk');

AWS.config.loadFromPath('./routes/aws/config.json');

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// AWS Parameters Setting

let templatePromise;

// Create createTemplate params
const params = {
  Template: {
    TemplateName: 'template_forget_password',
    SubjectPart: '🔴 [MARA London] - Your password has reset!',
    HtmlPart:
      '<!DOCTYPE html>\r\n<html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB" xml:lang="en-GB">\r\n  <head>\r\n    <meta charset="utf-8" />\r\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />\r\n  </head>\r\n  <body>\r\n    <span>Hello, <b>{{fullName}}</b>!</span><br /><br />\r\n    <span>We have received your request to reset your account password.</span><br />\r\n    <br />\r\n    <span>We can confirm that your password has been reset.</span><br />\r\n    <span>Your new password is <mark>{{newPassword}}</mark></span\r\n    ><br />\r\n    <br />\r\n    <span\r\n      >Please note that you will be prompted to change the auto-generated password once you logged\r\n      into the portal.</span\r\n    ><br />\r\n    <br />\r\n    <span\r\n      >-----------------------------------------------------------------------------------------------------------</span\r\n    ><br />\r\n    <span><i>This email is an automated email from the system.</i></span>\r\n  </body>\r\n</html>\r\n',
    TextPart:
      'Hello, {{fullName}}!\r\n\r\nWe have received your request to reset your account password.\r\n\r\nWe can confirm that your password has been reset.\r\nYour new password is {{newPassword}}\r\n\r\nPlease note that you will be prompted to change the auto-generated password once you logged into the portal.\r\n\r\n-----------------------------------------------------------------------------------------------------------\r\nThis email is an automated email from the system.',
  },
};

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// Create template

// Create the promise and SES service object
templatePromise = new AWS.SES({ apiVersion: '2010-12-01' }).createTemplate(params).promise();

// Handle promise's fulfilled/rejected states
templatePromise
  .then(function (data) {
    console.log(data);
  })
  .catch(function (err) {
    console.error(err, err.stack);
  });

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// Update template

// Create the promise and SES service object
templatePromise = new AWS.SES({ apiVersion: '2010-12-01' }).updateTemplate(params).promise();

// Handle promise's fulfilled/rejected states
templatePromise
  .then(function () {
    console.log('Template Updated');
  })
  .catch(function (err) {
    console.error(err, err.stack);
  });

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------
// Delete template

// Create the promise and SES service object
templatePromise = new AWS.SES({ apiVersion: '2010-12-01' })
  .deleteTemplate({ TemplateName: 'template_contact_us' })
  .promise();

// Handle promise's fulfilled/rejected states
templatePromise
  .then(function () {
    console.log('Template Deleted');
  })
  .catch(function (err) {
    console.error(err, err.stack);
  });
