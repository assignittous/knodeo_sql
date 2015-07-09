var logger, sqlite3;

logger = require('knodeo-logger').Logger;

sqlite3 = require('sqlite3').verbose();

exports.sqlite = {
  db: {},
  "new": function(path) {
    return this.db = new sqlite3.Database(path);
  },
  execute: function(sql, options, callback) {
    var db;
    db = new sqlite3.Database('test.sqlite');
    db.serialize(function() {
      db.all(sql, function(err, rows) {
        if (callback != null) {
          callback(rows);
        }
      });
    });
    return db.close();
  }
};
