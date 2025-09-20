import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/admin.model.js";
import Voter from "../models/voter.model.js";
import Poll from "../models/poll.model.js";
import { v4 as uuidv4 } from "uuid";
import contract from "../blockchain/contract.js";
// import { Web3 } from "web3";
// import contractABI from "../ABI.json"; // ABI from Remix build
// const contractAddress = "0xYourDeployedContractAddress";   // Replace with your deployed contract

dotenv.config();


// const web3 = new Web3(process.env.WEB3_PROVIDER_URL);

// const contract = new web3.eth.Contract(contractABI, contractAddress);

// console.log("Loaded WEB3_PROVIDER_URL =", process.env.WEB3_PROVIDER_URL);

/* -------------------- 1) Admin Login -------------------- */
export const adminLogin = async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const admin = await Admin.findOne({ emailId });
    if (!admin) return res.status(400).json({ error: "Invalid email" });

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { userId: admin._id, emailId: admin.emailId }, 
      process.env.JWT_SECRET_KEY, {
      expiresIn: "2h"
    });
    const tempAdmin = {
      id: admin._id,
      name: admin.name,
      emailId: admin.emailId,
      createdPolls: admin.createdPolls,
      school: admin.school,
      access: admin.access
    }
    res.status(200).cookie('token', token, {httpOnly: true, sameSite:'strict', maxAge: 1*24*60*60*1000}).json({ admin: tempAdmin});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* -------------------- 2) Admin Logout -------------------- authmiddleware */
export const adminLogout = async (req, res) => {
    try {
        return res.cookie ('token', '', {maxAge: 0}).json ({
            message: 'Successfully logged out!',
            success: true,
        })
    } catch (error) {
        console.log (error);
    }
}

/* -------------------- 3) Create Poll -------------------- authmiddleware */
export const createPoll = async (req, res) => {
  try {
    const { title, description, candidates, schools, endDate } = req.body;
    const candidatesIDs = await Promise.all(
      candidates.map((cand) => (
      Voter.findOne({ emailId: cand.emailId }).then((voter) => {
        if (!voter) {
          throw new Error(`Candidate with email ${cand.emailId} not found`);
        }
        return voter._id;
      })
    ))
    );

    const poll = new Poll({
      pollId: uuidv4(),
      title,
      description,
      candidates: candidatesIDs,
      voters:[],
      votes: [],
      eligibleSchool: schools,
      startDate: new Date(),
      endDate: new Date(endDate),
      createdBy: req.id
    });

    await poll.save();

    // Link to admin
    await Admin.findByIdAndUpdate(req.id, { $push: { createdPolls: poll._id } });

    res.status(201).json({ message: "Poll created successfully", poll, success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create poll", details: err.message, success: false });
  }
};

/* -------------------- 4) Register Voter -------------------- authmiddleware */
export const registerVoter = async (req, res) => {
  try {
    const { name, metamaskId, emailId, school, password, profession } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const voter = new Voter({
      name,
      metamaskId,
      emailId,
      school,
      password: hashedPassword,
      profession
    });

    await voter.save();
    res.status(201).json({ message: "Voter registered successfully", voter, success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to register voter", details: err.message });
  }
};

/* -------------------- 5) List Polls Created by Admin -------------------- authmiddleware */
export const pollList = async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.id }).populate("candidates");

    const pollsWithVotes = await Promise.all(
      polls.map(async (poll) => {
        // Get votes from blockchain
        let chainVotes = await contract.methods.getVotesByPoll(poll.pollId).call();

        // Format blockchain votes
        chainVotes = chainVotes.map((v) => ({
          pollId: v.pollId,
          candidate: v.candidate,
          voter: v.voter,
        }));

        return {
          pollId: poll.pollId,
          title: poll.title,
          description: poll.description,
          candidates: poll.candidates,
          eligibleSchool: poll.eligibleSchool,
          startDate: poll.startDate,
          endDate: poll.endDate,
          votes: chainVotes,
        };
      })
    );

    res.status(200).json({ polls: pollsWithVotes, success: true });
  } catch (err) {
    console.error("pollList error:", err);
    res.status(500).json({ error: "Failed to fetch polls", details: err.message });
  }
};

/* -------------------- 6) View Poll Results by Poll ID -------------------- authmiddleware */
export const pollResult = async (req, res) => {
  try {
    const pollId = req.params.pollId;

    // Call smart contract function (returns array of votes)
    const votes = await contract.methods.getVotesByPoll(pollId).call();

    if (!votes || votes.length === 0) {
      return res.status(404).json({ error: "No votes found for this poll" });
    }

    // Count votes per candidate
    const results = {};
    votes.forEach((vote) => {
      const candidateAddr = vote.candidate.toLowerCase();
      results[candidateAddr] = (results[candidateAddr] || 0) + 1;
    });

    res.json({
      pollId,
      totalVotes: votes.length,
      results
    });
  } catch (err) {
    console.error("Blockchain error:", err);
    res.status(500).json({ error: "Failed to fetch poll results from blockchain" });
  }
};

/* -------------------- 7) View All Voters -------------------- authmiddleware */
export const viewVoters = async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json(voters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch voters" });
  }
};

/* -------------------- 8) View a Particular Voter -------------------- authmiddleware */
export const viewVoter = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);
    if (!voter) return res.status(404).json({ error: "Voter not found" });
    res.json(voter);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch voter" });
  }
};

/* -------------------- 9) Delete Voter -------------------- authmiddleware */
export const deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.params.id);
    if (!voter) return res.status(404).json({ error: "Voter not found" });
    res.json({ message: "Voter deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete voter" });
  }
};