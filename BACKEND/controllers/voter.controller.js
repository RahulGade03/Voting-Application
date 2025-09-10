import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Voter from "../models/voter.model.js";   // Your voter schema
import Poll from "../models/poll.model.js";     // Poll schema created by admin
import authMiddleware from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";

dotenv.config();


// Web3 + Smart contract setup
// const {Web3} = require("web3");
// const contractABI = require("../ABI.json");
// const contractAddress = "0xYourDeployedContractAddress";   // deployed contract
// const web3 = new Web3(process.env.WEB3_PROVIDER_URL);
// const contract = new web3.eth.Contract(contractABI, contractAddress);

/* -------------------- 1) VOTER LOGIN -------------------- */
export const voterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const voter = await Voter.findOne({ email });
    if (!voter) return res.status(404).json({ error: "Voter not found" });

    const isMatch = await bcrypt.compare(password, voter.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ voterId: voter._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

/* -------------------- 2) VOTER LOGOUT -------------------- */
export const voterLogout = (req, res) => {
  // Just clear token client-side or add to blacklist
  res.json({ message: "Logged out successfully" });
};

/* -------------------- 3) VIEW AVAILABLE POLLS -------------------- */
export const availablePolls = async (req, res) => {
  try {
    // Extract voter from JWT (authMiddleware should set req.voterId)
    const voter = await Voter.findById(req.id);
    if (!voter) return res.status(404).json({ error: "Voter not found" });

    const now = new Date();

    // Fetch all polls where voter is eligible and still ongoing
    let polls = await Poll.find({
      eligibleSchool: voter.school,
      "duration.endDate": { $gt: now },
    });

    // Filter out polls where voter has already voted (on-chain check)
    const availablePolls = [];
    for (const poll of polls) {
      const votes = await contract.methods.getVotesByPoll(poll.pollId).call();
      const hasVoted = votes.some(
        (vote) => vote.voter.toLowerCase() === voter.metamaskid.toLowerCase()
      );

      if (!hasVoted) {
        availablePolls.push({
          pollId: poll.pollId,
          title: poll.title,
          description: poll.description,
          endDate: poll.duration.endDate,
          eligibleSchool: poll.eligibleSchool,
        });
      }
    }

    res.json({ polls: availablePolls });
  } catch (err) {
    console.error("Error fetching available polls:", err);
    res.status(500).json({ error: "Failed to fetch polls" });
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

    res.json({ pollId, totalVotes: votes.length, results, votes });
  } catch (err) {
    console.error("Error fetching poll results:", err);
    res.status(500).json({ error: "Failed to fetch poll results" });
  }
};

/* -------------------- 5) VIEW VOTED POLLS (on-chain) -------------------- */
export const myVotes = async (req, res) => {
  try {
    const voterAddress = req.id;
    const votes = await contract.methods.getVotesByVoter(voterAddress).call();

    if (!votes || votes.length === 0) {
      return res.status(404).json({ error: "No votes found for this voter" });
    }

    res.json({ voter: voterAddress, votes });
  } catch (err) {
    console.error("Error fetching voted polls:", err);
    res.status(500).json({ error: "Failed to fetch voted polls" });
  }
};