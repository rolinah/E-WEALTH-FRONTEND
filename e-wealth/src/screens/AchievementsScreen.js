import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Badge from '../components/Badge';
import XPProgressBar from '../components/XPProgressBar';
import { Colors } from '../../constants/Colors';

// Mock data for demonstration
const mockStreak = 7;
const mockXP = 320;
const mockXPGoal = 500;
const mockBadges = [
  { id: 1, name: 'First Module', description: 'Completed your first module!' },
  { id: 2, name: 'Quiz Master', description: 'Scored 100% on a quiz!' },
  { id: 3, name: 'Streak Starter', description: '3-day learning streak!' },
];

export default function AchievementsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <Text style={styles.subtitle}>Track your progress and celebrate your learning milestones!</Text>
      {/* Streak */}
      <View style={styles.streakBox}>
        <Text style={styles.streakLabel}>Current Streak</Text>
        <Text style={styles.streakValue}>{mockStreak} days 🔥</Text>
      </View>
      {/* XP Progress */}
      <View style={styles.xpBox}>
        <Text style={styles.xpLabel}>XP Progress</Text>
        <XPProgressBar xp={mockXP} goal={mockXPGoal} />
        <Text style={styles.xpText}>{mockXP} / {mockXPGoal} XP</Text>
      </View>
      {/* Badges */}
      <View style={styles.badgesBox}>
        <Text style={styles.badgesLabel}>Badges</Text>
        <View style={styles.badgesList}>
          {mockBadges.map(badge => (
            <Badge key={badge.id} name={badge.name} description={badge.description} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  streakBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    width: '100%',
  },
  streakLabel: {
    fontSize: 16,
    color: Colors.light.secondary,
    marginBottom: 4,
  },
  streakValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.accent,
  },
  xpBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    width: '100%',
  },
  xpLabel: {
    fontSize: 16,
    color: Colors.light.secondary,
    marginBottom: 4,
  },
  xpText: {
    fontSize: 15,
    color: Colors.light.text,
    marginTop: 8,
  },
  badgesBox: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    width: '100%',
  },
  badgesLabel: {
    fontSize: 16,
    color: Colors.light.secondary,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
}); 