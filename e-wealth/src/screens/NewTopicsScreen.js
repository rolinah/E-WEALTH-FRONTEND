import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';

const newTopics = [
  { name: 'Sales Basics', image: require('../../assets/images/sales-topic.jpg'), desc: 'Learn the basics of sales in just 10 minutes.', video: require('../../assets/videos/sales-preview.mp4') },
  { name: 'Team Leadership', image: require('../../assets/images/leadership-topic.jpg'), desc: 'Lead your team to success.', video: require('../../assets/videos/leadership-preview.mp4') },
];

export default function NewTopicsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>New Topics</Text>
      {newTopics.map((topic, idx) => (
        <View key={idx} style={styles.card}>
          <Image source={topic.image} style={styles.cardImage} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{topic.name} <Text style={styles.newBadge}>NEW</Text></Text>
            <Text style={styles.cardDesc}>{topic.desc}</Text>
            <Video
              source={topic.video}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
            />
          </View>
        </View>
      ))}
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
  newBadge: { color: '#FFD600', fontWeight: 'bold', fontSize: 12 },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 8 },
  video: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
}); 