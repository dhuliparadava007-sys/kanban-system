const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validatePassword = (password) => {
  const minLength = /.{6,}/;
  const upperCase = /[A-Z]/;
  const lowerCase = /[a-z]/;
  const number = /[0-9]/;

  if (!minLength.test(password)) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (!upperCase.test(password)) {
    throw new Error("Password must contain at least one uppercase letter");
  }

  if (!lowerCase.test(password)) {
    throw new Error("Password must contain at least one lowercase letter");
  }

  if (!number.test(password)) {
    throw new Error("Password must contain at least one number");
  }
};

// SIGNUP


exports.signup = async (name, email, password) => {
  validatePassword(password); // 🔥 validation added here

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );

  const { password: _, ...safeUser } = result.rows[0];

  return safeUser;
};

//  LOGIN

exports.login = async (email, password) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
};