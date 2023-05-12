import { useEffect, useState } from "react";
import { tokenSymbols, tokenInfos } from "../constants";
import {
  Logo,
  MiddleColumn,
  Modal,
  ModalBackground,
  ModalBody,
  ModalHeader,
  Row,
  Title,
  ModalLine,
  TokenName,
  TokenSymbol,
  LastColumn,
} from "../styles/SelectTokenModalStyles";
import AccountService from "../services/AccountService";
import { getWalletBalance } from "../services/WalletService";
import Utils from "../utils/Utils";

type SelectTokenModalProps = {
  setInputSymbol: (value: string) => void;
  setOutputSymbol: (value: string) => void;
  isInput: boolean | undefined;
  onClose: () => void;
};

const SelectTokenModal = ({
  setInputSymbol,
  setOutputSymbol,
  isInput,
  onClose,
}: SelectTokenModalProps) => {
  const setToken = (symbol: string) =>
    isInput ? setInputSymbol(symbol) : setOutputSymbol(symbol);

  const [walletBalances, setWalletBalances] = useState<{
    [key: string]: number | string;
  }>({});

  const setTokenWalletBalances = async () => {
    const { walletAddress } = await AccountService.getAccountData();

    await Promise.all(
      tokenSymbols.map(async (symbol: string) => {
        let balance: number | string = 0;

        if (!!walletAddress) {
          balance = await getWalletBalance(symbol);
        }
        balance = Utils.hexToHumanAmount(balance, tokenInfos[symbol].decimals);
        setWalletBalances((prev) => ({ ...prev, [symbol]: balance }));
      })
    );
  };

  useEffect(() => {
    setTokenWalletBalances();
  }, []);
  if (Object.keys(walletBalances).length !== tokenSymbols.length) {
    return null;
  }

  return (
    <ModalBackground onClick={onClose}>
      <Modal onClick={(e: any) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Select a token</Title>
        </ModalHeader>
        <ModalLine />
        <ModalBody>
          {tokenSymbols.map((symbol) => (
            <Row
              className="row"
              key={symbol}
              onClick={() => {
                setToken(symbol);
                onClose();
              }}
            >
              <div className="col-md-2">
                <Logo>{symbol}</Logo>
              </div>
              <MiddleColumn className="col-md-7">
                <TokenName>{tokenInfos[symbol].name}</TokenName>
                <TokenSymbol>{symbol}</TokenSymbol>
              </MiddleColumn>
              <LastColumn className="col-md-3">
                {walletBalances[symbol]}
              </LastColumn>
            </Row>
          ))}
        </ModalBody>
      </Modal>
    </ModalBackground>
  );
};

export default SelectTokenModal;
