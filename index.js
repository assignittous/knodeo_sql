var callback, config, options, postgresql, sql;

postgresql = require("./lib/postgresql").postgresql;

sql = "select * from users";

config = require('knodeo-configuration').Configuration;

config.load('config.sql.cson');

options = config.current.databases.knodeo;

options.database = "knodeo";

callback = function(results) {
  return console.log(results.rows);
};

postgresql.execute(sql, options, callback);
