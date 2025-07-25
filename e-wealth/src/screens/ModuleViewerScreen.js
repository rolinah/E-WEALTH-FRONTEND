import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../constants/Colors'; // Added import for Colors
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function ModuleViewerScreen({ route, navigation }) {
  const { module, topic } = route.params || {};
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { user } = useAuth ? useAuth() : { user: null };

  const handleComplete = async () => {
    Alert.alert(
      'Complete Module',
      'Are you sure you want to mark this module as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            setCompleted(true);
            // Award XP via backend
            try {
              const userId = user?.id || (await api.getCurrentUserId?.()) || null;
              if (userId && module?.id) {
                const res = await fetch('http://localhost:3000/api/video/completed', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, moduleId: module.id })
                });
                const data = await res.json();
                if (data.success) {
                  Alert.alert('Success', 'Module completed! 25 XP awarded.');
                } else {
                  Alert.alert('Info', data.message || 'Module already completed.');
                }
              } else {
                Alert.alert('Error', 'User or module ID missing.');
              }
            } catch (e) {
              Alert.alert('Error', 'Failed to award XP.');
            }
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  if (!module) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Module not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.moduleTitle}>{module.title}</Text>
        <Text style={styles.topicName}>{topic?.name}</Text>
        <Text style={styles.duration}>{module.duration} minutes</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.contentText}>{module.content}</Text>
        
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step {currentStep + 1} of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${((currentStep + 1) / 3) * 100}%` }]} />
          </View>
        </View>

        <View style={styles.videoSection}>
          <Text style={styles.sectionTitle}>Video Content</Text>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.placeholderText}>Video content will appear here</Text>
            <Text style={styles.placeholderSubtext}>Learn through interactive videos</Text>
          </View>
        </View>

        <View style={styles.interactiveSection}>
          <Text style={styles.sectionTitle}>Interactive Exercise</Text>
          <View style={styles.exerciseCard}>
            {currentStep === 0 && (
              <Text style={styles.exerciseText}>Let's start with a simple question about financial literacy...</Text>
            )}
            {currentStep === 1 && (
              <Text style={styles.exerciseText}>Great! Now let's explore some key concepts...</Text>
            )}
            {currentStep === 2 && (
              <Text style={styles.exerciseText}>Final step: Apply what you've learned...</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentStep < 2 ? 'Next' : 'Complete Module'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  topicName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  duration: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 20,
  },
  stepIndicator: {
    marginBottom: 20,
  },
  stepText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.light.accent, // yellow for progress only
  },
  videoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
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
  },
  interactiveSection: {
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  exerciseText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 24,
  },
  actions: {
    padding: 20,
  },
  button: {
    backgroundColor: '#4F8CFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  nextButton: {
    backgroundColor: Colors.light.accent, // yellow for primary action
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});
