import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto"
import { v4 as uuidv4 } from "uuid";

import Admin from "../models/admin.model.js";
import Voter from "../models/voter.model.js";
import Poll from "../models/poll.model.js";
import contract from "../blockchain/contract.js";
import sendCredentialsMail from "../utils/nodemailer.js";

dotenv.config();

/* -------------------- 1) Admin Login -------------------- */
export const adminLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const admin = await Admin.findOne({ emailId });
    if (!admin) {
      return res.status(400).json({
        error: "Invalid email",
        success: false
      });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(400).json({
        error: "Invalid password",
        success: false
      });
    }

    const token = jwt.sign(
      { userId: admin._id, emailId: admin.emailId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const tempAdmin = {
      id: admin._id,
      name: admin.name,
      emailId: admin.emailId,
      createdPolls: admin.createdPolls,
      school: admin.school,
      access: admin.access
    }

    res.status(200)
      .cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 })
      .json({ admin: tempAdmin, success: true });

  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false
    });
  }
};

/* -------------------- 2) Admin Logout -------------------- authmiddleware */
export const adminLogout = async (req, res) => {
  try {
    return res.cookie('token', '', { maxAge: 0 }).json({
      message: 'Successfully logged out!',
      success: true,
    })
  } catch (error) {
    console.log(error);
  }
}

/* -------------------- 3) Create Poll -------------------- authmiddleware */
export const createPoll = async (req, res) => {
  try {
    const { title, description, candidates, schools, endDate } = req.body;

    let ED = new Date(endDate);
    ED.setDate(ED.getDate() + 1);

    const candidatesIDs = await Promise.all(
      candidates.map(async (emailId) => {
        const voter = await Voter.findOne({ emailId })
        if (!voter) {
          throw new Error(`Candidate with email ${emailId} not found`);
        }
        return voter._id;
      })
    );
    /* Why we used Promise.all() here? 
    Because Voter.findOne() inside candidates.map(...) returns a Promise (one for each candidate).
    And the map makes it an array of promises. Promise.all() waits for all these Promises to resolve
    and returns a single Promise that resolves to an array of candidate IDs.
    If we did not use Promise.all(), we would end up with an array of unresolved Promises instead of 
    actual candidate IDs.
    */

    const poll = new Poll({
      pollId: uuidv4(),
      title,
      description,
      candidates: candidatesIDs,
      voters: [],
      votes: [],
      eligibleSchools: schools,
      startDate: new Date(),
      endDate: ED,
      createdBy: req.id
    });

    await poll.save();

    // Link to admin
    await Admin.findByIdAndUpdate(req.id, { $push: { createdPolls: poll._id } });

    res.status(201).json({
      message: "Poll created successfully",
      poll,
      success: true
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
      success: false
    });
  }
};

/* -------------------- 4) Register Voter -------------------- authmiddleware */
export const registerVoter = async (req, res) => {
  try {
    const { name, emailId, school, profession } = req.body;

    const password = crypto.randomBytes(8).toString('hex'); // creating a random password for initial login
    const hashedPassword = await bcrypt.hash(password, 10);

    let voter = new Voter({
      name,
      emailId,
      school,
      password: hashedPassword,
      profession,
      mustChangePassword: true
    });

    await voter.save();

    const text = `Hello ${name},

Your account has been created successfully!

Login Details:
Type: Voter Account
Username (email): ${emailId}
Password: ${password}

Please login and change your password immediately.

- Voting Application Team`;

    await sendCredentialsMail(emailId, text);

    res.status(201).json({
      message: "Voter registered successfully",
      success: true
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to register voter",
      details: err.message,
      success: false
    });
  }
};

/* -------------------- 4) Register Admin -------------------- authmiddleware */
export const registerAdmin = async (req, res) => {
  try {
    const superAdmin = await Admin.findOne({ _id: req.id });
    if (superAdmin.access !== "ALL") {
      return res.status(403).josn({
        error: "Access denied. Only super admins can register new admins.",
        success: false
      });
    }

    const { name, emailId, school, access } = req.body;
    const password = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      emailId,
      password: hashedPassword,
      school,
      access,
      mustChangePassword: true
    });

    await admin.save();
    const text = `Hello ${name},

Your account has been created successfully!

Login Details:
Type: Admin Account
Username (email): ${emailId}
Password: ${password}

Please login and change your password immediately.

- Voting Application Team`;

    await sendCredentialsMail(emailId, text);

    res.status(201).json({
      message: "Admin registered successfully",
      success: true
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to register admin", details: err.message, success: false });
  }
};

/* -------------------- 5) List Polls Created by Admin -------------------- authmiddleware */
export const pollList = async (req, res) => {
  try {
    let polls = await Poll.find({
      createdBy: req.id
    }).populate([
      { path: 'candidates', select: 'name emailId _id' },
      { path: 'createdBy', select: 'name emailId' }
    ]).lean();  // lean says: Don’t give me fancy Mongoose documents. Just give me plain JS objects — directly from MongoDB.

    res.status(200).json({
      polls,
      success: true
    });

  } catch (err) {
    res.status(500).json({
      error: err.toString(),
      success: false
    });
  }
};

/* -------------------- 6) View Poll Results by Poll ID -------------------- authmiddleware */
export const pollResult = async (req, res) => {
  try {
    const pollId = req.params.pollId;
    let poll = await Poll.findOne({
      pollId: pollId
    }).populate([
      { path: 'candidates', select: 'name emailId _id' },
      { path: 'createdBy', select: 'name emailId' }
    ]).lean();

    if (!poll) {
      return res.status(404).json({
        error: "Poll not found",
        success: false
      });
    }

    // Call smart contract function (returns array of votes)
    const votes = await contract.methods.getVotesByPoll(pollId).call();

    // Count votes per candidate
    const results = {};
    votes.forEach((vote) => {
      const candidate = vote.candidateName;
      results[candidate] = (results[candidate] || 0) + 1;
    });

    poll = { ...poll, results };

    res.status(200).json({
      poll,
      totalVotes: votes.length,
      success: true
    });

  } catch (err) {
    res.status(500).json({
      error: err,
      success: false
    });
  }
};

/* -------------------- 7) View All Voters -------------------- authmiddleware */
// used pagination
export const viewVoters = async (req, res) => {
  try {
    // Get page number from query params (default to 1)
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // 10 voters per batch

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch 10 voters for the requested page
    const voters = await Voter.find()
      .skip(skip)
      .limit(limit)
      .select('-password');

    // Total count for frontend pagination
    const totalVoters = await Voter.countDocuments();

    res.status(200).json({
      total: totalVoters,
      page,
      totalPages: Math.ceil(totalVoters / limit),
      voters,
      success: true
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch voters",
      success: false
    });
  }
};


/* -------------------- 8) View a Particular Voter -------------------- authmiddleware */
export const viewVoter = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id)
      .select('-password -pollsVoted');

    if (!voter) {
      return res.status(404).json({
        error: "Voter not found",
        success: false
      });
    }

    res.status(200).json({ voter, success: true });

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch voter",
      success: false
    });
  }
};

/* -------------------- 9) Get Voter List by Name ---------- authmiddleware */

export const getVoterListByName = async (req, res) => {
  try {
    const searchString = req.query.searchString;
    const voters = await Voter.find({
      name: { $regex: searchString, $options: "i" } // 'i' for case-insensitive
    }).select("-password");
    // console.log(voters);
    if (voters.length == 0) {
      return res.status(400).json({
        error: "Voter not found!",
        success: false
      })
    }

    return res.status(200).json({
      voters,
      success: true
    })

  } catch (error) {
    console.log(error);
  }
}

/* -------------------- 10) Delete Voter -------------------- authmiddleware */
export const deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.params.id);
    if (!voter) {
      return res.status(404).json({
        error: "Voter not found",
        success: false
      });
    }

    res.status(200).json({
      voter,
      message: "Voter deleted successfully",
      success: true
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to delete voter",
      success: false
    });
  }
};

/* -------------------- 11) Change Password -------------------- authmiddleware */
export const changePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        error: "Admin not found",
        success: false
      });
    }

    const { newPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;
    admin.mustChangePassword = false;
    await admin.save();

    res.status(200).json({
      message: "Password changed successfully",
      success: true
    });

  } catch (error) {
    res.status(500).json({
      error: "Falied to change password",
      success: false
    });
  }
}

/* -------------------- 12) Forgot Password -------------------- */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ emailId: email });
    if (!admin) {
      return res.status(404).json({
        error: "Admin not found",
        success: false
      });
    }

    const newPassword = crypto.randomBytes(8).toString('hex');
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;
    admin.mustChangePassword = true;
    await admin.save();

    const text = `Hello ${admin.name},

We received your request to reset your password. Your new password is provided below. This is a temporary password, so please log in and change it immediately.

Login Details:
Type: Admin Account
Username (email): ${email}
Password: ${password}

Please login and change your password immediately.

- Voting Application Team`;

    await sendCredentialsMail(email, text);

    res.status(200).json({
      message: "Password reset information sent to your email",
      success: true
    });

  }
  catch (error) {
    res.status(500).json({
      error: "Failed to process forgot password",
      success: false
    });
  }
}