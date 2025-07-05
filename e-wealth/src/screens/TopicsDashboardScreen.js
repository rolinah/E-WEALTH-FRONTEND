import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { api } from '../services/api';

const badgeDefault = require('../assets/images/badge-streak.png');

export default function TopicsDashboardScreen({ navigation }) {
  const [topics, setTopics] = useState([]);
  const [userTopics, setUserTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const currentUser = api.getCurrentUser();
      if (!currentUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const [topicsData, userTopicsData] = await Promise.all([
        api.getTopics(),
        api.getUserTopics(currentUser.uid)
      ]);

      // Merge topics with user progress
      const topicsWithProgress = topicsData.map(topic => {
        const userTopic = userTopicsData.find(ut => ut.topicId === topic.id);
        return {
          ...topic,
          progress: userTopic ? userTopic.progress : 0,
          streak: userTopic ? userTopic.streak : 0
        };
      });

      setTopics(topicsWithProgress);
      setUserTopics(userTopicsData);
    } catch (err) {
      setError('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicPress = (topic) => {
    navigation.navigate('TopicDetails', { topic });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Topics Dashboard</Text>
      {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>}
      {topics.map((topic, idx) => (
        <TouchableOpacity 
          key={idx} 
          style={styles.card}
          onPress={() => handleTopicPress(topic)}
        >
          <Image source={badgeDefault} style={styles.badge} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{topic.name}</Text>
            <Text style={styles.cardDesc}>{topic.description || topic.desc}</Text>
            <Text style={styles.progressText}>
              Progress: {topic.progress || 0}% | Streak: {topic.streak || 0} days
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <Text style={styles.sectionTitle}>Stay Motivated!</Text>
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
  badge: { width: 40, height: 40, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 8 },
  progressText: { fontSize: 12, color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center' },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
}); 