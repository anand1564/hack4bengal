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
const contractAddress = "0x364837Bfe8D9d36150801A71E187E5b96B3ADC7C";
const contract = new ethers.Contract(contractAddress, contractAbi.abi, signer);

router.post("/:eventId/buy", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { buyerAddress } = req.body;

    console.log("Received eventId:", eventId);

    // Find the event document first
    let event;

    if (eventId.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a MongoDB ObjectId, query by _id
      event = await Event.findById(eventId);
    } else {
      // Try to convert to Number for eventId field
      const numEventId = Number(eventId);
      if (isNaN(numEventId)) {
        return res.status(400).json({ error: "Invalid event ID format" });
      }
      event = await Event.findOne({ eventId: numEventId });
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    console.log("Found event:", event);

    // IMPORTANT: Use the numeric eventId from the event document 
    // for smart contract interaction
    const numericEventId = event.eventId;
    console.log("Using numeric eventId for contract:", numericEventId);

    // Now interact with the contract using the numeric ID
    const tx = await contract.buyTicket(numericEventId, {
      value: ethers.utils.parseEther(event.price.toString()) // Set appropriate value
    });

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Generate a unique ticket ID
    const ticketId = Math.floor(Math.random() * 1000000);

    event.ticketsSold += 1;
    await event.save();
    // Create a new ticket in the database
    const ticket = new Ticket({
      ticketId,
      eventId: event.eventId, // Use the numeric eventId
      ownerAddress: buyerAddress,
      originalOwnerAddress: buyerAddress,
      mintedAt: new Date(),
      transferHistory: [{
        fromAddress: null,
        toAddress: buyerAddress,
        price: event.price,
        timestamp: new Date(),
        transactionHash: receipt.transactionHash
      }]
    });

    await ticket.save();

    // Generate QR code
    const qrData = JSON.stringify({
      ticketId,
      eventId: event.eventId,
      ownerAddress: buyerAddress,
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

module.exports = router;
