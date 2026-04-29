const pool = require("../config/db");

// ==========================
// CREATE CARD
// ==========================
exports.createCard = async (listId, title, description) => {
  try {
    const result = await pool.query(
      `INSERT INTO cards (list_id, title, description, position)
       VALUES (
         $1,
         $2,
         $3,
         COALESCE(
           (SELECT MAX(position) + 1 FROM cards WHERE list_id = $1),
           0
         )
       )
       RETURNING *`,
      [listId, title, description]
    );

    const card = result.rows[0];


    await pool.query(
      `INSERT INTO activities (action, entity_type, entity_id)
       VALUES ('CARD_CREATED', 'CARD', $1)`,
      [card.id]
    );

    return card;
  } catch (err) {
    console.log("CREATE CARD ERROR:", err.message);
    throw err;
  }
};

// ==========================
// MOVE CARD (Drag & Drop)
// ==========================
exports.moveCard = async (
  cardId,
  newListId,
  prevPosition,
  nextPosition,
  currentVersion
) => {
  let newPosition;

  if (prevPosition === null && nextPosition === null) {
    newPosition = 0;
  } else if (prevPosition === null) {
    newPosition = nextPosition / 2;
  } else if (nextPosition === null) {
    newPosition = prevPosition + 1;
  } else {
    newPosition = (prevPosition + nextPosition) / 2;
  }

  
  if (!Number.isFinite(newPosition)) {
    newPosition = Date.now(); // fallback unique
  }

  console.log("NEW POSITION:", newPosition);

  const result = await pool.query(
    `UPDATE cards
     SET list_id = $1,
         position = $2,
         version = version + 1
     WHERE id = $3
     RETURNING *`,
    [newListId, newPosition, cardId]
  );

  return result.rows[0];
};
// ==========================
// GET CARDS
// ==========================
exports.getCards = async (listId, search, status) => {
  let query = `SELECT * FROM cards WHERE list_id = $1`;
  let values = [listId];
  let index = 2;

  if (search) {
    query += ` AND title ILIKE $${index}`;
    values.push(`%${search}%`);
    index++;
  }

  if (status) {
    query += ` AND status = $${index}`;
    values.push(status);
    index++;
  }

  query += ` ORDER BY position ASC, id ASC`;

  const result = await pool.query(query, values);
  return result.rows;
};
exports.deleteCard = async (cardId) => {
  const result = await pool.query(
    "DELETE FROM cards WHERE id = $1 RETURNING *",
    [cardId]
  );

  if (result.rowCount === 0) {
    throw new Error("Card not found");
  }

  // Optional: activity log
  await pool.query(
    `INSERT INTO activities (action, entity_type, entity_id)
     VALUES ('CARD_DELETED', 'CARD', $1)`,
    [cardId]
  );

  return result.rows[0];
};
exports.updateCard = async (cardId, title, description) => {
  const result = await pool.query(
    `UPDATE cards
     SET title = $1,
         description = $2
     WHERE id = $3
     RETURNING *`,
    [title, description, cardId]
  );

  if (result.rowCount === 0) {
    throw new Error("Card not found");
  }

  return result.rows[0];
};