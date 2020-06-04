/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable prefer-destructuring */
/* eslint-disable strict */

'use strict';

const sqlite3 = require('sqlite3').verbose();
const TransactionDatabase = require('sqlite3-transactions').TransactionDatabase;

module.exports = {
  openConnection() {
    return new Promise(function (resolve, reject) {
      const db = new TransactionDatabase(
        new sqlite3.Database('./routes/db/maralondon.db', sqlite3.OPEN_READWRITE, (err) => {
          if (err) {
            console.log('Cannot open Database');
            reject(new Error(err));
          } else {
            console.log('Database Connection - established');
            resolve(db);
          }
        })
      );
    });
  },
  closeConnection(db) {
    return new Promise(function (resolve, reject) {
      try {
        db.close();
        console.log('Database Connection - closed');
        resolve('OK');
      } catch (error) {
        console.log('Cannot close Database');
        reject(new Error(error));
      }
    });
  },
};
