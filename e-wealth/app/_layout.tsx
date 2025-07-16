import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import OnboardingScreen from './onboarding';
import WelcomeScreen from './welcome';

function AuthGate() {
  const { isAuthenticated, loading } = useAuth();

  // Debug logging
  console.log('AuthGate: isAuthenticated', isAuthenticated, 'loading', loading);

  if (loading) {
    // Show a splash/loading screen while checking auth state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F6FA' }}>
        <ActivityIndicator size="large" color="#FFD600" />
      </View>
    );
  }

  // Only show login/signup if not authenticated
  if (!isAuthenticated) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
      </Stack>
    );
  }

  // Authenticated: show main app tabs (dashboard)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate />
      <Toast />
    </AuthProvider>
  );
}
