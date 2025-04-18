// models/transaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: {
    type: Number
  },
  fromAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  toAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  eventId: {
    type: Number
  },
  ticketId: {
    type: Number
  },
  value: {
    type: mongoose.Decimal128,
    default: 0
  },
  gasUsed: {
    type: Number
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'FAILED'],
    default: 'PENDING'
  },
  type: {
    type: String,
    required: true,
    enum: ['CREATE_EVENT', 'BUY_TICKET', 'LIST_RESALE', 'BUY_RESALE', 'CANCEL_RESALE']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// // Create indexes for faster queries
// transactionSchema.index({ transactionHash: 1 });
// transactionSchema.index({ fromAddress: 1 });
// transactionSchema.index({ eventId: 1 });
// transactionSchema.index({ ticketId: 1 });
// transactionSchema.index({ type: 1 });

// Format value from Decimal128 to number for client
transactionSchema.set('toJSON', {
  transform: (doc, ret) => {
    if (ret.value) {
      ret.value = parseFloat(ret.value.toString());
    }
    return ret;
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;