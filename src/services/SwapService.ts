import { ethers } from "ethers";
import { GAS_LIMIT, tokenInfos } from "../constants";
import Utils from "../utils/Utils";
import AccountService from "./AccountService";
import { getSwapRouter } from "./ContractService";

interface swapToken {
  inputAmount: string;
  inputSymbol: string;
  outputSymbol: string;
  setIsTransacting: (value: boolean) => void;
  setIsConfirming: (value: boolean) => void;
  minutesToDeadline: number;
}

interface swapErc20ToErc20 {
  amountIn: ethers.BigNumber;
  inputSymbol: string;
  outputSymbol: string;
  deadline: number;
  signer: ethers.providers.JsonRpcSigner | null;
  recipient: string | undefined;
  setIsTransacting: (value: boolean) => void;
  setIsConfirming: (value: boolean) => void;
}

export default {
  swapToken: async ({
    inputAmount,
    inputSymbol,
    outputSymbol,
    setIsTransacting,
    setIsConfirming,
    minutesToDeadline = 10,
  }: swapToken) => {
    setIsConfirming(true);

    const deadline = Utils.deadlineFromMinutes(minutesToDeadline);
    const inputDecimals = tokenInfos[inputSymbol].decimals;
    const amountIn = Utils.tokensToWei(inputAmount, inputDecimals);

    const { signer, walletAddress: recipient } =
      await AccountService.getAccountData();

    if (![inputSymbol, outputSymbol].includes("ETH")) {
      swapErc20ToErc20({
        amountIn,
        inputSymbol,
        outputSymbol,
        deadline,
        signer,
        recipient,
        setIsTransacting,
        setIsConfirming,
      });
    }
  },
};

const swapErc20ToErc20 = async ({
  amountIn,
  inputSymbol,
  outputSymbol,
  deadline,
  signer,
  recipient,
  setIsTransacting,
  setIsConfirming,
}: swapErc20ToErc20) => {
  const tokenIn = tokenInfos[inputSymbol].address;
  const tokenOut = tokenInfos[outputSymbol].address;

  const params = {
    tokenIn,
    tokenOut,
    recipient,
    deadline,
    amountIn,
    fee: 3000,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  const swapRouterContract = getSwapRouter();

  try {
    const tx = await swapRouterContract
      .connect(signer!)
      .exactInputSingle(params, { gasLimit: GAS_LIMIT });
    setIsTransacting(true);
    setIsConfirming(false);

    await tx.wait();
  } catch {
    setIsConfirming(false);
  }
  console.log(`Swapped ${inputSymbol} to ${outputSymbol}`);
};
