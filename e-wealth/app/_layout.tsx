import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { ActivityIndicator, View, Text, Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter, useSegments } from 'expo-router';
import React from 'react';

function AppBrandBar() {
  return (
    <View style={{
      width: '100%',
      backgroundColor: '#fff',
      paddingTop: Platform.OS === 'ios' ? 54 : 32,
      paddingBottom: 16,
      alignItems: 'center',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      elevation: 4,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 6,
    }}>
      <Text style={{
        color: '#1A2EFF',
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed',
        marginBottom: 2,
      }}>E-Wealth</Text>
      <View style={{
        width: 48,
        height: 5,
        backgroundColor: '#FFD600',
        borderRadius: 3,
        marginTop: 6,
      }} />
    </View>
  );
}

function AuthGate() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  // Determine if we are on the Home page (/(tabs)/index)
  const isHome = segments[0] === '(tabs)' && segments.length === 1;

  // Restrict admin screens to admins only
  React.useEffect(() => {
    if (
      isAuthenticated &&
      !isAdmin &&
      [
        '/admin-content-manager',
        '/admin-analytics',
        '/(tabs)/admin',
      ].includes(router.asPath)
    ) {
      router.replace('/');
    }
  }, [isAuthenticated, isAdmin, router.asPath]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F6FA' }}>
        <ActivityIndicator size="large" color="#FFD600" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
        <StatusBar style="dark" backgroundColor="#1A2EFF" />
        {/* Only show AppBrandBar if not on Home page */}
        {!isHome && <AppBrandBar />}
        <View style={{
          flex: 1,
          marginTop: 18,
          marginHorizontal: 0,
          backgroundColor: '#fff',
          borderRadius: 18,
          marginBottom: 0,
          elevation: 2,
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowRadius: 8,
          overflow: 'hidden',
        }}>
          <Stack screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <>
                {/* Main App Screens */}
                <Stack.Screen name="(tabs)" />
                {/* Learning Screens */}
                <Stack.Screen name="interests" options={{ title: 'Choose Interests' }} />
                <Stack.Screen name="topics-collection" options={{ title: 'Topics Collection' }} />
                <Stack.Screen name="topics-dashboard" options={{ title: 'Topics Dashboard' }} />
                <Stack.Screen name="topic-details" options={{ title: 'Topic Details' }} />
                <Stack.Screen name="topic-list" options={{ title: 'Topic List' }} />
                <Stack.Screen name="module-viewer" options={{ title: 'Module Viewer' }} />
                <Stack.Screen name="quiz" options={{ title: 'Quiz' }} />
                {/* New Feature Screens */}
                <Stack.Screen name="skill-gap-analysis" options={{ title: 'Skill Gap Analysis' }} />
                <Stack.Screen name="progress-dashboard" options={{ title: 'Progress Dashboard' }} />
                <Stack.Screen name="forum" options={{ title: 'Forum' }} />
                <Stack.Screen name="peer-mentoring" options={{ title: 'Peer Mentoring' }} />
                {/* Admin Screens - only show if admin */}
                {isAdmin && <Stack.Screen name="admin-content-manager" options={{ title: 'Admin Content Manager' }} />}
                {isAdmin && <Stack.Screen name="admin-analytics" options={{ title: 'Admin Analytics' }} />}
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
        </View>
      </View>
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
