pg = require 'pg'

conString = "postgres://user:password@localhost/db"

sql = "select count(*) from users"

pg.connect conString, (err, client, done)->
  if err
    console.log "ERROR!"
    return
  

  client.query sql, (err, result)->
    if err
      console.log "SQL QUERY ERROR"
      return
    console.log result.rows
    done()
    client.end()
    return
  return
