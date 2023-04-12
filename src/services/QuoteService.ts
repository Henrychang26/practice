import { tokenInfos } from "../constants/index";
import { getQuoter } from "./ContractService";
import Utils from "../utils/Utils";

export const getQuote = async (
  inputAmount: string,
  inSymbol: string,
  outSymbol: string
) => {
  if (Utils.isSymbolsEthAndWeth(inSymbol, outSymbol)) {
    return inputAmount;
  }

  const { inputSymbol, outputSymbol } = Utils.EthtoWethString(
    inSymbol,
    outSymbol
  );

  const token0 = tokenInfos[inputSymbol];
  const token1 = tokenInfos[outputSymbol];

  const amountIn = Utils.tokensToWei(inputAmount.toString(), token0.decimals);

  const quoterContract = getQuoter();

  const quote = await quoterContract.quoteExactInputSingle.staticCall(
    token0.address,
    token1.address,
    "3000",
    amountIn,
    0
  );

  return Utils.hexToHumanAmount(quote, token1.decimals);
};
