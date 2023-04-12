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
} from "../styles/SelectTokenModalStyles";

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
            </Row>
          ))}
        </ModalBody>
      </Modal>
    </ModalBackground>
  );
};

export default SelectTokenModal;
