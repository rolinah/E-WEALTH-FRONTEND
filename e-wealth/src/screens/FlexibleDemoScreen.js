import React from 'react';
import { View, Text, Button, useWindowDimensions, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

// Example dynamic data prop
const defaultData = {
  title: 'Welcome to the Flexible Demo!',
  isAdmin: false,
  notifications: 3,
};

const FlexibleDemoScreen = ({ route }) => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Dynamic content: get data from route params or use default
  const data = route?.params?.data || defaultData;

  return (
    <View style={[styles.container, { backgroundColor, flexDirection: isTablet ? 'row' : 'column' }]}>  
      <View style={styles.section}>
        <Text style={[styles.title, { color: textColor }]}>{data.title}</Text>
        <Text style={{ color: textColor }}>
          {isTablet ? 'Tablet layout' : 'Mobile layout'}
        </Text>
        {data.isAdmin && (
          <Button title="Go to Admin Panel" onPress={() => {}} />
        )}
        <Text style={{ color: textColor }}>
          Notifications: {data.notifications}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={[styles.subtitle, { color: textColor }]}>This screen adapts to:</Text>
        <Text style={{ color: textColor }}>• Device size (responsive)</Text>
        <Text style={{ color: textColor }}>• Theme (light/dark)</Text>
        <Text style={{ color: textColor }}>• Dynamic data (props/route)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    flex: 1,
    margin: 12,
    minWidth: 200,
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default FlexibleDemoScreen; 