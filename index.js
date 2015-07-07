var callback, config, cson, databaseConfig, fs, logger, mssql, options, postgresql, sql, writeDataFile;

postgresql = require("./lib/postgresql").postgresql;

mssql = require("./lib/mssql").mssql;

cson = require("cson");

fs = require("fs");

logger = require('knodeo-logger').Logger;

config = require('knodeo-configuration').Configuration;

config.load('config.sql.cson');

writeDataFile = function(data, path) {
  var output;
  output = cson.createString(data);
  return fs.writeFileSync(path, output, "UTF-8");
};

sql = "select * from users";

options = config.current.databases.pi_dev;

options.database = "pi_dev";

callback = function(data) {
  return writeDataFile(data, "postgresql.cson");
};

postgresql.execute(sql, options, callback);

databaseConfig = config.current.databases['test'];

options = {
  userName: databaseConfig.user,
  password: databaseConfig.password,
  server: databaseConfig.host,
  options: {
    port: databaseConfig.port,
    database: 'test',
    rowCollectionOnDone: true
  }
};

callback = function(data) {
  return writeDataFile(data, "mssql.cson");
};

mssql.execute("select * from names", options, callback);
