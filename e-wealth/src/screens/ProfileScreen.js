import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
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

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const currentUser = api.getCurrentUser();
      if (!currentUser) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const userProfile = await api.getUserProfile(currentUser.uid);
      setProfile(userProfile);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.signOut();
              // Navigation will be handled by auth state listener
            } catch (error) {
              Alert.alert('Logout Failed', error.message);
            }
          }
        }
      ]
    );
  };

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
          {profile.streak !== undefined && (
            <Text style={{ color: '#FFD600', marginBottom: 12 }}>Streak: {profile.streak} days</Text>
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
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: 200,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 