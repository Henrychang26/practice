import { ethers } from "ethers";
import { GAS_LIMIT, contracts, tokenInfos } from "../constants";
import Utils from "../utils/Utils";
import AccountService from "./AccountService";
import { getSwapRouter, getToken } from "./ContractService";

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

interface swapEthToErc20 {
  amountIn: ethers.BigNumber;
  outputSymbol: string;
  deadline: number;
  signer: ethers.providers.JsonRpcSigner | null;
  recipient: string | undefined;
  setIsTransacting: (value: boolean) => void;
  setIsConfirming: (value: boolean) => void;
}

interface swapEthToWeth {
  amountIn: ethers.BigNumber;
  signer: ethers.providers.JsonRpcSigner | null;
  setIsTransacting: (value: boolean) => void;
  setIsConfirming: (value: boolean) => void;
}

interface swapWthToEth {
  amountIn: ethers.BigNumber;
  signer: ethers.providers.JsonRpcSigner | null;
  setIsTransacting: (value: boolean) => void;
  setIsConfirming: (value: boolean) => void;
}

interface swapErc20ToEth {
  amountIn: ethers.BigNumber;
  inputSymbol: string;
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
    } else if (inputSymbol === "ETH" && outputSymbol !== "WETH") {
      await swapEthToErc20({
        amountIn,
        outputSymbol,
        deadline,
        signer,
        recipient,
        setIsTransacting,
        setIsConfirming,
      });
    } else if (inputSymbol === "ETH" && outputSymbol === "WETH") {
      await swapEthToWeth({
        amountIn,
        signer,
        setIsTransacting,
        setIsConfirming,
      });
    } else if (inputSymbol === "WETH" && outputSymbol === "ETH") {
      await swapWethToEth({
        amountIn,
        signer,
        setIsTransacting,
        setIsConfirming,
      });
    } else if (inputSymbol !== "ETH" && outputSymbol === "ETH") {
      await swapErc20ToEth({
        amountIn,
        inputSymbol,
        deadline,
        signer,
        recipient,
        setIsTransacting,
        setIsConfirming,
      });
    }
    setIsConfirming(false);
    setIsTransacting(false);
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

const swapEthToErc20 = async ({
  amountIn,
  outputSymbol,
  deadline,
  signer,
  recipient,
  setIsTransacting,
  setIsConfirming,
}: swapEthToErc20) => {
  const tokenIn = tokenInfos["WETH"].address;
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
      .exactInputSingle(params, { gasLimit: GAS_LIMIT, value: amountIn });
    setIsTransacting(true);
    setIsConfirming(false);

    await tx.wait();
  } catch {
    setIsConfirming(false);
  }
  console.log(`Swapped ETH to ${outputSymbol}`);
};

const swapEthToWeth = async ({
  amountIn,
  signer,
  setIsTransacting,
  setIsConfirming,
}: swapEthToWeth) => {
  try {
    const tx = await signer?.sendTransaction({
      to: contracts.WRAPPEDETHER.address,
      value: amountIn,
    });
    setIsTransacting(true);
    setIsConfirming(false);
    await tx?.wait();
  } catch {
    setIsConfirming(false);
  }
  console.log("Swapped ETH to WETH");
};

const swapWethToEth = async ({
  amountIn,
  signer,
  setIsTransacting,
  setIsConfirming,
}: swapWthToEth) => {
  try {
    const wethContract = getToken("WETH");
    await wethContract
      .connect(signer!)
      .approve(contracts.WRAPPEDETHER.address, amountIn);
    const tx = wethContract.connect(signer!).withdraw(amountIn);

    setIsTransacting(true);
    setIsConfirming(false);
    await tx?.wait();
  } catch {
    setIsConfirming(false);
  }

  console.log("Unweapped WETH to ETH");
};

const swapErc20ToEth = async ({
  amountIn,
  inputSymbol,
  deadline,
  signer,
  recipient,
  setIsTransacting,
  setIsConfirming,
}: swapErc20ToEth) => {
  try {
    const tokenIn = tokenInfos[inputSymbol].address;
    const tokenOut = tokenInfos["WETH"].address;

    const swapRouterContract = getSwapRouter();

    const params1 = {
      tokenIn,
      tokenOut,
      recipient: swapRouterContract.address,
      deadline,
      amountIn,
      fee: 3000,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };

    const encData1 = swapRouterContract.interface.encodeFunctionData(
      "exactInputSingle",
      [params1]
    );

    const amountMinimum = 0;

    const encData2 = swapRouterContract.interface.encodeFunctionData(
      "unwrapWETH9",
      [amountMinimum, recipient]
    );

    const calls = [encData1, encData2];

    const encMultiCall = swapRouterContract.interface.encodeFunctionData(
      "multicall",
      [calls]
    );

    const txArgs = {
      to: contracts.SWAPROUTER.address,
      from: recipient,
      data: encMultiCall,
      gasLimit: GAS_LIMIT,
    };

    const tx = await signer?.sendTransaction(txArgs);
    setIsTransacting(true);
    setIsConfirming(false);
    await tx?.wait();
  } catch {
    setIsConfirming(false);
  }

  console.log(`Swapped ${inputSymbol} to ETH`);
};
