import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { Colors } from '../../constants/Colors';
import { interests as allInterests } from './InterestsScreen';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editInterests, setEditInterests] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

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

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.light.accent} /></View>;
  }

  if (!profile) {
    return <View style={styles.loading}><Text style={styles.errorText}>Failed to load profile.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profile.avatar || undefined }} style={styles.avatar} />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
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
}); 