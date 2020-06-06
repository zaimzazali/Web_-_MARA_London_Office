/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable strict */

'use strict';

const AWS = require('aws-sdk');

const services_database = require('./services_database');

// =====================================================================
// =====================================================================
// AWS Config Object

let config;

function query0(transaction) {
  return new Promise(function (resolve, reject) {
    transaction.all(`SELECT * FROM aws_details`, function (err, rows) {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
}

function fetchConfig(db) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let returnRow;
      let proceed;

      async function run() {
        // Step 0 - Get the keys
        await query0(transaction)
          .then(function (result) {
            returnRow = result;
            console.log('Query 0 - Pass');
          })
          .catch(function () {
            console.log('Query 0 - Fail');
          });

        proceed = true;
        await transaction.commit(function (error) {
          if (error) {
            reject(new Error(error.message));
            proceed = false;
            return console.log('AWS Related - Transaction commit() failed. Rollback...', error);
          }
          return console.log('AWS Related - Transaction commit() was successful.');
        });

        if (!proceed) {
          reject(new Error('ERROR'));
          return 0;
        }

        // Step 1 - Check the query result
        if (returnRow.length === 1) {
          // Pass Through
        } else {
          reject(new Error('ERROR'));
          return 0;
        }

        // Step 2 - Create the config object
        await returnRow.forEach(function (row) {
          const configObj = new AWS.Config({
            accessKeyId: row.keyID,
            secretAccessKey: row.accessID,
            region: row.region,
          });
          resolve(configObj);
        });
        return 0;
      }
      run();
    });
  });
}

function setConfigObj() {
  return new Promise(function (resolve, reject) {
    async function run() {
      let db;
      await services_database
        .openConnection()
        .then(async function (result1) {
          db = result1;
          await fetchConfig(db)
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
}

// Initialise the AWS Config object
setConfigObj()
  .then(function (result) {
    config = result;
  })
  .catch(function () {
    config = null;
  });

// =====================================================================
// =====================================================================
// Modules

module.exports = {
  getConfigObj() {
    return new Promise(function (resolve) {
      resolve(config);
    });
  },
};
