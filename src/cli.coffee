program = require "commander"
logger = require("knodeo-logger").Logger
pkg = require "./package.json"
fs = require "fs"
cson = require "cson"
config = require('knodeo-configuration').Configuration

# db support
postgresql = require("./lib/postgresql").postgresql
mssql = require("./lib/mssql").mssql

noOp = ()-> 
  console.log "Nothing ran, couldn't understand your command"


writeDataFile = (data, path)->
  
  output = cson.createString(data)
  fs.writeFileSync path, output, "UTF-8"



# this is because fs.existsSync is getting deprecated
fileExists = (path)->
  try
    # Query the entry
    stats = fs.lstatSync(path)
    # Is it a directory?
    if stats.isDirectory()
      # Yes it is
      return false
    else
      return true
  catch e
    return false

# version
program
.version(pkg.version, "-v, --version")
.option("-s, --sql <sqlfile>", "SQL File")
.option("-d, --database <database>", "Database")
.option("-o, --output <outputfile>", "Output file")

# todo, not implemented yet
.option("-r, --root <attribute>", "Attribute")
.option("-f, --first", "First record only")


.parse(process.argv)


if program.sql? && program.database? && program.output?

  # Validate config
  configFile = 'config.sql.cson'
  if fileExists(configFile)
    config.load 'config.sql.cson'




  else
    logger.error 'config.sql.cson could not be found in the current working directory'
    return

  # Check sql file
  if fileExists(program.sql)
    sql = fs.readFileSync(program.sql,'utf8')
  else
    logger.error "SQL file does not exist"
    return



  
  if program.database
    
    if config.current.databases[program.database]?
      console.log "database: #{program.database} OK"
      dbConfig = config.current.databases[program.database]      


      console.log "Root: #{program.root}"
      console.log "First: #{program.first}"

      callback = (data)->
        logger.info "Writing to #{program.output}"

        if program.first?
          data = data[0]

        if program.root?
          root = {}
          root[program.root] = data
          data = root

        writeDataFile data, program.output
      

      switch dbConfig.type
        when "mssql"
          logger.info "MSSQL Database"
          options = 
            userName: dbConfig.user
            password: dbConfig.password
            server: dbConfig.host
            options:
              port: dbConfig.port
              database: program.database
              rowCollectionOnDone: true      
          mssql.execute sql, options, callback
        when "postgresql"
          options = dbConfig
          options.database = program.database                  
          logger.info "Postgresql Database"
          postgresql.execute sql, options, callback
        else
          logger.error "Database type #{dbConfig.type} is not supported"
          return




    else
      logger.error "Database #{program.database} is not specified in config.sql.cson"
      return
    





else
  logger.error "sql (-s), database (-d) and output (-o) parameters are required."
