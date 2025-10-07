import mysql from "mysql2";
import { configDotenv } from "dotenv";
configDotenv();

const pool = mysql.createPool({
  database: process.env.DATABASE,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
});
pool.getConnection((err, connection) => {
  if (err) console.error("DB connection failed:", err);
  else {
    console.log("✅ Database connected!");
    connection.release();
  }
});
const query = async (sql, param) => {
  const [row] = await pool.promise().execute(sql, param);

  return row;
};
export default query;
