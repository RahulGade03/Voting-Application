// middlewares/connectdb.js
import mongoose from "mongoose";

let isConnected = false; // Global flag

const connectDB = async () => {
  if (isConnected) { // Already connected
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDB;
