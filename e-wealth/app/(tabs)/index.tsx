import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';
import { interests as allInterests } from '../../src/screens/InterestsScreen';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/services/api';

interface Achievement {
  icon?: string;
  name: string;
}
interface Progress {
  xp: number;
  xpGoal?: number;
  streak?: number;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const profile = await api.getProfile();
        setSelected(Array.isArray(profile.interests) ? profile.interests : []);
        // Fetch achievements and progress
        const ach = await api.getUserBadges(profile.id);
        setAchievements(Array.isArray(ach) ? ach : []);
        const prog = await api.getUserProgress();
        setProgress(prog || null);
      } catch (e) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleInterest = (name: string) => {
    if (selected.includes(name)) {
      setSelected((prev) => prev.filter((n) => n !== name));
    } else if (selected.length < 2) {
      setSelected((prev) => [...prev, name]);
    }
  };

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.light.accent} /></View>;
  }

  // If user has not selected 2 interests, block all other content and show only interest selection UI
  if (selected.length < 2) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
        <Text style={styles.sectionTitle}>Choose your interests</Text>
        <Text style={styles.sectionDesc}>
          Select <Text style={{ fontWeight: 'bold', color: Colors.light.accent }}>2 topics</Text> that excite you to personalize your learning journey. You can update these anytime in your profile.
        </Text>
        <View style={styles.chipContainer}>
          {allInterests.map((interest: { name: string; color: string }, idx: number) => {
            const isSelected = selected.includes(interest.name);
            const isDisabled = !isSelected && selected.length >= 2;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.chip, isSelected && { backgroundColor: interest.color, borderColor: interest.color }, isDisabled && { opacity: 0.5 }]}
                activeOpacity={0.8}
                onPress={() => toggleInterest(interest.name)}
                disabled={isDisabled}
              >
                <Text style={[styles.chipText, isSelected && { color: '#222' }]}>{interest.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={{ color: Colors.light.accent, marginBottom: 12, marginTop: 8 }}>
          {selected.length === 0
            ? 'Please select your first interest.'
            : 'Select one more interest to continue.'}
        </Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            // Save interests and reload (simulate API call)
            api.updateProfile({ interests: selected }).then(() => {
              // Optionally reload or refetch profile
              setLoading(true);
              api.getProfile().then(profile => {
                setSelected(Array.isArray(profile.interests) ? profile.interests : []);
                setLoading(false);
              });
            });
          }}
          disabled={selected.length < 2}
        >
          <Text style={styles.saveButtonText}>{selected.length < 2 ? 'Select 2 Interests' : 'Save Interests'}</Text>
        </TouchableOpacity>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Why choose interests?</Text>
          <Text style={styles.sectionDesc}>
            Your interests help us recommend the best courses, modules, and networking opportunities for you. You can always update them later in your profile.
          </Text>
        </View>
      </ScrollView>
    );
  }

  // After 2 interests are selected, show achievements and progress
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
      <Text style={styles.sectionTitle}>Your personalized dashboard</Text>
      <TouchableOpacity
        style={styles.editInterestsBtn}
        onPress={() => {
          // Navigate to interests screen
          // You may need to use router.push if using expo-router
          // For now, just reload interests
          setLoading(true);
          api.getProfile().then(profile => {
            setSelected(Array.isArray(profile.interests) ? profile.interests : []);
            setLoading(false);
          });
        }}
      >
        <Text style={styles.editInterestsBtnText}>Update Interests</Text>
      </TouchableOpacity>
      {/* Achievements Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.length === 0 ? (
          <Text style={{ color: '#888' }}>No achievements yet.</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {achievements.map((badge: Achievement, idx: number) => (
              <View key={idx} style={styles.badge}>
                <Text style={{ fontSize: 24 }}>{badge.icon || '🏅'}</Text>
                <Text style={styles.badgeText}>{badge.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      {/* Progress Section */}
      {progress && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Course Progress</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(100, (progress.xp / (progress.xpGoal || 500)) * 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.xp} XP / {progress.xpGoal || 500} XP</Text>
          <Text style={styles.progressText}>Streak: {progress.streak || 0} days</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#101A3D',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    minHeight: '100%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101A3D',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 420,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 10,
    paddingHorizontal: 22,
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  chipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.1,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 10,
    margin: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  badgeText: {
    color: Colors.light.primary,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  progressBarBg: {
    width: '100%',
    height: 18,
    backgroundColor: '#eee',
    borderRadius: 9,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.accent,
    borderRadius: 9,
  },
  progressText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  editInterestsBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editInterestsBtnText: {
    color: Colors.light.accent,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  sectionDesc: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});
