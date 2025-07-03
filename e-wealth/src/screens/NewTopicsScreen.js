import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NewTopicsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Topics</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F8CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 