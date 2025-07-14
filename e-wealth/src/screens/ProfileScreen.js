import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { Colors } from '../../constants/Colors';
import { interests as allInterests } from './InterestsScreen';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';

const BADGES = [
  {
    id: 'first-module',
    name: 'First Module Completed',
    description: 'Complete your first module.',
    icon: '🏅',
    earned: true,
  },
  {
    id: 'five-modules',
    name: '5 Modules Completed',
    description: 'Complete five modules.',
    icon: '🥇',
    earned: false,
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score 100% on a quiz.',
    icon: '🎯',
    earned: true,
  },
  {
    id: 'streak',
    name: '7-Day Streak',
    description: 'Log in for 7 days in a row.',
    icon: '🔥',
    earned: false,
  },
];

function printCertificate({ userName, moduleName }) {
  const date = new Date().toLocaleDateString();
  const html = `
    <html>
      <head>
        <title>Certificate of Completion</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
          .cert { border: 6px solid #1A2EFF; border-radius: 24px; padding: 40px; display: inline-block; }
          .cert-title { font-size: 32px; font-weight: bold; color: #1A2EFF; margin-bottom: 24px; }
          .cert-body { font-size: 20px; margin-bottom: 24px; }
          .cert-name { font-size: 28px; font-weight: bold; color: #FFD600; margin: 16px 0; }
          .cert-module { font-size: 22px; color: #1A2EFF; margin: 12px 0; }
          .cert-date { font-size: 16px; color: #888; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="cert-title">Certificate of Completion</div>
          <div class="cert-body">This is to certify that</div>
          <div class="cert-name">${userName}</div>
          <div class="cert-body">has successfully completed the module</div>
          <div class="cert-module">${moduleName}</div>
          <div class="cert-date">Date: ${date}</div>
        </div>
        <script>window.print();</script>
      </body>
    </html>
  `;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

const COMPLETED_MODULES = [
  { id: 1, name: 'Business Finance Fundamentals' },
  { id: 2, name: 'Startup Management' },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editInterests, setEditInterests] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const { signOut } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
        setEditInterests(data.interests || []);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleInterest = (name) => {
    setEditInterests((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.updateProfile({ interests: editInterests });
      setProfile((prev) => ({ ...prev, interests: editInterests }));
      setEditMode(false);
      setMessage('Profile updated!');
    } catch (e) {
      setMessage(e.message || 'Failed to update profile');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.light.accent} /></View>;
  }

  if (!profile) {
    return <View style={styles.loading}><Text style={styles.errorText}>Failed to load profile.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarSection}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../../assets/images/avatar-placeholder.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.avatarBtn} onPress={pickImage}>
          <Text style={styles.avatarBtnText}>Change Photo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>
      <View style={styles.badgesSection}>
        <Text style={styles.badgesTitle}>Badges</Text>
        <View style={styles.badgesList}>
          {BADGES.map((badge) => (
            <View key={badge.id} style={[styles.badgeCard, !badge.earned && styles.badgeLocked]}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeName}>{badge.name}</Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
              {!badge.earned && <Text style={styles.badgeLockedText}>Locked</Text>}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.certificatesSection}>
        <Text style={styles.certificatesTitle}>Certificates</Text>
        {COMPLETED_MODULES.length === 0 && <Text style={{ color: '#888', marginBottom: 8 }}>No certificates yet.</Text>}
        {COMPLETED_MODULES.map((mod) => (
          <View key={mod.id} style={styles.certificateRow}>
            <Text style={styles.certificateName}>{mod.name}</Text>
            <TouchableOpacity
              style={styles.certificateBtn}
              onPress={() => printCertificate({ userName: profile.name || 'User', moduleName: mod.name })}
            >
              <Text style={styles.certificateBtnText}>View/Print Certificate</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionDesc}>{profile.bio || 'No bio provided.'}</Text>
      </View>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Interests</Text>
        {editMode ? (
          <View style={styles.chipContainer}>
            {allInterests.map((interest, idx) => {
              const isSelected = editInterests.includes(interest.name);
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.chip, isSelected && { backgroundColor: interest.color, borderColor: interest.color }]}
                  activeOpacity={0.8}
                  onPress={() => toggleInterest(interest.name)}
                >
                  <Text style={[styles.chipText, isSelected && { color: '#222' }]}>{interest.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.chipContainer}>
            {(Array.isArray(profile.interests) ? profile.interests : []).map((interest, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{interest}</Text>
              </View>
            ))}
          </View>
        )}
        {editMode && (
          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Interests'}</Text>
          </TouchableOpacity>
        )}
        {!!message && <Text style={styles.saveMessage}>{message}</Text>}
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => router.push('/edit-profile')}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  errorText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.surface,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.light.icon,
    marginBottom: 8,
  },
  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 420,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.light.accent,
  },
  sectionDesc: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
    maxWidth: 360,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    backgroundColor: Colors.light.accent,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  editButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  saveButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveMessage: {
    color: Colors.light.accent,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },
  badgesSection: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  badgesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2EFF',
    marginBottom: 12,
  },
  badgesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badgeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    width: 140,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  badgeIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A2EFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  badgeLocked: {
    opacity: 0.4,
  },
  badgeLockedText: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  certificatesSection: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  certificatesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2EFF',
    marginBottom: 12,
  },
  certificateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    width: 320,
    maxWidth: '100%',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  certificateName: {
    flex: 1,
    fontSize: 15,
    color: '#222',
  },
  certificateBtn: {
    backgroundColor: '#1A2EFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  certificateBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#1A2EFF',
  },
  avatarBtn: {
    backgroundColor: '#1A2EFF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  avatarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: Colors.light.error,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  logoutButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 