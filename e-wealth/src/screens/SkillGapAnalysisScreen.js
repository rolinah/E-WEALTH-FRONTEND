// SkillGapAnalysisScreen.js
// Screen for analyzing quiz results and recommending modules based on user performance.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SkillGapAnalysisScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skill Gap Analysis (Coming Soon)</Text>
      <View style={styles.card}>
        <Text>This section will display your skill gaps and recommended modules.</Text>
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