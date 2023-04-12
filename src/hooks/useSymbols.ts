import { useState } from "react";

const useSymbols = () => {
  const [inputSymbol, _setInputSymbol] = useState("ETH");
  const [outputSymbol, _setOutputSymbol] = useState<string>("");

  const setInputSymbol = (symbol: string) => {
    if (symbol === outputSymbol) {
      _setOutputSymbol("");
    }
    _setInputSymbol(symbol);
  };
  const setOutputSymbol = (symbol: string) => {
    if (symbol === inputSymbol) {
      _setInputSymbol("");
    }
    _setOutputSymbol(symbol);
  };

  return {
    inputSymbol,
    setInputSymbol,
    outputSymbol,
    setOutputSymbol,
  };
};

export default useSymbols;
