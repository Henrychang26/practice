import { getWalletBalance } from "./../services/WalletService";
import { useState } from "react";

interface setWalletBalancesType {
  inputSymbol: string;
  outputSymbol: string;
}

const useWalletBalances = () => {
  const [inputWalletBalance, _setInputWalletBalance] = useState<
    number | string | null
  >();
  const [outputWalletBalance, _setOutputWalletBalance] = useState<
    number | string | null
  >();

  const setWalletBalances = ({
    inputSymbol,
    outputSymbol,
  }: setWalletBalancesType) => {
    setInputWalletBalance(inputSymbol);
    setOutputWalletBalance(outputSymbol);
  };

  const setInputWalletBalance = async (symbol: string) => {
    if (symbol == null) return _setInputWalletBalance(null);

    _setInputWalletBalance(0);
    const inputWalletBalance = await getWalletBalance(symbol);
    _setInputWalletBalance(inputWalletBalance?.toString());
  };

  const setOutputWalletBalance = async (symbol: string) => {
    if (symbol == null) return _setOutputWalletBalance(null);

    _setOutputWalletBalance(0);
    const outputWalletBalance = await getWalletBalance(symbol);
    _setOutputWalletBalance(outputWalletBalance?.toString());
  };

  return { inputWalletBalance, outputWalletBalance, setWalletBalances };
};

export default useWalletBalances;
