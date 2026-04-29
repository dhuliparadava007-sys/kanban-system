const pool = require("../config/db");

// ==========================
// CREATE LIST
// ==========================
exports.createList = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    const result = await pool.query(
      `
      INSERT INTO lists (board_id, name, position)
      VALUES ($1, $2,
        COALESCE((SELECT MAX(position) + 1 FROM lists WHERE board_id = $1), 0)
      )
      RETURNING *
      `,
      [boardId, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("CREATE LIST ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// GET LISTS + CARDS
// ==========================
exports.getLists = async (req, res) => {
  try {
    const { boardId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        l.id AS list_id,
        l.name,
        l.position,
        c.id AS card_id,
        c.title,
        c.description,
        c.position AS card_position
      FROM lists l
      LEFT JOIN cards c ON l.id = c.list_id
      WHERE l.board_id = $1
      ORDER BY l.position ASC, c.position ASC
      `,
      [boardId]
    );

    const listsMap = {};

    result.rows.forEach(row => {
      if (!listsMap[row.list_id]) {
        listsMap[row.list_id] = {
          id: row.list_id,
          name: row.name,
          position: row.position,
          cards: []
        };
      }

      if (row.card_id) {
        listsMap[row.list_id].cards.push({
          id: row.card_id,
          title: row.title,
          description: row.description,
          position: row.card_position
        });
      }
    });

    res.json(Object.values(listsMap));
  } catch (err) {
    console.log("GET LISTS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};