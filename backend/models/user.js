const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  password:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String
  },
  eventsCreated: [{
    type: Schema.Types.ObjectId,
    ref: 'Events'
  }],
  eventsRegistered: [{
    type: Schema.Types.ObjectId,
    ref: 'Events'
  }],
  hackathonsParticipated: [{
    type: Schema.Types.ObjectId,
    ref: 'Hackathons'
  }],
  hackathonsCreated: [{
    type: Schema.Types.ObjectId,
    ref: 'Hackathons'
  }],
  ticketsPurchased: [{
    type: Schema.Types.ObjectId,
    ref: 'Events'
  }],
}, { 
  timestamps: true 
});

// Create index for faster queries
// userSchema.index({ address: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;