import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Video } from 'expo-av';

const settingsOptions = [
  { name: 'Theme', icon: require('../../assets/images/icon.png') },
  { name: 'App settings', icon: require('../../assets/images/icon.png') },
  { name: 'Languages', icon: require('../../assets/images/icon.png') },
  { name: 'Privacy and Security', icon: require('../../assets/images/icon.png') },
  { name: 'Notifications', icon: require('../../assets/images/icon.png') },
  { name: 'Help and Support', icon: require('../../assets/images/icon.png') },
  { name: 'About', icon: require('../../assets/images/icon.png') },
];

const settingsExplanations = {
  'Theme': 'Change the app appearance between light and dark mode.',
  'App settings': 'Configure general app preferences and behaviors.',
  'Languages': 'Select your preferred language for the app.',
  'Privacy and Security': 'Manage your privacy and security settings.',
  'Notifications': 'Control notification preferences and alerts.',
  'Help and Support': 'Get help or contact support for assistance.',
  'About': 'Learn more about this app and its creators.'
};

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState('');
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../../assets/images/icon.png')} style={styles.bg} />
      <Text style={styles.title}>Settings</Text>
      {settingsOptions.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.optionRow}
          onPress={() => {
            setCurrentExplanation(settingsExplanations[opt.name] || 'No explanation available.');
            setModalVisible(true);
          }}
        >
          <Image source={opt.icon} style={styles.icon} />
          <Text style={styles.optionText}>{opt.name}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.sectionTitle}>;</Text>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Explanation</Text>
            <Text style={styles.modalText}>{currentExplanation}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
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
  modalText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4F8CFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 