import { logError } from '@/lib/logging/client';
import { Comment, Paste, User as PrismaUser } from '@prisma/client';
import { User } from '@supabase/supabase-js';
import axios from 'axios';
import { getErrorMessage } from '../axios/error';

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

export const togglePasteLike = async ({ id }: { id: string }) => {
  try {
    const response = await axios.post(`/api/paste/${id}/toggleLike`, {
      timeout: 10_000,
    });

    return response.data as { addLike: boolean };
  } catch (error) {
    logError(JSON.stringify(error));
    throw getErrorMessage(error);
  }
};

export const getPasteById = async ({ id }: { id: string }) => {
  try {
    const response = await axios.get(`/api/paste/${id}`, {
      timeout: 10_000,
    });

    return response.data as { authUser: User | null; paste: PasteData | null };
  } catch (error) {
    logError(JSON.stringify(error));
    throw getErrorMessage(error);
  }
};
