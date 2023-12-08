const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Use session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Create a SQLite database file and a users table
const db = new sqlite3.Database('user_database.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
});

// Example set to store authenticated user IDs (replace with your authentication logic)
const authenticatedUsers = new Set();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/solutions', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'solutions.html'));
});

app.get('/myths', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'myths.html'));
});

app.get('/about', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/explore', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'explore.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handling form submission for signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Example: Log the received data
  console.log(`Received signup request: Username - ${username}, Password - ${password}`);

  // Example: Store user in the database using parameterized query
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  stmt.run(username, password);
  stmt.finalize();

  // Set a session variable to indicate the user is authenticated
  req.session.userId = username;

  // Redirect the user to another page after signup
  res.redirect('/');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handling form submission for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Example: Log the received data
  console.log(`Received login request: Username - ${username}, Password - ${password}`);

  // Example: Verify user credentials against the database using parameterized query
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.get(sql, [username, password], (err, row) => {
    if (row) {
      // Set a session variable to indicate the user is authenticated
      req.session.userId = username;
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
});

// Handling form submission for logout
app.post('/logout', (req, res) => {
  // Destroy the session to log out the user
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
