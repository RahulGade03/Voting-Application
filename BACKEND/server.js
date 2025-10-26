import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import adminRoutes from "./routes/admin.routes.js";
import voterRoutes from "./routes/voter.routes.js";
import connectDB from './middlewares/connectdb.js';

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  credentials: true                 // allow cookies/authorization headers
}));
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/voter", voterRoutes);

connectDB()
app.listen(5000, () => {
    console.log("Server running on port 5000")
});