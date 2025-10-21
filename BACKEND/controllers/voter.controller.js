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
    console.log("Is Valid: " + isValid);
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
    // Extract voter from JWT (authMiddleware should set req.voterId)
    const voter = await Voter.findById(req.id).select('school endDate');
    if (!voter) return res.status(404).json({ error: "Voter not found" });
    const voterHash = req.query.voterHash;
    const now = new Date();

    // Fetch all polls where voter is eligible and still ongoing
    let polls = await Poll.find({
      eligibleSchools: { $in: [voter.school] },
      endDate: { $gt: now },
    });

    // Filter out polls where voter has already voted (on-chain check)
    const availablePolls = [];
    for (const poll of polls) {
      const votes = await contract.methods.getVotesByPoll(poll.pollId).call();
      const hasVoted = votes.some(
        (vote) => vote.voter === voterHash
      );

      if (!hasVoted) {
        availablePolls.push({
          pollId: poll.pollId,
          title: poll.title,
          description: poll.description,
          endDate: poll.duration.endDate,
          eligibleSchools: poll.eligibleSchools,
        });
      }
    }

    res.status(201).json({ polls: availablePolls, success: true });
  } catch (err) {
    console.error("Error fetching available polls:", err);
    res.status(500).json({ error: "Failed to fetch polls", success: false });
  }
};

/* -------------------- 4) VIEW POLL RESULTS (on-chain) -------------------- */
export const pollResults = async (req, res) => {
  try {
    const pollId = req.params.pollId;
    const votes = await contract.methods.getVotesByPoll(pollId).call();

    if (!votes || votes.length === 0) {
      return res.status(404).json({ error: "No votes found for this poll" });
    }

    // Count votes per candidate
    const results = {};
    votes.forEach((vote) => {
      const candidate = vote.candidate.toLowerCase();
      results[candidate] = (results[candidate] || 0) + 1;
    });

    res.json({
      pollId,
      totalVotes: votes.length,
      results
    });
  } catch (err) {
    console.error("Error fetching poll results:", err);
    res.status(500).json({ error: "Failed to fetch poll results" });
  }
};

// implement this in frontend
/* -------------------- 5) VIEW VOTED POLLS (on-chain) -------------------- */
export const myVotes = async (req, res) => {
  try {
    const voterAddress = req.id;
    let votes = await contract.methods.getVotesByVoter(voterAddress).call();

    if (!votes || votes.length === 0) {
      return res.status(404).json({ error: "No votes found for this voter", success: false });
    }

    votes = await Promise.all(
      votes.map(async (vote) => {
        const poll = await Poll.findById(vote.pollId);
        const endDate = poll.endDate;
        return { ...vote, endDate };
      })
    )

    res.status(200).json({ votes });
  } catch (err) {
    console.error("Error fetching voted polls:", err);
    res.status(500).json({ error: "Failed to fetch voted polls" });
  }
};

/* -------------------- 6) CHANGE PASSWORD -------------------- authmiddleware */
export const changePassword = async (req, res) => {
  try {
    console.log( "Change Password Request Received for Voter ID: " + req.id );
    const voter = await Voter.findById(req.id);
    if (!voter) {
      return res.status(404).json({ error: "Voter not found", success: false });
    }
    console.log( "Voter found: " + voter );
    const { newPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    voter.password = hashedNewPassword;
    voter.mustChangePassword = false;
    await voter.save();
    console.log( "Password changed successfully for Voter ID: " + req.id );
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