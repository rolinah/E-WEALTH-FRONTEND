import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Modal, Platform } from 'react-native';
import { Video } from 'expo-av';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <LinearGradient
        colors={[Colors.light.primary, '#6FA8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Settings</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentBox}>
          {settingsOptions.map((opt, idx) => (
            <Pressable
              key={idx}
              style={styles.optionRow}
              onPress={() => {
                setCurrentExplanation(settingsExplanations[opt.name] || 'No explanation available.');
                setModalVisible(true);
              }}
            >
              <View style={styles.iconCircle}>
                <Image source={opt.icon} style={[styles.icon, { tintColor: Colors.light.primary }]} />
              </View>
              <Text style={styles.optionText}>{opt.name}</Text>
            </Pressable>
          ))}
        </View>
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
              <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    marginBottom: 0,
    elevation: 4,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.light.accent,
    letterSpacing: 2,
    marginBottom: 0,
    marginTop: 8,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 32,
    paddingTop: 32,
    minHeight: '100%',
    backgroundColor: Colors.light.background,
  },
  contentBox: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
    marginTop: -40,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 32,
    elevation: 6,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.10,
    shadowRadius: 18,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    width: '100%',
    maxWidth: 400,
    elevation: 3,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  icon: {
    width: 24,
    height: 24,
  },
  optionText: {
    fontSize: 18,
    color: Colors.light.text,
    fontWeight: '600',
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
    width: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  modalText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 