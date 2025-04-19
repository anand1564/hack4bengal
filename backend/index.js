const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const PORT = 8000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Middlewares
app.use(cors());
app.use(express.json());

// Replace with your actual Mongo URI or keep using dotenv
const MONGO_URI = process.env.MONGO_URI || "";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
const authRouter = require('./routes/auth'); 
const eventRouter = require('./routes/createEvent');
const transactionRouter = require('./routes/transactions');
const hackathonRouter = require('./routes/hackathon');
const Message = require('./models/Message');

app.use('/api/events', eventRouter);
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/hackathon', hackathonRouter);

// Route to get chat history
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const connectedUsers = new Map();
const addressToSocketId = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', async (userData) => {
    const existingSocketId = addressToSocketId.get(userData.address);
    if (existingSocketId) {
      connectedUsers.delete(existingSocketId);
      addressToSocketId.delete(userData.address);
    }

    connectedUsers.set(socket.id, {
      id: socket.id,
      name: userData.name,
      address: userData.address
    });
    addressToSocketId.set(userData.address, socket.id);

    if (!existingSocketId) {
      const joinMessage = {
        senderId: socket.id,
        senderName: userData.name,
        text: `${userData.name} has joined the chat`,
        type: 'system'
      };
      await new Message(joinMessage).save();

      io.emit('userJoined', {
        id: socket.id,
        name: userData.name,
        message: joinMessage.text
      });
    }

    io.emit('userList', Array.from(connectedUsers.values()));
  });

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

  socket.on('disconnect', async () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      const currentSocketForAddress = addressToSocketId.get(user.address);
      if (currentSocketForAddress === socket.id) {
        addressToSocketId.delete(user.address);

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

// Start HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
