// App.js
import React from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to E-Wealth App!</Text>
      </View>
      <Toast />
    </>
  );
} 