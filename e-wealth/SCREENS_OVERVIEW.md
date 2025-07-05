# E-Wealth Application Screens Overview

This document provides a comprehensive overview of all screens in the E-Wealth application, their functionality, and navigation paths.

## Authentication Screens

### 1. Login Screen (`/auth/login`)
- **File**: `src/screens/LoginScreen.js`
- **Route**: `app/auth/login.tsx`
- **Functionality**: 
  - Email and password authentication
  - Firebase integration
  - Navigation to signup
  - Error handling and loading states
- **Navigation**: 
  - → Sign Up
  - → Main App (after successful login)

### 2. Sign Up Screen (`/auth/signup`)
- **File**: `src/screens/SignUpScreen.js`
- **Route**: `app/auth/signup.tsx`
- **Functionality**:
  - User registration with email/password
  - Profile creation in Firebase
  - Form validation
  - Navigation to login
- **Navigation**:
  - → Login
  - → Main App (after successful signup)

## Main App Screens (Tab Navigation)

### 3. Home Screen (`/(tabs)/index`)
- **File**: `src/screens/HomeScreen.js`
- **Route**: `app/(tabs)/index.tsx`
- **Functionality**:
  - Dashboard with user stats
  - Quick action buttons
  - Featured video content
  - Navigation to other screens
- **Navigation**:
  - → Topics Dashboard
  - → New Topics
  - → Topic List
  - → Interests
  - → Topics Collection

### 4. Profile Screen (`/(tabs)/profile`)
- **File**: `src/screens/ProfileScreen.js`
- **Route**: `app/(tabs)/profile.tsx`
- **Functionality**:
  - User profile display
  - Balance and streak tracking
  - Gallery and badges
  - Logout functionality
- **Navigation**:
  - → Logout (returns to auth)

### 5. Community Screen (`/(tabs)/community`)
- **File**: `src/screens/CommunityScreen.js`
- **Route**: `app/(tabs)/community.tsx`
- **Functionality**:
  - Community posts display
  - Social interactions
  - Learning from others
- **Navigation**:
  - → Create new post
  - → View post details

### 6. Settings Screen (`/(tabs)/settings`)
- **File**: `src/screens/SettingsScreen.js`
- **Route**: `app/(tabs)/settings.tsx`
- **Functionality**:
  - App settings
  - User preferences
  - Account management
- **Navigation**:
  - → Profile
  - → Logout

### 7. Admin Screen (`/(tabs)/admin`)
- **File**: `src/screens/AdminScreen.js`
- **Route**: `app/(tabs)/admin.tsx`
- **Functionality**:
  - Admin dashboard
  - User analytics
  - Content management
  - System statistics
- **Navigation**:
  - → User management
  - → Content editing

## Learning Screens

### 8. Interests Screen (`/interests`)
- **File**: `src/screens/InterestsScreen.js`
- **Route**: `app/interests.tsx`
- **Functionality**:
  - Interest selection
  - Personalized learning path
  - Topic recommendations
- **Navigation**:
  - → Topics Collection
  - → Home

### 9. Topics Collection Screen (`/topics-collection`)
- **File**: `src/screens/TopicsCollectionScreen.js`
- **Route**: `app/topics-collection.tsx`
- **Functionality**:
  - Browse all topics
  - Topic categories
  - Search and filter
- **Navigation**:
  - → Topic Details
  - → Topics Dashboard

### 10. Topics Dashboard Screen (`/topics-dashboard`)
- **File**: `src/screens/TopicsDashboardScreen.js`
- **Route**: `app/topics-dashboard.tsx`
- **Functionality**:
  - User progress tracking
  - Topic completion status
  - Learning streaks
  - Firebase integration
- **Navigation**:
  - → Topic Details
  - → Module Viewer

### 11. New Topics Screen (`/new-topics`)
- **File**: `src/screens/NewTopicsScreen.js`
- **Route**: `app/new-topics.tsx`
- **Functionality**:
  - Latest topics
  - Featured content
  - New releases
- **Navigation**:
  - → Topic Details
  - → Module Viewer

### 12. Topic Details Screen (`/topic-details`)
- **File**: `src/screens/TopicDetailsScreen.js`
- **Route**: `app/topic-details.tsx`
- **Functionality**:
  - Detailed topic information
  - Module listing
  - Progress tracking
  - Quiz access
- **Navigation**:
  - → Module Viewer
  - → Quiz
  - → Back to Topics

### 13. Topic List Screen (`/topic-list`)
- **File**: `src/screens/TopicListScreen.js`
- **Route**: `app/topic-list.tsx`
- **Functionality**:
  - Complete topic catalog
  - Search functionality
  - Category filtering
  - Firebase data integration
- **Navigation**:
  - → Topic Details
  - → Back to Home

### 14. Module Viewer Screen (`/module-viewer`)
- **File**: `src/screens/ModuleViewerScreen.js`
- **Route**: `app/module-viewer.tsx`
- **Functionality**:
  - Interactive learning modules
  - Step-by-step progression
  - Video content
  - Progress tracking
- **Navigation**:
  - → Next step
  - → Complete module
  - → Back to Topic Details

### 15. Quiz Screen (`/quiz`)
- **File**: `src/screens/QuizScreen.js`
- **Route**: `app/quiz.tsx`
- **Functionality**:
  - Interactive quizzes
  - Multiple choice questions
  - Score tracking
  - Results display
- **Navigation**:
  - → Retake quiz
  - → Back to Topic Details

## Other Screens

### 16. Splash Screen (`/splash`)
- **File**: `src/screens/SplashScreen.js`
- **Route**: `app/splash.tsx`
- **Functionality**:
  - App loading screen
  - Authentication check
  - Initial setup
- **Navigation**:
  - → Login (if not authenticated)
  - → Main App (if authenticated)

## Navigation Structure

```
App Root
├── Authentication
│   ├── Login (/auth/login)
│   └── Sign Up (/auth/signup)
├── Main App (Tabs)
│   ├── Home (/(tabs)/index)
│   ├── Profile (/(tabs)/profile)
│   ├── Community (/(tabs)/community)
│   ├── Settings (/(tabs)/settings)
│   └── Admin (/(tabs)/admin)
├── Learning Screens
│   ├── Interests (/interests)
│   ├── Topics Collection (/topics-collection)
│   ├── Topics Dashboard (/topics-dashboard)
│   ├── New Topics (/new-topics)
│   ├── Topic Details (/topic-details)
│   ├── Topic List (/topic-list)
│   ├── Module Viewer (/module-viewer)
│   └── Quiz (/quiz)
└── Other
    └── Splash (/splash)
```

## Screen Features

### Authentication Features
- ✅ Firebase Authentication
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Navigation between auth screens

### Learning Features
- ✅ Topic browsing and selection
- ✅ Progress tracking
- ✅ Interactive modules
- ✅ Quiz functionality
- ✅ Video content support
- ✅ Firebase data integration

### User Features
- ✅ Profile management
- ✅ Community interactions
- ✅ Settings and preferences
- ✅ Admin dashboard
- ✅ Logout functionality

### Navigation Features
- ✅ Tab navigation
- ✅ Stack navigation
- ✅ Deep linking support
- ✅ Navigation helper utilities
- ✅ Back button handling

## Firebase Integration

All screens are integrated with Firebase for:
- User authentication
- Data persistence
- Real-time updates
- Progress tracking
- Community features

## Development Notes

1. **Screen Components**: All screens are implemented as React Native components
2. **Navigation**: Uses Expo Router for file-based routing
3. **State Management**: Uses React Context for authentication state
4. **Styling**: Consistent design system with blue/yellow theme
5. **Error Handling**: Comprehensive error states and loading indicators
6. **Accessibility**: Basic accessibility features implemented

## Testing Screens

To test all screens:

1. **Start the app**: `npm start`
2. **Navigate through tabs**: Use bottom tab navigation
3. **Test authentication**: Try login/signup flows
4. **Test learning flow**: 
   - Home → Topics Dashboard → Topic Details → Module Viewer → Quiz
5. **Test community**: Navigate to Community tab
6. **Test settings**: Check Profile and Settings tabs

All screens are now fully functional and integrated with the Firebase backend! 