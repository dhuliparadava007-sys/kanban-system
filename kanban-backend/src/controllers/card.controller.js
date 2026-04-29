const pool = require("../config/db");
// =====================
// CREATE CARD
// =====================
exports.createCard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { listId } = req.params;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const result = await pool.query(
      `
      INSERT INTO cards (list_id, title, description, position, status, version)
      VALUES (
        $1, $2, $3,
        COALESCE((SELECT MAX(position) + 1 FROM cards WHERE list_id = $1), 0),
        'todo',
        1
      )
      RETURNING *
      `,
      [listId, title, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =====================
// GET CARDS
// =====================
exports.getCards = async (req, res) => {
  try {
    const { listId } = req.params;

    const result = await pool.query(
      `SELECT * FROM cards WHERE list_id = $1 ORDER BY id ASC`,
      [listId]
    );

    res.json(result.rows);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =====================
// UPDATE CARD
// =====================
exports.updateCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { title, description } = req.body;

    const result = await pool.query(
      `UPDATE cards 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
      [title, description, cardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// =====================
// DELETE CARD
// =====================
exports.deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const result = await pool.query(
      `DELETE FROM cards WHERE id = $1 RETURNING *`,
      [cardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json({ message: "Card deleted", card: result.rows[0] });

  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
//====================
// MOVE CARD
//====================

exports.moveCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { newListId, newPosition } = req.body;

    if (!newListId) {
      return res.status(400).json({ message: "newListId is required" });
    }

    const result = await pool.query(
      `UPDATE cards 
       SET list_id = $1,
           position = $2
       WHERE id = $3
       RETURNING *`,
      [newListId, newPosition ?? 0, cardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log("MOVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};