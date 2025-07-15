import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const badgeDefault = require('../assets/images/icon.png');

export default function TopicsDashboardScreen({ navigation }) {
  const [topics, setTopics] = useState([]);
  const [userTopics, setUserTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTopics();
    AsyncStorage.getItem('user').then(u => {
      console.log('[AuthContext] user in AsyncStorage:', u);
    });
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
      <View style={styles.videoPlaceholder}>
        <Text style={styles.placeholderText}>Motivational video will appear here</Text>
        <Text style={styles.placeholderSubtext}>Keep up the great work!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 12,
    color: '#222',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  badge: { width: 40, height: 40, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardDesc: { fontSize: 14, color: '#666', marginBottom: 8 },
  progressText: { fontSize: 12, color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center' },
  videoPlaceholder: { 
    width: '100%', 
    height: 180, 
    borderRadius: 12, 
    marginBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed'
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  }
}); 