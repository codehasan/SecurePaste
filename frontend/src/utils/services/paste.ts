'use server';
import { logError } from '@/lib/logging/client';
import {
  Comment,
  CommentLike,
  Paste,
  PasteLike,
  User as PrismaUser,
} from '@prisma/client';
import { User } from '@supabase/supabase-js';
import axios from 'axios';
import { getErrorMessage } from '../axios/error';
import { sort } from '@/lib/CommentSort';
import { createClient } from '../supabase/server';
import logger from '@/lib/logging/server';
import prisma from '../prisma/db';

export type UserData = Omit<PrismaUser, 'bio'>;

export type CommentData = Omit<Comment, 'userId' | 'pasteId'> & {
  user: UserData;
  _count: {
    likes: number;
  };
  owner: boolean;
  likedByMe: boolean;
};

export type PasteData = Omit<Paste, 'bodyOverview' | 'updatedAt' | 'userId'> & {
  body: string;
  owner: boolean;
  likedByMe: boolean;
  _count: {
    likes: number;
  };
  comments: CommentData[];
  user: UserData;
};

const UserDataSelect = {
  id: true,
  avatar: true,
  name: true,
  verified: true,
};

export const getPasteById = async (id: string) => {
  let authUser: User | null = null;
  let data: PasteData | null = null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      logger.error(`Supabase user error: ${JSON.stringify(error)}`);
    } else if (data?.user) {
      authUser = data.user;
    }
  } catch (unexpectedError) {
    logger.error(`Unexpected user error: ${JSON.stringify(unexpectedError)}`);
  }

  try {
    const paste = await prisma.paste.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        bodyUrl: true,
        title: true,
        syntax: true,
        tags: true,
        createdAt: true,
        _count: { select: { likes: true } },
        user: {
          select: UserDataSelect,
        },
        comments: {
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            message: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: UserDataSelect,
            },
            _count: { select: { likes: true } },
          },
        },
      },
    });

    if (paste) {
      let commentLikes: CommentLike[] = [];
      let pasteLike: PasteLike | null = null;

      if (authUser) {
        commentLikes = await prisma.commentLike.findMany({
          where: {
            userId: authUser.id,
            commentId: { in: paste.comments.map((comment) => comment.id) },
          },
        });

        pasteLike = await prisma.pasteLike.findUnique({
          where: {
            userId_pasteId: {
              userId: authUser.id,
              pasteId: id,
            },
          },
        });
      }

      const response = await axios.get(paste.bodyUrl, {
        timeout: 10_000,
      });

      if (!response.data) {
        logger.info(`Body url: ${paste.bodyUrl}`);
        logger.error(`Error retrieving paste body: ${response.statusText}`);

        return null;
      }

      const comments = paste.comments.map((comment) => {
        return {
          ...comment,
          owner: authUser ? comment.user.id === authUser.id : false,
          likedByMe: Boolean(
            commentLikes.find((like) => like.commentId === comment.id)
          ),
        };
      });

      data = {
        ...paste,
        body: response.data,
        comments: authUser
          ? sort(comments, { userId: authUser.id })
          : sort(comments),
        owner: authUser ? paste.user.id === authUser.id : false,
        likedByMe: Boolean(pasteLike),
      };
    }
  } catch (err) {
    logger.error(`Unexpected error: ${JSON.stringify(err)}`);
  }

  return data;
};
