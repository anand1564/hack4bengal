const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Team member schema
const teamMemberSchema = new Schema({
  walletAddress: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  role: String
});

// Team schema
const teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  members: [teamMemberSchema],
  registeredAt: {
    type: Date,
    default: Date.now
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }
});

// Project submission schema
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
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
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
});

// Prize distribution schema
const prizeDistributionSchema = new Schema({
  rank: Number,
  amount: String,
  description: String
});

// Judge schema
const judgeSchema = new Schema({
  name: String,
  description: String,
  image:String
});

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
  eventTimeline:{
    openingCeremony:{
      type: Date,
    },
    HackingBegins:{
      type:Date,
    },
    SubmissionDeadline:{
      type:Date,
    },
    Results:{
      type:Date
    }
  },
  organizerAddress: {
    type: String,
    required: true
  },
  blockchainEventId: {
    type: String,
  },
  capacity: {
    type: Number,
    required: true
  },
  totalPrize:{
    type: String,
  },
  prizePool: {
    totalAmount: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      default: "ETH"
    },
    firstPrize:{
      type: String,
      default: "0"
    },
    secondPrize:{
      type: String,
      default: "0"
    },
    thirdPrize:{
      type: String,
      default: "0"
    },
  },
  web3Integration: {
    contractAddress: {
      type: String,
    },
    network: {
      type: String,
    },
    eventId: {
      type: String,
    },
    tokenType: {
      type: String,
      enum: ['ERC20', 'ERC721', 'ERC1155'],
      default: 'ERC721'
    }
  },
  teams: [teamSchema],
  judges: [judgeSchema],
  participants: [{
    walletAddress: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],
  Rules:[{
    type:String
  }],
  Resources:[{
    name:{
      type:String
    },
    link:{
      type:String
    }
  }],
  judginCriteria:[{
    description:{
      type:String
    },
    weight:{
      type:Number
    }
  }],
  projects: [projectSubmissionSchema],
}, { timestamps: true });

module.exports = mongoose.model('Hackathon', hackathonSchema);