const express = require('express');
const router = express.Router();
const { ethers } = require('ethers'); 
const mongoose = require('mongoose');
const Hackathon = require('../models/hackathons');
const contractAbi = require('../abis/NFTEventTicketing.json');
const multer = require('multer');

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);
const contractAddress = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);
const { uploadImageToPinata} = require('../utils/nftStorage');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create',upload.single('coverImage'), async (req, res) => {
  const {
    name,
    description,
    startDate,
    endDate,
    eventTimeline,
    organizerAddress,
    capacity,
    prizePool,
    Rules,
    Resources,
    judginCriteria
  } = req.body;

  // Validate required fields
  if (!name || !description || !startDate || !endDate || !organizerAddress) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    //Uploading image to pinata
    let coverImageURL = '';

      if (req.file) {
        coverImageURL = await uploadImageToPinata(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
      }

    console.log("Creating hackathon event on blockchain...");
    
    // Get the signer's address to verify transaction sender
    const signerAddress = await signer.getAddress();
    console.log(`Transaction will be sent from: ${signerAddress}`);
    
    // Set hackathon event properties
    const eventType = 2; // HACKATHON enum value
    const priceInWei = ethers.utils.parseEther("0"); // Free registration
    const eventCapacity = capacity || 100;
    
    console.log(`Creating event with params: name=${name}, type=${eventType}, price=${priceInWei}, capacity=${eventCapacity}`);
    
    // Create the event on blockchain
    const createTx = await contract.createEvent(
      name,
      eventType,
      priceInWei,
      eventCapacity
    );
    
    console.log(`Transaction sent: ${createTx.hash}`);
    console.log("Waiting for transaction confirmation...");
    
    // Wait for transaction to be mined
    const receipt = await createTx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Print all events for debugging
    console.log("Events found in transaction receipt:");
    receipt.events.forEach((event, index) => {
      console.log(`Event ${index}:`, event);
    });
    
    // Let's try to manually extract the eventId from logs
    let eventId = null;
    
    // If we couldn't find a named event, let's look at all logs
    if (receipt.logs && receipt.logs.length > 0) {
      console.log("Examining transaction logs...");
      
      // In the contract, the eventId should be the first parameter of the EventCreated event
      // We're assuming the first log is from our EventCreated event
      const log = receipt.logs[0];
      console.log("Log data:", log.data);
      console.log("Log topics:", log.topics);
      
      // Based on your contract, the eventId is likely the first indexed parameter
      // We'll try to extract it from the second topic (first is the event signature)
      if (log.topics.length >= 2) {
        // Extract the eventId from the second topic (remove leading zeros)
        eventId = ethers.BigNumber.from(log.topics[1]).toString();
        console.log(`Extracted eventId from logs: ${eventId}`);
      }
    }
    
    // If we still don't have an eventId, let's query the contract
    if (!eventId) {
      console.log("Could not extract eventId from logs, using counter value");
      // Get the current event counter value - this is an approximation
      // Assuming there's a way to get the total events count
      const eventCount = await contract.getEventIdCounter();
      if(!eventCount){
        eventId=-1;
      }
      eventId = eventCount.toString();
      console.log(`Using event counter value as eventId: ${eventId}`);
    }
    
    if (!eventId) {
      console.error("Still could not determine eventId, using hardcoded value");
      // Last resort - use a hardcoded value based on the current block number
      eventId = "1"; // You might need to adjust this based on your testing
    }
    
    // Now fund the prize pool with the eventId
    console.log(`Funding prize pool for event ${eventId} with ${prizePool.totalAmount} ETH...`);
    
    // Convert prize amount to Wei
    const prizeValueWei = ethers.utils.parseEther(prizePool.totalAmount);
    
    const fundTx = await contract.fundPrizePool(
      eventId,
      { value: prizeValueWei }
    );
    
    console.log(`Prize pool funding transaction sent: ${fundTx.hash}`);
    
    // Wait for funding transaction to be mined
    const fundReceipt = await fundTx.wait();
    console.log(`Prize pool funded in block ${fundReceipt.blockNumber}`);
    
    // Create the hackathon document in MongoDB
    const newHackathon = new Hackathon({
      name,
      description,
      image: coverImageURL,
      startDate,
      endDate,
      eventTimeline,
      organizerAddress,
      capacity,
      prizePool,
      teams: [],
      judges: [],
      participants: [],
      projects: [],
      Rules,
      Resources,
      judginCriteria
    });

    // Save to database
    await newHackathon.save();
    
    res.status(201).json({
      message: 'Hackathon created successfully',
      hackathon: newHackathon, // this includes _id
      blockchain: {
        eventId: eventId,
        createTxHash: receipt.transactionHash,
        fundTxHash: fundReceipt.transactionHash
      }
    });
  } catch (error) {
    console.error("Error creating hackathon:", error);
    
    // Log additional details for debugging
    if (error.reason) console.error("Error reason:", error.reason);
    if (error.code) console.error("Error code:", error.code);
    if (error.transaction) console.error("Failed transaction:", error.transaction);
    
    res.status(500).json({ 
      message: 'Error creating hackathon', 
      error: error.message,
      details: error.reason || "Unknown error"
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find();
    res.status(200).json(hackathons);
  } catch (error) {
    console.error("Error fetching hackathons:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid hackathon ID' });
  }

  try {
    const hackathon = await Hackathon.findById(id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    res.status(200).json(hackathon);
  } catch (error) {
    console.error("Error fetching hackathon:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/register/:id', async (req, res) => {
    const {id} = req.params;
    const {name,address,githubLink,xLink,linkedinLink} = req.body;  
    if (!name || !address || !githubLink) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try{
      const hackathon = await Hackathon.findById(id);
      if(!hackathon) {
        return res.status(404).json({ message: 'Hackathon not found' });
      }
      const newTeam = {
        name,
        address,
        githubLink,
        xLink,
        linkedinLink,
        isRegistered: true,
        isSubmitted: false
      }
      hackathon.teams.push(newTeam);
      hackathon.capacity-=1;
      await hackathon.save();
      res.status(200).json({ message: 'Team registered successfully', team: newTeam });
    }catch(err){
      console.error("Error registering team:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
});



router.post('/submitProject/:teamId/:hackathonId', async (req, res) => {
  const {hackathonId,teamId} = req.params;
  const {projectName, description, demoLink, githubLink} = req.body;
  if (!projectName || !description || !demoLink || !githubLink) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try{
    const hackathon = await Hackathon.findById(hackathonId);
    if(!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    const team = hackathon.teams.find(t => t._id.toString() === teamId);
    const newProject = {
      teamId,
      projectName,
      description,
      demoLink,
      githubLink
    }
    hackathon.projects.push(newProject);
    await hackathon.save();
    res.status(200).json({ message: 'Project submitted successfully', project: newProject });
  }catch(err){
    console.error("Error submitting project:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
})
router.get('/getTeams/:id', async (req, res) => {
  const {id} = req.params;
  try{
    const hackathon = await Hackathon.findById(id);
    if(!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    const teams = hackathon.teams;
    res.status(200).json({ message: 'Teams fetched successfully', teams });
  }catch(err){
    console.error("Error fetching teams:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
})
router.post('/award/:hackathonId/:teamId', async (req, res) => {
  const {hackathonId,teamId} = req.params;
  const {prizeAmount} = req.body;
  if (!prizeAmount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try{
    const hackathon = await Hackathon.findById(hackathonId);
    if(!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    const team = hackathon.teams.find(t => t._id.toString() === teamId);
    if(!team){
      return res.status(404).json({ message: 'Team not found' });
    }
    team.isSubmitted=true;
    await hackathon.save();
    res.status(200).json({ message: 'Prize awarded successfully', prizeAmount });
  }catch(err){
    console.error("Error awarding prize:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
})
router.get('/:hackathonId/submissions',async(req,res)=>{
  const {hackathonId} = req.params;
  try{
    const hackathon = await Hackathon.findById(hackathonId);
    if(!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    const submissions = hackathon.projects;
    res.status(200).json({ message: 'Submissions fetched successfully', submissions });
  }catch(err){
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
})
router.get('/:hackathonId/teams/:address',async(req,res)=>{
  const {hackathonId,address} = req.params;
  try{
    console.log(address);
    const hackathon = await Hackathon.findById(hackathonId);
    if(!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    const team = hackathon.teams.find(t => t.address.toString() === address);
    if(!team){
      return res.status(404).json({ message: 'Team not found' });
    }
    if(team.isSubmitted){
      return res.status(200).json({ isSubmitted: true, isRegistered: true});
    }else{
      return res.status(200).json({ isSubmitted: false, isRegistered: true});
    }
  }catch(err){
    console.error("Error fetching team:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
})
module.exports = router;