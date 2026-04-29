const pool = require("../config/db");

exports.createBoard = async (userId, name) => {
  const result = await pool.query(
    "INSERT INTO boards (user_id, name) VALUES ($1, $2) RETURNING *",
    [userId, name]
  );

  return result.rows[0];
};

exports.getBoards = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );

  return result.rows;
};

exports.deleteBoard = async (id, userId) => {
  const result = await pool.query(
    "DELETE FROM boards WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId]
  );

  return result.rows[0];
};