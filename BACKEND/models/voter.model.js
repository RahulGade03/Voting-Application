import mongoose from "mongoose";

const SchoolEnum = ["SCOPE", "SENSE", "SITE", "SELECT", "SMEC", "SCE", "SBST", "HOT", "OTHER"];
const ProfessionEnum = ["Student", "Faculty", "Research Scholar", "Staff"];

const voterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  school: { type: String, enum: SchoolEnum, required: true },
  password: { type: String, required: true },
  profession: { type: String, enum: ProfessionEnum, required: true },
  mustChangePassword: {type: Boolean, default: false}
});

const Voter = mongoose.model("Voter", voterSchema);

export default Voter;
