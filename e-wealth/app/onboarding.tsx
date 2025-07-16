import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { interests as allInterests } from '../src/screens/InterestsScreen';
import { useAuth } from '../src/contexts/AuthContext';
import { api } from '../src/services/api';

export default function OnboardingScreen() {
  const { user, signOut } = useAuth();
  const [selected, setSelected] = useState<string[]>(Array.isArray(user?.interests) ? user.interests : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleInterest = (name: string) => {
    if (selected.includes(name)) {
      setSelected((prev) => prev.filter((n) => n !== name));
    } else if (selected.length < 2) {
      setSelected((prev) => [...prev, name]);
    }
  };

  const saveInterests = async () => {
    setLoading(true);
    setError('');
    try {
      await api.updateProfile({ interests: selected });
      // Optionally reload user profile here if needed
    } catch (e) {
      setError('Failed to save interests.');
    } finally {
      setLoading(false);
    }
  };

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
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveInterests}
        disabled={selected.length < 2 || loading}
      >
        <Text style={styles.saveButtonText}>{loading ? 'Saving...' : selected.length < 2 ? 'Select 2 Interests' : 'Save Interests'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={signOut}
        disabled={loading}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#101A3D',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    minHeight: '100%',
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
  saveButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#222',
    fontWeight: '700',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: Colors.light.primary,
    fontWeight: '700',
    fontSize: 15,
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
  sectionDesc: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },
}); 