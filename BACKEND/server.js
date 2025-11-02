import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'

dotenv.config();

import adminRoutes from "./routes/admin.routes.js";
import voterRoutes from "./routes/voter.routes.js";
import connectDB from './middlewares/connectdb.js';

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,  // frontend URL
  credentials: true                 // allow cookies/authorization headers
}));
app.use(express.json());

connectDB()

app.use("/admin", adminRoutes);
app.use("/voter", voterRoutes);

app.get('/', (req, res) => {
  res.send("Hello World!");
})

app.listen(5000, () => {
    console.log("Server running on port 5000")
});

export default app;