import { View, Text, Button, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Home Screen</Text>
      {/* Business Topics Section */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Business Topics</Text>
      <Button title="Business Finances" onPress={() => router.push('/topics-collection')} />
      <Button title="Startup Management" onPress={() => router.push('/topics-collection')} />
      {/* Add more topics as needed */}
      <View style={{ height: 24 }} />
      {/* Learning Features */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Learning Features</Text>
      <Button title="Skill Gap Analysis" onPress={() => router.push('/skill-gap-analysis')} />
      <Button title="Progress Dashboard" onPress={() => router.push('/progress-dashboard')} />
      <Button title="Forum" onPress={() => router.push('/forum')} />
      <Button title="Peer Mentoring" onPress={() => router.push('/peer-mentoring')} />
    </ScrollView>
  );
}
