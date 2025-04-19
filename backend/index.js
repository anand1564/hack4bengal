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

// Route to get chat history for a specific event
app.get('/api/messages/:eventId', async (req, res) => {
  try {
    const messages = await Message.find({ eventId: req.params.eventId })
      .sort({ timestamp: 1 })
      .limit(100);
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

// Store connected users and their rooms
const connectedUsers = new Map();
const addressToSocketId = new Map();
const userRooms = new Map(); // Track which rooms each user is in

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', async (userData) => {
    // Clear previous connection if exists
    const existingSocketId = addressToSocketId.get(userData.address);
    if (existingSocketId) {
      const oldSocket = io.sockets.sockets.get(existingSocketId);
      if (oldSocket) {
        // Leave all rooms
        oldSocket.rooms.forEach(room => oldSocket.leave(room));
      }
      connectedUsers.delete(existingSocketId);
      addressToSocketId.delete(userData.address);
    }

    // Set up new connection
    connectedUsers.set(socket.id, {
      id: socket.id,
      name: userData.name,
      address: userData.address
    });
    addressToSocketId.set(userData.address, socket.id);
    userRooms.set(socket.id, new Set());

    io.emit('userList', Array.from(connectedUsers.values()));
  });

  socket.on('joinRoom', async (data) => {
    const { eventId, userData } = data;
    const userRoomSet = userRooms.get(socket.id);
    
    // Only join if not already in room
    if (userRoomSet && !userRoomSet.has(eventId)) {
      socket.join(eventId);
      userRoomSet.add(eventId);
      
      const joinMessage = {
        id: socket.id,
        name: userData.name,
        text: `${userData.name} has joined the event chat`,
        type: 'system',
        timestamp: new Date()
      };

      // Save to database
      await new Message({
        senderId: socket.id,
        senderName: userData.name,
        text: joinMessage.text,
        type: 'system',
        eventId: eventId,
        timestamp: joinMessage.timestamp
      }).save();

      // Emit only to the specific room
      socket.to(eventId).emit('message', joinMessage);
    }
  });

  socket.on('chatMessage', async (data) => {
    const { message, eventId } = data;
    const user = connectedUsers.get(socket.id);
    const userRoomSet = userRooms.get(socket.id);

    if (user && userRoomSet?.has(eventId)) {
      const messageData = {
        id: socket.id,
        name: user.name,
        text: message,
        timestamp: new Date()
      };

      // Save to database
      await new Message({
        senderId: socket.id,
        senderName: user.name,
        text: message,
        type: 'message',
        eventId: eventId,
        timestamp: messageData.timestamp
      }).save();

      // Emit to room (including sender)
      io.in(eventId).emit('message', messageData);
    }
  });

  socket.on('disconnect', async () => {
    const user = connectedUsers.get(socket.id);
    const userRoomSet = userRooms.get(socket.id);

    if (user && userRoomSet) {
      // Handle leave messages for each room
      for (const eventId of userRoomSet) {
        const leaveMessage = {
          id: socket.id,
          name: user.name,
          text: `${user.name} has left the chat`,
          type: 'system',
          timestamp: new Date()
        };

        // Save to database
        await new Message({
          senderId: socket.id,
          senderName: user.name,
          text: leaveMessage.text,
          type: 'system',
          eventId: eventId,
          timestamp: leaveMessage.timestamp
        }).save();

        // Emit to room
        io.in(eventId).emit('message', leaveMessage);
      }

      // Cleanup
      if (addressToSocketId.get(user.address) === socket.id) {
        addressToSocketId.delete(user.address);
      }
      connectedUsers.delete(socket.id);
      userRooms.delete(socket.id);
      io.emit('userList', Array.from(connectedUsers.values()));
    }
  });
});

// Start HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});