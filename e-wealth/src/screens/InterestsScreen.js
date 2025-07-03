import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InterestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Interests</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
}); 