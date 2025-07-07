import React from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Greeting and Emoji */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi Phoebe! <Text style={{fontSize: 24}}>😊</Text></Text>
        <TextInput style={styles.search} placeholder="Search" placeholderTextColor="#B0C4DE" />
      </View>
      {/* Featured Content */}
      <Text style={styles.sectionTitle}>Continue Learning</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        <TouchableOpacity style={styles.featuredCard}>
          <Image source={require('../../src/assets/images/business-finances.jpg')} style={styles.featuredImage} />
          <Text style={styles.featuredText}>Learn to Lead</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featuredCard}>
          <Image source={require('../../src/assets/images/startup-management.jpg')} style={styles.featuredImage} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F8CFF',
    paddingTop: 48,
    paddingHorizontal: 16,
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
