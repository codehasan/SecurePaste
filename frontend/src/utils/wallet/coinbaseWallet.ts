import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';
import { getAlchemySepoliaUrl } from './chains';

export const [coinbaseWallet, coinbaseHooks] =
  initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: getAlchemySepoliaUrl(),
          darkMode: false,
          appName: 'SecurePaste',
          appLogoUrl: 'https://securepaste.vercel.app/icon.png',
          reloadOnDisconnect: true,
          enableMobileWalletLink: true,
          headlessMode: false,
        },
      })
  );
