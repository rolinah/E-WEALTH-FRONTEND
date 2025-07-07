import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { api } from '../services/api';
import NavigationHelper from '../navigation/NavigationHelper';

const defaultImage = { uri: 'https://placehold.co/200x200/png' };
const contentCards = [
  { 
    title: 'Continue Learning', 
    image: { uri: 'https://images.unsplash.com/photo-1513258496099-48168024aec0' }, 
    desc: 'Pick up where you left off.',
    action: 'topics-dashboard'
  },
  { 
    title: 'New Content', 
    image: { uri: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6' }, 
    desc: 'Explore the latest topics.',
    action: 'new-topics'
  },
  { 
    title: 'All Topics', 
    image: { uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }, 
    desc: 'Browse all available topics.',
    action: 'topic-list'
  },
];

export default function HomeScreen({ navigation }) {
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

  const handleCardPress = (action) => {
    switch (action) {
      case 'topics-dashboard':
        NavigationHelper.goToTopicsDashboard(navigation);
        break;
      case 'new-topics':
        NavigationHelper.goToNewTopics(navigation);
        break;
      case 'topic-list':
        NavigationHelper.goToTopicList(navigation);
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* App Name Header */}
      <View style={styles.appNameHeader}>
        <Text style={styles.appNameText}>E-Wealth Hub</Text>
      </View>
      {loading && <ActivityIndicator size="large" color="#4F8CFF" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', margin: 12 }}>{error}</Text>}
      
      {dashboard && (
        <View style={styles.dashboardStats}>
          <Text style={styles.dashboardTitle}>Your Stats</Text>
          <Text>Modules Completed: {dashboard.modulesCompleted || 0}</Text>
          <Text>Quiz Score: {dashboard.quizScore || 0}%</Text>
          <Text>Current Streak: {dashboard.streak || 0} days</Text>
        </View>
      )}

      <Image 
        source={bannerError ? defaultImage : { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' }}
        style={styles.banner}
        onError={() => setBannerError(true)}
      />
      
      <Text style={styles.quote}>"Learning never exhausts the mind." – Leonardo da Vinci</Text>
      
      <Text style={styles.sectionTitle}>Featured Content</Text>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.placeholderText}>Featured video will appear here</Text>
        <Text style={styles.placeholderSubtext}>Watch the latest learning content</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      {contentCards.map((card, idx) => {
        const [imgError, setImgError] = useState(false);
        return (
          <TouchableOpacity
            key={idx}
            style={styles.card}
            onPress={() => handleCardPress(card.action)}
          >
            <Image 
              source={imgError ? defaultImage : card.image} 
              style={styles.cardImage} 
              onError={() => setImgError(true)}
            />
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.desc}</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Learning Path</Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => NavigationHelper.goToInterests(navigation)}
        >
          <Text style={styles.actionButtonText}>Choose Your Interests</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => NavigationHelper.goToTopicsCollection(navigation)}
        >
          <Text style={styles.actionButtonText}>Browse Topics Collection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A2EFF' },
  appNameHeader: {
    width: '100%',
    backgroundColor: '#1A2EFF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 18,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    elevation: 4,
  },
  appNameText: {
    color: '#FFD600',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  banner: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12 },
  quote: { fontStyle: 'italic', textAlign: 'center', margin: 12, color: '#fff' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', margin: 12, color: '#fff' },
  videoPlaceholder: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12, 
    marginBottom: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    margin: 12
  },
  placeholderText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    marginBottom: 8
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    margin: 12, 
    padding: 12, 
    alignItems: 'center', 
    elevation: 2 
  },
  cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cardDesc: { fontSize: 14, color: '#666' },
  dashboardStats: { margin: 12, backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  dashboardTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#222' },
  quickActions: {
    margin: 12,
  },
  actionButton: {
    backgroundColor: '#FFD600',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
