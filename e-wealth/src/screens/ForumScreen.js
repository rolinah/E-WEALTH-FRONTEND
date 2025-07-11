// e-wealth/app/forum.tsx or e-wealth/src/screens/ForumWeb.js
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Change to your backend IP if needed

export default function ForumWeb() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [showModal, setShowModal] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!username) return;
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });
    socketRef.current.on('chat history', (history) => {
      setMessages(history.map(m => ({ username: m.user_id, text: m.content })));
      setTimeout(scrollToBottom, 100);
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
      setShowModal(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
        }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12 }}>
            <h2>Enter your username</h2>
            <input
              value={tempUsername}
              onChange={e => setTempUsername(e.target.value)}
              placeholder="Username"
              style={{ padding: 8, fontSize: 16, marginBottom: 12 }}
              autoFocus
            />
            <button onClick={handleSetUsername} style={{ padding: 8, fontSize: 16 }}>Join</button>
          </div>
        </div>
      )}
      <h1>Discussion Forum</h1>
      <div style={{
        minHeight: 400, maxHeight: 500, overflowY: 'auto', background: '#f9f9f9',
        borderRadius: 8, padding: 16, marginBottom: 16, border: '1px solid #eee'
      }}>
        {messages.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <span style={{ color: '#0077cc', fontWeight: 'bold' }}>{item.username || 'Anonymous'}:</span>
            <span style={{ marginLeft: 8 }}>{item.text || item}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #ccc' }}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage} style={{ padding: '12px 18px', fontSize: 16, borderRadius: 8, background: '#0077cc', color: '#fff', border: 'none' }}>
          Send
        </button>
      </div>
    </div>
  );
} 