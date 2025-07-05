// Firebase Database Setup Script
// This script initializes the Firebase database with sample data for the E-Wealth app

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, addDoc } = require('firebase/firestore');

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample topics data
const sampleTopics = [
  {
    id: 'topic_1',
    name: 'Financial Literacy Basics',
    description: 'Learn the fundamentals of personal finance, budgeting, and money management.',
    order: 1,
    category: 'beginner',
    estimatedHours: 4,
    modules: [
      {
        id: 'module_1_1',
        title: 'Understanding Money',
        content: 'Introduction to money, currency, and basic financial concepts.',
        duration: 30,
        type: 'video'
      },
      {
        id: 'module_1_2',
        title: 'Budgeting Fundamentals',
        content: 'Learn how to create and maintain a personal budget.',
        duration: 45,
        type: 'interactive'
      }
    ]
  },
  {
    id: 'topic_2',
    name: 'Investment Strategies',
    description: 'Explore different investment options and strategies for building wealth.',
    order: 2,
    category: 'intermediate',
    estimatedHours: 6,
    modules: [
      {
        id: 'module_2_1',
        title: 'Stock Market Basics',
        content: 'Understanding stocks, bonds, and market fundamentals.',
        duration: 60,
        type: 'video'
      },
      {
        id: 'module_2_2',
        title: 'Portfolio Diversification',
        content: 'Learn how to build a diversified investment portfolio.',
        duration: 45,
        type: 'interactive'
      }
    ]
  },
  {
    id: 'topic_3',
    name: 'Retirement Planning',
    description: 'Plan for your future with comprehensive retirement strategies.',
    order: 3,
    category: 'advanced',
    estimatedHours: 5,
    modules: [
      {
        id: 'module_3_1',
        title: 'Retirement Accounts',
        content: 'Understanding 401(k), IRA, and other retirement vehicles.',
        duration: 50,
        type: 'video'
      },
      {
        id: 'module_3_2',
        title: 'Social Security',
        content: 'How Social Security works and when to claim benefits.',
        duration: 40,
        type: 'interactive'
      }
    ]
  }
];

// Sample community posts
const sampleCommunityPosts = [
  {
    id: 'post_1',
    userId: 'sample_user_1',
    userName: 'Sarah Johnson',
    title: 'My Journey to Financial Freedom',
    content: 'Started with $0 savings and now have a $50k emergency fund! Here\'s what worked for me...',
    likes: 24,
    comments: [
      {
        id: 'comment_1',
        userId: 'sample_user_2',
        userName: 'Mike Chen',
        content: 'Amazing progress! What was your biggest challenge?',
        timestamp: new Date()
      }
    ],
    createdAt: new Date()
  },
  {
    id: 'post_2',
    userId: 'sample_user_2',
    userName: 'Mike Chen',
    title: 'Investment Portfolio Review',
    content: 'Looking for feedback on my current portfolio allocation. 60% stocks, 30% bonds, 10% crypto...',
    likes: 12,
    comments: [],
    createdAt: new Date()
  }
];

// Sample admin data
const sampleAdminData = {
  totalUsers: 1250,
  activeUsers: 890,
  totalTopics: 15,
  averageProgress: 67,
  popularTopics: ['Financial Literacy Basics', 'Investment Strategies'],
  recentActivity: [
    {
      type: 'user_signup',
      message: 'New user registered: john.doe@email.com',
      timestamp: new Date()
    },
    {
      type: 'topic_completed',
      message: 'User completed: Financial Literacy Basics',
      timestamp: new Date()
    }
  ]
};

async function setupDatabase() {
  try {
    console.log('Setting up Firebase database...');

    // Add sample topics
    console.log('Adding sample topics...');
    for (const topic of sampleTopics) {
      await setDoc(doc(db, 'topics', topic.id), topic);
      console.log(`Added topic: ${topic.name}`);
    }

    // Add sample community posts
    console.log('Adding sample community posts...');
    for (const post of sampleCommunityPosts) {
      await setDoc(doc(db, 'communityPosts', post.id), post);
      console.log(`Added post: ${post.title}`);
    }

    // Add sample admin data
    console.log('Adding sample admin data...');
    await setDoc(doc(db, 'adminData', 'statistics'), sampleAdminData);
    console.log('Added admin statistics');

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 