import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, TextInput, Alert, TouchableOpacity, FlatList, Picker, ScrollView } from 'react-native';
import { api } from '../services/api';
import * as DocumentPicker from 'expo-document-picker';
import { uploadAdminTopicWithVideo } from '../services/admin';
import { AppState } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
const screenWidth = Dimensions.get('window').width;
const maxSectionWidth = 600;

function printCertificate({ userName, moduleName }) {
  const date = new Date().toLocaleDateString();
  const html = `
    <html>
      <head>
        <title>Certificate of Completion</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
          .cert { border: 6px solid #1A2EFF; border-radius: 24px; padding: 40px; display: inline-block; }
          .cert-title { font-size: 32px; font-weight: bold; color: #1A2EFF; margin-bottom: 24px; }
          .cert-body { font-size: 20px; margin-bottom: 24px; }
          .cert-name { font-size: 28px; font-weight: bold; color: #FFD600; margin: 16px 0; }
          .cert-module { font-size: 22px; color: #1A2EFF; margin: 12px 0; }
          .cert-date { font-size: 16px; color: #888; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="cert-title">Certificate of Completion</div>
          <div class="cert-body">This is to certify that</div>
          <div class="cert-name">${userName}</div>
          <div class="cert-body">has successfully completed the module</div>
          <div class="cert-module">${moduleName}</div>
          <div class="cert-date">Date: ${date}</div>
        </div>
        <script>window.print();</script>
      </body>
    </html>
  `;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
}

export default function AdminScreen() {
  const { signOut, isAdmin, isAuthenticated } = useAuth();
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
  const [materialInputs, setMaterialInputs] = useState({}); // { [interestName]: { title, desc, link } }
  const [interestMaterials, setInterestMaterials] = useState({ // mock materials for each interest
    Business: [
      { title: 'Intro to Business', desc: 'Basics of business', link: 'https://example.com/business.pdf' },
    ],
    Sales: [],
    Management: [],
    Logistics: [],
    Finance: [],
    Entrepreneurship: [],
    Marketing: [],
    Leadership: [],
    Strategy: [],
  });
  const [topics, setTopics] = useState([]);
  const [selectedModule, setSelectedModule] = useState('');
  // Mock completion data: moduleId -> [userEmail]
  const mockCompletions = {
    1: ['alice@example.com', 'bob@example.com'],
    2: ['carol@example.com'],
    3: ['dave@example.com'],
    4: ['sam@example.com', 'george@example.com'],
  };
  const router = useRouter();

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
    if (!topicTitle || !topicDesc || !video) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Please fill in all fields and select a video.' });
      return;
    }
    setUploading(true);
    try {
      const result = await uploadAdminTopicWithVideo(topicTitle, topicDesc, video);
      Toast.show({ type: 'success', text1: 'Success', text2: result.message || 'Topic and video uploaded successfully!' });
      setTopicTitle('');
      setTopicDesc('');
      setVideo(null);
      setTopicId('');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Upload Failed', text2: error.message });
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

  // Remove user from interest (mock)
  const handleDisqualifyUser = (interest, email) => {
    setInterestUsers((prev) => ({
      ...prev,
      [interest]: prev[interest].filter((u) => u !== email),
    }));
    Toast.show({ type: 'success', text1: 'User Disqualified', text2: `${email} has been disqualified from ${interest}` });
  };

  // Add material to interest (mock)
  const handleAddMaterial = (interest) => {
    const mat = materialInputs[interest] || {};
    if (!mat.title || !mat.link) return;
    setInterestMaterials((prev) => ({
      ...prev,
      [interest]: [...(prev[interest] || []), mat],
    }));
    setMaterialInputs((prev) => ({ ...prev, [interest]: { title: '', desc: '', link: '' } }));
  };

  // Remove material from interest (mock)
  const handleRemoveMaterial = (interest, idx) => {
    setInterestMaterials((prev) => ({
      ...prev,
      [interest]: prev[interest].filter((_, i) => i !== idx),
    }));
  };

  // Auto-logout on app background/close
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        signOut();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // Add mock analytics data at the top of the component:
  const analytics = {
    popularModules: [
      { name: 'Business', count: 24 },
      { name: 'Sales', count: 18 },
      { name: 'Management', count: 15 },
      { name: 'Finance', count: 10 },
      { name: 'Marketing', count: 7 },
    ],
    activeUsers: [5, 8, 12, 20, 18, 22, 25], // users per week
    weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    avgCompletion: [
      { name: 'Business', time: 4 },
      { name: 'Sales', time: 6 },
      { name: 'Management', time: 5 },
      { name: 'Finance', time: 7 },
      { name: 'Marketing', time: 3 },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(26, 46, 255, ${opacity})`,
    labelColor: (opacity = 1) => '#222',
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
  };

  // Add mock admin stats for demonstration
  const totalUsers = adminData?.totalUsers || 42;
  const activeUsers = adminData?.activeUsers || 18;
  const topicsCreated = adminData?.topicsCreated || topics.length;
  const totalCourses = topics.length;
  const totalModules = topics.reduce((sum, t) => sum + (t.modules ? t.modules.length : 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <LinearGradient
        colors={[Colors.light.primary, '#6FA8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 60, paddingBottom: 32, paddingHorizontal: 0, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, alignItems: 'center', marginBottom: 16 }}
      >
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: Colors.light.accent, letterSpacing: 2, marginBottom: 4 }}>Admin Panel</Text>
        <Text style={{ color: '#fff', fontSize: 16, opacity: 0.8 }}>Manage & Analyze</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40, paddingHorizontal: 12 }}>
        {loading && <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />}
        {error && <Text style={{ color: Colors.light.error, marginBottom: 12 }}>{error}</Text>}
        <View style={[styles.analyticsBox, { maxWidth: maxSectionWidth, width: '100%', alignSelf: 'center', marginTop: 24 }]}>
          <Text style={[styles.statsTitle, { fontSize: 22, color: Colors.light.primary, marginBottom: 16 }]}>Admin Analytics Dashboard</Text>
          {/* Most Popular Modules */}
          <Text style={styles.analyticsLabel}>Most Popular Modules</Text>
          <BarChart
            data={{
              labels: analytics.popularModules.map(m => m.name),
              datasets: [{ data: analytics.popularModules.map(m => m.count) }],
            }}
            width={Math.min(screenWidth - 32, 560)}
            height={180}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={{ marginBottom: 16, borderRadius: 12 }}
          />
          {/* Active Users Over Time */}
          <Text style={styles.analyticsLabel}>Active Users (Last 7 Weeks)</Text>
          <LineChart
            data={{
              labels: analytics.weeks,
              datasets: [{ data: analytics.activeUsers }],
            }}
            width={Math.min(screenWidth - 32, 560)}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={{ marginBottom: 16, borderRadius: 12 }}
          />
          {/* Average Completion Time */}
          <Text style={styles.analyticsLabel}>Average Completion Time (days)</Text>
          <BarChart
            data={{
              labels: analytics.avgCompletion.map(m => m.name),
              datasets: [{ data: analytics.avgCompletion.map(m => m.time) }],
            }}
            width={Math.min(screenWidth - 32, 560)}
            height={180}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={{ marginBottom: 8, borderRadius: 12 }}
          />
        </View>
        {adminData && (
          <View style={[styles.statsBox, { maxWidth: maxSectionWidth, width: '100%', alignSelf: 'center', marginTop: 24 }]}>
            <Text style={[styles.statsTitle, { fontSize: 20, color: Colors.light.primary, marginBottom: 12 }]}>Admin Stats</Text>
            <Text>Total Users: {totalUsers}</Text>
            <Text>Active Users: {activeUsers}</Text>
            <Text>Courses Registered: {totalCourses}</Text>
            <Text>Total Modules: {totalModules}</Text>
            <Text>Topics Created: {topicsCreated}</Text>
          </View>
        )}
        {/* All Topics Section */}
        <View style={{ backgroundColor: '#e3e3e3', borderRadius: 10, padding: 16, marginBottom: 32, width: '100%', maxWidth: maxSectionWidth, alignSelf: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: Colors.light.primary }}>All Topics</Text>
          {topics.length === 0 ? (
            <Text style={{ color: '#888', fontStyle: 'italic' }}>No topics created yet.</Text>
          ) : (
            topics.map(topic => (
              <View key={topic.id} style={{ marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 8 }}>
                <Text style={{ fontWeight: 'bold', color: '#101A3D' }}>ID: {topic.id}</Text>
                <Text style={{ fontWeight: 'bold' }}>{topic.title}</Text>
                <Text style={{ color: '#555' }}>{topic.description}</Text>
                {topic.modules && (
                  <Text style={{ color: '#888', fontSize: 12 }}>
                    Modules: {topic.modules.length}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>
        {/* Enrollment by Interest Section */}
        {adminData && adminData.interestStats && (
          <View style={[styles.enrollmentBox, { maxWidth: maxSectionWidth, width: '100%', alignSelf: 'center', marginTop: 24 }]}>
            <Text style={[styles.statsTitle, { fontSize: 20, color: Colors.light.primary, marginBottom: 12 }]}>Enrollment by Interest</Text>
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
                        <TouchableOpacity onPress={() => handleDisqualifyUser(interest.name, user)}>
                          <Text style={styles.removeBtn}>Disqualify</Text>
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
                    {/* Learning Materials Section */}
                    <View style={styles.materialsBox}>
                      <Text style={styles.expandedTitle}>Learning Materials</Text>
                      {(interestMaterials[interest.name] || []).length === 0 && <Text style={{ color: '#888', marginBottom: 8 }}>No materials yet.</Text>}
                      {(interestMaterials[interest.name] || []).map((mat, i) => (
                        <View key={i} style={styles.materialRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.materialTitle}>{mat.title}</Text>
                            <Text style={styles.materialDesc}>{mat.desc}</Text>
                            <Text style={styles.materialLink}>{mat.link}</Text>
                          </View>
                          <TouchableOpacity onPress={() => handleRemoveMaterial(interest.name, i)}>
                            <Text style={styles.removeBtn}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                      <View style={styles.addMaterialRow}>
                        <TextInput
                          style={styles.input}
                          placeholder="Material Title"
                          value={materialInputs[interest.name]?.title || ''}
                          onChangeText={text => setMaterialInputs(prev => ({ ...prev, [interest.name]: { ...prev[interest.name], title: text } }))}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="Description (optional)"
                          value={materialInputs[interest.name]?.desc || ''}
                          onChangeText={text => setMaterialInputs(prev => ({ ...prev, [interest.name]: { ...prev[interest.name], desc: text } }))}
                        />
                        <TextInput
                          style={styles.input}
                          placeholder="File link (URL)"
                          value={materialInputs[interest.name]?.link || ''}
                          onChangeText={text => setMaterialInputs(prev => ({ ...prev, [interest.name]: { ...prev[interest.name], link: text } }))}
                        />
                        <TouchableOpacity style={styles.addBtn} onPress={() => handleAddMaterial(interest.name)}>
                          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add Material</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        {/* Content Management Section */}
        <View style={[styles.contentBox, { maxWidth: maxSectionWidth, width: '100%', alignSelf: 'center', marginTop: 32 }]}>
          <Text style={[styles.statsTitle, { fontSize: 20, color: Colors.light.primary, marginBottom: 12 }]}>Upload Video to Topic</Text>
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
        {/* Certificates Section (Module selection + users who completed) */}
        <View style={[styles.certificateBox, { maxWidth: 420, width: '100%', alignSelf: 'center', marginTop: 32 }]}>
          <Text style={[styles.statsTitle, { fontSize: 20, color: Colors.light.primary, marginBottom: 12 }]}>Print Certificates</Text>
          <Text style={{ marginBottom: 8 }}>Select Module:</Text>
          <View style={{ backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 12 }}>
            <Picker
              selectedValue={selectedModule}
              onValueChange={setSelectedModule}
              style={{ width: 250 }}
            >
              <Picker.Item label="Select a module..." value="" />
              {topics.map((topic) => (
                <Picker.Item key={topic.id} label={topic.title} value={topic.id} />
              ))}
            </Picker>
          </View>
          {selectedModule && (mockCompletions[selectedModule] || []).length === 0 && (
            <Text style={{ color: '#888', marginBottom: 8 }}>No users completed this module.</Text>
          )}
          {selectedModule && (mockCompletions[selectedModule] || []).map((userEmail, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ flex: 1 }}>{userEmail}</Text>
              <TouchableOpacity
                style={{ backgroundColor: Colors.light.primary, padding: 8, borderRadius: 8 }}
                onPress={() => {
                  const moduleName = topics.find(t => t.id === selectedModule)?.title || 'Module';
                  printCertificate({ userName: userEmail, moduleName });
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Print Certificate</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  statsBox: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentBox: {
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: 340,
    elevation: 4,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
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
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: 340,
    elevation: 4,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
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
  materialsBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
    width: '100%',
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: '#F5F6FA',
    borderRadius: 6,
    padding: 8,
  },
  materialTitle: {
    fontWeight: 'bold',
    color: '#1A2EFF',
    fontSize: 15,
  },
  materialDesc: {
    color: '#666',
    fontSize: 13,
  },
  materialLink: {
    color: '#FF9900',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  addMaterialRow: {
    marginTop: 10,
  },
  certificateBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    marginBottom: 24,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  analyticsBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#1A2EFF',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  analyticsLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A2EFF',
    marginBottom: 4,
    marginTop: 8,
  },
}); 