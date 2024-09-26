import { ConnectButton, useActiveAccount, useActiveWalletConnectionStatus } from "thirdweb/react";
import { mainnet } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";

import client from "../client.js"

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("com.okex.wallet"),
  createWallet("com.bitget.web3"),
  createWallet("com.binance"),
];

const WalletInfo = () => {
  const account = useActiveAccount();
  console.log("address", account);
  console.log("status", useActiveWalletConnectionStatus());


  return (
    <div className="wallet-container">
      <ConnectButton
        client={client}
        chain={mainnet}
        wallets={wallets}
        connectModal={{ size: "compact" }}
      />
    </div>
  );
};

export default WalletInfo;
