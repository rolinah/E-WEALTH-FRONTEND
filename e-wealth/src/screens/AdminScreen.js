import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export default function AdminScreen() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getAdminData()
      .then(data => {
        setAdminData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load admin data');
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>}
      {adminData && (
        <View style={styles.statsBox}>
          <Text style={styles.statsTitle}>Admin Stats</Text>
          <Text>Total Users: {adminData.totalUsers}</Text>
          <Text>Active Users: {adminData.activeUsers}</Text>
          <Text>Topics Created: {adminData.topicsCreated}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8F5FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsBox: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
}); 