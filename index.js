var callback, config, cson, fs, logger, mssql, options, postgresql, sql, sqlite, writeDataFile;

postgresql = require("./lib/postgresql").postgresql;

mssql = require("./lib/mssql").mssql;

sqlite = require("./lib/sqlite").sqlite;

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


/*
sql = "select * from users"


options = config.current.databases.pi_dev
options.database = "pi_dev"

callback = (data)->
  writeDataFile data, "postgresql.cson"

postgresql.execute sql, options, callback


databaseConfig = config.current.databases['test']


 * to do - move the options mapping into the mssql lib
options = 
  userName: databaseConfig.user
  password: databaseConfig.password
  server: databaseConfig.host
  options:
    port: databaseConfig.port
    database: 'test'
    rowCollectionOnDone: true

callback = (data)->
  writeDataFile data, "mssql.cson"

mssql.execute "select * from names", options, callback
 */

options = config.current.databases.test;

callback = function(data) {
  return writeDataFile(data, "sqlite.cson");
};

sql = 'SELECT rowid AS id, info FROM lorem';

sqlite.execute(sql, options, callback);
