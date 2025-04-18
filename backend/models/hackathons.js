// Hackathon Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Project Submission Schema
const projectSubmissionSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  repositoryUrl: {
    type: String,
    required: true,
    trim: true
  },
  demoUrl: {
    type: String,
    trim: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  team: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      trim: true
    }
  }],
  submissionDate: {
    type: Date,
    default: Date.now
  },
  feedback: [{
    judgeId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    comment: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'evaluated', 'winner', 'finalist'],
    default: 'submitted'
  }
}, { timestamps: true });

// Hackathon Schema
const hackathonSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  submissionDeadline: {
    type: Date,
    required: true
  },
  prizePool: {
    totalAmount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'ETH'
    },
    distribution: [{
      rank: Number,
      amount: Number,
      description: String
    }]
  },
  web3Integration: {
    contractAddress: {
      type: String,
      trim: true
    },
    network: {
      type: String,
      trim: true
    },
    tokenType: {
      type: String,
      enum: ['ERC20', 'ERC721', 'ERC1155', 'other'],
      default: 'ERC20'
    }
  },
  judges: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    bio: String,
    avatarUrl: String
  }],
  participants: [{
    teams: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    }],
    registeredAt: {
      type: Date,
      default: Date.now
    },
    walletAddress: {
      type: String,
      trim: true
    }
  }],
  projects: [projectSubmissionSchema],
  rules: {
    type: String
  },
  criteria: [{
    name: String,
    description: String,
    weight: Number
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'registration_open', 'registration_closed', 'submission_open', 'judging', 'completed'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite_only'],
    default: 'public'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);