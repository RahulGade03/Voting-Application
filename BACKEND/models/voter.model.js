const mongoose = require("mongoose");

const SchoolEnum = ["SCOPE", "ALL", "SENSE", "SITE", "HOT"];
const ProfessionEnum = ["student", "faculty", "research scholar", "staff"];

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

module.exports = { Voter };