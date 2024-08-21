import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';
import { getAlchemySepoliaUrl } from './wallet-utils';

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: getAlchemySepoliaUrl(),
        appName: 'SecurePaste',
      },
    })
);
