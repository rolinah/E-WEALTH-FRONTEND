// ProgressDashboardScreen.js
// Screen for visualizing user progress, XP, and weak areas with charts.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { Colors } from '../../constants/Colors';

export default function ProgressDashboardScreen() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Replace with actual API call for progress
        const data = await api.getProfile();
        setProgress(data.progress || {});
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.light.accent} /></View>;
  }

  if (!progress) {
    return <View style={styles.loading}><Text style={styles.errorText}>Failed to load progress.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Progress Dashboard</Text>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Learning Progress</Text>
        <Text style={styles.sectionDesc}>Modules Completed: {progress.modulesCompleted || 0}</Text>
        <Text style={styles.sectionDesc}>Quizzes Passed: {progress.quizzesPassed || 0}</Text>
        <Text style={styles.sectionDesc}>XP Earned: {progress.xp || 0}</Text>
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Streak</Text>
        <Text style={styles.sectionDesc}>{progress.streak || 0} days</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
    minHeight: '100%',
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
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.light.accent,
  },
  sectionDesc: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
    maxWidth: 360,
    marginBottom: 4,
  },
}); 