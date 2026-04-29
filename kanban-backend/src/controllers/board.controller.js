const boardService = require("../services/board.service");

exports.createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const board = await boardService.createBoard(req.user.id, name);
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBoards = async (req, res) => {
  try {
    const boards = await boardService.getBoards(req.user.id);
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBoard = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await boardService.deleteBoard(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete board" });
  }
};