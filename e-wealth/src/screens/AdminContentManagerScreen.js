// AdminContentManagerScreen.js
// Screen for admins to add/update modules without app updates.
import React from 'react';
import { View, Text, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function AdminContentManagerScreen() {
  // Placeholder state for selected video
  const [video, setVideo] = React.useState(null);

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

  // Handler for uploading the video (to be implemented)
  const uploadVideo = async () => {
    // TODO: Implement upload logic (e.g., to Firebase Storage or backend server)
    alert('Upload logic not implemented yet.');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Admin Content Manager (Coming Soon)</Text>
      {/* Video Upload Section */}
      <View style={{ marginTop: 32, alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Upload Video</Text>
        <Button title="Pick Video" onPress={pickVideo} />
        {video && (
          <Text style={{ marginTop: 8 }}>Selected: {video.name}</Text>
        )}
        <Button
          title="Upload Video"
          onPress={uploadVideo}
          disabled={!video}
        />
      </View>
    </View>
  );
} 