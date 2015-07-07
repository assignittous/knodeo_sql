logger = require('knodeo-logger').Logger
_ = require "lodash"

Connection = require("tedious").Connection
Request = require("tedious").Request


exports.mssql = {

  execute: (sql, options, callback)->
    logger.info sql

    connection = new Connection(options)

    executeStatement = ()->



      request = new Request sql, (err, rowCount)->
        if err?
          logger.error "Request error"
          console.log err
        else
          logger.info "#{rowCount} rows retrieved"
        connection.close()
        return

      request.on 'done', (rowcount, more, rows)->
        # map the results to a simple array of objects
        rows = _.map rows, (r)->
          out = {}
          _.forEach r, (o)->
            out[o.metadata.colName] = o.value
          return out

        if callback?
          callback rows
        #console.log "ROWS"
        #console.log rows



      #console.log connection
      connection.execSqlBatch(request)


    connection.on 'connect', (err)->
      if err?
        logger.error "Connection error"
        console.log err
        return
      logger.info "CONNECTED"
      executeStatement()




}