import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';

const gallery = [
  require('../assets/images/gallery1.jpg'),
  require('../assets/images/gallery2.jpg'),
  require('../assets/images/gallery3.jpg'),
];

const badges = [
  require('../../assets/images/badge-streak.png'),
  require('../../assets/images/badge-achievement.png'),
];

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/images/profile-pic.jpg')} style={styles.profilePic} />
      <Text style={styles.title}>Phoebe Ajiko</Text>
      <Text style={styles.subtitle}>Learner | Finance Enthusiast</Text>
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
        source={require('../../assets/videos/progress-summary.mp4')}
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