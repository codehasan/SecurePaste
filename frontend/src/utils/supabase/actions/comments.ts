'use server';

import logger from '@/lib/logging/server';
import { IdVerificationSchema, NewCommentSchema } from '@/lib/schema/ZodSchema';
import prisma from '@/utils/prisma/db';
import { CommentData } from '@/utils/services/paste';

export async function createNewComment({
  pasteId,
  userId,
  parentId,
  message,
}: {
  pasteId: string;
  userId: string;
  parentId: string | null;
  message: string;
}): Promise<CommentData> {
  // 1. Validate the form data sent from the app
  const data = {
    pasteId,
    userId,
    parentId,
    message,
  };

  const validation = NewCommentSchema.safeParse(data);

  if (!validation.success) {
    logger.warn(JSON.stringify(validation.error));
    throw new Error(validation.error.issues[0].message);
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        message,
        pasteId,
        parentId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            name: true,
            verified: true,
          },
        },
      },
    });

    return {
      ...comment,
      _count: {
        likes: 0,
      },
      likedByMe: false,
      owner: true,
    };
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw new Error('An unexpected error occured.');
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
  let start = performance.now();
  // 1. Validate the form data sent from the app
  const validation = IdVerificationSchema.safeParse(pasteId);

  if (!validation.success) {
    logger.warn(JSON.stringify(validation.error));
    throw new Error(validation.error.issues[0].message);
  }

  console.log(`Validation: ${(performance.now() - start).toFixed(2)} ms`);

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
