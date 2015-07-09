
logger = require('knodeo-logger').Logger
sqlite3 = require('sqlite3').verbose()

exports.sqlite = {
  db: {}
  new: (path)->
    @db = new (sqlite3.Database)(path)


  execute: (sql, options, callback)->
    db = new (sqlite3.Database)('test.sqlite')
    db.serialize ->
      db.all sql, (err, rows) ->
        if callback?
          callback rows
        return
      return
    db.close()

}