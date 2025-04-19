

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
     const {
       name,
       description,
       image,
       startDate,
       endDate,
       registrationDeadline,
       submissionDeadline,
       totalPrize,
       firstPrize,
       secondPrize,
       thirdPrize,
       currency,
       contractAddress,
       network,
       tokenType,
       organizerAddress
     } = req.body;
   
     if (!name || !description || !startDate || !endDate || !registrationDeadline || !submissionDeadline || !totalPrize || !organizerAddress) {
       return res.status(400).json({ message: 'Missing required fields' });
     }
   
     try {
       // Create the hackathon document
       const newHackathon = new Hackathon({
         name,
         description,
         image,
         startDate,
         endDate,
         registrationDeadline,
         submissionDeadline,
         organizerAddress,
         prizePool: {
           totalAmount: totalPrize,
           currency: currency || "ETH",
           distribution: [
             { rank: 1, amount: firstPrize, description: "First prize" },
             { rank: 2, amount: secondPrize, description: "Second prize" },
             { rank: 3, amount: thirdPrize, description: "Third prize" }
           ]
         },
         web3Integration: {
           contractAddress: contractAddress || contract.address, // fallback to deployed one
           network: network || "localhost",
           tokenType: tokenType || "ERC20"
         }
       });
   
       // Fund the prize pool using smart contract (assumes contract supports this)
       let ethValue;

if (typeof totalPrize === 'number') {
  // Convert number to string
  ethValue = totalPrize.toString();
} else if (totalPrize instanceof ethers.BigNumber) {
  // Use BigNumber directly
  ethValue = ethers.utils.formatEther(totalPrize); // Convert BigNumber to string
} else {
  throw new Error("Invalid totalPrize type");
}

const tx = await contract.fundPrizePool({
  value: ethers.utils.parseEther(ethValue), // Parse the string value
});
const receipt = await tx.wait();
   
       // Save to DB
       await newHackathon.save();
   
       res.status(201).json(newHackathon);
     } catch (error) {
       console.error("Error creating hackathon:", error);
       console.log("Total Prize:", totalPrize, "Type:", typeof totalPrize);
       res.status(500).json({ message: 'Server error', error });
     }
   });
   

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