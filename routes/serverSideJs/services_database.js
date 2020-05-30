/* eslint-disable strict */
/* eslint-disable func-names */

'use strict';

const sqlite3 = require('sqlite3').verbose();

let db = null;

function openConnection() {
  return new Promise(function (resolve, reject) {
    db = new sqlite3.Database('./routes/db/maralondon.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve('OK');
      }
    });
  });
}

function closeConnection() {
  return new Promise(function (resolve, reject) {
    db.close((err) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve('OK');
      }
    });
  });
}

function execQueryInsert(sqlStatment) {
  return new Promise(function (resolve, reject) {
    db.run(sqlStatment, [], function (err) {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(this.lastID);
      }
    });
  });
}

function execQuerySelect(sqlStatment) {
  return new Promise(function (resolve, reject) {
    db.all(sqlStatment, [], (err, row) => {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve(row);
      }
    });
  });
}

// Can be use for Delete and Update
function execQuery(sqlStatment) {
  return new Promise(function (resolve, reject) {
    db.run(sqlStatment, [], function (err) {
      if (err) {
        reject(new Error(err.message));
      } else {
        resolve('OK');
      }
    });
  });
}

module.exports = {
  async insertData(sqlStatment) {
    try {
      let latestIndex = null;
      await openConnection();
      await execQueryInsert(sqlStatment).then((data) => {
        latestIndex = data;
      });
      await closeConnection();
      return latestIndex;
    } catch (error) {
      throw new Error(error);
    }
  },
  async selectData(sqlStatment) {
    try {
      let returndata = null;
      await openConnection();
      await execQuerySelect(sqlStatment).then((data) => {
        returndata = data;
      });
      await closeConnection();
      return returndata;
    } catch (error) {
      throw new Error(error);
    }
  },
  async removeData(sqlStatment) {
    try {
      await openConnection();
      await execQuery(sqlStatment);
      await closeConnection();
    } catch (error) {
      throw new Error(error);
    }
  },
  async updateData(sqlStatment) {
    try {
      await openConnection();
      await execQuery(sqlStatment);
      await closeConnection();
    } catch (error) {
      throw new Error(error);
    }
  },
};
