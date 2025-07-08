import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const defaultAvatar = require('../../assets/images/icon.png');
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Section Title */}
      <Text style={styles.hubTitle}>E-Wealth Hub</Text>
      <View style={styles.hubAccent} />
      {/* Navigation Section */}
      <View style={styles.navSection}>
        <View style={styles.navGrid}>
          <TouchableOpacity style={[styles.navCard, { borderLeftColor: '#FFD600' }]} onPress={() => router.push('/interests')}>
            <Text style={styles.navCardText}>Interests Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navCard, { borderLeftColor: '#1A2EFF' }]} onPress={() => router.push('/topics-collection')}>
            <Text style={styles.navCardText}>Topics Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navCard, { borderLeftColor: '#FF9900' }]} onPress={() => router.push('/topics-dashboard')}>
            <Text style={styles.navCardText}>Topics Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navCard, { borderLeftColor: '#FFD600' }]} onPress={() => router.push('/forum')}>
            <Text style={styles.navCardText}>Forum</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navCard, { borderLeftColor: '#1A2EFF' }]} onPress={() => router.push('/peer-mentoring')}>
            <Text style={styles.navCardText}>Peer Mentoring</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navCard, { borderLeftColor: '#FF9900' }]} onPress={() => router.push('/progress-dashboard')}>
            <Text style={styles.navCardText}>Progress Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navCard, { borderLeftColor: '#FFD600' }]} onPress={() => router.push('/skill-gap-analysis')}>
            <Text style={styles.navCardText}>Skill Gap Analysis</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Featured Content */}
      <Text style={styles.sectionTitle}>Continue Learning</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <TouchableOpacity style={styles.featuredCard}>
          <Image source={defaultAvatar} style={styles.featuredImage} />
          <Text style={styles.featuredText}>Learn to Lead</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featuredCard}>
          <Image source={defaultAvatar} style={styles.featuredImage} />
          <Text style={styles.featuredText}>New Content</Text>
        </TouchableOpacity>
        {/* Add more featured cards as needed */}
      </ScrollView>
      {/* Business Topics Section */}
      <Text style={styles.sectionTitle}>Business Topics</Text>
      <View style={styles.cardList}>
        <TouchableOpacity style={[styles.topicCard, { backgroundColor: '#1A2EFF' }]} onPress={() => router.push('/topics-collection')}>
          <Text style={styles.topicTitle}>Business Finances</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.topicCard, { backgroundColor: '#FFD600' }]} onPress={() => router.push('/topics-collection')}>
          <Text style={[styles.topicTitle, { color: '#1A2EFF' }]}>Startup Management</Text>
        </TouchableOpacity>
        {/* Add more topics as needed */}
      </View>
      {/* Learning Features */}
      <Text style={styles.sectionTitle}>Learning Features</Text>
      <View style={styles.cardList}>
        <TouchableOpacity style={[styles.featureCard, { borderLeftColor: '#FFD600' }]} onPress={() => router.push('/skill-gap-analysis')}>
          <Text style={styles.featureTitle}>Skill Gap Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.featureCard, { borderLeftColor: '#1A2EFF' }]} onPress={() => router.push('/progress-dashboard')}>
          <Text style={styles.featureTitle}>Progress Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.featureCard, { borderLeftColor: '#FF9900' }]} onPress={() => router.push('/forum')}>
          <Text style={styles.featureTitle}>Forum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.featureCard, { borderLeftColor: '#FFD600' }]} onPress={() => router.push('/peer-mentoring')}>
          <Text style={styles.featureTitle}>Peer Mentoring</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101A3D' },
  contentContainer: { alignItems: 'center', paddingBottom: 32 },
  hubTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed',
    marginTop: 24,
    textAlign: 'center',
  },
  hubAccent: {
    width: 60,
    height: 5,
    backgroundColor: '#FFD600',
    borderRadius: 3,
    marginTop: 6,
    marginBottom: 18,
    alignSelf: 'center',
  },
  navSection: {
    marginTop: 0,
    marginBottom: 18,
    width: '92%',
    alignSelf: 'center',
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navCard: {
    backgroundColor: '#19224A',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#FFD600',
  },
  navCardText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD600',
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: '4%',
  },
  horizontalScroll: {
    marginBottom: 16,
    width: '92%',
    alignSelf: 'center',
  },
  featuredCard: {
    backgroundColor: '#19224A',
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  featuredImage: {
    width: 120,
    height: 70,
    borderRadius: 8,
    marginBottom: 6,
  },
  featuredText: {
    fontWeight: 'bold',
    color: '#FFD600',
    fontSize: 14,
  },
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '92%',
    alignSelf: 'center',
  },
  topicCard: {
    backgroundColor: '#1A2EFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  topicTitle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  featureCard: {
    backgroundColor: '#19224A',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderLeftWidth: 6,
    borderLeftColor: '#FFD600',
  },
  featureTitle: {
    fontWeight: 'bold',
    color: '#FFD600',
    fontSize: 16,
  },
});
