import type { AddEthereumChainParameter } from '@web3-react/types';

export const getAlchemySepoliaUrl = () => {
  return process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL!;
};

export const getWalletConnectProjectId = () => {
  return process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
};

const SepoliaETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'SepoliaETH',
  decimals: 18,
};

export const SepoliaTestnet = {
  chainName: 'Sepolia Testnet',
  chainId: 11155111,
  nativeCurrency: SepoliaETH,
  rpcUrls: [getAlchemySepoliaUrl()],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};
