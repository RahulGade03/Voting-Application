// const express = require("express");
import express from 'express';
// const cors =  require('cors');
import cors from 'cors';
// const adminRoutes = require("./routes/admin.routes.js");
import adminRoutes from "./routes/admin.routes.js";
// const voterRoutes = require("./routes/voter.routes.js");
import voterRoutes from "./routes/voter.routes.js";
import connectDB from './middlewares/connectdb.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/voter", voterRoutes);

app.listen(5000, () => {
    connectDB()
    console.log("Server running on port 5000")
});
