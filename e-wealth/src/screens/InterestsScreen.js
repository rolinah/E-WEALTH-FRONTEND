import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { api } from '../services/api';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

const interests = [
  { name: 'Business', color: '#FFD600' }, // yellow
  { name: 'Sales', color: '#1A2EFF' },   // blue
  { name: 'Management', color: '#FF9900' }, // orange
  { name: 'Logistics', color: '#FFD600' },
  { name: 'Finance', color: '#1A2EFF' },
  { name: 'Entrepreneurship', color: '#FF9900' },
  { name: 'Marketing', color: '#FFD600' },
  { name: 'Leadership', color: '#1A2EFF' },
  { name: 'Strategy', color: '#FF9900' },
];

export default function InterestsScreen() {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const toggleInterest = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.updateProfile({ interests: selected });
      setMessage('Interests saved!');
      // Optionally, navigate to profile or another screen
      // router.push('/(tabs)/profile');
    } catch (e) {
      setMessage(e.message || 'Failed to save interests');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose your interests</Text>
      <Text style={styles.subtitle}>Select topics that excite you and help us personalize your experience.</Text>
      <View style={styles.chipContainer}>
        {interests.map((interest, idx) => {
          const isSelected = selected.includes(interest.name);
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.chip, isSelected && { backgroundColor: interest.color, borderColor: interest.color }]}
              activeOpacity={0.8}
              onPress={() => toggleInterest(interest.name)}
            >
              <Text style={[styles.chipText, isSelected && { color: '#222' }]}>{interest.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Interests'}</Text>
      </TouchableOpacity>
      {!!message && <Text style={styles.saveMessage}>{message}</Text>}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Why choosing your interests matters</Text>
        <Text style={styles.sectionDesc}>
          Selecting your interests helps us tailor content, recommendations, and networking opportunities to your professional goals. You can update your interests anytime in your profile settings.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#101A3D', // deep blue
    alignItems: 'center',
    padding: 32,
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
  subtitle: {
    fontSize: 16,
    color: '#E3E6F0',
    marginBottom: 28,
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 22,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 36,
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
    transition: 'all 0.2s',
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
    padding: 28,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.light.primary,
    textAlign: 'center',
  },
  sectionDesc: {
    fontSize: 15,
    color: '#E3E6F0',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 360,
  },
  saveButton: {
    backgroundColor: Colors.light.accent, // keep yellow for primary action
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveMessage: {
    color: Colors.light.accent,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },
}); 