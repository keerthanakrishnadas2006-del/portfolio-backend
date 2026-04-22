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
    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    res.status(201).send("Contact saved successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving contact");
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
