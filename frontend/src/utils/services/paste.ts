import { SupabaseClient, User } from '@supabase/supabase-js';
import prisma from '../prisma/db';
import {
  Comment,
  CommentLike,
  Paste,
  PasteLike,
  User as PrismaUser,
} from '@prisma/client';
import { sort } from '@/lib/CommentSort';

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

export async function getPasteById(supabase: SupabaseClient, id: string) {
  let authUser: User | null = null;
  let data: PasteData | null = null;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Supabase user error:', error.message);
    } else if (data?.user) {
      authUser = data.user;
    }
  } catch (unexpectedError) {
    console.error('Unexpected error:', unexpectedError);
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
        visitsCount: true,
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
        comments: authUser
          ? sort(comments, { userId: authUser.id })
          : sort(comments),
        owner: authUser ? paste.user.id === authUser.id : false,
        likedByMe: Boolean(pasteLike),
      };
    }
  } catch (error) {
    console.error('Error fetching paste data:', JSON.stringify(error));
  }

  return { authUser, paste: data };
}
