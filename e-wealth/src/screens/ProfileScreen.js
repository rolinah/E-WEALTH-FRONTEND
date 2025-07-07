import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import XPProgressBar from '../components/XPProgressBar';
import { Ionicons } from '@expo/vector-icons';
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

const BACKEND_URL = 'http://localhost:3000';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);
  const [editModal, setEditModal] = useState(false);

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
      // Fetch videos from backend
      const res = await fetch(`${BACKEND_URL}/videos/${currentUser.uid}`);
      const videoList = await res.json();
      setVideos(videoList.map(v => v.url));
    } catch (err) {
      setError('Failed to load profile or videos');
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
            } catch (error) {
              Alert.alert('Logout Failed', error.message);
            }
          }
        }
      ]
    );
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.cancelled) {
      try {
        const currentUser = api.getCurrentUser();
        if (!currentUser) throw new Error('User not authenticated');
        const formData = new FormData();
        formData.append('video', {
          uri: result.uri,
          name: 'video.mp4',
          type: 'video/mp4',
        });
        formData.append('userId', currentUser.uid);
        const res = await fetch(`${BACKEND_URL}/upload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const data = await res.json();
        setVideos((prev) => [...prev, data.url]);
      } catch (err) {
        Alert.alert('Upload failed', err.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && <ActivityIndicator size="large" color="#FFD600" style={{ marginTop: 40 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>}
      {profile && (
        <>
          {/* Profile Pic with Edit Overlay */}
          <View style={styles.profilePicContainer}>
            <Image source={require('../assets/images/icon.png')} style={styles.profilePic} />
            <TouchableOpacity style={styles.editPicButton} onPress={() => setEditModal(true)}>
              <Ionicons name="pencil" size={22} color="#4F8CFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>{profile.name || 'Phoebe Ajiko'}</Text>
          <Text style={styles.subtitle}>{profile.bio || profile.email || 'Learner | Finance Enthusiast'}</Text>
          {/* Stats Row + Edit Profile Button */}
          <View style={styles.statsRowFull}>
            <View style={styles.statCardFull}>
              <Ionicons name="flame" size={20} color="#FFD600" />
              <Text style={styles.statValue}>{profile.streak || 0}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statCardFull}>
              <Ionicons name="star" size={20} color="#FFD600" />
              <Text style={styles.statValue}>{profile.xp || 0}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statCardFull}>
              <Ionicons name="medal" size={20} color="#FFD600" />
              <Text style={styles.statValue}>{badges.length}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <TouchableOpacity style={styles.editProfileButtonFull} onPress={() => setEditModal(true)}>
              <Ionicons name="create-outline" size={20} color="#1A2EFF" />
              <Text style={styles.editProfileButtonTextFull}>Edit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* Gallery Section (Images & Videos) */}
      <View style={styles.cardWhiteGallery}>
        <Text style={styles.sectionTitleGallery}>Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryRow}>
          {gallery.map((img, idx) => (
            <Image key={idx} source={img} style={styles.galleryImg} />
          ))}
          {videos.map((uri, idx) => (
            <View key={idx} style={styles.videoThumb}>
              <Ionicons name="videocam" size={28} color="#4F8CFF" />
              <Text style={styles.videoLabel}>Video {idx + 1}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addVideoButton} onPress={pickVideo}>
            <Ionicons name="add" size={28} color="#fff" />
            <Text style={styles.addVideoText}>Add</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {/* XP Progress Bar & Streak */}
      <View style={styles.cardWhiteProgress}>
        <XPProgressBar xp={profile?.xp || 0} maxXp={1000} />
        <Text style={styles.streakCounter}>🔥 Streak: {profile?.streak || 0} days</Text>
      </View>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
      {/* Edit Profile Modal (placeholder) */}
      <Modal visible={editModal} transparent animationType="slide" onRequestClose={() => setEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile (Coming Soon)</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setEditModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  profilePicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 8,
    position: 'relative',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  editPicButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFD600',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRowFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 18,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statCardFull: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 4,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1A2EFF',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  editProfileButtonFull: {
    backgroundColor: '#FFD600',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginLeft: 8,
    elevation: 2,
  },
  editProfileButtonTextFull: {
    color: '#1A2EFF',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 4,
  },
  cardWhiteGallery: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginVertical: 10,
    width: '100%',
    maxWidth: 400,
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  sectionTitleGallery: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2EFF',
    marginBottom: 8,
    marginLeft: 4,
  },
  galleryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  galleryImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  videoThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFD600',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 4,
  },
  addVideoButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#4F8CFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  addVideoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  cardWhiteProgress: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginVertical: 18,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  streakCounter: {
    color: '#1A2EFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: 200,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  closeButton: {
    backgroundColor: '#4F8CFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 