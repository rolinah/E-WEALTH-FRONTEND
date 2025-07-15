// AdminContentManagerScreen.js
// Screen for admins to add/update modules without app updates.
import React from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadAdminTopicWithVideo } from '../services/admin';
import Toast from 'react-native-toast-message';
import { api } from '../services/api';
import { deleteModuleById } from '../services/admin';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { createTopic } from '../services/admin';

export default function AdminContentManagerScreen() {
  // Placeholder state for selected video
  const [video, setVideo] = React.useState(null);
  const [topicTitle, setTopicTitle] = React.useState('');
  const [topicDesc, setTopicDesc] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [topics, setTopics] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [newTopicTitle, setNewTopicTitle] = React.useState('');
  const [newTopicDesc, setNewTopicDesc] = React.useState('');
  const [selectedTopicId, setSelectedTopicId] = React.useState('');

  const router = useRouter();

  // Fetch all topics and modules
  const fetchTopics = async () => {
    setRefreshing(true);
    try {
      const data = await api.getTopics();
      setTopics(data);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    } finally {
      setRefreshing(false);
    }
  };
  React.useEffect(() => { fetchTopics(); }, []);

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

  // Handler for uploading the topic and video (to be implemented)
  const uploadTopic = async () => {
    if (!topicTitle || !topicDesc || !video) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields and select a video.' });
      return;
    }
    setLoading(true);
    try {
      const result = await uploadAdminTopicWithVideo(topicTitle, topicDesc, video);
      Toast.show({ type: 'success', text1: 'Success', text2: result.message || 'Topic and video uploaded successfully!' });
      setTopicTitle('');
      setTopicDesc('');
      setVideo(null);
      fetchTopics(); // Refresh list
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Create a new topic
  const handleCreateTopic = async () => {
    if (!newTopicTitle) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Topic title is required.' });
      return;
    }
    setLoading(true);
    try {
      await createTopic(newTopicTitle, newTopicDesc);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Topic created successfully!' });
      setNewTopicTitle('');
      setNewTopicDesc('');
      fetchTopics();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Create Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Upload video to selected topic
  const uploadVideoToTopic = async () => {
    if (!selectedTopicId || !video) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Select a topic and a video.' });
      return;
    }
    setLoading(true);
    try {
      const topic = topics.find(t => t.id == selectedTopicId);
      const result = await uploadAdminTopicWithVideo(topic.title, topic.description, video, selectedTopicId);
      Toast.show({ type: 'success', text1: 'Success', text2: result.message || 'Video uploaded successfully!' });
      setVideo(null);
      setSelectedTopicId('');
      fetchTopics();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Delete a module/video
  const handleDelete = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this video/module?')) return;
    try {
      await deleteModuleById(moduleId);
      Toast.show({ type: 'success', text1: 'Deleted', text2: 'Video/module deleted.' });
      fetchTopics();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Delete Failed', text2: err.message });
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 24, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Admin Content Manager</Text>
      {/* Create Topic Form */}
      <View style={{ width: '100%', maxWidth: 600, backgroundColor: '#e3e3e3', borderRadius: 10, padding: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Create New Topic</Text>
        <TextInput
          style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' }}
          placeholder="Topic Title"
          value={newTopicTitle}
          onChangeText={setNewTopicTitle}
        />
        <TextInput
          style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#ddd', minHeight: 40 }}
          placeholder="Topic Description"
          value={newTopicDesc}
          onChangeText={setNewTopicDesc}
          multiline
        />
        <Button title={loading ? 'Creating...' : 'Create Topic'} onPress={handleCreateTopic} disabled={loading} />
      </View>
      {/* List of Created Topics */}
      <View style={{ width: '100%', maxWidth: 600, backgroundColor: '#e3e3e3', borderRadius: 10, padding: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>All Created Topics</Text>
        {topics.length === 0 ? (
          <Text style={{ color: '#888', fontStyle: 'italic' }}>No topics created yet.</Text>
        ) : (
          topics.map(topic => (
            <View key={topic.id} style={{ marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 8 }}>
              <Text style={{ fontWeight: 'bold', color: '#101A3D' }}>ID: {topic.id}</Text>
              <Text style={{ fontWeight: 'bold' }}>{topic.title}</Text>
              <Text style={{ color: '#555' }}>{topic.description}</Text>
              <Button title="View Topic" onPress={() => router.push({ pathname: '/topic-details', params: { id: topic.id } })} />
            </View>
          ))
        )}
      </View>
      {/* Video Upload Section */}
      <View style={{ marginTop: 8, alignItems: 'center', width: 300, marginBottom: 32 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Upload Video to Topic</Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 8, width: '100%' }}>
          <Text style={{ margin: 8, fontWeight: 'bold' }}>Select Topic:</Text>
          <select
            style={{ width: '100%', padding: 8, borderRadius: 6, borderColor: '#ccc', marginBottom: 8 }}
            value={selectedTopicId}
            onChange={e => setSelectedTopicId(e.target.value)}
          >
            <option value="">-- Select Topic --</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.title} (ID: {topic.id})</option>
            ))}
          </select>
        </View>
        <Button title="Pick Video" onPress={pickVideo} />
        {video && (
          <Text style={{ marginTop: 8 }}>Selected: {video.name}</Text>
        )}
        <Button
          title={loading ? 'Uploading...' : 'Upload Video'}
          onPress={uploadVideoToTopic}
          disabled={!selectedTopicId || !video || loading}
        />
      </View>
      {/* List of Topics and Videos */}
      <View style={{ marginTop: 8, width: '100%', maxWidth: 600 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>All Topics & Videos</Text>
        {refreshing ? (
          <Text>Loading...</Text>
        ) : (
          topics.map((topic) => (
            <View key={topic.id} style={{ marginBottom: 24, backgroundColor: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px #0001' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{topic.title}</Text>
              <Text style={{ color: '#555', marginBottom: 4 }}>ID: {topic.id}</Text>
              <Text style={{ color: '#555', marginBottom: 8 }}>{topic.description}</Text>
              <Button title="View Topic" onPress={() => router.push({ pathname: '/topic-details', params: { id: topic.id } })} />
              {topic.modules && topic.modules.length > 0 ? (
                topic.modules.map((mod) => (
                  <View key={mod.id} style={{ marginBottom: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 6, padding: 8 }}>
                    <Text style={{ fontWeight: 'bold', color: '#101A3D', marginBottom: 4 }}>{mod.title}</Text>
                    {mod.video && (
                      <Video
                        source={{ uri: mod.video }}
                        style={{ width: '100%', height: 120, backgroundColor: '#000', borderRadius: 6 }}
                        useNativeControls
                        resizeMode="contain"
                        accessibilityLabel={`Video for ${mod.title}`}
                      />
                    )}
                    <Button title="Delete Video" color="#d32f2f" onPress={() => handleDelete(mod.id)} />
                  </View>
                ))
              ) : (
                <Text style={{ fontStyle: 'italic', color: '#888' }}>No videos/modules for this topic.</Text>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
} 