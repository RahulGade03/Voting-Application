import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const SchoolEnum = ["SCOPE", "ALL", "SENSE", "SITE", "HOT"];
const PollStatusEnum = ["ongoing", "completed"];

const pollSchema = new mongoose.Schema({
  pollId: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  candidates: [
    {
      metamaskId: {
        type: String,
        required: true,
        validate: {
          validator: async function (value) {
            // Ensure candidate exists in voter DB
            const voter = await mongoose.model("Voter").findOne({ metamaskId: value });
            return !!voter;
          },
          message: "Candidate metamaskId must exist in voter database"
        }
      },
      name: { type: String, required: true }
    }
  ],
  voters: [
    {
      metamaskId: {
        type: String,
        required: true,
        validate: {
          validator: async function (value) {
            // Ensure voter exists in voter DB
            const voter = await mongoose.model("Voter").findOne({ metamaskId: value });
            return !!voter;
          },
          message: "Voter metamaskId must exist in voter database"
        }
      }
    }
  ],
  votes: [
    {
      candidateMetamaskId: { type: String, required: true },
      voterMetamaskId: { type: String, required: true }
    }
  ],
  eligibleSchool: { type: String, enum: SchoolEnum, required: true },
  duration: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  status: { type: String, enum: PollStatusEnum, default: "ongoing" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }
});

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;