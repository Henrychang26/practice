import { useState } from "react";
import { tokenInfos } from "../constants";

// interface setDecimalsType {
//   inputSymbol: string;
//   outputSymbol: string;
// }

const useDecimals = () => {
  const [inputDecimals, _setInputDecimals] = useState<number | null>(null);
  const [outputDecimals, _setOutputDecimals] = useState<number | null>(null);

  const setDecimals = (inputSymbol: string, outputSymbol: string) => {
    setInputDecimals(inputSymbol);
    setOutputDecimals(outputSymbol);
  };

  const setInputDecimals = (symbol: string | null) => {
    if (symbol === null) {
      return _setInputDecimals(null);
    }
    _setInputDecimals(tokenInfos[symbol]?.decimals!);
  };

  const setOutputDecimals = (symbol: string | null) => {
    if (symbol === null) {
      return _setOutputDecimals(null);
    }
    _setOutputDecimals(tokenInfos[symbol]?.decimals);
  };
  return { inputDecimals, outputDecimals, setDecimals };
};

export default useDecimals;
