import { BrowserProvider, Eip1193Provider } from "ethers";

export {};

declare global {
  interface Window {
    ethereum: Eip1193Provider & BrowserProvider;
  }
}

declare module "ethers" {
  interface Signer {
    approve(
      spender: string,
      value: ethers.BigNumberish
    ): Promise<ethers.TransactionResponse>;
  }
}
