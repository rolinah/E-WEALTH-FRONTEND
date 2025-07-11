import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/'); // Redirect to home if already logged in
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      // Navigation will be handled by AuthContext
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Login</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor={Colors.light.icon}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={Colors.light.icon}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/signup')}>
          <Text style={styles.link}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 24,
    width: 340,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 40,
    backgroundColor: Colors.light.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 12,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.light.icon,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: Colors.light.primary,
    textAlign: 'center',
    marginTop: 8,
    fontSize: 15,
  },
});
