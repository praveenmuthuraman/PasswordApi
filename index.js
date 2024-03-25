import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./Database/dp.config.js";
import router from "./Routers/User.router.js";

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(cors());

app.use(express.json());
ConnectDB();
app.use("/api", router);
app.listen(port, () => {
  console.log("Server is running on port -", port);
});
