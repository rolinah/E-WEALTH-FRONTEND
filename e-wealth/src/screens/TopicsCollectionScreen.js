import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { api } from '../services/api';
import { Colors } from '../../constants/Colors';

export default function TopicsCollectionScreen() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getTopics();
        setTopics(data);
      } catch (e) {
        setError('Failed to load topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.light.accent} accessibilityLabel="Loading topics" /></View>;
  }

  if (error) {
    return <View style={styles.loading}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Topics Collection</Text>
      <Text style={styles.subtitle}>Ready to Learn?</Text>
      <View style={styles.cardList}>
        {topics.length === 0 ? (
          <Text style={styles.emptyText}>No topics available yet. Please check back soon!</Text>
        ) : (
          topics.map((topic, idx) => (
            <View key={topic.id || idx} style={styles.card} accessible accessibilityLabel={`Topic: ${topic.title}`}>
              {topic.videoURL ? (
                <Video
                  source={{ uri: topic.videoURL }}
                  style={styles.cardVideo}
                  useNativeControls
                  resizeMode="contain"
                  accessibilityLabel={`Video for ${topic.title}`}
                />
              ) : null}
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{topic.title}</Text>
                <Text style={styles.cardDesc}>{topic.description}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    padding: 24,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    color: Colors.light.icon,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 12,
    color: Colors.light.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 20,
    textAlign: 'center',
  },
  cardList: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    marginBottom: 20,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardVideo: { width: 80, height: 60, borderRadius: 8, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.light.text, marginBottom: 4 },
  cardDesc: { fontSize: 14, color: Colors.light.icon },
}); 