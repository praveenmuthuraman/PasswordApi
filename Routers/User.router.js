import express from "express";
import bcrypt from "bcrypt";
import User from "../model/user.schema.js";
import  jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyToken from "../middleware/user.verify.js";
import nodemailer from 'nodemailer'

dotenv.config()

const router = express.Router();

router.get("/test", (req, res) => res.json({ message: "API Testing success" }));


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(200).json({ message: "Registration successful" ,data:newUser});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/login',async(req,res)=>{
try {
    const { email, password } = req.body;
    const user = await User.findOne({email}); 
    if(!user){
        return res.status(401).json({message:"User Not Found"})
    }
    const passwordMatch =await bcrypt.compare(password,user.password)
    if(!passwordMatch){
        return res.status(401).json({message:"Invalid Password"})
    }
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: "1h"});

    res.status(200).json({ message: "Login successful",token:token });

   } catch (error) {
     console.log(error);
     res.status(500).json({ error: "Internal Server Error" });
    
   }
})

router.get('/data',verifyToken,(req,res)=>{
    res.json({message:`welcome,${req.user.username}`})
})

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const token = Math.random().toString(36).slice(-8);
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 360000;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "praveenmuthuraman4756@gmail.com",
      pass: "kbrk sqir ojzg lvqz",
    },
  });
  let mailOptions = {
    from: "praveenmuthuraman4756@gmail.com",
    to: user.email,
    subject: "Password Reset link",
    text: `https://passwordapi.onrender.com/reset-password/${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(404)
        .json({ message: "Something went wrong, Try Again" });
    }
    res.status(200).json({ message: "Email send Successful" });
  });
});

router.post('/reset-password/:token', async(req,res)=>{
    const {token} =req.params;
    const {password}=req.body;

    const user =await User.findOne({
        resetPasswordToken:token,
        resetPasswordExpires:{$gt:Date.now()},
});
if(!user){
    return res.status(404).json({message:"Invalid Token"})
}
const hashPassword =await bcrypt.hash(password,10)
user.password =hashPassword;
user.resetPasswordToken =null;
user.resetPasswordExpires=null;

await user.save();

res.json({message:"password update successful"})

})

export default router;
