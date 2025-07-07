import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function XPProgressBar({ xp = 0, maxXp = 100 }) {
  const percent = Math.min(100, Math.round((xp / maxXp) * 100));
  return (
    <View style={styles.container}>
      <Text style={styles.label}>XP Progress: {xp} / {maxXp}</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  label: { color: '#fff', fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  barBackground: {
    width: '100%',
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: 16,
    backgroundColor: '#FFD600',
    borderRadius: 8,
  },
}); 