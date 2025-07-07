import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
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
      <Text style={styles.title}>Choose your interest</Text>
      <Text style={styles.subtitle}>Select topics that excite you</Text>
      <View style={styles.cardList}>
        {interests.map((interest, idx) => (
          <TouchableOpacity key={idx} style={styles.card}>
            <Image source={interest.icon} style={styles.icon} />
            <View>
              <Text style={styles.interestName}>{interest.name}</Text>
              <Text style={styles.interestDesc}>{interest.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {/* Add button styled as a card */}
        <TouchableOpacity style={styles.addCard}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#FFD600',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 12,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
    width: '100%',
    maxWidth: 400,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 12,
    width: 170,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  addCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    margin: 12,
    width: 170,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  addText: {
    fontSize: 32,
    color: '#222',
    fontWeight: 'bold',
  },
  icon: { width: 40, height: 40, marginRight: 16 },
  interestName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  interestDesc: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 12, textAlign: 'center' },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
}); 