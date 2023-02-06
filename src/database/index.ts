// const { Pool } = require("pg");
import { Pool } from "pg";

if (process.env.DB_USER === undefined) {
  throw Error("DB_USER is undefined");
} else if (process.env.DB_PASS === undefined) {
  throw Error("DB_PASS is undefined");
} else if (process.env.DB_HOST === undefined) {
  throw Error("DB_HOST is undefined");
} else if (process.env.DB_PORT === undefined) {
  throw Error("DB_PORT is undefined");
} else if (process.env.DB_NAME === undefined) {
  throw Error("DB_NAME is undefined");
}

const db = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export default db;
// module.exports = pool;
