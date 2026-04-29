console.log("card routes loaded");

const express = require("express");
const router = express.Router();

const cardController = require("../controllers/card.controller");
const authMiddleware = require("../middleware/auth.middleware");

// CREATE CARD (by list)
router.post("/list/:listId", authMiddleware, cardController.createCard);

// GET CARDS (by list)
router.get("/list/:listId", authMiddleware, cardController.getCards);

// MOVE CARD
router.put("/move/:cardId", authMiddleware, cardController.moveCard);

// UPDATE CARD
router.put("/:cardId", authMiddleware, cardController.updateCard);

// DELETE CARD
router.delete("/:cardId", authMiddleware, cardController.deleteCard);

module.exports = router;