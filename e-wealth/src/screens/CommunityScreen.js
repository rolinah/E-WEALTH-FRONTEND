import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { api } from '../services/api';

const defaultAvatar = require('../assets/images/icon.png');

export default function CommunityScreen() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCommunity()
      .then(data => {
        setChats(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load community feed');
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.sectionTitle}>Featured Video</Text>
      <Video
        source={require('../assets/videos/community-welcome.mp4')}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
      />
      <Text style={styles.sectionTitle}>Chats</Text>
      {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>}
      {chats.map((chat, idx) => (
        <View key={idx} style={styles.chatRow}>
          <Image source={chat.avatar ? { uri: chat.avatar } : defaultAvatar} style={styles.avatar} />
          <View style={styles.chatBubble}>
            <Text style={styles.userName}>{chat.user}</Text>
            <Text style={styles.message}>{chat.message}</Text>
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center' },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
  chatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, width: '100%', maxWidth: 350 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  chatBubble: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flex: 1 },
  userName: { fontWeight: 'bold', color: '#222' },
  message: { color: '#333' },
}); 