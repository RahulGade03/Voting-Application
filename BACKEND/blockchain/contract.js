import { Web3 } from "web3";
import ABI from "./ABI.json" with { type: "json" };

// Web3 setup
const web3 = new Web3(
  "https://alien-boldest-uranium.ethereum-sepolia.quiknode.pro/cccd48313e2dcf82fb4ebf9df668d481f3c6ad10/"
);

// Contract setup
const contractAddress = "0x713e047f453b269350fa10f25485e8f77737fd1b"; // remaining
const contract = new web3.eth.Contract(ABI, contractAddress);
export default contract;