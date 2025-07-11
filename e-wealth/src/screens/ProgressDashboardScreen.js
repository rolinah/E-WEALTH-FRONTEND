// ProgressDashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, Button } from 'react-native';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { PieChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ProgressDashboardScreen() {
  const [profile, setProfile] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { signOut, user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const userProfile = await api.getProfile();
        const allTopics = await api.getTopics();
        setProfile(userProfile);
        setTopics(allTopics);
        setLastUpdated(new Date());
      } catch (e) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={Colors.light.accent} /></View>;
  }

  if (!profile) {
    return <View style={styles.loading}><Text style={styles.errorText}>Failed to load dashboard data.</Text></View>;
  }

  // Real and fallback data
  const userName = profile.name || user?.name || 'User';
  const completedTopics = profile.completedTopics || 2; // Replace with real data if available
  const totalTopics = topics.length;
  const streak = profile.streak || 0;
  const xp = profile.totalPoints || profile.xp || 0;

  const tasks = [
    { name: 'Not Started', count: totalTopics - completedTopics, color: '#ddd' },
    { name: 'Completed', count: completedTopics, color: Colors.light.accent },
  ];
  const contracts = [
    { name: 'Design', percent: 80 },
    { name: 'Procurement', percent: 60 },
    { name: 'Construction', percent: 40 },
    { name: 'Project Close', percent: 10 },
  ];
  const timeData = [
    { label: 'Planned', value: 10 },
    { label: 'Actual', value: 8 },
  ];
  const costData = [
    { label: 'Planned', value: 2000 },
    { label: 'Budget', value: 2500 },
  ];
  const workload = [
    { name: 'Maria', value: 8 },
    { name: 'Jennifer', value: 6 },
    { name: 'Brandon', value: 4 },
    { name: 'Sam', value: 2 },
    { name: 'George', value: 1 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Progress Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {userName}!</Text>
      <Text style={styles.updated}>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : ''}</Text>
      <View style={{ alignSelf: 'flex-end', marginBottom: 8 }}>
        <Button title="Log out" color={Colors.light.accent} onPress={signOut} />
      </View>
      {/* Top Row */}
      <View style={styles.row}>
        {/* Health Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health</Text>
          <Text style={styles.cardStat}>Time: <Text style={styles.bold}>14% ahead</Text></Text>
          <Text style={styles.cardStat}>Tasks: <Text style={styles.bold}>{totalTopics - completedTopics} to complete</Text></Text>
          <Text style={styles.cardStat}>Progress: <Text style={styles.bold}>{completedTopics}/{totalTopics}</Text></Text>
          <Text style={styles.cardStat}>XP: <Text style={styles.bold}>{xp}</Text></Text>
          <Text style={styles.cardStat}>Streak: <Text style={styles.bold}>{streak} days</Text></Text>
        </View>
        {/* Tasks Donut Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tasks</Text>
          <PieChart
            data={tasks.map(t => ({
              name: t.name,
              population: t.count,
              color: t.color,
              legendFontColor: Colors.light.text,
              legendFontSize: 12,
            }))}
            width={140}
            height={140}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            hasLegend={true}
            center={[0, 0]}
          />
        </View>
        {/* Contracts Progress Bars */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contracts</Text>
          {contracts.map((c, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 12 }}>{c.name}</Text>
              <View style={{ backgroundColor: '#eee', borderRadius: 6, height: 8, width: 100 }}>
                <View style={{ backgroundColor: Colors.light.accent, width: `${c.percent}%`, height: 8, borderRadius: 6 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* Bottom Row */}
      <View style={styles.row}>
        {/* Time Bar Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Time</Text>
          <BarChart
            data={{
              labels: timeData.map(d => d.label),
              datasets: [{ data: timeData.map(d => d.value) }],
            }}
            width={120}
            height={120}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
          />
        </View>
        {/* Cost Bar Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cost</Text>
          <BarChart
            data={{
              labels: costData.map(d => d.label),
              datasets: [{ data: costData.map(d => d.value) }],
            }}
            width={120}
            height={120}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
          />
        </View>
        {/* Workload Bar Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Workload</Text>
          {workload.map((w, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ width: 60, fontSize: 12 }}>{w.name}</Text>
              <View style={{ backgroundColor: '#eee', borderRadius: 6, height: 8, width: 60 }}>
                <View style={{ backgroundColor: Colors.light.accent, width: w.value * 10, height: 8, borderRadius: 6 }} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => Colors.light.accent,
  labelColor: (opacity = 1) => Colors.light.text,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    padding: 16,
    paddingTop: 32,
    minHeight: '100%',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  welcome: {
    fontSize: 18,
    color: Colors.light.accent,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  updated: {
    fontSize: 12,
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'flex-start',
    minWidth: 120,
    maxWidth: 180,
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.light.accent,
  },
  cardStat: {
    fontSize: 13,
    color: Colors.light.text,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
}); 