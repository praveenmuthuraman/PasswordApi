import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURL = process.env.DB_STRING;
const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(mongoURL);
    console.log("Connected to the mongoDB");
  } catch (error) {}
};

export default ConnectDB;
