require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create videos table if not exists
async function ensureTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255),
      url VARCHAR(255),
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(sql);
}
ensureTable();

// Video upload endpoint
app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const userId = req.body.userId || 'testuser'; // Replace with real user ID from auth
  const videoUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
  await pool.query('INSERT INTO videos (user_id, url) VALUES (?, ?)', [userId, videoUrl]);
  res.json({ url: videoUrl });
});

// Get videos for a user
app.get('/videos/:userId', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM videos WHERE user_id = ?', [req.params.userId]);
  res.json(rows);
});

// Health check
app.get('/', (req, res) => res.send('MySQL backend running!'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));