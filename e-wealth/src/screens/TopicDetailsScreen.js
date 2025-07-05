import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { api } from '../services/api';

export default function TopicDetailsScreen({ route, navigation }) {
  const { topic } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [currentModule, setCurrentModule] = useState(0);

  const handleModulePress = (module) => {
    navigation.navigate('ModuleViewer', { module, topic });
  };

  const handleStartQuiz = () => {
    navigation.navigate('Quiz', { topic });
  };

  if (!topic) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Topic not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{topic.name}</Text>
        <Text style={styles.description}>{topic.description}</Text>
        <Text style={styles.stats}>
          Estimated Time: {topic.estimatedHours || 0} hours | 
          Progress: {topic.progress || 0}%
        </Text>
      </View>

      <View style={styles.modulesSection}>
        <Text style={styles.sectionTitle}>Modules</Text>
        {topic.modules && topic.modules.map((module, index) => (
          <TouchableOpacity
            key={module.id || index}
            style={styles.moduleCard}
            onPress={() => handleModulePress(module)}
          >
            <Text style={styles.moduleTitle}>{module.title}</Text>
            <Text style={styles.moduleContent}>{module.content}</Text>
            <Text style={styles.moduleDuration}>{module.duration} minutes</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.quizButton} onPress={handleStartQuiz}>
          <Text style={styles.quizButtonText}>Take Quiz</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoSection}>
        <Text style={styles.sectionTitle}>Introduction Video</Text>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.placeholderText}>Introduction video will appear here</Text>
          <Text style={styles.placeholderSubtext}>Learn about this topic</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F8CFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  stats: {
    fontSize: 14,
    color: '#FFD600',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
  modulesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  moduleContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  moduleDuration: {
    fontSize: 12,
    color: '#FFD600',
    fontWeight: 'bold',
  },
  actionsSection: {
    padding: 20,
  },
  quizButton: {
    backgroundColor: '#FFD600',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  quizButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  videoSection: {
    padding: 20,
  },
  videoPlaceholder: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed'
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  }
});
