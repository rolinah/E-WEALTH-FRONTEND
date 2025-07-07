import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { getTopics } from '../services/firebase';

export default function TopicsCollectionScreen() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color="#FFD600" /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Topics Collection</Text>
      <Text style={styles.subtitle}>Ready to Learn?</Text>
      <View style={styles.cardList}>
        {topics.map((topic, idx) => (
          <View key={topic.id || idx} style={styles.card}>
            {topic.videoURL ? (
              <Video
                source={{ uri: topic.videoURL }}
                style={styles.cardVideo}
                useNativeControls
                resizeMode="contain"
              />
            ) : null}
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{topic.title}</Text>
              <Text style={styles.cardDesc}>{topic.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1A2EFF',
    alignItems: 'center',
    padding: 24,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A2EFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 12,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardList: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardVideo: { width: 80, height: 60, borderRadius: 8, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#666' },
}); 