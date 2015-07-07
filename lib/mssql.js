var Connection, Request, _, logger;

logger = require('knodeo-logger').Logger;

_ = require("lodash");

Connection = require("tedious").Connection;

Request = require("tedious").Request;

exports.mssql = {
  execute: function(sql, options, callback) {
    var connection, executeStatement;
    logger.info(sql);
    connection = new Connection(options);
    executeStatement = function() {
      var request;
      request = new Request(sql, function(err, rowCount) {
        if (err != null) {
          logger.error("Request error");
          console.log(err);
        } else {
          logger.info(rowCount + " rows retrieved");
        }
        connection.close();
      });
      request.on('done', function(rowcount, more, rows) {
        rows = _.map(rows, function(r) {
          var out;
          out = {};
          _.forEach(r, function(o) {
            return out[o.metadata.colName] = o.value;
          });
          return out;
        });
        if (callback != null) {
          return callback(rows);
        }
      });
      return connection.execSqlBatch(request);
    };
    return connection.on('connect', function(err) {
      if (err != null) {
        logger.error("Connection error");
        console.log(err);
        return;
      }
      logger.info("CONNECTED");
      return executeStatement();
    });
  }
};
