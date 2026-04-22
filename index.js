const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");


const app = express();
app.use(cors());
app.use(express.json());



const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",     // change if your MySQL user is different
  password: "root",     // add password if you set one
  database: "portfolio"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected!");
});

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Get projects
app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Save contact form
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  db.query(
    "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
    [name, email, message],
    (err, result) => {
      if (err) throw err;
      res.json({ success: true });
    }
  );
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
