# Firebase Setup Guide for E-Wealth Application

This guide will help you set up Firebase for your E-Wealth application, including authentication, database, and storage.

## Prerequisites

1. Node.js installed on your system
2. Firebase account (create one at https://firebase.google.com)
3. Expo CLI installed globally: `npm install -g expo-cli`

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "e-wealth-app" (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

## Step 4: Set Up Storage

1. In Firebase Console, go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location (same as Firestore)
5. Click "Done"

## Step 5: Get Firebase Configuration

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register app with name "E-Wealth Web"
6. Copy the firebaseConfig object

## Step 6: Update Firebase Configuration

1. Open `src/services/firebase.js`
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 7: Install Dependencies

Run the following command in your project directory:

```bash
cd e-wealth
npm install
```

## Step 8: Set Up Database with Sample Data

1. Update the Firebase config in `scripts/setup-firebase.js` with your actual config
2. Run the setup script:

```bash
node scripts/setup-firebase.js
```

This will create:
- Sample topics for learning
- Sample community posts
- Sample admin data

## Step 9: Configure Security Rules

### Firestore Security Rules

In Firebase Console, go to Firestore Database > Rules and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read topics
    match /topics/{topicId} {
      allow read: if request.auth != null;
    }
    
    // Users can read/write their own topic progress
    match /userTopics/{userTopicId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Users can read/write community posts
    match /communityPosts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Admin data - read only for authenticated users
    match /adminData/{docId} {
      allow read: if request.auth != null;
    }
  }
}
```

### Storage Security Rules

In Firebase Console, go to Storage > Rules and update with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload files to their own folder
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for app assets
    match /assets/{allPaths=**} {
      allow read: if true;
    }
  }
}
```

## Step 10: Test the Application

1. Start the development server:

```bash
npm start
```

2. Test the following features:
   - User registration and login
   - Profile creation and viewing
   - Topics loading and progress tracking
   - Community posts
   - File uploads (if implemented)

## Database Structure

### Collections

1. **users** - User profiles
   ```
   {
     uid: string,
     name: string,
     email: string,
     balance: number,
     streak: number,
     totalPoints: number,
     createdAt: timestamp
   }
   ```

2. **topics** - Learning topics
   ```
   {
     id: string,
     name: string,
     description: string,
     order: number,
     category: string,
     estimatedHours: number,
     modules: array
   }
   ```

3. **userTopics** - User progress on topics
   ```
   {
     userId: string,
     topicId: string,
     progress: number,
     streak: number,
     lastUpdated: timestamp
   }
   ```

4. **communityPosts** - Community discussions
   ```
   {
     userId: string,
     userName: string,
     title: string,
     content: string,
     likes: number,
     comments: array,
     createdAt: timestamp
   }
   ```

5. **adminData** - Admin statistics
   ```
   {
     totalUsers: number,
     activeUsers: number,
     totalTopics: number,
     averageProgress: number,
     popularTopics: array,
     recentActivity: array
   }
   ```

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check if Email/Password auth is enabled in Firebase Console
   - Verify Firebase config is correct
   - Check browser console for errors

2. **Database access denied**
   - Verify Firestore security rules
   - Check if user is authenticated
   - Ensure proper collection/document structure

3. **Storage upload fails**
   - Check Storage security rules
   - Verify file size limits
   - Check network connectivity

### Debug Mode

To enable debug logging, add this to your Firebase config:

```javascript
// In firebase.js
if (__DEV__) {
  console.log('Firebase initialized in debug mode');
}
```

## Production Considerations

1. **Security Rules**: Update rules for production with proper restrictions
2. **Environment Variables**: Use environment variables for Firebase config
3. **Error Handling**: Implement proper error handling and user feedback
4. **Performance**: Optimize queries and implement pagination
5. **Backup**: Set up regular database backups
6. **Monitoring**: Enable Firebase Analytics and Crashlytics

## Support

For Firebase-specific issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

For app-specific issues, check the console logs and ensure all dependencies are properly installed. 