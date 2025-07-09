import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { NavigationCard } from '../../components/NavigationCard';
import { FeaturedCard } from '../../components/FeaturedCard';

export default function HomeScreen() {
  const router = useRouter();
  const logo = require('../../assets/images/ewealth-logo.png');
  const defaultAvatar = require('../../assets/images/icon.png');

  // Only keep the most important quick links
  const navigationItems = [
    { title: 'Interests', route: '/interests' as const, color: Colors.light.accent },
    { title: 'Topics', route: '/topics-collection' as const, color: Colors.light.primary },
    { title: 'Dashboard', route: '/topics-dashboard' as const, color: Colors.light.secondary },
    { title: 'Forum', route: '/forum' as const, color: Colors.light.accent },
    { title: 'Mentoring', route: '/peer-mentoring' as const, color: Colors.light.primary },
    { title: 'Progress', route: '/progress-dashboard' as const, color: Colors.light.secondary },
  ];

  const featuredItems = [
    { title: 'Leadership Skills', image: defaultAvatar },
    { title: 'Business Finance', image: defaultAvatar },
    { title: 'Marketing Strategy', image: defaultAvatar },
  ];

  // Business topics now link to their respective topic details
  const topicItems = [
    { title: 'Finance', color: Colors.light.primary },
    { title: 'Management', color: Colors.light.accent },
    { title: 'Marketing', color: Colors.light.secondary },
    { title: 'Leadership', color: Colors.light.primary },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.appTitle}>E-Wealth</Text>
          <Text style={styles.appSubtitle}>Empowering Business Growth</Text>
        </View>
        {/* Navigation Section */}
        <View style={styles.navSection}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.navGrid}>
            {navigationItems.map((item, index) => (
              <NavigationCard
                key={index}
                title={item.title}
                onPress={() => router.push(item.route)}
                borderColor={item.color}
              />
            ))}
          </View>
        </View>
        {/* Featured Content */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {featuredItems.map((item, index) => (
              <FeaturedCard
                key={index}
                title={item.title}
                imageSource={item.image}
              />
            ))}
          </ScrollView>
        </View>
        {/* Business Topics Section */}
        <View style={styles.topicsSection}>
          <Text style={styles.sectionTitle}>Business Topics</Text>
          <View style={styles.cardList}>
            {topicItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.topicCard, { backgroundColor: item.color }]}
                onPress={() => router.push({ pathname: '/topic-details', params: { topic: item.title } })}
              >
                <Text style={[
                  styles.topicTitle,
                  item.color === Colors.light.accent && { color: Colors.light.background }
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: { 
    flex: 1, 
    backgroundColor: Colors.light.background 
  },
  contentContainer: { 
    paddingBottom: 32 
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  appTitle: {
    color: Colors.light.text,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed',
    marginBottom: 4,
  },
  appSubtitle: {
    color: Colors.light.icon,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 1,
  },
  navSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.accent,
    marginBottom: 16,
    marginLeft: 4,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '48%', // Ensures two cards per row
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
  },
  featuredSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  horizontalScroll: {
    marginBottom: 8,
  },
  topicsSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  cardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topicCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  topicTitle: {
    fontWeight: 'bold',
    color: Colors.light.text,
    fontSize: 16,
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
  },
});
