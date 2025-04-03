const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('./podeo.db', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER DEFAULT 0
  )
`, (err) => {
  if (err) {
    console.error("Error creating users table:", err.message);
  } else {
    console.log("Users table is ready.");
  }
});


db.run(`
    CREATE TABLE IF NOT EXISTS podcasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      mp3Url TEXT,
      imageUrl TEXT,
      name TEXT,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error("Error creating podcasts table:", err.message);
    } else {
      console.log("Podcasts table is ready.");
    }
  });
  

  app.post('/api/register', (req, res) => {
    const { username, email, password, isAdmin } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please provide username, email, and password." });
    }
  
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    const adminFlag = isAdmin ? 1 : 0;
  
    db.run(`INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, adminFlag],
      function(err) {
        if (err) {
          console.error("Registration error:", err.message);
          return res.status(500).json({ error: "Registration failed." });
        }
        res.status(201).json({ message: "User registered successfully.", userId: this.lastID });
      }
    );
  });
  

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Please provide username and password." });
  }

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      console.error("Error fetching user:", err.message);
      return res.status(500).json({ error: "Login error." });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ message: "Login successful.", token, isAdmin: !!user.isAdmin });
    } else {
      return res.status(401).json({ error: "Invalid credentials." });
    }
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Access token missing." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token." });
    req.user = user;
    next();
  });
}

app.get('/api/dashboard', authenticateToken, (req, res) => {
  if (req.user.isAdmin) {
    res.json({ message: "Welcome to the admin dashboard.", user: req.user });
  } else {
    res.status(403).json({ error: "Access denied. Not an admin." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
