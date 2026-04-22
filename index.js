const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// ✅ Connect to Postgres using DATABASE_URL from Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Render
});

pool.connect()
  .then(() => console.log("Connected to Postgres"))
  .catch(err => console.error("Connection error", err));

// ✅ Route to save contact form submissions
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *",
      [name, email, message]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting contact:", err);
    res.status(500).send("Server error");
  }
});


// ✅ Route to fetch all contacts
app.get("/contacts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.get("/", (req, res) => {
  res.send("Portfolio backend is live 🚀");
});
pool.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

