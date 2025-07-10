import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />, 
        }}
      />
      <Tabs.Screen
        name="topics-collection"
        options={{
          title: 'Topics',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="book.fill" color={color} />, 
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Achievements',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="trophy.fill" color={color} />, 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />, 
        }}
      />
    </Tabs>
  );
}
