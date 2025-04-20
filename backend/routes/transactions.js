const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const Event = require("../models/events");
const QRCode = require("qrcode");
const { ethers } = require("ethers");
const contractAbi = require("../abis/NFTEventTicketing.json");

// Configure provider and signer (Use your own RPC or Infura endpoint)
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// Replace with your private key or load from .env
const signer = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);

// Replace with deployed contract address
const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);


router.post("/:eventId/buy", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { signature, message, walletAddress } = req.body;

    console.log("Verifying signature...");
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    console.log("Recovered Address:", recoveredAddress);
    console.log("Provided Wallet Address:", walletAddress);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

    // Fetch the event
    let event;
    if (eventId.match(/^[0-9a-fA-F]{24}$/)) {
      event = await Event.findById(eventId);
    } else {
      const numEventId = Number(eventId);
      if (isNaN(numEventId)) {
        return res.status(400).json({ error: "Invalid event ID format" });
      }
      event = await Event.findOne({ eventId: numEventId });
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const numericEventId = event.eventId;

    const tx = await contract.buyTicket(numericEventId, {
      value: ethers.utils.parseEther(event.price.toString())
    });

    const receipt = await tx.wait();
    const ticketId = Math.floor(Math.random() * 1000000);

    event.ticketsSold += 1;
    await event.save();

    const ticket = new Ticket({
      ticketId,
      eventId: event.eventId,
      ownerAddress: walletAddress,
      originalOwnerAddress: walletAddress,
      mintedAt: new Date(),
      transferHistory: [{
        fromAddress: null,
        toAddress: walletAddress,
        price: event.price,
        timestamp: new Date(),
        transactionHash: receipt.transactionHash
      }]
    });

    await ticket.save();

    const qrData = JSON.stringify({
      ticketId,
      eventId: event.eventId,
      ownerAddress: walletAddress,
      eventName: event.name
    });

    const qrCode = await QRCode.toDataURL(qrData);

    res.status(201).json({
      message: "Ticket purchased successfully",
      ticket,
      qrCode,
      transactionHash: receipt.transactionHash
    });

  } catch (error) {
    console.error("Error purchasing ticket:", error);
    res.status(500).json({ error: "Failed to purchase ticket" });
  }
});

router.get("/:eventId/tickets",async(req,res)=>{
  const {eventId} = req.params;
  try{
    const tickets = await Ticket.find({eventId});
    res.status(200).json({tickets});
  }catch(err){
    console.error("Error fetching tickets:", err);
    res.status(500).json({error:"Failed to fetch tickets"});
  }
})

router.get("/:ownerAddress/tickets", async (req, res) => {
  const { ownerAddress } = req.params;

  if (!ownerAddress) {
    return res.status(400).json({ error: "Owner address is required" });
  }

  try {
    const normalizedAddress = ownerAddress.toLowerCase();
    console.log("Normalized Address:", normalizedAddress);

    const tickets = await Ticket.find({ ownerAddress: normalizedAddress });
    console.log("Tickets Found:", tickets);

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ error: "No tickets found" });
    }

    return res.status(200).json({ tickets });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});
module.exports = router;
