// PeerMentoringScreen.js
// Screen for connecting users with top-performing peers for mentoring.
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';

const mentors = [
  { name: 'Jane Doe', expertise: 'Finance' },
  { name: 'John Smith', expertise: 'Leadership' },
  { name: 'Alice Johnson', expertise: 'Marketing' },
  { name: 'Bob Lee', expertise: 'Strategy' },
];

export default function PeerMentoringScreen() {
  const [selected, setSelected] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Peer Mentoring</Text>
      <Text style={styles.subtitle}>Connect with mentors and peers to accelerate your learning.</Text>
      <View style={styles.cardList}>
        {mentors.map((mentor, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.mentorCard, selected === idx && { borderColor: Colors.light.accent, borderWidth: 2 }]}
            onPress={() => setSelected(idx)}
          >
            <Text style={styles.mentorName}>{mentor.name}</Text>
            <Text style={styles.mentorExpertise}>{mentor.expertise}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>How Peer Mentoring Works</Text>
        <Text style={styles.sectionDesc}>
          Tap a mentor to view their profile and request a session. Peer mentoring helps you learn from others and share your own expertise.
        </Text>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 28,
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 22,
  },
  cardList: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  mentorCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    width: '100%',
    maxWidth: 420,
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  mentorName: {
    fontWeight: 'bold',
    color: Colors.light.text,
    fontSize: 16,
    marginBottom: 4,
  },
  mentorExpertise: {
    color: Colors.light.accent,
    fontSize: 14,
    fontWeight: '600',
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
  },
}); 