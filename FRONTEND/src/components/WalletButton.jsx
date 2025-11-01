import React from 'react';
import { useWeb3 } from '@/context/Web3Context';

const WalletButton = () => {
  const { web3, account, contract, connect } = useWeb3();

  const connectWallet = async () => {
    try {
      await connect();
      console.log("Metamask connected!");
    } catch (error) {
      console.log(error);
    }
  };

  const isConnected = web3 && account && contract;

  return (
    <button
      onClick={!isConnected ? connectWallet : undefined}
      className={`px-5 py-2 w-[90%] ml-3 rounded-xl font-medium transition-all duration-300 shadow-sm 
        ${isConnected
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-blue-100 text-blue-800 hover:bg-blue-200 active:scale-95"}
      `}
    >
      {isConnected ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );
};

export default WalletButton;
