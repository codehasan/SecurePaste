import { JsonRpcProvider } from '@ethersproject/providers';
import type { AddEthereumChainParameter } from '@web3-react/types';

export const getAlchemySepoliaUrl = () => {
  return process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL!;
};

export const getInfuraSepoliaUrl = () => {
  return process.env.NEXT_PUBLIC_INFURA_SEPOLIA_URL!;
};

export const getWalletConnectProjectId = () => {
  return process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;
};

export const SepoliaETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'SepoliaETH',
  decimals: 18,
};

export const SepoliaTestnet = {
  chainName: 'Sepolia Testnet',
  chainId: 11155111,
  nativeCurrency: SepoliaETH,
  rpcUrls: [getAlchemySepoliaUrl(), getInfuraSepoliaUrl()],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export const alchemySepoliaProvider = new JsonRpcProvider(
  getAlchemySepoliaUrl(),
  {
    chainId: SepoliaTestnet.chainId,
    name: SepoliaTestnet.chainName,
  }
);

export const infuraSepoliaProvider = new JsonRpcProvider(
  getInfuraSepoliaUrl(),
  {
    chainId: SepoliaTestnet.chainId,
    name: SepoliaTestnet.chainName,
  }
);
