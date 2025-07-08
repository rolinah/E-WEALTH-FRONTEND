import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TextInput, Alert, TouchableOpacity, FlatList } from 'react-native';
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
  const [expandedInterest, setExpandedInterest] = useState(null);
  const [userInputs, setUserInputs] = useState({}); // { [interestName]: '' }
  const [interestUsers, setInterestUsers] = useState({ // mock users for each interest
    Business: ['alice@example.com', 'bob@example.com'],
    Sales: ['carol@example.com'],
    Management: ['dave@example.com'],
    Logistics: [],
    Finance: [],
    Entrepreneurship: [],
    Marketing: [],
    Leadership: [],
    Strategy: [],
  });

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

  // Add user to interest (mock)
  const handleAddUser = (interest) => {
    const email = userInputs[interest];
    if (!email) return;
    setInterestUsers((prev) => ({
      ...prev,
      [interest]: [...(prev[interest] || []), email],
    }));
    setUserInputs((prev) => ({ ...prev, [interest]: '' }));
  };

  // Remove user from interest (mock)
  const handleRemoveUser = (interest, email) => {
    setInterestUsers((prev) => ({
      ...prev,
      [interest]: prev[interest].filter((u) => u !== email),
    }));
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
      {/* Enrollment by Interest Section */}
      {adminData && adminData.interestStats && (
        <View style={styles.enrollmentBox}>
          <Text style={styles.statsTitle}>Enrollment by Interest</Text>
          {adminData.interestStats.map((interest, idx) => (
            <View key={idx} style={styles.interestRow}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setExpandedInterest(expandedInterest === interest.name ? null : interest.name)}>
                <Text style={styles.interestName}>{interest.name}</Text>
                <Text style={styles.interestCount}>{interest.count} enrolled</Text>
              </TouchableOpacity>
              {expandedInterest === interest.name && (
                <View style={styles.expandedBox}>
                  <Text style={styles.expandedTitle}>Users in {interest.name}</Text>
                  {(interestUsers[interest.name] || []).length === 0 && <Text style={{ color: '#888', marginBottom: 8 }}>No users enrolled.</Text>}
                  {(interestUsers[interest.name] || []).map((user, i) => (
                    <View key={i} style={styles.userRow}>
                      <Text style={styles.userEmail}>{user}</Text>
                      <TouchableOpacity onPress={() => handleRemoveUser(interest.name, user)}>
                        <Text style={styles.removeBtn}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <View style={styles.addUserRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="User email"
                      value={userInputs[interest.name] || ''}
                      onChangeText={text => setUserInputs(prev => ({ ...prev, [interest.name]: text }))}
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={() => handleAddUser(interest.name)}>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
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
  enrollmentBox: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 340,
    elevation: 2,
  },
  interestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  interestName: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 16,
  },
  interestCount: {
    color: '#1A2EFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  expandedBox: {
    backgroundColor: '#F5F6FA',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  expandedTitle: {
    fontWeight: 'bold',
    color: '#1A2EFF',
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    elevation: 1,
  },
  userEmail: {
    color: '#222',
    fontSize: 15,
  },
  removeBtn: {
    color: '#ff4444',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  addUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addBtn: {
    backgroundColor: '#1A2EFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginLeft: 8,
  },
}); 