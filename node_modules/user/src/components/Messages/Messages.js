import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Messages.css';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
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
    fetchConversations();
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
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="messages">
      <div className="messages-menu">
        <div className="messages-menu-header">
          <h2>Messages</h2>
        </div>
        {loading ? (
          <div className="messages-loading">Loading conversations...</div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation-item ${currentChat?._id === conv._id ? 'active' : ''}`}
                onClick={() => setCurrentChat(conv)}
              >
                <div className="conversation-name">
                  {conv.members.find(member => member !== currentUser.email)}
                </div>
                <div className="conversation-preview">
                  {conv.lastMessage || 'No messages yet'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="messages-chat">
        {currentChat ? (
          <>
            <div className="chat-header">
              <h3>{currentChat.members.find(member => member !== currentUser.email)}</h3>
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
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;