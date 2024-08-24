import '@nomicfoundation/hardhat-toolbox';
import { config as dotConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotConfig({ path: './frontend/.env.local' });

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.NEXT_PUBLIC_INFURA_SEPOLIA_URL!,
      accounts: [process.env.WALLET_PRIVATE_KEY!],
    },
  },
  defaultNetwork: 'hardhat',
};

export default config;
