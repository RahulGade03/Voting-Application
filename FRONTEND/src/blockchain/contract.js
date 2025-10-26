import { Web3 } from "web3";    // web3 is a used to connect block-chain to our backend
import ABI from "./ABI.json" with { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const web3 = new Web3(process.env.WEB3_PROVIDER_URL);

const contractAddress = process.env.CONTRACT_ADDRESS; // remaining
const contract = new web3.eth.Contract(ABI, contractAddress);
export default contract;