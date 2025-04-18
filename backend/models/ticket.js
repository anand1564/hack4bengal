// models/ticket.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  ticketId: {
    type: Number,
    required: true,
    unique: true
  },
  eventId: {
    type: Number,
    required: true,
    ref: 'Event'
  },
  ownerAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  originalOwnerAddress: {
    type: String,
    lowercase: true
  },
  forSale: {
    type: Boolean,
    default: false
  },
  resalePrice: {
    type: mongoose.Decimal128,
    default: 0
  },
  mintedAt: {
    type: Date,
    default: Date.now
  },
  transferHistory: [{
    fromAddress: {
      type: String,
      lowercase: true
    },
    toAddress: {
      type: String,
      lowercase: true
    },
    price: {
      type: mongoose.Decimal128
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    transactionHash: {
      type: String
    }
  }],
  metadataURI: {
    type: String
  },
  attended: {
    type: Boolean,
    default: false
  },
  checkedInAt: {
    type: Date
  }
}, { 
  timestamps: true 
});

// // Create indexes for faster queries
// ticketSchema.index({ ticketId: 1 });
// ticketSchema.index({ eventId: 1 });
// ticketSchema.index({ ownerAddress: 1 });
// ticketSchema.index({ forSale: 1 });

// Format resalePrice from Decimal128 to number for client
ticketSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.resalePrice) {
      ret.resalePrice = parseFloat(ret.resalePrice.toString());
    }
    if (ret.transferHistory) {
      ret.transferHistory.forEach(history => {
        if (history.price) {
          history.price = parseFloat(history.price.toString());
        }
      });
    }
    return ret;
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;