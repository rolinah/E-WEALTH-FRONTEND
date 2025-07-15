import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { api } from '../src/services/api';
import { useLocalSearchParams } from 'expo-router';

export default function TopicDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getTopicById(id)
      .then(setTopic)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101A3D' }}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101A3D' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }
  if (!topic) {
    return null;
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#101A3D' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 32, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#101A3D' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: '#FFD600', fontSize: 24 }}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Topic Details</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>{topic.title}</Text>
        <Text style={{ color: '#fff', marginBottom: 16 }}>{topic.description}</Text>
        {topic.modules && topic.modules.length > 0 && topic.modules.map((mod) => (
          mod.video ? (
            <View key={mod.id} style={{ marginBottom: 24, width: '100%', maxWidth: 400 }}>
              <Text style={{ color: '#FFD600', fontWeight: 'bold', marginBottom: 8 }}>{mod.title}</Text>
              <Video
                source={{ uri: mod.video }}
                style={{ width: '100%', height: 200, backgroundColor: '#000' }}
                useNativeControls
                resizeMode="contain"
                accessibilityLabel={`Video for ${mod.title}`}
              />
            </View>
          ) : null
        ))}
        {(!topic.modules || topic.modules.length === 0) && (
          <Text style={{ color: '#fff', fontStyle: 'italic' }}>No videos for this topic yet.</Text>
        )}
      </View>
    </View>
  );
} 