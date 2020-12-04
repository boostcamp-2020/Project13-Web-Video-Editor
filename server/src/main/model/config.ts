import mysql from 'mysql2/promise';
import path from 'path';

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default connection;
