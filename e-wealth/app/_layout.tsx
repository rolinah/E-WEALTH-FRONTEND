import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../src/contexts/AuthContext';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Authentication Screens */}
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          
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
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
