// PeerMentoringScreen.js
// Screen for connecting users with top-performing peers for mentoring.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PeerMentoringScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Peer Mentoring (Coming Soon)</Text>
      <View style={styles.card}>
        <Text>This feature is under development. We'll be adding peer mentoring functionality soon.</Text>
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Learn More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 12,
    color: '#222',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  button: {
    backgroundColor: '#4F8CFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 