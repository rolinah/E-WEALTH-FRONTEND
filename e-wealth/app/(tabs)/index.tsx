import React from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const defaultAvatar = require('../../assets/images/icon.png');
  return (
    <ScrollView style={styles.container}>
      {/* App Name Header */}
      <View style={styles.appNameHeader}>
        <Text style={styles.appNameText}>E-Wealth Hub</Text>
      </View>
      <View style={styles.navSection}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/interests')}>
          <Text style={styles.navButtonText}>Interests Card</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/topics-collection')}>
          <Text style={styles.navButtonText}>Topics Collection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/topics-dashboard')}>
          <Text style={styles.navButtonText}>Topics Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/new-topics')}>
          <Text style={styles.navButtonText}>New Topics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/forum')}>
          <Text style={styles.navButtonText}>Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/peer-mentoring')}>
          <Text style={styles.navButtonText}>Peer Mentoring</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/progress-dashboard')}>
          <Text style={styles.navButtonText}>Progress Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/skill-gap-analysis')}>
          <Text style={styles.navButtonText}>Skill Gap Analysis</Text>
        </TouchableOpacity>
      </View>
      {/* Featured Content */}
      <Text style={styles.sectionTitle}>Continue Learning</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <TouchableOpacity style={styles.featuredCard}>
          <Image source={require('../../assets/images/icon.png')} style={styles.featuredImage} />
          <Text style={styles.featuredText}>Learn to Lead</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featuredCard}>
          <Image source={require('../../assets/images/icon.png')} style={styles.featuredImage} />
          <Text style={styles.featuredText}>New Content</Text>
        </TouchableOpacity>
        {/* Add more featured cards as needed */}
      </ScrollView>
      {/* Business Topics Section */}
      <Text style={styles.sectionTitle}>Business Topics</Text>
      <View style={styles.cardList}>
        <TouchableOpacity style={styles.topicCard} onPress={() => router.push('/topics-collection')}>
          <Text style={styles.topicTitle}>Business Finances</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topicCard} onPress={() => router.push('/topics-collection')}>
          <Text style={styles.topicTitle}>Startup Management</Text>
        </TouchableOpacity>
        {/* Add more topics as needed */}
      </View>
      {/* Learning Features */}
      <Text style={styles.sectionTitle}>Learning Features</Text>
      <View style={styles.cardList}>
        <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/skill-gap-analysis')}>
          <Text style={styles.featureTitle}>Skill Gap Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/progress-dashboard')}>
          <Text style={styles.featureTitle}>Progress Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/forum')}>
          <Text style={styles.featureTitle}>Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featureCard} onPress={() => router.push('/peer-mentoring')}>
          <Text style={styles.featureTitle}>Peer Mentoring</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFD600' },
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
  navSection: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#1A2EFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 12,
    width: '90%',
    alignItems: 'center',
    elevation: 2,
  },
  navButtonText: {
    color: '#FFD600',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  header: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  search: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    padding: 8,
    elevation: 2,
  },
  featuredImage: {
    width: 120,
    height: 70,
    borderRadius: 8,
    marginBottom: 6,
  },
  featuredText: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 14,
  },
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  topicCard: {
    backgroundColor: '#FFD600',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
  },
  topicTitle: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
  },
  featureTitle: {
    fontWeight: 'bold',
    color: '#4F8CFF',
    fontSize: 16,
  },
});
