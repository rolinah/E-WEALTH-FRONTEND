import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

function AuthGate() {
  const { isAuthenticated, loading } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFD600" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {isAuthenticated ? (
          <>
            {/* Main App Screens */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Learning Screens */}
            <Stack.Screen name="interests" options={{ title: 'Choose Interests' }} />
            <Stack.Screen name="topics-collection" options={{ title: 'Topics Collection' }} />
            <Stack.Screen name="topics-dashboard" options={{ title: 'Topics Dashboard' }} />
            <Stack.Screen name="new-topics" options={{ title: 'New Topics' }} />
            <Stack.Screen name="topic-details" options={{ title: 'Topic Details' }} />
            <Stack.Screen name="topic-list" options={{ title: 'Topic List' }} />
            <Stack.Screen name="module-viewer" options={{ title: 'Module Viewer' }} />
            <Stack.Screen name="quiz" options={{ title: 'Quiz' }} />
            {/* Other Screens */}
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </>
        ) : (
          <>
            {/* Authentication Screens Only */}
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
