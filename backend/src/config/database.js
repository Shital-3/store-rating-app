import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const ssl = process.env.DB_SSL === "true"
  ? {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true
    }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;