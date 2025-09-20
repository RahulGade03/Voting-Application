import mongoose from "mongoose";

const SchoolEnum = ["SCOPE", "SENSE", "SITE", "HOT", "OTHER"];
const ProfessionEnum = ["Student", "Faculty", "Research Scholar", "Staff"];

const voterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  metamaskId: { type: String, unique: true, required: true }, // blockchain ID
  emailId: { type: String, required: true, unique: true },
  school: { type: String, enum: SchoolEnum, required: true },
  password: { type: String, required: true },
  profession: { type: String, enum: ProfessionEnum, required: true },
  pollsVoted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }]
});

const Voter = mongoose.model("Voter", voterSchema);

export default Voter;