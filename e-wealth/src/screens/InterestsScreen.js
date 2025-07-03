import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';

const interests = [
  { name: 'Business', icon: require('../assets/images/icon.png'), desc: 'Grow your business skills' },
  { name: 'Sales', icon: require('../assets/images/icon.png'), desc: 'Master the art of selling' },
  { name: 'Management', icon: require('../assets/images/icon.png'), desc: 'Lead teams to success' },
  { name: 'Logistics', icon: require('../assets/images/icon.png'), desc: 'Optimize supply chains' },
];

export default function InterestsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose Your Interests</Text>
      <Text style={styles.subtitle}>Select topics that excite you</Text>
      {interests.map((interest, idx) => (
        <View key={idx} style={styles.card}>
          <Image source={interest.icon} style={styles.icon} />
          <View>
            <Text style={styles.interestName}>{interest.name}</Text>
            <Text style={styles.interestDesc}>{interest.desc}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Why choosing your interests matters</Text>
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
    backgroundColor: '#FFE066',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { width: 40, height: 40, marginRight: 16 },
  interestName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  interestDesc: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, textAlign: 'center' },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
}); 