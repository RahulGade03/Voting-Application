import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const SchoolEnum = ["SCOPE", "ALL", "SENSE", "SITE", "HOT"];

const pollSchema = new mongoose.Schema({
  pollId: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  candidates: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Voter", required: true }
  ],
  votes: [{
    candidateId: { 
      type: mongoose.Schema.Types.ObjectId, ref: "Voter",
      validate: {
        validator: function(candidateId) {
          // Ensure candidateId exists in this poll's candidates array
          return this.candidates.includes(candidateId);
        },
        message: "candidateId must be one of the candidates of this poll."
      }
    },
    voterHash: { type: String, ref: "Voter" }
  }],
  eligibleSchools: { type: [String], enum: SchoolEnum, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
});

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;