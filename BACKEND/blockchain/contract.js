import { Web3 } from "web3";
import ABI from "./ABI.json" with { type: "json" };
import dotenv from "dotenv";
dotenv.config();

// Web3 setup
const web3 = new Web3(process.env.WEB3_PROVIDER_URL);  // MOST PROBABLY NEEDS A CHANGE in .env file

// Contract setup
const contractAddress = process.env.CONTRACT_ADDRESS; // remaining
const contract = new web3.eth.Contract(ABI, contractAddress);
export default contract;