import { contracts, tokenInfos } from "../constants";
import AccountService from "./AccountService";
import { getToken } from "./ContractService";
import { ContractTransaction } from "ethers/types/ethers";

// export interface isApprovedToken {
//   tokenSymbol: string;
//   spenderAddress: string;
// }

// export interface approveTokens {
//   tokenSymbol: string;
//   spenderAddress: string;
//   setIsApproving: (value: boolean) => void;
//   setIsAskingForPermission: (value: boolean) => void;
// }

export default {
  isApprovedToken: async (tokenSymbol: string, spenderAddress: string) => {
    const contract = getToken(tokenSymbol);
    const { walletAddress } = await AccountService.getAccountData();
    const Allowance = await contract.allowance(walletAddress, spenderAddress);
    const allowance = Number(Allowance);
    const maxAllowance = tokenInfos[tokenSymbol].maxAllowance;
    console.log(maxAllowance);
    console.log(allowance);

    return allowance - Number(maxAllowance) === 0;
  },

  approveTokens: async (
    tokenSymbol: string,
    spenderAddress: string,
    setIsApproving: (value: boolean) => void,
    setIsAskingForPermission: (value: boolean) => void
  ) => {
    const contract = getToken(tokenSymbol);
    const { signer, provider } = await AccountService.getAccountData();
    console.log(signer);
    console.log(contract.connect(signer));
    try {
      const maxAllowance = tokenInfos[tokenSymbol].maxAllowance;

      //   const tx = await contract
      //     .connect(signer)
      //     .getFunction("approve")
      //     .call(spenderAddress, maxAllowance);
      //   console.log(APPROVE);
      const tx: ContractTransaction = await contract
        .connect(signer)
        .approve(spenderAddress, maxAllowance);

      setIsAskingForPermission(false);
      setIsApproving(true);

      await tx.wait();

      setIsApproving(false);
    } catch {
      setIsAskingForPermission(false);
      setIsApproving(false);
      console.log("approval declined");
    }
  },

  clearnApprovals: async () => {
    const { signer } = await AccountService.getAccountData();

    const wethContract = getToken("WETH");
    const uniContract = getToken("UNI");
    const usdcContract = getToken("WUSDC");

    wethContract.approve(contracts.SWAPROUTER.address, 0);
    uniContract.approve(contracts.SWAPROUTER.address, 0);
    usdcContract.approve(contracts.SWAPROUTER.address, 0);
  },
};

//(method) BaseContract.connect(signerOrProvider: string | Signer | Provider): Contract
