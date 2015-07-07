var logger, pg;

pg = require('pg');

logger = require('knodeo-logger').Logger;

exports.postgresql = {
  execute: function(sql, options, callback) {
    var connectionString;
    logger.info(sql);
    connectionString = "postgres://" + options.user + ":" + options.password + "@" + options.host + "/" + options.database;
    return pg.connect(connectionString, function(err, client, done) {
      if (err) {
        logger.error("Connection Error");
        return;
      }
      client.query(sql, function(err, result) {
        if (err) {
          logger.error("Query error");
          return;
        }
        if (callback != null) {
          callback(result);
        }
        done();
        client.end();
      });
    });
  }
};
