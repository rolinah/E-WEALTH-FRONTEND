import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Video } from 'expo-av';

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/signup-illustration.png')} style={styles.illustration} />
      <Text style={styles.tagline}>Unlock your learning journey</Text>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={() => setLoading(true)}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <Text style={styles.link}>Already have an account? Log in</Text>
      <Text style={styles.sectionTitle}>How to use the app</Text>
      <Video
        source={require('../../assets/videos/signup-intro.mp4')}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  illustration: { width: 120, height: 120, alignSelf: 'center', marginBottom: 12 },
  tagline: { fontSize: 16, color: '#888', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#FFD600', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#222', fontWeight: 'bold' },
  link: { color: '#007AFF', textAlign: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
});
