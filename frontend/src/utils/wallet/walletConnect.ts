import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { getWalletConnectProjectId, SepoliaTestnet } from './chains';

export const [walletConnectV2, walletConnectV2Hooks] =
  initializeConnector<WalletConnectV2>(
    (actions) =>
      new WalletConnectV2({
        actions,
        options: {
          projectId: getWalletConnectProjectId(),
          chains: [SepoliaTestnet.chainId],
          showQrModal: true,
          metadata: {
            description:
              'Empowering secure data sharing through advanced encryption and blockchain technology, ensuring unparalleled privacy and reliability for your confidential information.',
            icons: ['https://securepaste.vercel.app/icon.png'],
            name: 'SecurePaste',
            url: 'https://securepaste.vercel.app',
          },
        },
        defaultChainId: SepoliaTestnet.chainId,
      })
  );
