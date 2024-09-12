'use client';
import Coinbase from '@/icons/Coinbase';
import MetaMaskIcon from '@/icons/MetaMask';
import Select from '@/icons/Select';
import TrustWalletIcon from '@/icons/TrustWallet';
import WalletBlockIcon from '@/icons/WalletBlockIcon';
import WalletConnect from '@/icons/WalletConnect';
import { log, logError } from '@/lib/logging/client';
import { getTrimmedAddress } from '@/lib/WalletUtils';
import {
  alchemySepoliaProvider,
  infuraSepoliaProvider,
  SepoliaTestnet,
} from '@/utils/wallet/chains';
import { coinbaseHooks, coinbaseWallet } from '@/utils/wallet/coinbaseWallet';
import { metaMask, metaMaskHooks } from '@/utils/wallet/metamaskWallet';
import { trustWallet, trustWalletHooks } from '@/utils/wallet/trustWallet';
import {
  walletConnectV2,
  walletConnectV2Hooks,
} from '@/utils/wallet/walletConnect';
import { TrustWallet } from '@trustwallet/web3-react-trust-wallet';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { useWeb3React, Web3ContextType } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Connector } from '@web3-react/types';
import {
  URI_AVAILABLE,
  WalletConnect as WalletConnectV2,
} from '@web3-react/walletconnect-v2';
import classNames from 'classnames';
import { BigNumberish, formatEther } from 'ethers';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IoClose } from 'react-icons/io5';
import styles from '../components/NavBar/NavBar.module.css';

type WalletState = {
  connectToWallet: (
    connector: MetaMask | CoinbaseWallet | WalletConnectV2
  ) => Promise<void>;
  disconnectWallet: (connector: Connector) => Promise<void>;
  showWalletConnectDialog: () => void;
  showMyWalletDialog: () => void;
  updateBalance: () => Promise<void>;
} & Omit<Web3ContextType, 'accounts' | 'ENSNames' | 'ENSName'>;

interface WalletProviderProps {
  children: ReactNode;
}

const WalletContext = React.createContext({} as WalletState);

export const useWallet = () => {
  return useContext(WalletContext);
};

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const {
    account,
    provider,
    chainId,
    isActivating,
    isActive,
    connector,
    hooks,
  } = useWeb3React();
  const { useIsActivating: useMetamaskLoading } = metaMaskHooks;
  const { useIsActivating: useWalletConnectLoading } = walletConnectV2Hooks;
  const { useIsActivating: useCoinbaseLoading } = coinbaseHooks;
  const { useIsActivating: useTrustWalletLoading } = trustWalletHooks;
  const [balance, setBalance] = useState<BigNumberish | null>(null);
  const connectWalletDialogRef = useRef<HTMLDialogElement>(null);
  const myWalletDialogRef = useRef<HTMLDialogElement>(null);

  const isMetamaskLoading = useMetamaskLoading();
  const isWalletConnectLoading = useWalletConnectLoading();
  const isCoinbaseLoading = useCoinbaseLoading();
  const isTrustWalletLoading = useTrustWalletLoading();

  useEffect(() => {
    const connectWallets = async () => {
      try {
        await metaMask.connectEagerly();
      } catch {
        log('Failed to connect eagerly to MetaMask');
      }

      try {
        await walletConnectV2.connectEagerly();
      } catch (error) {
        log('Failed to connect eagerly to WalletConnect', error);
      }

      try {
        await coinbaseWallet.connectEagerly();
      } catch {
        log('Failed to connect eagerly to Coinbase Wallet');
      }

      try {
        await trustWallet.connectEagerly();
      } catch {
        log('Failed to connect eagerly to Trust Wallet');
      }
    };

    walletConnectV2.events.on(URI_AVAILABLE, closeWalletConnectDialog);
    connectWallets();

    return () => {
      walletConnectV2.events.off(URI_AVAILABLE, closeWalletConnectDialog);
    };
  }, []);

  useEffect(() => {
    updateBalance();
  }, [account, isActive]);

  const connectToWallet = async (
    connector: MetaMask | CoinbaseWallet | WalletConnectV2 | TrustWallet
  ) => {
    try {
      if (connector instanceof WalletConnectV2) {
        await connector.activate(SepoliaTestnet.chainId);
      } else {
        await connector.activate(SepoliaTestnet);
      }
    } catch (error) {
      logError(`Wallet connection error: ${error}`);
      logError(`Wallet connection error: ${JSON.stringify(error)}`);
    }
  };

  const disconnectWallet = async (connector: Connector) => {
    try {
      if (connector?.deactivate) {
        void connector.deactivate();
      } else {
        void connector.resetState();
      }
    } catch (error) {
      logError(`Wallet disconnect error: ${error}`);
      logError(`Wallet disconnect error: ${JSON.stringify(error)}`);
    }
  };

  const showWalletConnectDialog = () => {
    if (connectWalletDialogRef.current) {
      connectWalletDialogRef.current.showModal();
    }
  };

  const closeWalletConnectDialog = () => {
    if (connectWalletDialogRef.current) {
      connectWalletDialogRef.current.close();
    }
  };

  const showMyWalletDialog = () => {
    if (myWalletDialogRef.current) {
      myWalletDialogRef.current.showModal();
    }
  };

  const updateBalance = async () => {
    if (!isActive || !account) {
      return setBalance(null);
    }

    try {
      const balance = await alchemySepoliaProvider.getBalance(account);
      return setBalance(balance.toBigInt());
    } catch (e) {
      console.error('Error alchemy balance:', e);

      try {
        const balance = await infuraSepoliaProvider.getBalance(account);
        return setBalance(balance.toBigInt());
      } catch (e) {
        console.error('Error infura balance:', e);
      }
    }

    setBalance(null);
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        chainId,
        isActivating,
        isActive,
        connector,
        hooks,
        connectToWallet,
        disconnectWallet,
        showWalletConnectDialog,
        showMyWalletDialog,
        updateBalance,
      }}
    >
      <>
        {children}
        {isActive && account ? (
          <dialog
            id="wallet-modal"
            ref={myWalletDialogRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box bg-white">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  <IoClose className="size-5" />
                </button>
              </form>

              <div>
                <div className="flex flex-1 flex-col items-center justify-start gap-4 text-base">
                  <div className="flex w-full flex-wrap items-center pr-8 text-lg font-medium">
                    My wallet
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-start gap-3">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-slate-200 p-1 pr-2">
                        <WalletBlockIcon
                          address={account}
                          size={4}
                          scale={8}
                          width={30}
                          height={30}
                          className="overflow-hidden rounded-full"
                        />
                        <span className="text-base">
                          {getTrimmedAddress(account)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-lg font-medium">
                      {balance ? (
                        <span>
                          {formatEther(balance)}{' '}
                          {SepoliaTestnet.nativeCurrency.symbol}
                        </span>
                      ) : (
                        <span className="loading loading-spinner loading-md"></span>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn btn-error btn-custom mt-2 w-full"
                    onClick={() => disconnectWallet(connector)}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button className="cursor-default">close</button>
            </form>
          </dialog>
        ) : (
          <dialog
            id="wallet-modal"
            ref={connectWalletDialogRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box bg-white">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  <IoClose className="size-5" />
                </button>
              </form>

              <div>
                <div className="flex flex-1 flex-col items-center justify-start gap-4 text-base">
                  <div className="flex w-full flex-wrap items-center pr-8 text-lg font-medium">
                    Connect a wallet
                  </div>

                  <div className="flex w-full flex-1 flex-col items-center justify-start gap-3">
                    <button
                      className={classNames(
                        'relative flex max-h-[72px] w-full cursor-pointer items-center gap-3 overflow-hidden rounded-2xl p-4 hover:bg-[rgba(34,34,34,0.07)]',
                        styles.borderModal,
                        {
                          'btn-disabled': isActivating,
                        }
                      )}
                      onClick={() => connectToWallet(metaMask)}
                      disabled={isActivating}
                    >
                      <MetaMaskIcon
                        className={classNames(
                          styles.borderModal,
                          'rounded-[10px]'
                        )}
                      />
                      <div className="flex grow flex-col items-start justify-center">
                        <span className="text-start text-sm font-medium">
                          MetaMask
                        </span>
                        <span className="break-words text-start text-xs text-stone-500">
                          Available on iOS, Android, Chrome, and Firefox
                        </span>
                      </div>

                      {isMetamaskLoading && (
                        <span className="loading loading-spinner loading-md text-gray-700"></span>
                      )}
                    </button>
                  </div>

                  <div className="collapse">
                    <input
                      type="checkbox"
                      className="!min-h-0"
                      defaultChecked={true}
                    />

                    <div className="collapse-title flex !min-h-0 items-center p-0 py-2 text-sm text-gray-600">
                      <div className="h-px w-full bg-gray-200"></div>
                      <div className="mx-4 flex items-center whitespace-nowrap">
                        <span>Other wallets</span>
                        <Select className="size-5" />
                      </div>
                      <div className="h-px w-full bg-gray-200"></div>
                    </div>

                    <div className="collapse-content mt-4 grid gap-[2px] overflow-hidden rounded-xl !p-0">
                      <div className="relative w-full bg-[rgb(249,249,249)] hover:bg-[rgba(34,34,34,0.07)]">
                        <button
                          className={classNames(
                            'flex w-full flex-auto items-center justify-start p-[18px]',
                            { 'btn-disabled': isActivating }
                          )}
                          onClick={() => connectToWallet(walletConnectV2)}
                          disabled={isActivating}
                        >
                          <WalletConnect
                            className={classNames(
                              styles.borderModal,
                              styles.borderMedium,
                              'size-10 rounded-xl'
                            )}
                          />
                          <span className="grow px-2 text-start font-medium">
                            WalletConnect
                          </span>

                          {isWalletConnectLoading && (
                            <span className="loading loading-spinner loading-md text-gray-700"></span>
                          )}
                        </button>
                      </div>

                      <div className="relative flex w-full items-stretch justify-between bg-[rgb(249,249,249)] hover:bg-[rgba(34,34,34,0.07)]">
                        <button
                          className={classNames(
                            'flex w-full flex-auto items-center justify-start p-[18px]',
                            { 'btn-disabled': isActivating }
                          )}
                          onClick={() => {
                            connectToWallet(coinbaseWallet);
                            closeWalletConnectDialog();
                          }}
                          disabled={isActivating}
                        >
                          <Coinbase
                            className={classNames(
                              styles.borderModal,
                              styles.borderMedium,
                              'size-10 rounded-xl'
                            )}
                          />
                          <span className="grow px-2 text-start font-medium">
                            Coinbase Wallet
                          </span>

                          {isCoinbaseLoading && (
                            <span className="loading loading-spinner loading-md text-gray-700"></span>
                          )}
                        </button>
                      </div>

                      <div className="relative flex w-full items-stretch justify-between bg-[rgb(249,249,249)] hover:bg-[rgba(34,34,34,0.07)]">
                        <button
                          className={classNames(
                            'flex w-full flex-auto items-center justify-start p-[18px]',
                            { 'btn-disabled': isActivating }
                          )}
                          onClick={() => connectToWallet(trustWallet)}
                          disabled={isActivating}
                        >
                          <TrustWalletIcon
                            className={classNames(
                              styles.borderModal,
                              styles.borderMedium,
                              'size-10 rounded-xl'
                            )}
                          />
                          <span className="grow px-2 text-start font-medium">
                            Trust Wallet
                          </span>

                          {isTrustWalletLoading && (
                            <span className="loading loading-spinner loading-md text-gray-700"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div id="help" className="w-full px-1 text-sm text-gray-600">
                    By connecting a wallet, you will be able to create, edit or
                    delete a private paste.
                  </div>
                </div>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button className="cursor-default">close</button>
            </form>
          </dialog>
        )}
      </>
    </WalletContext.Provider>
  );
};
