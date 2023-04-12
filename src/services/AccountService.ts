import { ethers } from "ethers";

const getProvider = () => new ethers.BrowserProvider(window.ethereum);

const getSigner = async () => {
  const provider = getProvider();
  const accounts = await provider.send("eth_accounts", []);
  if (accounts.length > 0) {
    return await provider.getSigner();
  }
  return null;
};

const signerAddress = async (signer: ethers.JsonRpcSigner | null) =>
  signer?.getAddress();

export default {
  getProvider: () => getProvider(),

  connectWallet: async () => {
    const provider = getProvider();
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const walletAddress = await signerAddress(signer);
    return { provider, signer, walletAddress };
  },

  getAccountData: async () => {
    const provider = getProvider();
    const signer = await getSigner();
    const walletAddress = await signerAddress(signer);
    return { provider, signer, walletAddress };
  },
};
