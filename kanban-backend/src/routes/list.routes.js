console.log(" list routes loaded");

const express = require("express");
const router = express.Router();
const listController = require("../controllers/list.controller");
const authMiddleware = require("../middleware/auth.middleware");

//  CREATE list
router.post("/:boardId", authMiddleware, listController.createList);

//  GET lists
router.get("/:boardId", authMiddleware, listController.getLists);
module.exports = router;