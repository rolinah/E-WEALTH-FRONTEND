import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';

const topics = [
  { name: 'Sales Topic', progress: 80, streak: 5, badge: require('../../assets/images/badge-streak.png'), desc: 'Introduction to Sales' },
  { name: 'Management Topic', progress: 60, streak: 3, badge: require('../../assets/images/badge-streak.png'), desc: 'How to manage teams' },
];

export default function TopicsDashboardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Topics Dashboard</Text>
      {topics.map((topic, idx) => (
        <View key={idx} style={styles.card}>
          <Image source={topic.badge} style={styles.badge} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{topic.name}</Text>
            <Text style={styles.cardDesc}>{topic.desc}</Text>
            <Text style={styles.progressText}>Progress: {topic.progress}% | Streak: {topic.streak} days</Text>
          </View>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Stay Motivated!</Text>
      <Video
        source={require('../../assets/videos/motivation.mp4')}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#4F8CFF',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 2,
  },
  badge: { width: 40, height: 40, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 8 },
  progressText: { fontSize: 12, color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center' },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
}); 