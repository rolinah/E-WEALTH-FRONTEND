import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '../../src/contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { isAdmin } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.icon,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View style={{ backgroundColor: theme.surface, borderTopColor: theme.accent, borderTopWidth: 1, flex: 1 }} />
        ),
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: theme.surface,
            borderTopColor: theme.accent,
            borderTopWidth: 1,
            height: 64,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
          },
          default: {
            backgroundColor: theme.surface,
            borderTopColor: theme.accent,
            borderTopWidth: 1,
            height: 64,
            elevation: 8,
          },
        }),
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
          letterSpacing: 0.5,
        },
      }}
    >
      {/* Strict role-based tabs: admin vs user */}
      {isAdmin ? (
        <>
          <Tabs.Screen
            name="admin-analytics"
            options={{
              title: 'Analysis',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />, // Use a chart icon for analytics
              headerShown: true,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />, 
              headerShown: true,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
              headerShown: true,
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />, 
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="topics-collection"
            options={{
              title: 'Topics',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />, 
              headerShown: true,
            }}
          />
          <Tabs.Screen
            name="achievements"
            options={{
              title: 'Achievements',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="bubble.left.and.bubble.right.fill" color={color} />, 
              headerShown: true,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />, 
              headerShown: true,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
              headerShown: true,
            }}
          />
        </>
      )}
      {/* Future: add instructor role, onboarding tab, etc. here */}
    </Tabs>
  );
}
