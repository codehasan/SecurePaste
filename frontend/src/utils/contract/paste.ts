'use client';

import contractDeployment from '@/contract/abi/SecurePaste.json';
import configJson from '@/contract/config.json';
import { SecurePaste } from '@/contract/typechain-types';
import { logError, logWarning } from '@/lib/logging/client';
import { constructUrl } from '@/lib/RedirectHelper';
import { NewPrivatePasteSchema } from '@/lib/schema/ZodSchema';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { uploadFileToIPFS } from '../pinata/actions/pastes';
import { SepoliaTestnet } from '../wallet/chains';

interface Config {
  [chain: string]: {
    address: string;
  };
}

type SecurePasteContract = SecurePaste &
  ethers.BaseContract &
  Omit<ethers.ContractInterface, keyof ethers.BaseContract>;

const PASTE_CREATE_PAGE = '/paste';

export async function createNewPrivatePaste(
  title: string,
  body: string,
  syntax: string,
  web3: ReturnType<typeof useWeb3React>
) {
  const router = useRouter();

  const validation = NewPrivatePasteSchema.safeParse({
    title,
    body,
    syntax,
  });

  if (!validation.success) {
    logWarning(JSON.stringify(validation.error));
    router.push(
      constructUrl(PASTE_CREATE_PAGE, {
        error: validation.error.issues[0].message,
      })
    );
  }

  if (web3.isActive && web3.account && web3.provider) {
    const cid = await uploadFile(web3.account, body);

    if (!cid) {
      router.push(
        constructUrl(PASTE_CREATE_PAGE, {
          error: 'Unable to pin paste to IPFS!',
        })
      );
      return;
    }

    const result = await createNewPasteInternal(title, cid, syntax, web3);

    if (!result) {
      router.push(
        constructUrl(PASTE_CREATE_PAGE, {
          error: 'Unable to create private paste!',
        })
      );
    }
  } else {
    router.push(
      constructUrl(PASTE_CREATE_PAGE, { error: 'Wallet is not connected!' })
    );
  }
}

async function uploadFile(account: string, body: string) {
  try {
    return await uploadFileToIPFS(account, body);
  } catch (e) {
    logError(JSON.stringify(e));
    logError(e);
  }
  return null;
}

async function createNewPasteInternal(
  title: string,
  cid: string,
  syntax: string,
  web3: ReturnType<typeof useWeb3React>
) {
  const config: Config = configJson;

  const sepoliaNetwork = new ethers.Network(
    SepoliaTestnet.chainName,
    SepoliaTestnet.chainId
  );
  const ethersProvider = new ethers.BrowserProvider(
    web3.provider as any,
    sepoliaNetwork
  );
  const signer = await ethersProvider.getSigner(web3.account);

  const securePaste = new ethers.Contract(
    config['11155111'].address,
    contractDeployment.abi,
    signer
  ) as SecurePasteContract;

  try {
    const transaction = await securePaste.createPaste(
      title,
      cid,
      syntax,
      BigInt(Math.floor(Date.now() / 1000))
    );
    transaction.wait();

    return true;
  } catch (e) {
    logError(JSON.stringify(e));
    logError(e);
  }

  return false;
}
