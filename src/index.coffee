
exports.query = 
  postgresql: require("./lib/postgresql").postgresql
  mssql: require("./lib/mssql").mssql
  sqlite: require("./lib/sqlite").sqlite