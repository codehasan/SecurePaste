'use client';
import { ToastProvider } from '@/hooks/useToast';
import { WalletProvider } from '@/hooks/useWallet';
import { coinbaseHooks, coinbaseWallet } from '@/utils/wallet/coinbaseWallet';
import { metaMask, metaMaskHooks } from '@/utils/wallet/metamaskWallet';
import { trustWallet, trustWalletHooks } from '@/utils/wallet/trustWallet';
import {
  walletConnectV2,
  walletConnectV2Hooks,
} from '@/utils/wallet/walletConnect';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3ReactProvider
      connectors={[
        [metaMask, metaMaskHooks],
        [walletConnectV2, walletConnectV2Hooks],
        [coinbaseWallet, coinbaseHooks],
        [trustWallet, trustWalletHooks],
      ]}
    >
      <WalletProvider>
        <ToastProvider>{children}</ToastProvider>
      </WalletProvider>
    </Web3ReactProvider>
  );
};

export default ClientProviders;
