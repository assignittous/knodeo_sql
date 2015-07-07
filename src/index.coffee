# index.coffee

postgresql = require("./lib/postgresql").postgresql

sql = "select * from users"

config = require('knodeo-configuration').Configuration
config.load 'config.sql.cson'
options = config.current.databases.knodeo
options.database = "knodeo"

callback = (results)->
  console.log results.rows

postgresql.execute sql, options, callback