//  Here Routes for login, register, refresh, logout, api/auth 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const usermodel = require('../models/user')
const authMiddleware = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken')
const Task =require('../models/task')
router.post('/api/register',async (req,res)=>{
    try{
        const {username,email,password,repassword} = req.body;
        const exist =await usermodel.findOne({username});
        if(exist) return res.status(400).json({message:"User already exist"});
        if(password !== repassword) return res.status(400).json({message:"Password not matched"});

        const hashedpassword =await bcrypt.hash(password,10);

        const newUser= new usermodel({email,username,password:hashedpassword});
        await newUser.save();

        res.status(201).json({message:"User succesfully registered"})
    }
    catch(err){
        res.status(500).json({message:"Register Server error", error: err.message});
    }   
});

router.post('/api/login',async (req,res)=>{
    try{
        const {username,password}=req.body;

        const exist =await usermodel.findOne({username});

        if(!exist) return res.status(404).json({message:"user not found"});

        const isMatch = await bcrypt.compare(password,exist.password);

        if(!isMatch) return res.status(401).json({message:"Incorrect password"});

        const accessToken= jwt.sign({userId:exist._id,username:exist.username,email:exist.email},process.env.SECRETKEY,{expiresIn:"1m"});

        const refreshToken= jwt.sign({userId:exist._id,username:exist.username,email:exist.email},process.env.SECRETKEY,{expiresIn:"7d"});

        res.status(200).json({message:"Successfully LoggedIn",accessToken,refreshToken});
    }
    catch(err){
        res.status(500).json({message:"Login Server error",err:err.message})
    }
});

router.post('/api/tasklist', authMiddleware, async (req, res) => {
    try{
        const { title, description, dueDate } = req.body;
        const newTask = new Task({ title, description, dueDate, user: req.user._id });
        await newTask.save();
        res.status(201).json(newTask);
    }
    catch(err){
        res.status(500).json({message:"Tasklist server error",error:err})
    }
  });

router.post('/api/logout', authMiddleware, (req, res) => {
    res.status(200).json({ message: "Successfully logged out" });
  });
  

module.exports=router;