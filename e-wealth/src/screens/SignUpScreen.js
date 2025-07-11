import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Switch } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }
    if (isAdmin && !adminSecret) {
      Alert.alert('Error', 'Admin secret is required for admin registration');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, { name, role: isAdmin ? 'admin' : undefined, adminSecret: isAdmin ? adminSecret : undefined });
      Alert.alert('Success', 'Account created successfully!');
      // Navigation will be handled by AuthContext
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Sign Up</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Name" 
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Confirm Password" 
          secureTextEntry 
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <View style={styles.adminRow}>
          <Text style={styles.adminLabel}>Register as Admin</Text>
          <Switch value={isAdmin} onValueChange={setIsAdmin} />
        </View>
        {isAdmin && (
          <TextInput
            style={styles.input}
            placeholder="Admin Secret"
            value={adminSecret}
            onChangeText={setAdminSecret}
            secureTextEntry
          />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
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
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  adminLabel: {
    fontSize: 15,
    color: '#222',
    marginRight: 8,
  },
});
