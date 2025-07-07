import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import XPProgressBar from '../components/XPProgressBar';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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
  const { signOut } = useAuth();
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
              await signOut();
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
      {/* Blue Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#FFD600" style={{ marginTop: 40 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>}
      {profile && (
        <>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profilePicContainerCard}>
              <Image source={require('../assets/images/icon.png')} style={styles.profilePicLarge} />
            </View>
            <Text style={styles.profileName}>{profile.name || 'Phoebe Ajiko'}</Text>
            <Text style={styles.profileEmail}>{profile.email || 'phoebe@email.com'}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="star" size={18} color="#FFD600" />
                <Text style={styles.statValue}>{profile.xp || 0}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="flame" size={18} color="#FFD600" />
                <Text style={styles.statValue}>{profile.streak || 0}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <TouchableOpacity style={styles.editProfileButton} onPress={() => setEditModal(true)}>
                <Ionicons name="create-outline" size={18} color="#1A2EFF" />
                <Text style={styles.editProfileButtonText}>Edit profile</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <Text style={styles.userInfoTitle}>User Info</Text>
            <Text style={styles.userInfoText}>Name: {profile.name || 'Phoebe'}</Text>
            <Text style={styles.userInfoText}>Email: {profile.email || 'phoebe@email.com'}</Text>
            <Text style={styles.userInfoText}>Short Bio: A businesswoman who loves products. Where the great experience meets the next big idea.</Text>
          </View>
          {/* Saved Content Section */}
          <View style={styles.savedContentSection}>
            <Text style={styles.savedContentTitle}>Saved content</Text>
            <TextInput style={styles.searchBar} placeholder="search library" placeholderTextColor="#888" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.savedContentGrid}>
              {gallery.map((img, idx) => (
                <Image key={idx} source={img} style={styles.savedContentImg} />
              ))}
              {videos.map((uri, idx) => (
                <View key={idx} style={styles.savedContentVideoThumb}>
                  <Ionicons name="videocam" size={28} color="#4F8CFF" />
                  <Text style={styles.savedContentVideoLabel}>Video {idx + 1}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </>
      )}
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
    padding: 0,
    minHeight: '100%',
  },
  header: {
    width: '100%',
    backgroundColor: '#1A2EFF',
    paddingTop: 40,
    paddingBottom: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginTop: -30,
    marginBottom: 12,
    width: '90%',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  profilePicContainerCard: {
    marginBottom: 10,
  },
  profilePicLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#1A2EFF',
    backgroundColor: '#fff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A2EFF',
    marginBottom: 2,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 4,
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1A2EFF',
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  editProfileButton: {
    backgroundColor: '#FFD600',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginLeft: 8,
    elevation: 2,
  },
  editProfileButtonText: {
    color: '#1A2EFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  userInfoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
    elevation: 2,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2EFF',
    marginBottom: 6,
  },
  userInfoText: {
    fontSize: 14,
    color: '#222',
    marginBottom: 2,
  },
  savedContentSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '90%',
    alignSelf: 'center',
    elevation: 2,
  },
  savedContentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2EFF',
    marginBottom: 8,
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 10,
    color: '#222',
  },
  savedContentGrid: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  savedContentImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  savedContentVideoThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFD600',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedContentVideoLabel: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 4,
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