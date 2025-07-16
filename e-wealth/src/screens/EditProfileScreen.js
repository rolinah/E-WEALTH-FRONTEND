import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { api } from '../services/api';
import { Colors } from '../../constants/Colors';
import { interests as allInterestsRaw } from './InterestsScreen';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export default function EditProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [editInterests, setEditInterests] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
        setName(data.name || '');
        setBio(data.bio || '');
        setEditInterests(Array.isArray(data.interests) ? data.interests : []);
        setAvatar(data.avatar || '');
      } catch (e) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleInterest = (interestName) => {
    setEditInterests((prev) =>
      prev.includes(interestName)
        ? prev.filter((n) => n !== interestName)
        : [...prev, interestName]
    );
  };

  const handlePickAvatar = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      const localUri = pickerResult.assets[0].uri;
      setAvatarUploading(true);
      try {
        // Upload to backend
        const formData = new FormData();
        formData.append('avatar', {
          uri: localUri,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        });
        // Get JWT
        const token = await api.getToken?.() || (await import('../services/storage')).default.getItem('jwt');
        const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/upload/avatar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload avatar');
        const data = await res.json();
        setAvatar(data.url);
      } catch (e) {
        Alert.alert('Error', e.message || 'Failed to upload avatar');
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ name, bio, interests: editInterests, avatar });
      Toast.show({ type: 'success', text1: 'Success', text2: 'Profile updated!' });
      router.back();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.light.accent} />
      </View>
    );
  }

  const allInterests = Array.isArray(allInterestsRaw) ? allInterestsRaw : [];
  if (!Array.isArray(allInterestsRaw)) {
    console.warn('[EditProfileScreen] allInterests is not an array:', allInterestsRaw);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity style={styles.avatarContainer} onPress={handlePickAvatar} disabled={avatarUploading}>
        <Image
          source={avatar ? { uri: avatar } : require('../../assets/images/icon.png')}
          style={styles.avatar}
        />
        <Text style={styles.avatarEditText}>{avatarUploading ? 'Uploading...' : 'Change Avatar'}</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <Text style={styles.sectionTitle}>Interests</Text>
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
      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
      <Toast />
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
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.surface,
    marginBottom: 8,
  },
  avatarEditText: {
    color: Colors.light.primary,
    fontSize: 15,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.light.accent,
    alignSelf: 'flex-start',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    width: '100%',
    maxWidth: 420,
  },
  chip: {
    backgroundColor: Colors.light.accent,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.light.accent,
  },
  chipText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  saveButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 