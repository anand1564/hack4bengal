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
  address:{
    type: String,
    required: true
  },
  githubLink:{
    type: String,
    trim: true,
    required: true
  },
  xLink:{
    type: String,
    trim: true,
  },
  linkedinLink:{
    type: String,
    trim: true,
  },
  isSubmitted:{
    type: Boolean,
    default: false
  }
});

// Project submission schema
const projectSubmissionSchema = new Schema({
  teamId:{
    type: Schema.Types.ObjectId,
  },
  projectName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  demoLink: {
    type: String,
    trim: true
  },
  githubLink: {
    type: String,
    trim: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
})

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