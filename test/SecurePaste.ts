import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumberish, BytesLike, Typed } from 'ethers';
import hardhat from 'hardhat';
import { SecurePaste, SecurePaste__factory } from '../typechain-types';

const pasteData = {
  title: 'How to make a promise run with timeout.',
  ipfsHash: 'QmcQvCyLAncpEzvmYtKfvVPVayGqFvTQrYpUpPAJeoXGke',
  syntax: 'text',
};

const updatedPasteData = {
  title: 'How to make a promise run with timeout in typescript.',
  ipfsHash: 'QmetMdze3rLzEGQGQdTtXzfYwU55N89nBTcJ347VTBeDrD',
  syntax: 'typescript',
};

describe('SecurePaste', () => {
  let wallet1: HardhatEthersSigner,
    wallet2: HardhatEthersSigner,
    wallet3: HardhatEthersSigner;

  let securePaste: SecurePaste;

  before(async () => {
    [wallet1, wallet2, wallet3] = await hardhat.ethers.getSigners();
  });

  describe('Deployment', () => {
    it('Should deploy the contract', async () => {
      const factory: SecurePaste__factory =
        await hardhat.ethers.getContractFactory('SecurePaste');
      securePaste = await factory.connect(wallet1).deploy();
      await securePaste.waitForDeployment();

      securePaste.addListener(
        'NewPaste',
        (id: BytesLike | Typed, sender: string) => {
          console.warn(`New paste created by ${sender}, id: ${id}`);
        }
      );

      securePaste.addListener(
        'PasteDeleted',
        (id: BytesLike | Typed, sender: string) => {
          console.warn(`Paste deleted by ${sender}, id: ${id}`);
        }
      );

      securePaste.addListener(
        'PasteUpdated',
        (id: BytesLike | Typed, sender: string) => {
          console.warn(`Paste updated by ${sender}, id: ${id}`);
        }
      );

      securePaste.addListener(
        'NewPasteCooldownUpdated',
        (oldTime: BigNumberish, newTime: BigNumberish) => {
          console.warn(
            `New paste cooldown updated from ${oldTime} seconds to ${newTime} seconds.`
          );
        }
      );

      securePaste.addListener(
        'UserPasteLimitUpdated',
        (oldLimit: BigNumberish, newLimit: BigNumberish) => {
          console.warn(
            `User paste limit updated from ${oldLimit} to ${newLimit}.`
          );
        }
      );

      expect(await securePaste?.getAddress()).to.be.not.undefined.and.to.be.not
        .null;
    });

    it('Should return correct owner', async () => {
      const owner = await securePaste.owner();
      expect(owner).to.be.equal(wallet1.address);
    });
  });

  describe('Create Paste', () => {
    it('Should create a new paste with unique id', async () => {
      const transaction = await securePaste.createPaste(
        pasteData.title,
        pasteData.ipfsHash,
        pasteData.syntax,
        BigInt(Math.floor(Date.now() / 1000))
      );
      await transaction.wait();

      const transaction2 = await securePaste
        .connect(wallet2)
        .createPaste(
          pasteData.title,
          pasteData.ipfsHash,
          pasteData.syntax,
          BigInt(Math.floor(Date.now() / 1000))
        );
      await transaction2.wait();

      const wallet1Pastes = await securePaste.getAllPaste();
      const wallet2Pastes = await securePaste.connect(wallet2).getAllPaste();

      expect(wallet1Pastes.length).to.be.equal(1);
      expect(wallet2Pastes.length).to.be.equal(1);
    });

    it('Should return created paste', async () => {
      const pastes = await securePaste.getAllPaste();
      const paste = pastes[0];

      expect(paste.title).to.be.equal(pasteData.title);
      expect(paste.ipfsHash).to.be.equal(pasteData.ipfsHash);
      expect(paste.syntax).to.be.equal(pasteData.syntax);
    });
  });

  describe('Update paste', () => {
    it('Should update existing paste', async () => {
      const pastes = await securePaste.getAllPaste();
      const paste = pastes[0];

      const transaction = await securePaste.updatePaste(
        paste.id,
        updatedPasteData.title,
        updatedPasteData.ipfsHash,
        updatedPasteData.syntax
      );
      await transaction.wait();

      expect(await transaction.getBlock()).to.be.not.null;
    });

    it('Should return updated paste', async () => {
      const pastes = await securePaste.getAllPaste();
      const paste = pastes[0];

      expect(paste.title).to.be.equal(updatedPasteData.title);
      expect(paste.ipfsHash).to.be.equal(updatedPasteData.ipfsHash);
      expect(paste.syntax).to.be.equal(updatedPasteData.syntax);
    });
  });

  describe('Get paste', () => {
    it('Should get existing paste', async () => {
      const pastes = await securePaste.connect(wallet2).getAllPaste();
      const paste = pastes[0];

      const returnedPaste = await securePaste
        .connect(wallet2)
        .getPaste(paste.id);

      expect(paste.title).to.be.equal(returnedPaste.title);
      expect(paste.ipfsHash).to.be.equal(returnedPaste.ipfsHash);
      expect(paste.syntax).to.be.equal(returnedPaste.syntax);

      expect(returnedPaste.title).to.be.equal(pasteData.title);
      expect(returnedPaste.ipfsHash).to.be.equal(pasteData.ipfsHash);
      expect(returnedPaste.syntax).to.be.equal(pasteData.syntax);
    });
  });

  describe('Delete paste', () => {
    it('Should delete existing paste', async () => {
      const pastes = await securePaste.getAllPaste();
      const paste = pastes[0];

      const transaction = await securePaste.deletePaste(paste.id);
      await transaction.wait();

      const newPastes = await securePaste.getAllPaste();
      expect(newPastes.length).to.be.equal(0);
    });
  });

  describe('Owner operations', () => {
    it('Should update new paste cooldown time', async () => {
      const transaction = await securePaste.setNewPasteCooldown(0);
      await transaction.wait();

      const transaction2 = await securePaste.createPaste(
        pasteData.title,
        pasteData.ipfsHash,
        pasteData.syntax,
        BigInt(Math.floor(Date.now() / 1000))
      );

      const transaction3 = await securePaste.createPaste(
        pasteData.title,
        pasteData.ipfsHash,
        pasteData.syntax,
        BigInt(Math.floor(Date.now() / 1000))
      );

      await transaction2.wait();
      await transaction3.wait();

      const pastes = await securePaste.getAllPaste();
      expect(pastes.length).to.be.equal(2);
    });

    it('Should update per user paste limit', async () => {
      const transaction = await securePaste.setUserPasteLimit(6);
      await transaction.wait();

      expect(await transaction.getBlock()).to.be.not.null;
    });
  });

  describe('Security checks', () => {
    it('Should only let the owner change paste limit', async () => {
      await expect(securePaste.connect(wallet2).setUserPasteLimit(8))
        .to.be.revertedWithCustomError(
          securePaste,
          'OwnableUnauthorizedAccount'
        )
        .withArgs(wallet2.address);
    });

    it('Should only let the owner change new paste cooldown', async () => {
      await expect(securePaste.connect(wallet2).setNewPasteCooldown(0))
        .to.be.revertedWithCustomError(
          securePaste,
          'OwnableUnauthorizedAccount'
        )
        .withArgs(wallet2.address);
    });

    it('Should only let the paste owner delete their paste', async () => {
      const wallet2Pastes = await securePaste.connect(wallet2).getAllPaste();

      await expect(
        securePaste.connect(wallet3).deletePaste(wallet2Pastes[0].id)
      )
        .to.be.revertedWithCustomError(securePaste, 'PasteError')
        .withArgs(5, wallet2Pastes[0].id, wallet3.address);
    });

    it('Should only let the paste owner retrieve their paste', async () => {
      const wallet2Pastes = await securePaste.connect(wallet2).getAllPaste();

      await expect(securePaste.connect(wallet3).getPaste(wallet2Pastes[0].id))
        .to.be.revertedWithCustomError(securePaste, 'PasteError')
        .withArgs(5, wallet2Pastes[0].id, wallet3.address);
    });

    it('Should only let the paste owner update their paste', async () => {
      const wallet2Pastes = await securePaste.connect(wallet2).getAllPaste();

      await expect(
        securePaste
          .connect(wallet3)
          .updatePaste(
            wallet2Pastes[0].id,
            updatedPasteData.title,
            updatedPasteData.ipfsHash,
            updatedPasteData.syntax
          )
      )
        .to.be.revertedWithCustomError(securePaste, 'PasteError')
        .withArgs(5, wallet2Pastes[0].id, wallet3.address);
    });
  });
});
