import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.schema.js";

dotenv.config();

const verifyToken =(req,res,next)=>{
    const authHeader = req.headers.authorization;

if(!authHeader){
    res.status(401).json({message:"Missing Token"})
}
const token =authHeader.split(' ')[1];
jwt.verify(token, process.env.JWT_SECRET,async(err,decode)=>{
    if(err){
        return res.status(403).json({message:"Invalid Token"})
    }
    const user =await User.findOne({_id:decode.id})
    if(!user){
        return res.status(404).json({message:"User Not Found"})
    }
    req.user =user;
    next();
});

};

export default verifyToken;