import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Video } from 'expo-av';

const communityChats = [
  { user: 'Alice', avatar: require('../assets/images/icon.png'), message: 'Welcome to the community!' },
  { user: 'Bob', avatar: require('../assets/images/favicon.png'), message: 'Excited to learn together.' },
  { user: 'Carol', avatar: require('../assets/images/icon.png'), message: 'Let\'s share our progress!' },
];

export default function CommunityScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.sectionTitle}>Featured Video</Text>
      <Video
        source={require('../../assets/videos/community-welcome.mp4')}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
      />
      <Text style={styles.sectionTitle}>Chats</Text>
      {communityChats.map((chat, idx) => (
        <View key={idx} style={styles.chatRow}>
          <Image source={chat.avatar} style={styles.avatar} />
          <View style={styles.chatBubble}>
            <Text style={styles.userName}>{chat.user}</Text>
            <Text style={styles.message}>{chat.message}</Text>
          </View>
        </View>
      ))}
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginBottom: 8, color: '#fff', textAlign: 'center' },
  video: { width: '100%', height: 180, borderRadius: 12, marginBottom: 20 },
  chatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, width: '100%', maxWidth: 350 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  chatBubble: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flex: 1 },
  userName: { fontWeight: 'bold', color: '#222' },
  message: { color: '#333' },
}); 