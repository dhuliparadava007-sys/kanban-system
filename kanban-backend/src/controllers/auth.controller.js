const authService = require("../services/auth.service");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.signup(name, email, password);

    const { password: _, ...safeUser } = user; // remove password

    res.status(201).json(safeUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await authService.login(email, password);

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};