pg = require 'pg'
logger = require('knodeo-logger').Logger

exports.postgresql = {

  execute: (sql, options, callback) ->
    logger.info sql
    connectionString = "postgres://#{options.user}:#{options.password}@#{options.host}/#{options.database}"

    pg.connect connectionString, (err, client, done)->
      if err
        logger.error "Connection Error"
        return
      

      client.query sql, (err, result)->
        if err
          logger.error "Query error"
          return
        if callback?
          callback(result)
        done()
        client.end()
        return
      return

}