// models/event.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  virtualLink: {
    type: String
  }
}, { _id: false });

const eventSchema = new Schema({
  eventId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['IN_PERSON', 'LIVE_SESSION', 'HACKATHON']
  },
  price: {
    type: mongoose.Decimal128,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  ticketsSold: {
    type: Number,
    default: 0,
    min: 0
  },
  organizerAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  location: locationSchema,
  image: {
    type: String
  }
}, { 
  timestamps: true 
});

// Create indexes for faster queries
// eventSchema.index({ eventId: 1 });
// eventSchema.index({ organizerAddress: 1 });
// eventSchema.index({ eventType: 1 });
// eventSchema.index({ startDate: 1 });

// Virtual property to get available tickets
eventSchema.virtual('availableTickets').get(function() {
  return Math.max(0, this.capacity - this.ticketsSold);
});

// Method to check if event is sold out
eventSchema.methods.isSoldOut = function() {
  return this.ticketsSold >= this.capacity;
};

// Method to check if event has started
eventSchema.methods.hasStarted = function() {
  return this.startDate && new Date() >= this.startDate;
};

// Format price from Decimal128 to number for client
eventSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.price) {
      ret.price = parseFloat(ret.price.toString());
    }
    return ret;
  }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;