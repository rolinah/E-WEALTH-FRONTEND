// ForumScreen.js
// Screen for discussion forums and Q&A boards per business topic.
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Change if your server runs elsewhere

export default function ForumScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [usernameModal, setUsernameModal] = useState(true);
  const [tempUsername, setTempUsername] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    if (!username) return;
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);

  const sendMessage = () => {
    if (input.trim() && username) {
      socketRef.current.emit('chat message', { username, text: input });
      setInput('');
    }
  };

  const handleSetUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      setUsernameModal(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Modal visible={usernameModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your username</Text>
            <TextInput
              style={styles.input}
              value={tempUsername}
              onChangeText={setTempUsername}
              placeholder="Username"
              autoFocus
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSetUsername}>
              <Text style={styles.sendButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>Discussion Forum</Text>
      <FlatList
        data={messages}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.username}>{item.username || 'Anonymous'}:</Text>
            <Text style={styles.messageText}>{item.text || item}</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 12,
    color: '#222',
    textAlign: 'center',
  },
  messageBubble: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  username: {
    color: '#4F8CFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  messageText: {
    color: '#222',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sendButton: {
    backgroundColor: '#4F8CFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
}); 