const mysql = require('mysql');


exports.connection = mysql.createPool({
  host: 'localhost',
  user: "supAdmin", // TODO : a placer dans le .env
  password: "admin", // TODO : a placer dans le  .env
  database: 'Groupomania',
  timezone: 'local',
  charset: 'utf8mb4'
});


