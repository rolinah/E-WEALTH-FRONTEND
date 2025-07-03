import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { api } from '../services/api';

const gallery = [
  require('../assets/images/icon.png'),
  require('../assets/images/icon.png'),
  require('../assets/images/icon.png'),
];

const badges = [
  require('../assets/images/icon.png'),
  require('../assets/images/icon.png'),
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getUserProfile()
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 40 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>}
      {profile && (
        <>
          <Image source={require('../assets/images/icon.png')} style={styles.profilePic} />
          <Text style={styles.title}>{profile.name || 'Phoebe Ajiko'}</Text>
          <Text style={styles.subtitle}>{profile.email || 'Learner | Finance Enthusiast'}</Text>
          {profile.balance !== undefined && (
            <Text style={{ color: '#FFD600', marginBottom: 12 }}>Balance: ${profile.balance}</Text>
          )}
        </>
      )}
      <View style={styles.badgesRow}>
        {badges.map((badge, idx) => (
          <Image key={idx} source={badge} style={styles.badge} />
        ))}
      </View>
      <Text style={styles.sectionTitle}>Gallery</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryRow}>
        {gallery.map((img, idx) => (
          <Image key={idx} source={img} style={styles.galleryImg} />
        ))}
      </ScrollView>
      <Text style={styles.sectionTitle}>Your Progress</Text>
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
  profilePic: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#FFD600', marginBottom: 12 },
  badgesRow: { flexDirection: 'row', marginBottom: 16 },
  badge: { width: 36, height: 36, marginRight: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center' },
  galleryRow: { flexDirection: 'row', marginBottom: 16 },
  galleryImg: { width: 80, height: 80, borderRadius: 12, marginRight: 8 },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
}); 