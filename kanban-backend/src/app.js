const express = require("express");
const cors = require("cors");


const app = express();

const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const boardRoutes = require("./routes/board.routes");
const listRoutes = require("./routes/list.routes");
const cardRoutes = require("./routes/card.routes");

// =====================
// GLOBAL MIDDLEWARE
// =====================
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

// =====================
//  CHECK
// =====================
app.get("/", (req, res) => {
  res.send("Kanban API Running");
});

module.exports = app;