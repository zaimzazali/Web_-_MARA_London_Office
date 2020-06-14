/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-useless-concat */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable strict */

'use strict';

const services_database = require('./services_database');
const extraFunctions = require('./extraFunctions');

// =====================================================================
// =====================================================================
// Selecting all related data to display

function query0(transaction, userID) {
  return new Promise(function (resolve, reject) {
    transaction.all(
      `SELECT user_ID, full_name FROM view_userDetails WHERE user_ID = ?`,
      [userID],
      function (err, rows) {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function getInfo(db, userID) {
  return new Promise(function (resolve, reject) {
    db.beginTransaction(function (err, transaction) {
      let row;
      async function run() {
        // Step 0 - Select related info to display
        await query0(transaction, userID)
          .then(async function (result) {
            row = result[0];

            row.user_ID = await extraFunctions.decodeSingleQuote(decodeURIComponent(row.user_ID));
            row.full_name = await extraFunctions.decodeSingleQuote(
              decodeURIComponent(row.full_name)
            );
            resolve(row);

            console.log('Query 0 - Pass');
          })
          .catch(function () {
            reject(new Error('ERROR'));
            console.log('Query 0 - Fail');
          });

        await transaction.commit(function (error) {
          if (error) {
            reject(new Error(error.message));
            return console.log('Info Display - Transaction commit() failed. Rollback...', error);
          }
          return console.log('Info Display - Transaction commit() was successful.');
        });
      }
      run();
    });
  });
}

// =====================================================================
// =====================================================================
// Modules

module.exports = {
  getRelatedInfo(request) {
    return new Promise(function (resolve, reject) {
      async function run() {
        let db;
        await services_database
          .openConnection()
          .then(async function (result1) {
            db = result1;
            await getInfo(db, request.session.userID)
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
