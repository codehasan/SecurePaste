'use client';
import { logError } from '@/lib/logging/client';
import axios from 'axios';
import { getErrorMessage } from '../axios/error';
import { CommentData } from './paste';

export const createNewComment = async ({
  pasteId,
  message,
  parentId,
}: {
  pasteId: string;
  message: string;
  parentId: string | null;
}) => {
  try {
    const response = await axios.post(
      `/api/paste/${pasteId}/comments`,
      {
        pasteId,
        message,
        parentId,
      },
      { timeout: 10_000 }
    );

    return response.data as CommentData;
  } catch (error) {
    logError(JSON.stringify(error));
    throw getErrorMessage(error);
  }
};

export const updateComment = async ({
  pasteId,
  message,
  id,
}: {
  pasteId: string;
  message: string;
  id: string;
}) => {
  try {
    const response = await axios.put(
      `/api/paste/${pasteId}/comments/${id}`,
      {
        pasteId,
        message,
        id,
      },
      { timeout: 10_000 }
    );

    return response.data as CommentData;
  } catch (error) {
    logError(JSON.stringify(error));
    throw getErrorMessage(error);
  }
};

export const deleteComment = async ({
  pasteId,
  id,
}: {
  pasteId: string;
  id: string;
}) => {
  try {
    const response = await axios.delete(
      `/api/paste/${pasteId}/comments/${id}`,
      {
        timeout: 10_000,
      }
    );

    return response.data as CommentData;
  } catch (error) {
    logError(JSON.stringify(error));
    throw getErrorMessage(error);
  }
};

export const toggleCommentLike = async ({
  pasteId,
  id,
}: {
  pasteId: string;
  id: string;
}) => {
  try {
    const response = await axios.post(
      `/api/paste/${pasteId}/comments/${id}/toggleLike`,
      {
        timeout: 10_000,
      }
    );

    return response.data as { addLike: boolean };
  } catch (error) {
    logError(JSON.stringify(error));
    throw getErrorMessage(error);
  }
};
