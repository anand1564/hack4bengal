

const express = require('express');
const Hackathon = require('../models/hackathons');
const router = express.Router();
const contractAbi = require('../abis/NFTEventTicketing.json');
const { ethers } = require('ethers'); 

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// Replace with your private key or load from .env
const signer = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);

// Replace with deployed contract address
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);

router.post('/create', async (req, res) => {
     const { name, description, eventType, ticketPrice, startDate,endDate,location,totalPrize,
          firstPrize, secondPrize, thirdPrize } = req.body;
     
     // Validate the request body
     if (!name || !description || !eventType || !price || !capacity) {
          return res.status(400).json({ message: 'All fields are required' });
     }
     
     try{
     // Check if the event type is valid
     const validEventTypes = ['IN_PERSON', 'LIVE_SESSION', 'HACKATHON'];
     if (!validEventTypes.includes(eventType)) {
          return res.status(400).json({ message: 'Invalid event type' });
     }
     const hackathonId = Math.floor(Math.random() * 1000000);
     // Create a new hackathon event
     const newHackathon = new Hackathon({
          hackathonId,
          name,
          description,
          eventType,
          price,
          location,
          startDate,
          endDate,
          ticketPrice,
          totalPrize,
          firstPrize,
          secondPrize,
          thirdPrize
     });
     const tx = await contract.fundPrizePool({
          value: ethers.utils.parseEther(totalPrize.toString())
     });
     const receipt = await tx.wait();
     // Save the hackathon to the database (assuming you have a Hackathon model)
     // const savedHackathon = await Hackathon.create(newHackathon);
    await newHackathon.save();
     
     res.status(201).json(newHackathon);
     } catch (error) {
     console.error(error);
     res.status(500).json({ message: 'Server error' });
     }
})

router.get('/getAll', async (req, res) => {
     try {
          const hackathons = await Hackathon.find();
          res.status(200).json(hackathons);
     } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
     }
})

module.exports= router;