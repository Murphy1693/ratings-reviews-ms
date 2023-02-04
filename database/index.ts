require("dotenv").config();
const { Client, Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.query(`SELECT * FROM reviews WHERE id = 1`).then((data) => {
  console.log(data);
});

module.exports = pool;
