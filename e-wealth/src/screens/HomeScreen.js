import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { api } from '../services/api';
import NavigationHelper from '../navigation/NavigationHelper';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const defaultImage = { uri: 'https://placehold.co/200x200/png' };
const contentCards = [
  { 
    title: 'Continue Learning', 
    image: { uri: 'https://images.unsplash.com/photo-1513258496099-48168024aec0' }, 
    desc: 'Pick up where you left off.',
    action: 'topics-dashboard'
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
      case 'topic-list':
        NavigationHelper.goToTopicList(navigation);
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={[Colors.light.primary, '#6FA8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: '100%', paddingTop: 60, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, alignItems: 'center', marginBottom: 16 }}
      >
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: Colors.light.accent, letterSpacing: 2, marginBottom: 4 }}>E-Wealth Hub</Text>
        <View style={{ width: 60, height: 5, backgroundColor: Colors.light.accent, borderRadius: 3, marginTop: 6 }} />
      </LinearGradient>
      {loading && <ActivityIndicator size="large" color="#1A2EFF" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', margin: 12 }}>{error}</Text>}
      {/* Stats Card */}
      {dashboard && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dashboard.modulesCompleted || 0}</Text>
              <Text style={styles.statLabel}>Modules</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dashboard.quizScore || 0}%</Text>
              <Text style={styles.statLabel}>Quiz Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{dashboard.streak || 0}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>
      )}
      {/* Banner */}
      <Image 
        source={bannerError ? defaultImage : { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca' }}
        style={styles.banner}
        onError={() => setBannerError(true)}
      />
      {/* Quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>"Learning never exhausts the mind."</Text>
        <Text style={styles.quoteAuthor}>– Leonardo da Vinci</Text>
      </View>
      {/* Featured Content */}
      <Text style={styles.sectionTitle}>Featured Content</Text>
      <View style={styles.featuredCard}>
        <Text style={styles.featuredTitle}>Featured video will appear here</Text>
        <Text style={styles.featuredSub}>Watch the latest learning content</Text>
      </View>
      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.cardList}>
        {contentCards.map((card, idx) => {
          const [imgError, setImgError] = useState(false);
          return (
            <TouchableOpacity
              key={idx}
              style={styles.actionCard}
              onPress={() => handleCardPress(card.action)}
              activeOpacity={0.85}
            >
              <Image 
                source={imgError ? defaultImage : card.image} 
                style={styles.actionCardImage} 
                onError={() => setImgError(true)}
              />
              <View style={styles.actionCardText}>
                <Text style={styles.actionCardTitle}>{card.title}</Text>
                <Text style={styles.actionCardDesc}>{card.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Learning Path */}
      <View style={styles.learningPathCard}>
        <Text style={styles.sectionTitle}>Learning Path</Text>
        <TouchableOpacity 
          style={[styles.pathButton, { backgroundColor: Colors.light.primary }]}
          onPress={() => NavigationHelper.goToInterests(navigation)}
        >
          <Text style={styles.pathButtonText}>Choose Your Interests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.pathButton, { backgroundColor: Colors.light.accent }]}
          onPress={() => NavigationHelper.goToTopicsCollection(navigation)}
        >
          <Text style={[styles.pathButtonText, { color: Colors.light.primary }]}>Browse Topics Collection</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  contentContainer: { padding: 0, alignItems: 'center' },
  header: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 0,
    elevation: 0,
    shadowColor: 'transparent',
  },
  headerTitle: {
    color: '#1A2EFF',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed',
    marginBottom: 2,
  },
  headerAccent: {
    width: 60,
    height: 5,
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
    marginTop: 6,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 18,
    marginBottom: 10,
    width: '92%',
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2EFF',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A2EFF',
  },
  statLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  banner: { width: '92%', height: 160, borderRadius: 14, marginBottom: 16, alignSelf: 'center', objectFit: 'cover' },
  quoteCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#1A2EFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', margin: 12, color: '#1A2EFF' },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    marginBottom: 18,
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  featuredTitle: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featuredSub: {
    fontSize: 14,
    color: '#888',
  },
  cardList: {
    width: '92%',
    alignSelf: 'center',
    marginBottom: 18,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    padding: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  actionCardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  actionCardText: { flex: 1 },
  actionCardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A2EFF' },
  actionCardDesc: { fontSize: 14, color: '#666' },
  learningPathCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 32,
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  pathButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginVertical: 8,
    alignItems: 'center',
    width: '100%',
  },
  pathButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
