import { getPool, getQuoter2 } from "./ContractService";
import { pools, tokenInfos } from "../constants";
import Utils from "../utils/Utils";

// export type GetPriceImpact = {
//   inputAmount: string;
//   inSymbol: string;
//   outSymbol: string;
// };
type slot0Type = {
  sqrtPriceX96: number;
};

type quoteType = {
  sqrtPriceX96After: string;
};
export const getPriceImpact = async (
  inputAmount: string,
  inSymbol: string,
  outSymbol: string
) => {
  if (Utils.isSymbolsEthAndWeth(inSymbol, outSymbol)) return;

  const { inputSymbol, outputSymbol } = Utils.EthtoWethString(
    inSymbol,
    outSymbol
  );

  const poolAddress = pools[inputSymbol][outputSymbol][3000];
  const poolContract = getPool(poolAddress);

  const slot0: slot0Type = await poolContract.slot0();
  console.log(slot0);
  const sqrtPriceX96 = slot0.sqrtPriceX96;

  const token0: string = await poolContract.token0();
  const isToken0Input = inputSymbol === token0;

  let token0Decimals;
  let token1Decimals;
  if (isToken0Input) {
    token0Decimals = tokenInfos[inputSymbol].decimals;
    token1Decimals = tokenInfos[outputSymbol].decimals;
  } else {
    token0Decimals = tokenInfos[outputSymbol].decimals;
    token1Decimals = tokenInfos[inputSymbol].decimals;
  }

  const inputAddress = tokenInfos[inputSymbol].address;
  const outputAddress = tokenInfos[outputSymbol].address;
  const inputTokenDecimals = tokenInfos[inputSymbol].decimals;

  const amountIn = Utils.tokensToWei(inputAmount, inputTokenDecimals);

  const params = {
    tokenIn: inputAddress,
    tokenOut: outputAddress,
    amountIn: amountIn,
    fee: 3000,
    sqrtPriceLimitX96: "0",
  };

  const quoter = getQuoter2();

  const quote: quoteType = await quoter.callStatic.quoteExactInputSingle(
    params
  );
  const sqrtPriceX96After = parseFloat(quote.sqrtPriceX96After);

  const price = Utils.sqrtToPrice(
    sqrtPriceX96,
    token0Decimals,
    token1Decimals,
    isToken0Input
  );

  const priceAfter = Utils.sqrtToPrice(
    sqrtPriceX96After,
    token0Decimals,
    token1Decimals,
    isToken0Input
  );

  const absoluteChange = -Math.abs(price - priceAfter);

  const percentChange = absoluteChange / price;

  return Utils.decimalToPercent(percentChange, 3);
};
