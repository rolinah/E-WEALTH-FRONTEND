import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const topic = {
  name: 'Sales Topic',
  progress: 0,
  streaks: 0,
  items: [
    'Introduction to Sales',
    'Reflection and Quiz',
    'How to sale anything!',
    'Reflection and Quiz',
  ],
};

export default function NewTopicsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{topic.name}</Text>
      <View style={styles.badges}>
        <View style={styles.badge}><Text style={styles.badgeText}>Progress {topic.progress}</Text></View>
        <View style={styles.badge}><Text style={styles.badgeText}>Streaks {topic.streaks}</Text></View>
      </View>
      <TouchableOpacity style={styles.goButton}>
        <Text style={styles.goButtonText}>Let's go</Text>
      </TouchableOpacity>
      <View style={styles.cardList}>
        {topic.items.map((item, i) => (
          <TouchableOpacity key={i} style={styles.itemCard}>
            <Text style={styles.itemText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  badges: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#FFD600',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
  },
  badgeText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
  },
  goButton: {
    backgroundColor: '#FFD600',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 20,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  goButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardList: {
    width: '100%',
    alignItems: 'center',
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  itemText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 