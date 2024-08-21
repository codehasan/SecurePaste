'use client';
import { ToastProvider } from '@/hooks/useToast';
import { WalletProvider } from '@/hooks/useWallet';
import {
  hooks as coinbaseHooks,
  coinbaseWallet,
} from '@/utils/wallet/coinbaseWallet';
import {
  metaMask,
  hooks as metaMaskHooks,
} from '@/utils/wallet/metamaskWallet';
import {
  walletConnectV2,
  hooks as walletConnectV2Hooks,
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
      ]}
    >
      <WalletProvider>
        <ToastProvider>{children}</ToastProvider>
      </WalletProvider>
    </Web3ReactProvider>
  );
};

export default ClientProviders;
