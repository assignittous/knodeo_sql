# index.coffee

postgresql = require("./lib/postgresql").postgresql
mssql = require("./lib/mssql").mssql
cson = require "cson"
fs = require "fs"
logger = require('knodeo-logger').Logger
config = require('knodeo-configuration').Configuration
config.load 'config.sql.cson'


writeDataFile = (data, path)->
  output = cson.createString(data)
  fs.writeFileSync path, output, "UTF-8"


sql = "select * from users"


options = config.current.databases.pi_dev
options.database = "pi_dev"

callback = (data)->
  writeDataFile data, "postgresql.cson"

postgresql.execute sql, options, callback


databaseConfig = config.current.databases['test']


# to do - move the options mapping into the mssql lib
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