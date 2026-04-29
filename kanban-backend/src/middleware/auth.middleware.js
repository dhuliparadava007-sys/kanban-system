const jwt = require("jsonwebtoken");
const pool = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Auth Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify token
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    //  Convert ID

    const userId = parseInt(decoded.id);

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    //  Fetch user from DB

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const { password, ...safeUser } = user;

    req.user = safeUser;

    next();

  } catch (err) {
    console.log("JWT Error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};