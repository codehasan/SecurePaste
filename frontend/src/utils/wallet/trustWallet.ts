import { TrustWallet } from '@trustwallet/web3-react-trust-wallet';
import { initializeConnector } from '@web3-react/core';

export const [trustWallet, trustWalletHooks] = initializeConnector<TrustWallet>(
  (actions) => new TrustWallet({ actions })
);
