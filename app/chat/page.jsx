'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Fetch user data and initialize socket connection
    const fetchUserAndConnect = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');
        return;
      }

      try {
        // Fetch user data
        const response = await fetch('http://localhost:8000/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData);

        // Fetch message history
        const messagesResponse = await fetch('http://localhost:8000/api/messages');
        const messageHistory = await messagesResponse.json();
        setMessages(messageHistory.map(msg => ({
          id: msg.senderId,
          name: msg.senderName,
          text: msg.text,
          type: msg.type,
          timestamp: new Date(msg.timestamp)
        })));

        // Initialize socket connection
        const newSocket = io('http://localhost:8000');
        setSocket(newSocket);

        // Join chat with user data
        newSocket.emit('join', {
          name: userData.name,
          address: userData.address
        });

        // Socket event listeners
        newSocket.on('message', (message) => {
          setMessages((prev) => [...prev, message]);
        });

        newSocket.on('userJoined', (data) => {
          setMessages((prev) => [...prev, { 
            type: 'system', 
            text: data.message,
            timestamp: new Date()
          }]);
        });

        newSocket.on('userLeft', (data) => {
          setMessages((prev) => [...prev, { 
            type: 'system', 
            text: data.message,
            timestamp: new Date()
          }]);
        });

        newSocket.on('userList', (userList) => {
          setUsers(userList);
        });

        return () => {
          newSocket.close();
        };
      } catch (error) {
        console.error('Error:', error);
        router.push('/auth');
      }
    };

    fetchUserAndConnect();
  }, [router]);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('chatMessage', message);
      setMessage('');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 h-screen">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden h-[90vh]">
          <div className="flex h-full">
            {/* Users sidebar */}
            <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col">
              <h2 className="text-lg font-semibold p-4 text-black bg-gray-50 border-b">Online Users</h2>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {users.map((user) => (
                    <div 
                      key={user.id}
                      className="p-2 rounded-lg bg-white shadow-sm flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-black">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex ${msg.type === 'system' ? 'justify-center' : msg.id === socket?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.type === 'system' 
                          ? 'bg-gray-100 text-black text-sm' 
                          : msg.id === socket?.id
                          ? 'bg-indigo-100 text-black'
                          : 'bg-gray-200 text-black'
                      }`}
                    >
                      {msg.type !== 'system' && (
                        <p className="text-xs font-medium mb-1 text-black">
                          {msg.id === socket?.id ? 'You' : msg.name}
                        </p>
                      )}
                      <p className="text-black">{msg.type === 'system' ? msg.text : msg.text}</p>
                      <p className="text-xs text-black opacity-75 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 