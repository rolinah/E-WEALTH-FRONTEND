import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { Video } from 'expo-av';
import { auth } from '../services/firebase';

const topics = [
  { name: 'Business Finances', image: require('../assets/images/business-finances.jpg'), desc: 'Understand the basics of business finance.' },
  { name: 'Startup Management', image: require('../assets/images/startup-management.jpg'), desc: 'Master the art of launching startups.' },
];

export default function TopicsCollectionScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Topics Collection</Text>
      {topics.map((topic, idx) => (
        <View key={idx} style={styles.card}>
          <Image source={topic.image} style={styles.cardImage} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{topic.name}</Text>
            <Text style={styles.cardDesc}>{topic.desc}</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar} />
              <Text style={styles.progressText}>Progress: 40%</Text>
            </View>
          </View>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Watch Intro Video</Text>
      <Video
        source={require('../assets/videos/community-welcome.mp4')}
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
  cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 8 },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  progressBar: { width: 60, height: 8, backgroundColor: '#FFD600', borderRadius: 4, marginRight: 8 },
  progressText: { fontSize: 12, color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center' },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
}); 