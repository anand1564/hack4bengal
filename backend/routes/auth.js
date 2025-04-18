

const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/signup',async(req,res)=>{
     try{
     const {address,password,name,email} = req.body;
     if(!address || !password || !name || !email){
          return res.status(400).json({message:"Please fill all the fields"});
     }
     if(password.length < 6){
          return res.status(400).json({message:"Password should be at least 6 characters"});
     }
     const existingUser = await User.findOne({address}).maxTimeMS(1000);
     if(existingUser){
          return res.status(400).json({message:"User already exists"});
     }
     const hashedPassword = await bcrypt.hash(password,10);
     const user = new User({
          address,
          password:hashedPassword,
          name,
          email
     });
     await user.save();
     const token = jwt.sign({id:user._id},"hack4bengal123",{expiresIn:'1d'});
     res.status(201).json({message:"User created successfully",token});
}catch(err){
     console.error(err);
}
})

router.post('/signin', async (req, res) => {
     try {
       const { address, password } = req.body;
   console.log(address, password);
       if (!address || !password) {
         return res.status(400).json({ message: "Please fill all the fields" });
       }

       const existingUser = await User.findOne({ address });

       if (!existingUser) {
         return res.status(400).json({ message: "User does not exist" });
       }
   console.log(existingUser.password); 
       const isMatched = await bcrypt.compare(password, existingUser.password || "");

       if (!isMatched) {
         return res.status(400).json({ message: "Invalid credentials" });
       }

       const token = jwt.sign({ id: existingUser._id }, "hack4bengal123", {
         expiresIn: '1d',
       });

       res.status(200).json({ message: "User signed in successfully", token });
     } catch (err) {
       console.error(err);
       res.status(500).json({ message: "Internal server error" });
     }
   });

module.exports = router;