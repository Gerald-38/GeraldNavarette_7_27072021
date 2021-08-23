const mysql = require('mysql');
require('dotenv').config()


exports.connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE,
  timezone: 'local',
  charset: 'utf8mb4'
});




