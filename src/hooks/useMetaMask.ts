import { ethers } from "ethers";
import AccountService from "../services/AccountService";
import { useState } from "react";

const useMetaMask = () => {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>();
  const [walletAddress, setWalletAddress] = useState<string>();

  const connectMetaMask = async () => {
    const { signer, walletAddress } = await AccountService.connectWallet();

    setSigner(signer);
    setWalletAddress(walletAddress);
  };

  const tryConnectingMetaMask = async () => {
    const { signer, walletAddress } = await AccountService.getAccountData();

    setSigner(signer);
    setWalletAddress(walletAddress);
  };

  return { connectMetaMask, tryConnectingMetaMask, signer, walletAddress };
};

export default useMetaMask;
