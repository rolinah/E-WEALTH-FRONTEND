import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { Colors } from '../../constants/Colors';

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getCommunity();
        setPosts(data);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.light.accent} /></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.subtitle}>See what others are sharing and join the conversation.</Text>
      <View style={styles.cardList}>
        {posts.map((post, idx) => (
          <View key={post.id || idx} style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
            <Text style={styles.postAuthor}>By {post.author || 'Anonymous'}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
    minHeight: '100%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 28,
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 22,
  },
  cardList: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  postCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    width: '100%',
    maxWidth: 420,
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  postTitle: {
    fontWeight: 'bold',
    color: Colors.light.text,
    fontSize: 16,
    marginBottom: 4,
  },
  postContent: {
    color: Colors.light.text,
    fontSize: 14,
    marginBottom: 8,
  },
  postAuthor: {
    color: Colors.light.accent,
    fontSize: 13,
    fontWeight: '600',
  },
}); 