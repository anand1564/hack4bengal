

const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
const Event = require('../models/events');
const Ticket = require('../models/ticket');
const User = require('../models/user');
const userMiddleware = require('../middlewares/userMiddleware');
const { events } = require('../models/events');

router.post('/createEvent', userMiddleware, async (req, res) => {
     const { name, description, eventType, price, capacity, startDate, endDate, organizerAddress } = req.body;
     const eventId = Math.floor(Math.random() * 1000000);
     try {
       const event = new Event({
         eventId,
         name,
         description,
         eventType,
         price,
         capacity,
         startDate,
         endDate,
         organizerAddress,
       });
       await event.save();
       res.status(201).json({ message: 'Event created successfully', event });
     } catch (err) {
       res.status(500).json({ message: 'Error creating event', error: err.message });
     }
   });
router.get('/getEvents/all',userMiddleware,async(req,res)=>{
     try{
          const events = await Event.find();
          res.status(200).json(events);
     }catch(err){
          console.log(err);
          res.status(500).json({message: "Error fetching events"});
     }
})
router.get('/getEvents/:eventId', userMiddleware, async (req, res) => {
     try {
       const { eventId } = req.params;

       const event = await Event.findOne({ eventId: eventId });

       if (!event) {
         return res.status(404).json({ message: "Event not found" });
       }

       res.status(200).json(event);
     } catch (err) {
       console.error(err);
       res.status(500).json({ message: "Error fetching event" });
     }
});

module.exports = router;