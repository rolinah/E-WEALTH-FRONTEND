# E-Wealth Application

A comprehensive financial literacy and wealth-building mobile application built with React Native, Expo, and Firebase.

## Features

- **User Authentication**: Secure login/signup with Firebase Authentication
- **Learning Topics**: Interactive financial education modules
- **Progress Tracking**: Monitor your learning progress and streaks
- **Community**: Share experiences and learn from others
- **Profile Management**: Track balance, achievements, and personal stats
- **Admin Dashboard**: Analytics and user management (for administrators)

## Tech Stack

### Frontend
- React Native with Expo
- Firebase SDK for authentication and database
- React Navigation for routing
- Expo AV for video content

### Backend
- Express.js server
- Firebase Admin SDK
- RESTful API endpoints
- Rate limiting and security middleware

### Database
- Firebase Firestore (NoSQL)
- Real-time data synchronization
- Secure authentication and authorization

## Quick Start

### Prerequisites

1. Node.js (v16 or higher)
2. Expo CLI: `npm install -g expo-cli`
3. Firebase account
4. Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-wealth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Update `src/config/firebase.config.js` with your Firebase credentials

4. **Set up the backend (optional)**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

## Project Structure

```
e-wealth/
├── app/                    # Expo Router screens
├── src/
│   ├── screens/           # React Native screens
│   ├── services/          # API and Firebase services
│   ├── contexts/          # React contexts (Auth)
│   ├── config/            # Configuration files
│   └── navigation/        # Navigation setup
├── backend/               # Express.js server
├── scripts/               # Database setup scripts
└── assets/                # Images, videos, fonts
```

## Firebase Database Structure

### Collections

1. **users** - User profiles and preferences
2. **topics** - Learning modules and content
3. **userTopics** - User progress tracking
4. **communityPosts** - Community discussions
5. **adminData** - Analytics and admin statistics

### Security Rules

The application uses Firebase Security Rules to ensure data protection:

- Users can only access their own profile data
- Topics are readable by all authenticated users
- Community posts are readable by all, writable by authenticated users
- Admin data requires admin privileges

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Learning
- `GET /api/topics` - Get all topics with user progress
- `POST /api/topics/:id/progress` - Update topic progress

### Community
- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post

### Admin
- `GET /api/admin/stats` - Get admin statistics

## Environment Variables

### Frontend (.env)
```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Backend (.env)
```
PORT=3000
NODE_ENV=development
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
JWT_SECRET=your-jwt-secret
```

## Development

### Running the App

1. **Start Expo development server**
   ```bash
   npm start
   ```

2. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

### Backend Development

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **API will be available at**
   ```
   http://localhost:3000/api
   ```

### Database Setup

1. **Initialize with sample data**
   ```bash
   node scripts/setup-firebase.js
   ```

2. **View database in Firebase Console**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Navigate to Firestore Database

## Testing

### Frontend Testing
```bash
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

## Deployment

### Frontend (Expo)

1. **Build for production**
   ```bash
   expo build:android
   expo build:ios
   ```

2. **Publish to Expo**
   ```bash
   expo publish
   ```

### Backend

1. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## Security Considerations

- Firebase Security Rules protect data access
- Rate limiting prevents abuse
- Input validation on all endpoints
- HTTPS enforcement in production
- Regular security updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Firebase connection errors**
   - Verify Firebase configuration
   - Check network connectivity
   - Ensure Firebase project is active

2. **Authentication issues**
   - Verify Email/Password auth is enabled
   - Check Firebase Console for user accounts
   - Clear app cache and restart

3. **Database access denied**
   - Verify Firestore security rules
   - Check user authentication status
   - Ensure proper collection structure

### Debug Mode

Enable debug logging by setting environment variables:

```bash
EXPO_PUBLIC_DEBUG=true
```

## Support

- **Documentation**: [Firebase Setup Guide](./FIREBASE_SETUP.md)
- **Issues**: Create an issue in the repository
- **Firebase Support**: [Firebase Documentation](https://firebase.google.com/docs)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Firebase for backend services
- Expo for the development platform
- React Native community for tools and libraries
