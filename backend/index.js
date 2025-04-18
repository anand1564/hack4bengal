

const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const PORT = 8000;

const cors = require('cors');
const dotenv = require('dotenv');
app.use(cors());
app.use(express.json());
const MONGO_URI = "";

dotenv.config();
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const authRouter = require('./routes/auth'); 
const eventRouter = require('./routes/createEvent');
const transactionRouter = require('./routes/transactions');
const hackathonRouter = require('./routes/hackathon');

app.use('/api/events',eventRouter);
app.use('/api/auth', authRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/hackathon', hackathonRouter);

app.listen(PORT,()=>{
     console.log("Server is running on port 3000");
})