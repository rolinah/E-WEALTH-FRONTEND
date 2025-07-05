const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

// Initialize Firebase Admin
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    res.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const updates = req.body;
    
    await db.collection('users').doc(userId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get topics with user progress
app.get('/api/topics', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Get all topics
    const topicsSnapshot = await db.collection('topics').orderBy('order').get();
    const topics = [];
    topicsSnapshot.forEach(doc => {
      topics.push({ id: doc.id, ...doc.data() });
    });
    
    // Get user progress
    const userTopicsSnapshot = await db.collection('userTopics')
      .where('userId', '==', userId)
      .get();
    
    const userTopics = {};
    userTopicsSnapshot.forEach(doc => {
      const data = doc.data();
      userTopics[data.topicId] = data;
    });
    
    // Merge topics with user progress
    const topicsWithProgress = topics.map(topic => ({
      ...topic,
      progress: userTopics[topic.id]?.progress || 0,
      streak: userTopics[topic.id]?.streak || 0
    }));
    
    res.json(topicsWithProgress);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update topic progress
app.post('/api/topics/:topicId/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { topicId } = req.params;
    const { progress, streak } = req.body;
    
    const userTopicRef = db.collection('userTopics').doc(`${userId}_${topicId}`);
    
    await userTopicRef.set({
      userId,
      topicId,
      progress: progress || 0,
      streak: streak || 0,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    res.json({ message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating topic progress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get community posts
app.get('/api/community/posts', authenticateToken, async (req, res) => {
  try {
    const postsSnapshot = await db.collection('communityPosts')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();
    
    const posts = [];
    postsSnapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create community post
app.post('/api/community/posts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { title, content } = req.body;
    
    // Get user profile for display name
    const userDoc = await db.collection('users').doc(userId).get();
    const userName = userDoc.exists ? userDoc.data().name : 'Anonymous';
    
    const postData = {
      userId,
      userName,
      title,
      content,
      likes: 0,
      comments: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('communityPosts').add(postData);
    
    res.json({ 
      message: 'Post created successfully',
      postId: docRef.id 
    });
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get admin statistics
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you can implement your own admin logic)
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();
    
    if (!userData || !userData.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const statsDoc = await db.collection('adminData').doc('statistics').get();
    
    if (!statsDoc.exists) {
      return res.status(404).json({ error: 'Admin statistics not found' });
    }
    
    res.json(statsDoc.data());
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 