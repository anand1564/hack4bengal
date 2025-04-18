const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const PORT = 8000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const cors = require('cors');
const dotenv = require('dotenv');
app.use(cors());
app.use(express.json());
const MONGO_URI = "mongodb+srv://admin:5w4-x9h9jJ2t%408A@cluster0.0blyw2r.mongodb.net/hack4bengal?retryWrites=true&w=majority";

const Message = require('./models/Message');

dotenv.config();
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const authRouter = require('./routes/auth'); 
const eventRouter = require('./routes/createEvent');
const transactionRouter = require('./routes/transactions');

app.use('/api/events',eventRouter);
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter);

// Add route to get chat history
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Store connected users with address as key
const connectedUsers = new Map();
const addressToSocketId = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user joining with their data
  socket.on('join', async (userData) => {
    // If this address is already connected, handle reconnection
    const existingSocketId = addressToSocketId.get(userData.address);
    if (existingSocketId) {
      // Remove old socket connection
      connectedUsers.delete(existingSocketId);
      addressToSocketId.delete(userData.address);
    }

    // Add new connection
    connectedUsers.set(socket.id, {
      id: socket.id,
      name: userData.name,
      address: userData.address
    });
    addressToSocketId.set(userData.address, socket.id);
    
    // Only emit join message if this is a new user
    if (!existingSocketId) {
      const joinMessage = {
        senderId: socket.id,
        senderName: userData.name,
        text: `${userData.name} has joined the chat`,
        type: 'system'
      };
      
      // Save join message
      await new Message(joinMessage).save();
      io.emit('userJoined', {
        id: socket.id,
        name: userData.name,
        message: joinMessage.text
      });
    }

    // Send the current list of connected users to all clients
    io.emit('userList', Array.from(connectedUsers.values()));
  });

  // Handle chat messages
  socket.on('chatMessage', async (message) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const messageData = {
        senderId: socket.id,
        senderName: user.name,
        text: message,
        type: 'message',
        timestamp: new Date()
      };

      // Save message to database
      try {
        await new Message(messageData).save();
        io.emit('message', {
          id: socket.id,
          name: user.name,
          text: message,
          timestamp: messageData.timestamp
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      // Only remove user completely if no other socket is connected with same address
      const currentSocketForAddress = addressToSocketId.get(user.address);
      if (currentSocketForAddress === socket.id) {
        addressToSocketId.delete(user.address);
        
        // Save leave message
        const leaveMessage = {
          senderId: socket.id,
          senderName: user.name,
          text: `${user.name} has left the chat`,
          type: 'system'
        };
        await new Message(leaveMessage).save();
        
        io.emit('userLeft', {
          id: socket.id,
          name: user.name,
          message: leaveMessage.text
        });
      }
      connectedUsers.delete(socket.id);
      io.emit('userList', Array.from(connectedUsers.values()));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});