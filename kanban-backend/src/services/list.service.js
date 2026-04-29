const pool = require("../config/db");

exports.createList = async (boardId, name) => {
  const result = await pool.query(
    `INSERT INTO lists (board_id, name, position)
     VALUES ($1, $2,
       COALESCE((SELECT MAX(position) + 1 FROM lists WHERE board_id = $1), 0)
     )
     RETURNING *`,
    [boardId, name]
  );

  return result.rows[0];
};

exports.getLists = async (boardId) => {
  const result = await pool.query(
    "SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC",
    [boardId]
  );

  return result.rows;
};