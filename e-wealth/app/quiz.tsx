import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import QuizScreen from '../src/screens/QuizScreen';

export default function Quiz() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: '#101A3D' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 32, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#101A3D' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: '#FFD600', fontSize: 24 }}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Quiz</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>Quiz Screen</Text>
      </View>
    </View>
  );
} 