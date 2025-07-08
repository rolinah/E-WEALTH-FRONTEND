// ProgressDashboardScreen.js
// Screen for visualizing user progress, XP, and weak areas with charts.
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { api } from '../services/api';

const categories = [
  { name: 'Writing', color: '#FFD600' },
  { name: 'Lifestyle', color: '#1A2EFF' },
  { name: 'Food', color: '#FF9900' },
  { name: 'Music', color: '#FFD600' },
  { name: 'Design', color: '#1A2EFF' },
];

const events = [
  { title: 'Color theory: the color wheel', date: '3 Sep / 8pm', duration: '2 hr', color: '#FFD600' },
  { title: 'Revisiting the Double Diamond', date: '3 Sep / 6pm', duration: '1 hr', color: '#FF9900' },
];

export default function ProgressDashboardScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const user = api.getCurrentUser();
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@example.com';
  if (isAdmin) {
    return (
      <View style={styles.root}>
        <View style={styles.adminBox}>
          <Text style={styles.adminText}>Admin accounts do not have learner progress.</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.root}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.sidebarLogo}>E-Wealth</Text>
        <View style={styles.sidebarMenu}>
          <Text style={[styles.sidebarItem, styles.sidebarItemActive]}>Dashboard</Text>
          <Text style={styles.sidebarItem}>My Tasks</Text>
          <Text style={styles.sidebarItem}>Statistics</Text>
          <Text style={styles.sidebarItem}>Courses</Text>
        </View>
      </View>
      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.main}>
        {/* Greeting */}
        <Text style={styles.greeting}>Good morning, User</Text>
        <Text style={styles.greetingSub}>Track your activity and find a suitable course to learn a new skill.</Text>
        <TouchableOpacity style={styles.suggestionBtn}>
          <Text style={styles.suggestionBtnText}>See suggestions</Text>
        </TouchableOpacity>
        {/* Progress Widget */}
        <View style={styles.progressRow}>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Weekly Progress</Text>
            <View style={styles.progressCircleOuter}>
              <View style={styles.progressCircleInner}>
                <Text style={styles.progressPercent}>82%</Text>
              </View>
            </View>
            <Text style={styles.progressSub}>4/5 tasks done</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>E-Wealth Library</Text>
            <Text style={styles.infoSub}>$15 dollars</Text>
          </View>
        </View>
        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.categoryCard, { backgroundColor: cat.color + '22' }, selectedCategory === cat.name && { borderColor: cat.color, borderWidth: 2 }]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Text style={[styles.categoryText, { color: cat.color }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Dynamic Chart Placeholder */}
        <Text style={styles.sectionTitle}>Dynamic</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={{ color: '#888' }}>[Chart Placeholder]</Text>
        </View>
        {/* Events/Webinars */}
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <View style={styles.eventList}>
          {events.map((event, idx) => (
            <View key={idx} style={[styles.eventCard, { borderLeftColor: event.color }]}> 
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventSub}>{event.date} • {event.duration}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F6FA',
  },
  sidebar: {
    width: 90,
    backgroundColor: '#1A2EFF',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 24,
    minHeight: '100%',
  },
  sidebarLogo: {
    color: '#FFD600',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 32,
  },
  sidebarMenu: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  sidebarItem: {
    color: '#fff',
    fontSize: 15,
    marginVertical: 12,
    opacity: 0.7,
  },
  sidebarItemActive: {
    color: '#FFD600',
    fontWeight: 'bold',
    opacity: 1,
  },
  main: {
    flexGrow: 1,
    padding: 28,
    paddingLeft: 36,
    backgroundColor: '#F5F6FA',
    minWidth: 0,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  greetingSub: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
  },
  suggestionBtn: {
    backgroundColor: '#1A2EFF',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  suggestionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    marginRight: 18,
    alignItems: 'center',
    width: 170,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  progressLabel: {
    fontSize: 15,
    color: '#888',
    marginBottom: 8,
  },
  progressCircleOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressCircleInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2EFF',
  },
  progressSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 22,
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2EFF',
    marginBottom: 6,
  },
  infoSub: {
    fontSize: 14,
    color: '#FF9900',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginTop: 24,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryCard: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  categoryText: {
    fontWeight: '600',
    fontSize: 15,
  },
  chartPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 6,
    elevation: 1,
  },
  eventList: {
    marginTop: 8,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#FFD600',
    elevation: 1,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  eventSub: {
    color: '#888',
    fontSize: 13,
  },
  adminBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  adminText: {
    fontSize: 18,
    color: '#1A2EFF',
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center',
  },
}); 