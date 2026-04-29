const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then((client) => {
    console.log("PostgreSQL Connected");
    client.release();
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
  });

pool.on("error", (err) => {
  console.error("Unexpected DB error:", err);
});

module.exports = pool;