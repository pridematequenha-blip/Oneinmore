// server.js — API mínima: Node + Express + better-sqlite3
const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const dbFile = process.env.SQLITE_FILE || path.join(__dirname, 'data.db');
const db = new Database(dbFile);

db.exec(`
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);
CREATE TABLE IF NOT EXISTS music (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT,
  created_at INTEGER DEFAULT (strftime('%s','now'))
);
`);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Prefix: /api (front-end atual usa /api)
app.get('/api/books', (req, res) => {
  const rows = db.prepare('SELECT * FROM books ORDER BY created_at DESC').all();
  res.json(rows);
});
app.post('/api/books', (req, res) => {
  const { title = '', author = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const st = db.prepare('INSERT INTO books (title,author) VALUES (?,?)');
  const info = st.run(title, author);
  res.json({ id: info.lastInsertRowid, title, author });
});

app.get('/api/music', (req, res) => {
  const rows = db.prepare('SELECT * FROM music ORDER BY created_at DESC').all();
  res.json(rows);
});
app.post('/api/music', (req, res) => {
  const { title = '', artist = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const st = db.prepare('INSERT INTO music (title,artist) VALUES (?,?)');
  const info = st.run(title, artist);
  res.json({ id: info.lastInsertRowid, title, artist });
});

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on ${port}`));
