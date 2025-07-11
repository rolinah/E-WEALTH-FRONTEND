import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Badge from '../components/Badge';
import XPProgressBar from '../components/XPProgressBar';
import { Colors } from '../../constants/Colors';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function AchievementsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [badges, setBadges] = useState([]);
  const [xp, setXP] = useState(0);
  const [xpGoal, setXPGoal] = useState(500);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch progress (XP, streak)
        const progressData = await api.getUserProgress();
        setXP(progressData.xp || 0);
        setStreak(progressData.streak || 0);
        // Optionally, set XP goal dynamically if available
        if (progressData.xpGoal) setXPGoal(progressData.xpGoal);
        // Fetch badges
        if (user && user.id) {
          const badgesData = await api.getUserBadges(user.id);
          setBadges(badgesData);
        }
      } catch (e) {
        setError(e.message || 'Failed to load achievements');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.light.accent} /></View>;
  }
  if (error) {
    return <View style={styles.loading}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <Text style={styles.subtitle}>Track your progress and celebrate your learning milestones!</Text>
      {/* Streak */}
      <View style={styles.streakBox}>
        <Text style={styles.streakLabel}>Current Streak</Text>
        <Text style={styles.streakValue}>{streak} days 🔥</Text>
      </View>
      {/* XP Progress */}
      <View style={styles.xpBox}>
        <Text style={styles.xpLabel}>XP Progress</Text>
        <XPProgressBar xp={xp} goal={xpGoal} />
        <Text style={styles.xpText}>{xp} / {xpGoal} XP</Text>
      </View>
      {/* Badges */}
      <View style={styles.badgesBox}>
        <Text style={styles.badgesLabel}>Badges</Text>
        <View style={styles.badgesList}>
          {badges.length === 0 ? (
            <Text style={styles.xpText}>No badges yet.</Text>
          ) : (
            badges.map(badge => (
              <Badge key={badge.id} name={badge.name} description={badge.description || ''} />
            ))
          )}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: 'bold',
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