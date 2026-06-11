import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query("Select Now()", (err, res) => {
  if (err) {
    console.error("Database connection failed: ", err.message);
  } else {
    console.log("Database connected successfully at: ", res.rows[0].now);
  }
});

export default pool;
