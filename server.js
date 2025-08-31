import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(__dirname));

let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, 'data.db'),
    driver: sqlite3.Database
  });
  await db.exec(`CREATE TABLE IF NOT EXISTS routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start TEXT NOT NULL,
    end TEXT NOT NULL,
    favorite INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );`);
})();

app.get('/api/routes', async (req, res) => {
  const rows = await db.all('SELECT id,start,end,favorite FROM routes ORDER BY created_at DESC LIMIT 10');
  res.json(rows);
});

app.post('/api/routes', async (req, res) => {
  const { start, end } = req.body;
  if (!start || !end) return res.status(400).json({ error: 'start and end required' });
  await db.run('INSERT INTO routes (start,end) VALUES (?,?)', [start, end]);
  await db.run('DELETE FROM routes WHERE id NOT IN (SELECT id FROM routes ORDER BY created_at DESC LIMIT 10)');
  res.json({ status: 'ok' });
});

app.get('/api/favorites', async (req, res) => {
  const rows = await db.all('SELECT id,start,end FROM routes WHERE favorite=1 ORDER BY created_at DESC');
  res.json(rows);
});

app.post('/api/favorites', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'id required' });
  await db.run('UPDATE routes SET favorite=1 WHERE id=?', id);
  res.json({ status: 'ok' });
});

app.delete('/api/favorites/:id', async (req, res) => {
  const { id } = req.params;
  await db.run('UPDATE routes SET favorite=0 WHERE id=?', id);
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

