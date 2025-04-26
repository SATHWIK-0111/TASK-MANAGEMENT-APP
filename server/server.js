const express = require('express')
require('dotenv').config()
const bcrypt = require('bcrypt')
const connectDB = require('./config/db')
const cors =require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const auth =require('./middlewares/authMiddleware')
connectDB();
const app=express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use('/', authRoutes);
app.use('/',taskRoutes);
app.get("/api/validate-token", auth, (req, res) => {
    console.log("Token is valid")
    res.send("Token is valid");
});

app.listen(process.env.PORT,async (req,res)=>{
    await console.log("Server started and running");
})