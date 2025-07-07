import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const topics = [
  { name: 'Sales Topic', progress: 13, streaks: 8, items: [
    'Introduction to Sales',
    'Reflection and Quiz',
    'How to sale anything!',
    'Reflection and Quiz',
  ] },
  // Add more topics as needed
];

export default function TopicsDashboard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Topics Dashboard</Text>
      {topics.map((topic, idx) => (
        <View key={idx} style={styles.topicCard}>
          <View style={styles.topicHeader}>
            <Text style={styles.topicName}>{topic.name}</Text>
            <View style={styles.badges}>
              <View style={styles.badge}><Text style={styles.badgeText}>Progress {topic.progress}</Text></View>
              <View style={styles.badge}><Text style={styles.badgeText}>Streaks {topic.streaks}</Text></View>
            </View>
          </View>
          {topic.items.map((item, i) => (
            <TouchableOpacity key={i} style={styles.itemCard}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          ))}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  topicCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FFD600',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  badgeText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
  },
  itemCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    marginTop: 2,
  },
  itemText: {
    color: '#333',
    fontSize: 16,
  },
}); 