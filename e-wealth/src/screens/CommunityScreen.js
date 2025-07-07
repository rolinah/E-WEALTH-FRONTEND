import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';

import { api } from '../services/api';
import XPProgressBar from '../components/XPProgressBar';
import Badge from '../components/Badge';
import { useAuth } from '../contexts/AuthContext';

const defaultAvatar = require('../assets/images/icon.png');

export default function CommunityScreen() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gamification state (should be fetched and updated in real-time)
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [maxXp, setMaxXp] = useState(500);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Fetch community chats
    api.getCommunity()
      .then(data => {
        setChats(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load community feed');
        setLoading(false);
      });
    // Fetch gamification data (XP, streak, badges) for the user
    if (user) {
      api.getProfile().then(profile => {
        setXp(profile.xp || 0);
        setStreak(profile.streak || 0);
        setBadges(profile.badges || []);
      });
    }
  }, [user]);

  // Example: Call this when user completes a module or logs in for a new day
  // setXp(xp + 10); setStreak(streak + 1); setBadges([...badges, { label: 'New Badge' }]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Community</Text>

      {/* Gamification Section */}
      <View style={styles.gamificationSection}>
        <Text style={styles.streakText}>🔥 Streak: {streak} days</Text>
        <XPProgressBar xp={xp} maxXp={maxXp} />
        <View style={styles.badgesRow}>
          {badges.length === 0 && <Text style={{ color: '#fff' }}>No badges yet</Text>}
          {badges.map((badge, idx) => (
            <Badge key={idx} label={badge.label} icon={badge.icon} />
          ))}
        </View>
      </View>

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
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center' },

  chatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, width: '100%', maxWidth: 350 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  chatBubble: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flex: 1 },
  userName: { fontWeight: 'bold', color: '#222' },
  message: { color: '#333' },
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
  button: {
    backgroundColor: '#4F8CFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gamificationSection: {
    backgroundColor: '#1A2EFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  streakText: {
    color: '#FFD600',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
}); 