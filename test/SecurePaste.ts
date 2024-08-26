import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import hre, { ethers } from 'hardhat';
import { SecurePaste, SecurePaste__factory } from '../typechain-types';
import { expect } from 'chai';
import { AddressLike, BigNumberish, BytesLike, Typed } from 'ethers';

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
      securePaste = await factory.connect(wallet1).deploy();
      await securePaste.waitForDeployment();

      securePaste.addListener(
        'NewPaste',
        (id: BytesLike | Typed, sender: string) => {
          console.log(`New paste created by ${sender}, id: ${id}`);
        }
      );

      securePaste.addListener(
        'PasteDeleted',
        (id: BytesLike | Typed, sender: string) => {
          console.log(`Paste deleted by ${sender}, id: ${id}`);
        }
      );

      securePaste.addListener(
        'PasteUpdated',
        (id: BytesLike | Typed, sender: string) => {
          console.log(`Paste updated by ${sender}, id: ${id}`);
        }
      );

      securePaste.addListener(
        'NewPasteCooldownUpdated',
        (oldTime: BigNumberish, newTime: BigNumberish) => {
          console.log(
            `New paste cooldown updated from ${oldTime} seconds to ${newTime} seconds.`
          );
        }
      );

      securePaste.addListener(
        'UserPasteLimitUpdated',
        (oldLimit: BigNumberish, newLimit: BigNumberish) => {
          console.log(
            `Individual user paste limit updated from ${oldLimit} to ${newLimit}.`
          );
        }
      );

      expect(securePaste).to.be.not.undefined.and.to.be.not.null;
    });

    it('Should return correct owner', async () => {
      const owner = await securePaste.owner();
      expect(owner).to.be.equal(wallet1.address);
    });
  });

  describe('Create Paste', () => {
    it('Should create a new paste', async () => {
      const transaction = await securePaste.createPaste(
        'How to make a promise run with timeout.',
        ethers.encodeBytes32String(
          'QmcQvCyLAncpEzvmYtKfvVPVayGqFvTQrYpUpPAJeoXGke'
        ),
        'text',
        Date.now()
      );

      await transaction.wait();

      const pastes = await securePaste.getAllPaste();

      expect(pastes.length).to.be.equal(1);
    });
  });
});
