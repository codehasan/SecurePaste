'use server';

import { getDb, writeToDb } from '@/data/jsondb';
import { EditCommentSchema, NewCommentSchema } from '@/lib/schema/ZodSchema';
import { redirect, RedirectType } from 'next/navigation';
import { v4 } from 'uuid';
import { z } from 'zod';

const commentDbPath =
  '/home/rahat/Desktop/Programming/Web3/SecurePaste/frontend/src/data/comments.json';

export async function newComment(formData: FormData) {
  const data = {
    title: formData.get('title') as string,
    syntax: formData.get('syntax') as string,
    body: formData.get('body') as string,
    encryption: formData.get('encryption') as string,
    tags: (formData.get('tags') as string).split(/[\s,]+/),
  };

  console.log(JSON.stringify(data));

  const validation = NewCommentSchema.safeParse(data);

  if (!validation.success) {
    redirect(
      `/error?message=${validation.error.issues[0].message}`,
      RedirectType.replace
    );
  }
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
