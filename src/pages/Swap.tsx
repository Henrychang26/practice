import { useEffect, useState } from "react";
import Utils from "../utils/Utils";
import SelectTokenModal from "../components/SelectTokenModal";
import { getQuote } from "../services/QuoteService";
import TokenSelect from "../components/TokenSelect";
import {
  Balance,
  Page,
  PriceContainer,
  PriceText,
  SwapContainer,
  SwapHeader,
  TokenContainer,
  TokenInput,
  TokenRow,
} from "../styles/SwapStyles";

import useSymbols from "../hooks/useSymbols";
import useAmount from "../hooks/useAmount";
import useMetaMask from "../hooks/useMetaMask";
import * as PriceService from "../services/PriceService";
import useWalletBalances from "../hooks/useWalletBalances";
import useDecimals from "../hooks/useDecimals";
import SwapButton from "../components/SwapButton";
import SwapService from "../services/SwapService";

function Swap() {
  //   const { _connectMetaMask, tryConnectingMetaMask, _signer, _walletAddress } =
  //     useMetaMask();
  const { connectMetaMask, signer, tryConnectingMetaMask, walletAddress } =
    useMetaMask();
  const { inputSymbol, setInputSymbol, outputSymbol, setOutputSymbol } =
    useSymbols();
  const { inputAmount, setInputAmount, outputAmount, setOutputAmount } =
    useAmount();

  const [isInput, setIsInput] = useState<boolean>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [priceImpact, setPriceImpact] = useState<string | undefined>("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);

  const swapTokens = async () => {
    if (!Utils.validateInputs({ inputSymbol, outputSymbol, inputAmount }))
      return;

    if (walletAddress === null) return;

    await SwapService.swapToken({
      inputAmount,
      inputSymbol,
      outputSymbol,
      setIsTransacting,
      setIsConfirming,
      minutesToDeadline: 10,
    });
    setWalletBalances({ inputSymbol, outputSymbol });
  };

  const calculateQuote = async () => {
    const quotedOutput = await getQuote(inputAmount, inputSymbol, outputSymbol);
    setOutputAmount(quotedOutput.toString());
  };

  const calculatePriceImpact = async () => {
    const priceImpact = await PriceService.getPriceImpact(
      inputAmount,
      inputSymbol,
      outputSymbol
    );

    setPriceImpact(priceImpact);
  };

  useEffect(() => {
    tryConnectingMetaMask();
  }, []);

  useEffect(() => {
    setOutputAmount("");

    if (!Utils.validateInputs({ inputSymbol, outputSymbol, inputAmount }))
      return;

    calculateQuote();
    calculatePriceImpact();
  }, [inputAmount, inputSymbol, outputSymbol]);

  const { inputWalletBalance, outputWalletBalance, setWalletBalances } =
    useWalletBalances();

  const { inputDecimals, outputDecimals, setDecimals } = useDecimals();

  useEffect(() => {
    setWalletBalances({ inputSymbol, outputSymbol });
    setDecimals(inputSymbol, outputSymbol);
  }, [inputSymbol, outputSymbol]);

  useEffect(() => {
    setWalletBalances({ inputSymbol, outputSymbol });
  }, [signer]);
  return (
    <Page>
      <SwapContainer>
        <SwapHeader>Swap</SwapHeader>
        <TokenContainer>
          <TokenRow>
            <TokenInput
              placeholder="0"
              value={inputAmount}
              onChange={setInputAmount}
            />
            <TokenSelect
              displayModal={() => {
                setIsInput(true);
                setShowModal(true);
              }}
              symbol={inputSymbol}
              isInput={true}
            />
          </TokenRow>
          <Balance>
            {Utils.hexToHumanAmount(inputWalletBalance!, inputDecimals!, 3)}
          </Balance>
        </TokenContainer>
        <TokenContainer>
          <TokenRow>
            <TokenInput
              placeholder="0"
              value={outputAmount}
              readOnly
            ></TokenInput>
            <TokenSelect
              displayModal={() => {
                setIsInput(false);
                setShowModal(true);
              }}
              symbol={outputSymbol}
              isInput={false}
            />
          </TokenRow>
          <Balance>
            {Utils.hexToHumanAmount(outputWalletBalance!, outputDecimals!, 3)}
          </Balance>
        </TokenContainer>

        {priceImpact && (
          <PriceContainer>
            <PriceText>Price Impact</PriceText>
            <div>{priceImpact}%</div>
          </PriceContainer>
        )}
        <SwapButton
          signer={signer}
          inputSymbol={inputSymbol}
          outputSymbol={outputSymbol}
          inputAmount={inputAmount}
          inputWalletBalance={inputWalletBalance}
          inputDecimals={inputDecimals}
          connectMetaMask={connectMetaMask}
          swapTokens={swapTokens}
          isTransacting={isTransacting}
          isConfirming={isConfirming}
        ></SwapButton>
      </SwapContainer>

      {showModal && (
        <SelectTokenModal
          onClose={() => setShowModal(false)}
          isInput={isInput}
          setInputSymbol={setInputSymbol}
          setOutputSymbol={setOutputSymbol}
        />
      )}
    </Page>
  );
}

export default Swap;
