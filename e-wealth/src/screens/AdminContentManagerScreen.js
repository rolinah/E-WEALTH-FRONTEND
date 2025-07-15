// AdminContentManagerScreen.js
// Screen for admins to add/update modules without app updates.
import React from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { uploadAdminTopicWithVideo } from '../services/admin';
import Toast from 'react-native-toast-message';

export default function AdminContentManagerScreen() {
  // Placeholder state for selected video
  const [video, setVideo] = React.useState(null);
  const [topicTitle, setTopicTitle] = React.useState('');
  const [topicDesc, setTopicDesc] = React.useState('');
  const [loading, setLoading] = React.useState(false);

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
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Admin Content Manager</Text>
      {/* Topic Title Input */}
      <TextInput
        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, width: 300, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' }}
        placeholder="Topic Title"
        value={topicTitle}
        onChangeText={setTopicTitle}
      />
      {/* Topic Description Input */}
      <TextInput
        style={{ backgroundColor: '#fff', borderRadius: 8, padding: 12, width: 300, marginBottom: 12, borderWidth: 1, borderColor: '#ddd', minHeight: 60 }}
        placeholder="Topic Description"
        value={topicDesc}
        onChangeText={setTopicDesc}
        multiline
      />
      {/* Video Upload Section */}
      <View style={{ marginTop: 8, alignItems: 'center', width: 300 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Upload Video</Text>
        <Button title="Pick Video" onPress={pickVideo} />
        {video && (
          <Text style={{ marginTop: 8 }}>Selected: {video.name}</Text>
        )}
        <Button
          title={loading ? 'Uploading...' : 'Upload Topic & Video'}
          onPress={uploadTopic}
          disabled={!topicTitle || !topicDesc || !video || loading}
        />
      </View>
    </View>
  );
} 