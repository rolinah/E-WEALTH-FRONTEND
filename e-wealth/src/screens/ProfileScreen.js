import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../services/api';
import { Colors } from '../../constants/Colors';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
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
        <View style={styles.chipContainer}>
          {(profile.interests || []).map((interest, idx) => (
            <View key={idx} style={styles.chip}>
              <Text style={styles.chipText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.editButton}>
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
}); 