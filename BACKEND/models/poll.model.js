import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const SchoolEnum = ["SCOPE", "SENSE", "SITE", "SELECT", "SMEC", "SCE", "SBST", "HOT"];

const pollSchema = new mongoose.Schema({
  pollId: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Voter", required: true }],
  eligibleSchools: { type: [String], enum: SchoolEnum, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
});

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;