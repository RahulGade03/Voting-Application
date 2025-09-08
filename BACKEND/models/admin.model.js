const mongoose = require("mongoose");

const SchoolEnum = ["SCOPE", "ALL", "SENSE", "SITE", "HOT"];

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdPolls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poll" }],
  school: {type: String, enum: SchoolEnum, required: true},
  access: {type: String, enum: SchoolEnum, required: true}
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };