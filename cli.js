#!/usr/bin/env node
var callback, config, configFile, cson, dbConfig, fileExists, fs, logger, mssql, noOp, options, pkg, postgresql, program, sql, writeDataFile;

program = require("commander");

logger = require("knodeo-logger").Logger;

pkg = require("./package.json");

fs = require("fs");

cson = require("cson");

config = require('knodeo-configuration').Configuration;

postgresql = require("./lib/postgresql").postgresql;

mssql = require("./lib/mssql").mssql;

noOp = function() {
  return console.log("Nothing ran, couldn't understand your command");
};

writeDataFile = function(data, path) {
  var output;
  output = cson.createString(data);
  return fs.writeFileSync(path, output, "UTF-8");
};

fileExists = function(path) {
  var e, stats;
  try {
    stats = fs.lstatSync(path);
    if (stats.isDirectory()) {
      return false;
    } else {
      return true;
    }
  } catch (_error) {
    e = _error;
    return false;
  }
};

program.version(pkg.version, "-v, --version").option("-s, --sql <sqlfile>", "SQL File").option("-d, --database <database>", "Database").option("-o, --output <outputfile>", "Output file").option("-r, --root <attribute>", "Attribute").option("-f, --first", "First record only").parse(process.argv);

if ((program.sql != null) && (program.database != null) && (program.output != null)) {
  configFile = 'config.sql.cson';
  if (fileExists(configFile)) {
    config.load('config.sql.cson');
  } else {
    logger.error('config.sql.cson could not be found in the current working directory');
    return;
  }
  if (fileExists(program.sql)) {
    sql = fs.readFileSync(program.sql, 'utf8');
  } else {
    logger.error("SQL file does not exist");
    return;
  }
  if (program.database) {
    if (config.current.databases[program.database] != null) {
      console.log("database: " + program.database + " OK");
      dbConfig = config.current.databases[program.database];
      callback = function(data) {
        logger.info("Writing to " + program.output);
        return writeDataFile(data, program.output);
      };
      switch (dbConfig.type) {
        case "mssql":
          logger.info("MSSQL Database");
          options = {
            userName: dbConfig.user,
            password: dbConfig.password,
            server: dbConfig.host,
            options: {
              port: dbConfig.port,
              database: program.database,
              rowCollectionOnDone: true
            }
          };
          mssql.execute(sql, options, callback);
          break;
        case "postgresql":
          options = dbConfig;
          options.database = program.database;
          logger.info("Postgresql Database");
          postgresql.execute(sql, options, callback);
          break;
        default:
          logger.error("Database type " + dbConfig.type + " is not supported");
          return;
      }
    } else {
      logger.error("Database " + program.database + " is not specified in config.sql.cson");
      return;
    }
  }
} else {
  logger.error("sql (-s), database (-d) and output (-o) parameters are required.");
}
