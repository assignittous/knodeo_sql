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
        if (client != null) {
          client.end();
        }
        return;
      }
      client.query(sql, function(err, result) {
        if (err) {
          logger.error("Query error");
          console.log(err);
          client.end();
          return;
        }
        logger.sql(sql);
        if (callback != null) {
          callback(result.rows);
        }
        done();
        client.end();
      });
    });
  }
};
