'use server';

import { getDb, writeToDb } from '@/data/jsondb';
import { EditCommentSchema, NewCommentSchema } from '@/lib/schema/ZodSchema';
import { redirect, RedirectType } from 'next/navigation';
import { v4 } from 'uuid';
import { z } from 'zod';
import { createClient } from '../server';
import logger from '@/lib/logging/server';
import { getAuthErrorMessage } from '../errors';
import prisma from '@/utils/prisma/db';
import { getLines } from '@/lib/ArrayHelper';

const commentDbPath =
  '/home/rahat/Desktop/Programming/Web3/SecurePaste/frontend/src/data/comments.json';

export async function newComment(formData: FormData) {
  // 1. Validate the form data sent from the app
  const data = {
    title: formData.get('title') as string,
    syntax: formData.get('syntax') as string,
    body: formData.get('body') as string,
    visibility: formData.get('visibility') as string,
    tags: ((formData.get('tags') as string) || '').split(/[\s,]+/),
  };
  const validation = NewCommentSchema.safeParse(data);

  if (!validation.success) {
    redirect(
      `/error?message=${validation.error.issues[0].message}`,
      RedirectType.replace
    );
  }

  // 2. Verify if user is logged in
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error) {
    logger.error(JSON.stringify(userResponse.error));
    redirect(
      `/error?message=${getAuthErrorMessage(userResponse.error)}`,
      RedirectType.replace
    );
  }

  if (!userResponse.data.user) {
    redirect(
      `/error?message=An unexpected error occurred. Please try again later.`,
      RedirectType.replace
    );
  }

  // Upload file to supabase storage bucket
  const filePath = `${userResponse.data.user.id}/${v4()}.txt`;
  const sorageResponse = await supabase.storage
    .from('pastes')
    .upload(filePath, data.body, {
      contentType: 'text/plain;charset=UTF-8',
    });

  if (sorageResponse.error) {
    logger.error(JSON.stringify(sorageResponse.error));
    redirect(
      `/error?message=Unable to upload your paste data. Please try again later.`,
      RedirectType.replace
    );
  }
  const bodyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${sorageResponse.data.fullPath}`;

  // Upload file content in postgresql
  try {
    const paste = await prisma.paste.create({
      data: {
        title: data.title,
        bodyOverview: getLines(data.body, 5),
        bodyUrl,
        syntax: data.syntax,
        tags: data.tags,
        user: {
          connect: {
            id: userResponse.data.user.id,
          },
        },
      },
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
    redirect(
      `/error?message=Unable to create your paste. Please try again later.`,
      RedirectType.replace
    );
  }

  redirect(`/user/${userResponse.data.user.id}/pastes`, RedirectType.replace);
}

export async function postComment(formData: FormData) {
  const data = {
    parentId: formData.get('parentId') as string,
    pasteId: formData.get('pasteId') as string,
    message: formData.get('message') as string,
  };
  const validation = NewCommentSchema.safeParse(data);

  if (!validation.success) {
    redirect(
      `/error?message=${validation.error.issues[0].message}`,
      RedirectType.replace
    );
  }

  const comment = {
    id: v4(),
    message: data.message,
    parentId: data.parentId || null,
    pasteId: data.pasteId,
    userId: '4a085585-7953-4afb-b3f3-665c9c5e79b9',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    likesCount: 0,
    childrenCount: 0,
  };

  const comments: {
    id: string;
    message: string;
    parentId: string | null;
    pasteId: string;
    userId: string;
    likesCount: number;
    childrenCount: number;
    updatedAt: string;
    createdAt: string;
  }[] = await getDb(commentDbPath);

  comments[comments.length] = comment;

  if (comment.parentId) {
    for (let element of comments) {
      if (element.id === comment.parentId) {
        element.childrenCount++;
      }
    }
  }

  writeToDb(commentDbPath, JSON.stringify(comments));
}

export async function deleteComment(formData: FormData) {
  const data = {
    commentId: formData.get('commentId') as string,
  };
  const validation = z
    .string()
    .min(1, { message: 'Comment ID is required.' })
    .safeParse(data.commentId);

  if (!validation.success) {
    redirect(
      `/error?message=${validation.error.issues[0].message}`,
      RedirectType.replace
    );
  }

  const comments: {
    id: string;
    message: string;
    parentId: string | null;
    pasteId: string;
    userId: string;
    likesCount: number;
    childrenCount: number;
    updatedAt: string;
    createdAt: string;
  }[] = await getDb(commentDbPath);

  const subComments = new Set([data.commentId]);
  const newComments = comments.filter((comment) => {
    if (comment.id === data.commentId) return false;

    if (comment.parentId && subComments.has(comment.parentId)) {
      subComments.add(comment.id);
      return false;
    }
    return true;
  });

  writeToDb(commentDbPath, JSON.stringify(newComments));
}

export async function editComment(formData: FormData) {
  const data = {
    commentId: formData.get('commentId') as string,
    message: formData.get('message') as string,
  };
  const validation = EditCommentSchema.safeParse(data);

  if (!validation.success) {
    redirect(
      `/error?message=${validation.error.issues[0].message}`,
      RedirectType.replace
    );
  }

  const comments: {
    id: string;
    message: string;
    parentId: string | null;
    pasteId: string;
    userId: string;
    likesCount: number;
    childrenCount: number;
    updatedAt: string;
    createdAt: string;
  }[] = await getDb(commentDbPath);

  for (let comment of comments) {
    if (comment.id === data.commentId) {
      comment.message = data.message;
      comment.updatedAt = new Date().toISOString();
      break;
    }
  }

  writeToDb(commentDbPath, JSON.stringify(comments));
}
