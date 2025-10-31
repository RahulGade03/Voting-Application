import { createContext, useContext, useState } from 'react';
import Web3 from 'web3';
import ABI from "../blockchain/ABI.json" with { type: "json" };
import { toast } from 'react-toastify';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const connect = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const contractInstance = new web3Instance.eth.Contract(ABI, contractAddress);
      setAccount(accounts[0]);
      setWeb3(web3Instance);
      setContract(contractInstance);
      return { web3Instance, contractInstance, acc: accounts[0], w3: web3Instance };
    } else {
      toast.error("Please install MetaMask and setup Sepolia Test network to use this feature.");
      // alert("Please install MetaMask and setup Sepolia Test network to use this feature.");
    }
  };

  return (
    <Web3Context.Provider value={{ web3, contract, account, connect }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
