import { sort } from '@/lib/CommentSort';
import logger from '@/lib/logging/server';
import prisma from '@/utils/prisma/db';
import { PasteData } from '@/utils/services/paste';
import { createClient } from '@/utils/supabase/server';
import { CommentLike, PasteLike } from '@prisma/client';
import { User } from '@supabase/supabase-js';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const UserDataSelect = {
  id: true,
  avatar: true,
  name: true,
  verified: true,
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
        id: params.id,
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
              pasteId: params.id,
            },
          },
        });
      }

      const response = await axios.get(paste.bodyUrl, {
        timeout: 10_000,
      });
      const body = response.data
        ? response.data
        : `Unable to download the paste content.
              Please refresh the page!`;

      if (response.status !== 200) {
        logger.info(`Body url: ${paste.bodyUrl}`);
        logger.error(`Error retrieving paste body: ${response.statusText}`);

        return NextResponse.json(
          { error: 'Error retrieving paste body! Please try again.' },
          { status: 500 }
        );
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
        body,
        comments: authUser
          ? sort(comments, { userId: authUser.id })
          : sort(comments),
        owner: authUser ? paste.user.id === authUser.id : false,
        likedByMe: Boolean(pasteLike),
      };
    }
  } catch (err) {
    logger.error(`Unexpected error: ${JSON.stringify(err)}`);

    return NextResponse.json(
      { error: 'An unexpected error occurred!' },
      { status: 500 }
    );
  }

  return NextResponse.json({ authUser, paste: data }, { status: 200 });
}
