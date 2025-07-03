import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { api } from '../services/api';

const defaultImage = { uri: 'https://placehold.co/200x200/png' };
const contentCards = [
  { title: 'Continue Learning', image: { uri: 'https://images.unsplash.com/photo-1513258496099-48168024aec0' }, desc: 'Pick up where you left off.' },
  { title: 'New Content', image: { uri: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6' }, desc: 'Explore the latest topics.' },
  { title: 'For You', image: { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }, desc: 'Personalized recommendations.' },
];

export default function HomeScreen() {
  const [bannerError, setBannerError] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDashboard()
      .then(data => {
        setDashboard(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load dashboard');
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#4F8CFF" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', margin: 12 }}>{error}</Text>}
      {dashboard && (
        <View style={styles.dashboardStats}>
          <Text style={styles.dashboardTitle}>Your Stats</Text>
          <Text>Modules Completed: {dashboard.modulesCompleted}</Text>
          <Text>Quiz Score: {dashboard.quizScore}</Text>
          <Text>Current Streak: {dashboard.streak} days</Text>
        </View>
      )}
      <Image 
        source={bannerError ? defaultImage : { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' }}
        style={styles.banner}
        onError={() => setBannerError(true)}
      />
      <Text style={styles.quote}>"Learning never exhausts the mind." – Leonardo da Vinci</Text>
      <Text style={styles.sectionTitle}>Featured Video</Text>
      <Video
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
      />
      <Text style={styles.sectionTitle}>Your Content</Text>
      {contentCards.map((card, idx) => {
        const [imgError, setImgError] = useState(false);
        return (
          <View key={idx} style={styles.card}>
            <Image 
              source={imgError ? defaultImage : card.image} 
              style={styles.cardImage} 
              onError={() => setImgError(true)}
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.desc}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12 },
  quote: { fontStyle: 'italic', textAlign: 'center', margin: 12, color: '#555' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 12 },
  video: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#f5f5f5', borderRadius: 12, margin: 12, padding: 12, alignItems: 'center', elevation: 2 },
  cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardDesc: { fontSize: 14, color: '#666' },
  dashboardStats: { margin: 12 },
  dashboardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});
