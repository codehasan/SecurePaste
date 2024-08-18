'use client';
import { ethers, Signer } from 'ethers';
import React, { ReactNode, useContext, useEffect, useState } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface WalletState {}

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContext = React.createContext({} as WalletState);

export const usePost = () => {
  return useContext(WalletContext);
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<Signer | null>(null);

  useEffect(() => {}, []);

  const hasMetamask = () => {
    return typeof window.ethereum !== 'undefined';
  };

  /**
   * Build your own error handling when calling this function.
   */
  const connectMetamask = async () => {
    if (hasMetamask()) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      setWallet(await provider.getSigner());
    }
  };

  return <WalletContext.Provider value={{}}>{children}</WalletContext.Provider>;
};
