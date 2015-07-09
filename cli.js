#!/usr/bin/env node
var callback, config, configFile, cson, dbConfig, fileExists, fs, logger, mssql, noOp, options, path, pkg, postgresql, program, sql, sqlite, writeDataFile;

program = require("commander");

logger = require("knodeo-logger").Logger;

pkg = require("./package.json");

fs = require("fs");

cson = require("cson");

config = require('knodeo-configuration').Configuration;

path = require("path");

postgresql = require("./lib/postgresql").postgresql;

mssql = require("./lib/mssql").mssql;

sqlite = require("./lib/sqlite").sqlite;

noOp = function() {
  return console.log("Nothing ran, couldn't understand your command");
};

writeDataFile = function(data, outputPath) {
  var dataType, output;
  dataType = path.extname(program.data);
  switch (dataType) {
    case ".cson":
      output = cson.createString(data);
      break;
    default:
      output = JSON.stringify(data, null, 2);
  }
  return fs.writeFileSync(outputPath, output, "UTF-8");
};

fileExists = function(filePath) {
  var e, stats;
  try {
    stats = fs.lstatSync(filePath);
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
      console.log("Root: " + program.root);
      console.log("First: " + program.first);
      callback = function(data) {
        var root;
        logger.info("Writing to " + program.output);
        if (program.first != null) {
          data = data[0];
        }
        if (program.root != null) {
          root = {};
          root[program.root] = data;
          data = root;
        }
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
        case "sqlite":
          options = dbConfig;
          logger.info("Sqlite Database");
          sqlite.execute(sql, options, callback);
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
