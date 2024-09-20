import { Network } from "@aptos-labs/ts-sdk";
import { AptosConnectWallet } from "@aptos-connect/wallet-adapter-plugin";

export const aptosConnectWallet = new AptosConnectWallet({
    network: Network.TESTNET,
    dappId: import.meta.env.VITE_APTOS_DAPP_ID,
    dappName: 'Enthro'
});
