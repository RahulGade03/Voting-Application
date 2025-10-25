import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Voter from "../models/voter.model.js";   // Your voter schema
import Poll from "../models/poll.model.js";     // Poll schema created by admin
import dotenv from "dotenv";
import contract from "../blockchain/contract.js";
import crypto from "crypto";
import sendCredentialsMail from "../utils/nodemailer.js";

dotenv.config();

/* -------------------- 1) VOTER LOGIN -------------------- */
export const voterLogin = async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const voter = await Voter.findOne({ emailId });
    if (!voter) return res.status(404).json({ error: "Voter not found", status: false });

    const isValid = await bcrypt.compare(password, voter.password);
    // console.log("Is Valid: " + isValid);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials", status: false });

    const token = jwt.sign(
      { userId: voter._id, emailId: voter.emailId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
      voter: voter,
      success: true
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", success: false });
  }
};

/* -------------------- 2) VOTER LOGOUT -------------------- */
export const voterLogout = async (req, res) => {
  try {
    return res.cookie('token', '', { maxAge: 0 }).json({
      message: 'Successfully logged out!',
      success: true,
    })
  } catch (error) {
    console.log(error);
  }
}

// Implement this in frontend
/* -------------------- 3) VIEW AVAILABLE POLLS -------------------- */
export const availablePolls = async (req, res) => {
  try {
    const voter = await Voter.findById(req.id).select('-password');
    if (!voter) return res.status(404).json({ error: "Voter not found" });

    // Get all polls eligible for this voter's school
    let polls = await Poll.find({
      eligibleSchools: { $in: [voter.school] }
    }).populate([
      { path: 'candidates', select: 'name emailId' },
      { path: 'createdBy', select: 'name emailId' }
    ]);

    // Filter out polls already voted (by MongoDB _id)
    const notVotedPolls = polls.filter((poll) =>
      !voter.pollsVoted.some((id) => id.toString() === poll._id.toString())
    );

    res.status(200).json({ polls: notVotedPolls, success: true });
  } catch (err) {
    console.error("Error fetching available polls:", err);
    res.status(500).json({ error: "Failed to fetch polls", success: false });
  }
};


/* -------------------- 4) VIEW POLL RESULTS (on-chain) -------------------- */
export const pollResult = async (req, res) => {
  try {
    const pollId = req.params.pollId;
    let poll = await Poll.findOne({ pollId: pollId }).populate([{path: 'candidates', select: 'name emailId _id'}, {path: 'createdBy', select: 'name emailId'}]).lean();
    if (!poll) return  res.status(404).json({ error: "Poll not found", success: false });

    // Call smart contract function (returns array of votes)
    const votes = await contract.methods.getVotesByPoll(pollId).call();

    // Count votes per candidate
    const results = {};
    votes.forEach((vote) => {
      const candidateAddr = vote.candidate.toLowerCase();
      results[candidateAddr] = (results[candidateAddr] || 0) + 1;
    });

    poll = {...poll, results};

    res.status(200).json({
      poll,
      totalVotes: votes.length,
      success: true
    });
  } catch (err) {
    console.error("Error fetching poll results:", err);
    res.status(500).json({ err, status: false });
  }
};

// /* -------------------- 5) VIEW VOTED POLLS -------------------- */
export const myVotedPolls = async (req, res) => {
  try {
    const voter = await Voter.findById(req.id).select('-password');
    if (!voter) return res.status(404).json({ error: "Voter not found" });
    const school = voter.school;

    // Get all polls eligible for this voter's school
    let polls = await Poll.find({
      eligibleSchools: { $in: [school] }
    }).select('_id pollId title description startDate endDate');
    if (!polls) return res.status(404).json({ error: "No polls found" });
    res.status(200).json({ polls, success: true });
  } catch (err) {
    console.error("Error fetching voted polls:", err);
    res.status(500).json({ err, status: false });
  }
};

/* -------------------- 6) CHANGE PASSWORD -------------------- authmiddleware */
export const changePassword = async (req, res) => {
  try {
    console.log("Change Password Request Received for Voter ID: " + req.id);
    const voter = await Voter.findById(req.id);
    if (!voter) {
      return res.status(404).json({ error: "Voter not found", success: false });
    }
    console.log("Voter found: " + voter);
    const { newPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    voter.password = hashedNewPassword;
    voter.mustChangePassword = false;
    await voter.save();
    console.log("Password changed successfully for Voter ID: " + req.id);
    res.status(200).json({ message: "Password changed successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Falied to change password", success: false });
  }
}


/* -------------------- 11) Forgot Password -------------------- */
export const forgotPassword = async (req, res) => {
  const { emailId } = req.body;
  try {
    // console.log("Forgot Password Request Received");
    // console.log("Email: " + emailId);
    const voter = await Voter.findOne({ emailId });
    if (!voter) {
      return res.status(404).json({ error: "Voter not found", success: false });
    }
    // console.log("Voter found: " + voter);
    const newPassword = crypto.randomBytes(8).toString('hex');
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    voter.password = hashedNewPassword;
    voter.mustChangePassword = true;
    await voter.save();
    // console.log("New password set for voter");
    const text = `Dear ${voter.name},

Your password has been reset. Please use the following temporary password to log in:
Type: Voter Account
Temporary Password: ${newPassword}

For security reasons, you will be required to change this password upon your next login.
Best regards,
`;
    // console.log("Sending credentials email to voter");
    await sendCredentialsMail(emailId, text);
    // console.log("Credentials email sent to voter");
    res.status(200).json({ message: "Password reset information sent to your email", success: true });
  }
  catch (error) {
    res.status(500).json({ error: "Failed to process forgot password", success: false });
  }
}