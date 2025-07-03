import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';

const settingsOptions = [
  { name: 'Theme', icon: require('../../assets/images/theme-icon.png') },
  { name: 'App settings', icon: require('../../assets/images/app-settings-icon.png') },
  { name: 'Languages', icon: require('../../assets/images/language-icon.png') },
  { name: 'Privacy and Security', icon: require('../../assets/images/privacy-icon.png') },
  { name: 'Notifications', icon: require('../../assets/images/notification-icon.png') },
  { name: 'Help and Support', icon: require('../../assets/images/help-icon.png') },
  { name: 'About', icon: require('../../assets/images/about-icon.png') },
];

export default function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/images/settings-bg.jpg')} style={styles.bg} />
      <Text style={styles.title}>Settings</Text>
      {settingsOptions.map((opt, idx) => (
        <View key={idx} style={styles.optionRow}>
          <Image source={opt.icon} style={styles.icon} />
          <Text style={styles.optionText}>{opt.name}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>How to customize your app</Text>
      <Video
        source={require('../../assets/videos/settings-guide.mp4')}
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
    position: 'relative',
  },
  bg: { position: 'absolute', top: 0, left: 0, width: '100%', height: 300, opacity: 0.15, zIndex: 0 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 16, zIndex: 1 },
  optionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, width: '100%', maxWidth: 350, zIndex: 1 },
  icon: { width: 28, height: 28, marginRight: 16 },
  optionText: { fontSize: 16, color: '#222' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center', zIndex: 1 },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20, zIndex: 1 },
}); 