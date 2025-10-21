import mongoose from "mongoose";

const SchoolEnum = ["SCOPE", "ALL", "SENSE", "SITE", "HOT"];

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
  school: {type: String, enum: SchoolEnum, required: true},
  access: {type: String, enum: SchoolEnum, required: true},
  mustChangePassword: {type: Boolean, defalut: false}
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;