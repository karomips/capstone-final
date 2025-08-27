import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Messages.css';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const scrollRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/conversations/${currentUser.email}`);
        setConversations(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setLoading(false);
      }
    };
    
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/list');
        if (res.data.success) {
          // Filter out current user
          const otherUsers = res.data.users.filter(user => user.email !== currentUser.email);
          setUsers(otherUsers);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchConversations();
    fetchUsers();
  }, [currentUser.email]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get(`http://localhost:5000/api/messages/${currentChat._id}`);
          setMessages(res.data);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      conversationId: currentChat._id,
      sender: currentUser.email,
      text: newMessage,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/messages', message);
      setMessages([...messages, res.data]);
      setNewMessage('');
      
      // Refresh conversations to update last message
      const conversationsRes = await axios.get(`http://localhost:5000/api/conversations/${currentUser.email}`);
      setConversations(conversationsRes.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const startNewConversation = async () => {
    if (!selectedUser) return;

    try {
      const res = await axios.post('http://localhost:5000/api/conversations', {
        members: [currentUser.email, selectedUser]
      });
      
      setCurrentChat(res.data);
      setShowNewChat(false);
      setSelectedUser('');
      
      // Refresh conversations list
      const conversationsRes = await axios.get(`http://localhost:5000/api/conversations/${currentUser.email}`);
      setConversations(conversationsRes.data);
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  const getOtherMember = (conversation) => {
    return conversation.members.find(member => member !== currentUser.email);
  };

  return (
    <div className="messages-container">
      <div className="messages-content">
        {/* Messages Header */}
        <div className="messages-header">
          <h1 className="messages-header-title">
            <span className="messages-header-icon"></span>
            Messages
          </h1>
          <p className="messages-header-subtitle">
            Connect with other users in the community
          </p>
        </div>

        <div className="messages">
          <div className="messages-menu">
            <div className="messages-menu-header">
              <h2>Conversations</h2>
              <button 
                className="new-chat-btn"
                onClick={() => setShowNewChat(!showNewChat)}
              >
                + New Chat
              </button>
            </div>
            
            {showNewChat && (
              <div className="new-chat-form">
                <select 
                  value={selectedUser} 
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="user-select"
                >
                  <option value="">Select a user...</option>
                  {users.map((user) => (
                    <option key={user.email} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <button 
                  onClick={startNewConversation}
                  disabled={!selectedUser}
                  className="start-chat-btn"
                >
                  Start Chat
                </button>
              </div>
            )}
            
            {loading ? (
              <div className="messages-loading">Loading conversations...</div>
            ) : (
              <div className="conversations-list">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <div
                      key={conv._id}
                      className={`conversation-item ${currentChat?._id === conv._id ? 'active' : ''}`}
                      onClick={() => setCurrentChat(conv)}
                    >
                      <div className="conversation-name">
                        {getOtherMember(conv)}
                      </div>
                      <div className="conversation-preview">
                        {conv.lastMessage || 'No messages yet'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-conversations">
                    <p>No conversations yet. Start a new chat above!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="messages-chat">
            {currentChat ? (
              <>
                <div className="chat-header">
                  <h3>{getOtherMember(currentChat)}</h3>
                </div>
                <div className="chat-messages">
                  {messages.map((message) => (
                    <div
                      ref={scrollRef}
                      key={message._id}
                      className={`message ${message.sender === currentUser.email ? 'own' : ''}`}
                    >
                      <div className="message-content">
                        <p>{message.text}</p>
                        <span className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <form className="chat-input-container" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="chat-input"
                  />
                  <button type="submit" className="send-button">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <div className="no-chat-icon">💬</div>
                <h3>Welcome to Messages</h3>
                <p>Select a conversation to start messaging or create a new chat</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;