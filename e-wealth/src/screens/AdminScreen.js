import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TextInput, Alert } from 'react-native';
import { api } from '../services/api';
import * as DocumentPicker from 'expo-document-picker';
import { uploadAdminTopicWithVideo } from '../services/admin';

export default function AdminScreen() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Content management state
  const [video, setVideo] = useState(null);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [topicId, setTopicId] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.getAdminData()
      .then(data => {
        setAdminData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load admin data');
        setLoading(false);
      });
  }, []);

  // Handler for picking a video file
  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: true,
    });
    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
  };

  // Handler for uploading the topic and video
  const uploadTopic = async () => {
    if (!topicTitle || !topicDesc || !video || !topicId) {
      Alert.alert('Error', 'Please fill in all fields and select a video.');
      return;
    }
    setUploading(true);
    try {
      await uploadAdminTopicWithVideo(topicTitle, topicDesc, video, topicId);
      Alert.alert('Success', 'Topic and video uploaded!');
      setTopicTitle('');
      setTopicDesc('');
      setVideo(null);
      setTopicId('');
    } catch (error) {
      Alert.alert('Upload Failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>}
      {adminData && (
        <View style={styles.statsBox}>
          <Text style={styles.statsTitle}>Admin Stats</Text>
          <Text>Total Users: {adminData.totalUsers}</Text>
          <Text>Active Users: {adminData.activeUsers}</Text>
          <Text>Topics Created: {adminData.topicsCreated}</Text>
        </View>
      )}
      {/* Content Management Section */}
      <View style={styles.contentBox}>
        <Text style={styles.statsTitle}>Upload Video to Topic</Text>
        <TextInput
          style={styles.input}
          placeholder="Topic ID"
          value={topicId}
          onChangeText={setTopicId}
        />
        <TextInput
          style={styles.input}
          placeholder="Module Title"
          value={topicTitle}
          onChangeText={setTopicTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Module Description"
          value={topicDesc}
          onChangeText={setTopicDesc}
          multiline
        />
        <Button title="Pick Video" onPress={pickVideo} />
        {video && <Text style={{ marginTop: 8 }}>Selected: {video.name}</Text>}
        <Button
          title={uploading ? 'Uploading...' : 'Upload Topic & Video'}
          onPress={uploadTopic}
          disabled={!topicTitle || !topicDesc || !video || !topicId || uploading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8F5FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsBox: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentBox: {
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 340,
    elevation: 2,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#222',
  },
}); 