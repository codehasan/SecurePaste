'use server';

import { getLines, getTags } from '@/lib/ArrayHelper';
import logger from '@/lib/logging/server';
import { push } from '@/lib/RedirectHelper';
import { IdVerificationSchema, NewPasteSchema } from '@/lib/schema/ZodSchema';
import prisma from '@/utils/prisma/db';
import { redirect, RedirectType } from 'next/navigation';
import { v4 } from 'uuid';
import { getAuthErrorMessage } from '../errors';
import { createClient } from '../server';

export async function createNewPaste(formData: FormData) {
  const pathname = '/paste';

  // 1. Validate the form data sent from the app
  const data = {
    title: formData.get('title') as string,
    syntax: formData.get('syntax') as string,
    body: formData.get('body') as string,
    visibility: formData.get('visibility') as string,
    tags: getTags((formData.get('tags') as string) || ''),
  };

  const validation = NewPasteSchema.safeParse(data);

  if (!validation.success) {
    logger.warn(JSON.stringify(validation.error));
    push(pathname, { error: validation.error.issues[0].message });
  }

  // 2. Verify if user is logged in
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error) {
    logger.error(JSON.stringify(userResponse.error));
    push(pathname, { error: getAuthErrorMessage(userResponse.error) });
  }

  if (!userResponse.data.user) {
    push(pathname, {
      error: 'An unexpected error occurred.',
    });
  }

  // Upload file to supabase storage bucket
  const filePath = `${userResponse.data.user!.id}/${v4()}.txt`;
  const storageResponse = await supabase.storage
    .from('pastes')
    .upload(filePath, data.body, {
      contentType: 'text/plain',
    });

  if (storageResponse.error) {
    logger.error(`path: ${filePath}, ${JSON.stringify(storageResponse.error)}`);
    push(pathname, {
      error: 'Unable to upload your paste data.',
    });
  }

  if (!storageResponse.data?.fullPath) {
    push(pathname, {
      error: 'An unexpected error occurred.',
    });
  }

  const bodyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${storageResponse.data!.fullPath}`;
  try {
    await prisma.paste.create({
      data: {
        title: data.title,
        bodyOverview: getLines(data.body, 5),
        bodyUrl,
        syntax: data.syntax,
        tags: data.tags,
        userId: userResponse.data.user!.id,
      },
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
    push(pathname, {
      error: 'Unable to create your paste.',
    });
  }

  redirect(`/user/${userResponse.data.user!.id}/pastes`, RedirectType.push);
}

export async function deletePaste(pasteId: string) {
  // 1. Validate the form data sent from the app
  const validation = IdVerificationSchema.safeParse(pasteId);

  if (!validation.success) {
    logger.warn(JSON.stringify(validation.error));
    throw new Error(validation.error.issues[0].message);
  }

  // 2. Verify if user is logged in
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error) {
    logger.error(JSON.stringify(userResponse.error));
    throw new Error(getAuthErrorMessage(userResponse.error));
  }

  if (!userResponse.data.user) {
    throw new Error('An unexpected error occurred.');
  }

  try {
    await prisma.paste.delete({
      where: {
        id: pasteId,
        userId: userResponse.data.user.id,
      },
    });
  } catch (error) {
    logger.error(JSON.stringify(error));
    throw new Error('An unexpected error occurred.');
  }
}

/**
 * @param userId - The id of user who liked the paste.
 * @param pasteId - The paste id where like should be toggled.
 * @description This functions throws all errors. The caller function has to implement error handling when calling this function.
 */
export async function toggleLike(
  userId: string,
  pasteId: string,
  addLike: boolean
) {
  // let start = performance.now();

  // 1. Validate the form data sent from the app
  const validation = IdVerificationSchema.safeParse(pasteId);

  if (!validation.success) {
    logger.warn(JSON.stringify(validation.error));
    throw new Error(validation.error.issues[0].message);
  }

  // console.log(`Validation: ${(performance.now() - start).toFixed(2)} ms`);

  try {
    if (addLike) {
      await prisma.pasteLike.create({
        data: {
          userId,
          pasteId,
        },
      });
    } else {
      await prisma.pasteLike.delete({
        where: {
          userId_pasteId: {
            userId,
            pasteId,
          },
        },
      });
    }
  } catch (error) {
    logger.error(JSON.stringify(error));
    throw new Error('An unexpected error occurred.');
  }
}
