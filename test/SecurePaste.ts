import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import hre from 'hardhat';
import { SecurePaste, SecurePaste__factory } from '../typechain-types';

describe('SecurePaste', () => {
  let wallet1: HardhatEthersSigner,
    wallet2: HardhatEthersSigner,
    wallet3: HardhatEthersSigner;

  let securePaste: SecurePaste;

  before(async () => {
    [wallet1, wallet2, wallet3] = await hre.ethers.getSigners();
  });

  describe('Deployment', () => {
    it('Should deploy the contract', async () => {
      const factory: SecurePaste__factory =
        await hre.ethers.getContractFactory('SecurePaste');
      securePaste = await factory.deploy();
    });
  });
});
