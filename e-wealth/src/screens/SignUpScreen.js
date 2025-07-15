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
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState(''); // 'error' | 'success' | ''
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    setNotification('');
    setNotificationType('');
    if (!email || !password || !confirmPassword || !name) {
      setNotification('Please fill in all fields');
      setNotificationType('error');
      return;
    }
    if (password !== confirmPassword) {
      setNotification('Passwords do not match');
      setNotificationType('error');
      return;
    }
    if (password.length < 6) {
      setNotification('Password must be at least 6 characters long');
      setNotificationType('error');
      return;
    }
    if (isAdmin && !adminSecret) {
      setNotification('Admin secret is required for admin registration');
      setNotificationType('error');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, { name, role: isAdmin ? 'admin' : 'entrepreneur', adminSecret: isAdmin ? adminSecret : undefined });
      setNotification('Account created successfully!');
      setNotificationType('success');
    } catch (error) {
      setNotification(error.message || 'Sign Up Failed');
      setNotificationType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Sign Up</Text>
        {/* Notification area */}
        {!!notification && (
          <View style={[styles.notification, notificationType === 'error' ? styles.error : styles.success]}>
            <Text style={styles.notificationText}>{notification}</Text>
          </View>
        )}
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
          <Text style={styles.adminLabel}>Register as:</Text>
          <TouchableOpacity style={[styles.roleButton, !isAdmin && styles.selectedRole]} onPress={() => setIsAdmin(false)}>
            <Text style={[styles.roleButtonText, !isAdmin && styles.selectedRoleText]}>Entrepreneur</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleButton, isAdmin && styles.selectedRole]} onPress={() => setIsAdmin(true)}>
            <Text style={[styles.roleButtonText, isAdmin && styles.selectedRoleText]}>Admin</Text>
          </TouchableOpacity>
        </View>
        {isAdmin && (
          <View style={styles.adminWarningBox}>
            <Text style={styles.adminWarningText}>Admin registration requires a valid secret key. Only authorized users should register as admin.</Text>
            <TextInput
              style={styles.input}
              placeholder="Admin Secret"
              value={adminSecret}
              onChangeText={setAdminSecret}
              secureTextEntry
            />
          </View>
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
  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.icon,
    marginHorizontal: 4,
  },
  roleButtonText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  selectedRole: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  selectedRoleText: {
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  adminWarningBox: {
    backgroundColor: Colors.light.warningBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  adminWarningText: {
    fontSize: 13,
    color: Colors.light.warningText,
    textAlign: 'center',
    marginBottom: 8,
  },
  notification: {
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  error: {
    backgroundColor: Colors.light.errorBackground,
    borderColor: Colors.light.errorBorder,
    borderWidth: 1,
  },
  success: {
    backgroundColor: Colors.light.successBackground,
    borderColor: Colors.light.successBorder,
    borderWidth: 1,
  },
});
