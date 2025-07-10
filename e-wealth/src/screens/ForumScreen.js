// ForumScreen.js
// Screen for discussion forums and Q&A boards per business topic.
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Modal, Keyboard } from 'react-native';
import io from 'socket.io-client';
import { Colors } from '../../constants/Colors';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Change if your server runs elsewhere

export default function ForumScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [usernameModal, setUsernameModal] = useState(true);
  const [tempUsername, setTempUsername] = useState('');
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!username) return;
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      flatListRef.current?.scrollToEnd({ animated: true });
    });
    socketRef.current.on('chat history', (history) => {
      setMessages(history.map(m => ({ username: m.user_id, text: m.content })));
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);

  const sendMessage = () => {
    if (input.trim() && username) {
      socketRef.current.emit('chat message', { username, text: input });
      setInput('');
      Keyboard.dismiss();
    }
  };

  const handleSetUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      setUsernameModal(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
      <Modal visible={usernameModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your username</Text>
            <TextInput
              style={styles.input}
              value={tempUsername}
              onChangeText={setTempUsername}
              placeholder="Username"
              placeholderTextColor={Colors.light.icon}
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
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text style={styles.username}>{item.username || 'Anonymous'}:</Text>
            <Text style={styles.messageText}>{item.text || item}</Text>
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor={Colors.light.icon}
          onFocus={() => setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100)}
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
    backgroundColor: Colors.light.background,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 12,
    color: Colors.light.text,
    textAlign: 'center',
  },
  messageBubble: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.accent,
  },
  username: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  messageText: {
    color: Colors.light.text,
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
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.light.icon,
    color: Colors.light.text,
  },
  sendButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  sendButtonText: {
    color: Colors.light.background,
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
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.text,
  },
}); 