'use server';

import logger from '@/lib/logging/server';
import { push } from '@/lib/RedirectHelper';
import { v4 } from 'uuid';
import { pinata } from '../pinata';

export async function uploadFileToIPFS(wallet: string, content: string) {
  const pathname = '/paste';

  try {
    const uuid = v4();
    const timestamp = new Date().toISOString();
    const uniqueContent = `${content}\n\n${timestamp} | ${wallet} | ${uuid}`;
    const file = new File([uniqueContent], `${uuid}.txt`, {
      type: 'text/plain',
    });
    const result = await pinata.upload.file(file);

    return result.cid;
  } catch (error) {
    logger.error(error);
    logger.error(JSON.stringify(error));
    push(pathname, { error: 'Unable to pin file in IPFS' });
  }

  return null;
}
