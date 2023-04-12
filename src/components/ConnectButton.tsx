import Utils from "../utils/Utils";
import { useEffect, useRef } from "react";
import {
  Address,
  Button,
  ConnectedButton,
  Icon,
} from "../styles/ConnectButtonStyles";
import useMetaMask from "../hooks/useMetaMask";

const ConnectButton = () => {
  const { connectMetaMask, tryConnectingMetaMask, signer, walletAddress } =
    useMetaMask();

  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (signer !== undefined && walletAddress !== undefined) {
      tryConnectingMetaMask();
    } else {
      return;
    }
  }, []);

  const setMetaMaskIcon = async () => {
    if (!walletAddress) return;

    const icon = Utils.getMetaMaskIcon(walletAddress);
    const element = iconRef.current;

    if (element) {
      if (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(icon);
    }
  };

  useEffect(() => {
    setMetaMaskIcon();
  }, [walletAddress]);

  return (
    <>
      {signer ? (
        <ConnectedButton className={"btn"}>
          <Icon ref={iconRef} />
          <Address className="address">
            {/* short wallet address form */}
            {Utils.condenseAddress(walletAddress!)}
          </Address>
        </ConnectedButton>
      ) : (
        <Button onClick={connectMetaMask}>Connect Wallet</Button>
      )}
    </>
  );
};

export default ConnectButton;
