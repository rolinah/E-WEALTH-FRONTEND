require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');

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

// Create users table if not exists
async function ensureUserTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(sql);
}
ensureUserTable();

// Ensure topics and user_topics tables exist
async function ensureTopicsTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS topics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      description TEXT
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_topics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      topic_id INT,
      progress INT DEFAULT 0,
      completed BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (topic_id) REFERENCES topics(id)
    )
  `);
}
ensureTopicsTables();

// Ensure modules table exists
async function ensureModulesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS modules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      topic_id INT,
      title VARCHAR(255),
      content TEXT,
      duration INT,
      type VARCHAR(50),
      video VARCHAR(255),
      image VARCHAR(255),
      FOREIGN KEY (topic_id) REFERENCES topics(id)
    )
  `);
}
ensureModulesTable();

// Ensure posts table exists
async function ensurePostsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}
ensurePostsTable();

// Ensure badges table exists
async function ensureBadgesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS badges (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      name VARCHAR(255),
      awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}
ensureBadgesTable();

// Create video_completions table if not exists
async function ensureVideoCompletionsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS video_completions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(255),
      module_id INT,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_completion (user_id, module_id)
    )
  `;
  await pool.query(sql);
}

// Ensure users table has xp column
async function ensureUsersXpColumn() {
  const [rows] = await pool.query("SHOW COLUMNS FROM users LIKE 'xp'");
  if (rows.length === 0) {
    await pool.query('ALTER TABLE users ADD COLUMN xp INT DEFAULT 0');
  }
}

// Update users table to include 'role' if not already present
(async function ensureUserRoleColumn() {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user'");
  } catch (e) {
    // Ignore error if column already exists
  }
})();

// Ensure users table has 'bio' column
(async function ensureUserBioColumn() {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN bio TEXT");
  } catch (e) {
    // Ignore error if column already exists
  }
})();

// Ensure users table has 'avatar' column
(async function ensureUserAvatarColumn() {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN avatar VARCHAR(255)");
  } catch (e) {
    // Ignore error if column already exists
  }
})();
// Ensure users table has 'interests' column
(async function ensureUserInterestsColumn() {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN interests TEXT");
  } catch (e) {
    // Ignore error if column already exists
  }
})();

// Video upload endpoint
app.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const userId = req.body.userId || 'testuser'; // Replace with real user ID from auth
  const videoUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
  await pool.query('INSERT INTO videos (user_id, url) VALUES (?, ?)', [userId, videoUrl]);
  res.json({ url: videoUrl });
});

// Avatar upload endpoint (authenticated)
app.post('/upload/avatar', upload.single('avatar'), async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], 'your_jwt_secret');
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // Save file and return URL
    const avatarUrl = `http://localhost:${process.env.PORT || 3000}/uploads/${req.file.filename}`;
    // Optionally update user profile with new avatar
    await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, decoded.id]);
    res.json({ url: avatarUrl });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get videos for a user
app.get('/videos/:userId', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM videos WHERE user_id = ?', [req.params.userId]);
  res.json(rows);
});

// Get all topics with their modules
app.get('/topics', async (req, res) => {
  const [topics] = await pool.query('SELECT * FROM topics');
  for (const topic of topics) {
    const [modules] = await pool.query('SELECT * FROM modules WHERE topic_id = ?', [topic.id]);
    topic.modules = modules;
  }
  res.json(topics);
});

// Get a single topic with its modules
app.get('/topics/:id', async (req, res) => {
  const [topics] = await pool.query('SELECT * FROM topics WHERE id = ?', [req.params.id]);
  if (!topics.length) return res.status(404).json({ error: 'Topic not found' });
  const topic = topics[0];
  const [modules] = await pool.query('SELECT * FROM modules WHERE topic_id = ?', [topic.id]);
  topic.modules = modules;
  res.json(topic);
});

// Get user progress
app.get('/user-topics/:userId', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM user_topics WHERE user_id = ?', [req.params.userId]);
  res.json(rows);
});

// Update user progress
app.post('/user-topics/:userId/:topicId', express.json(), async (req, res) => {
  const { progress, completed } = req.body;
  await pool.query(
    'INSERT INTO user_topics (user_id, topic_id, progress, completed) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE progress=?, completed=?',
    [req.params.userId, req.params.topicId, progress, completed, progress, completed]
  );
  res.json({ success: true });
});

// Get all posts
app.get('/posts', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
  res.json(rows);
});

// Create a post
app.post('/posts', express.json(), async (req, res) => {
  const { userId, content } = req.body;
  await pool.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [userId, content]);
  res.json({ success: true });
});

// Get user badges
app.get('/badges/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM badges WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch badges', details: err.message });
  }
});

// JWT-protected alias for fetching badges
app.get('/api/badges/:userId', authenticateJWT, async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM badges WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch badges', details: err.message });
  }
});

// Award badge
app.post('/badges/:userId', express.json(), async (req, res) => {
  const { name } = req.body;
  await pool.query('INSERT INTO badges (user_id, name) VALUES (?, ?)', [req.params.userId, name]);
  res.json({ success: true });
});

// Signup
// IMPORTANT: Admin registration requires ADMIN_SECRET in your .env file
// Only users with the correct adminSecret can register as admin
app.post('/auth/signup', express.json(), async (req, res) => {
  const { email, password, name, role, adminSecret, avatar, bio, interests } = req.body;
  // Validate required fields
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }
  let userRole = role === 'admin' ? 'admin' : 'entrepreneur';
  // Enforce adminSecret for admin registration
  if (userRole === 'admin') {
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Admin registration requires a valid admin secret key.' });
    }
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      'INSERT INTO users (email, password, name, role, avatar, bio, interests) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, hash, name, userRole, avatar || null, bio || '', interests ? JSON.stringify(interests) : '[]']
    );
    res.json({ success: true, role: userRole });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Login
app.post('/auth/login', express.json(), async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Get profile (protected)
app.get('/profile', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], 'your_jwt_secret');
    const [rows] = await pool.query('SELECT id, email, name, bio, avatar, interests, role FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    const user = rows[0];
    user.interests = user.interests ? JSON.parse(user.interests) : [];
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Health check
app.get('/', (req, res) => res.send('MySQL backend running!'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Admin: Upload video and assign to topic/module
app.post('/admin/upload-module', upload.single('video'), async (req, res) => {
  const { topicId, title, description, duration, type } = req.body;
  if (!req.file || !topicId || !title) {
    return res.status(400).json({ error: 'Missing required fields or video file' });
  }
  // Accept any video format, store original name and mimetype if needed
  const videoUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
  try {
    await pool.query(
      'INSERT INTO modules (topic_id, title, content, duration, type, video) VALUES (?, ?, ?, ?, ?, ?)',
      [topicId, title, description || '', duration || 0, type || req.file.mimetype || 'video', videoUrl]
    );
    res.json({ success: true, message: 'Video uploaded and module created successfully!', videoUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create module', details: err.message });
  }
});

// Admin: Delete a module/video by ID
app.delete('/admin/module/:id', async (req, res) => {
  const moduleId = req.params.id;
  try {
    // Get the module to find the video file
    const [modules] = await pool.query('SELECT video FROM modules WHERE id = ?', [moduleId]);
    if (!modules.length) return res.status(404).json({ error: 'Module not found' });
    const videoUrl = modules[0].video;
    // Remove the video file if it exists in uploads
    if (videoUrl) {
      const filename = videoUrl.split('/').pop();
      const filePath = path.join(__dirname, 'uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    // Delete the module from the database
    await pool.query('DELETE FROM modules WHERE id = ?', [moduleId]);
    res.json({ success: true, message: 'Module and video deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete module', details: err.message });
  }
});

// Admin: Create a new topic
app.post('/admin/topic', express.json(), async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const [result] = await pool.query('INSERT INTO topics (title, description) VALUES (?, ?)', [title, description || '']);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create topic', details: err.message });
  }
});

// Admin stats endpoint
app.get('/admin/stats', async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ activeUsers }]] = await pool.query("SELECT COUNT(*) as activeUsers FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    const [[{ topicsCreated }]] = await pool.query('SELECT COUNT(*) as topicsCreated FROM topics');
    res.json({ totalUsers, activeUsers, topicsCreated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
  }
});

// Middleware to authenticate JWT for /api endpoints
function authenticateJWT(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Update user profile (name, email, bio, password)
app.put('/api/user/profile', authenticateJWT, express.json(), async (req, res) => {
  const userId = req.user.id;
  const { name, email, bio, password, interests } = req.body;
  let updateFields = [];
  let updateValues = [];
  if (name) {
    updateFields.push('name = ?');
    updateValues.push(name);
  }
  if (email) {
    updateFields.push('email = ?');
    updateValues.push(email);
  }
  if (bio !== undefined) {
    updateFields.push('bio = ?');
    updateValues.push(bio);
  }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    updateFields.push('password = ?');
    updateValues.push(hash);
  }
  if (interests !== undefined) {
    updateFields.push('interests = ?');
    updateValues.push(JSON.stringify(interests));
  }
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  updateValues.push(userId);
  try {
    await pool.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

// /api/user/profile (GET) - alias for /profile, but requires JWT
app.get('/api/user/profile', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const [rows] = await pool.query('SELECT id, email, name, bio, avatar, interests, role FROM users WHERE id = ?', [userId]);
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  const user = rows[0];
  user.interests = user.interests ? JSON.parse(user.interests) : [];
  res.json(user);
});
// /api/topics (GET) - alias for /topics, but requires JWT
app.get('/api/topics', authenticateJWT, async (req, res) => {
  const [topics] = await pool.query('SELECT * FROM topics');
  for (const topic of topics) {
    const [modules] = await pool.query('SELECT * FROM modules WHERE topic_id = ?', [topic.id]);
    topic.modules = modules;
  }
  res.json(topics);
});
// /api/community/posts (GET) - alias for /posts, but requires JWT
app.get('/api/community/posts', authenticateJWT, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
  res.json(rows);
});
// /api/community/posts (POST) - alias for /posts, but requires JWT
app.post('/api/community/posts', authenticateJWT, express.json(), async (req, res) => {
  const userId = req.user.id;
  const { content } = req.body;
  await pool.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [userId, content]);
  res.json({ success: true });
});
// /api/posts (GET) - alias for /posts, but requires JWT
app.get('/api/posts', authenticateJWT, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
  res.json(rows);
});
// /api/admin/stats (GET) - alias for /admin/stats, but requires JWT
app.get('/api/admin/stats', authenticateJWT, async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ activeUsers }]] = await pool.query("SELECT COUNT(*) as activeUsers FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    const [[{ topicsCreated }]] = await pool.query('SELECT COUNT(*) as topicsCreated FROM topics');
    res.json({ totalUsers, activeUsers, topicsCreated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
  }
});
// /api/user/register (POST) - alias for /auth/signup
app.post('/api/user/register', express.json(), async (req, res) => {
  const { email, password, name, role, adminSecret } = req.body;
  // Enforce adminSecret for admin registration
  if (role === 'admin') {
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Admin registration requires a valid admin secret key.' });
    }
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [email, hash, name, role || 'user']);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// Notifications endpoint
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Ensure notifications table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        message TEXT,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
  }
});

// Endpoint: User completed a video/module, award XP
app.post('/api/video/completed', express.json(), async (req, res) => {
  const { userId, moduleId } = req.body;
  if (!userId || !moduleId) {
    return res.status(400).json({ error: 'Missing userId or moduleId' });
  }
  try {
    // Check if already completed
    const [rows] = await pool.query(
      'SELECT * FROM video_completions WHERE user_id = ? AND module_id = ?',
      [userId, moduleId]
    );
    if (rows.length > 0) {
      return res.json({ success: false, message: 'Already completed' });
    }
    // Award XP (25 per video)
    await pool.query('UPDATE users SET xp = xp + 25 WHERE id = ?', [userId]);
    // Record completion
    await pool.query(
      'INSERT INTO video_completions (user_id, module_id) VALUES (?, ?)',
      [userId, moduleId]
    );
    res.json({ success: true, message: 'XP awarded' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to award XP', details: err.message });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', async (socket) => {
  console.log('A user connected');
  // Send recent messages to the newly connected client
  try {
    const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 50');
    // Send in chronological order
    socket.emit('chat history', rows.reverse());
  } catch (err) {
    console.error('Error fetching chat history:', err);
  }
  socket.on('chat message', async (msg) => {
    io.emit('chat message', msg);
    // Save to database
    try {
      await pool.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [msg.username || 'anonymous', msg.text]);
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));