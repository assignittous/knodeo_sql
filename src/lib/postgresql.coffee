pg = require 'pg'
logger = require('knodeo-logger').Logger

exports.postgresql = {

  execute: (sql, options, callback) ->
    logger.info sql
    connectionString = "postgres://#{options.user}:#{options.password}@#{options.host}/#{options.database}"

    pg.connect connectionString, (err, client, done)->
      if err
        logger.error "Connection Error"
        if client?
          client.end()
        return
      

      client.query sql, (err, result)->
        if err
          logger.error "Query error"
          console.log err
          client.end()
          return
        logger.sql sql
        if callback?
          callback(result.rows)
        done()
        client.end()
        return
      return

}