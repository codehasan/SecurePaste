'use client';
import { CommentData, PasteData } from '@/utils/services/paste';
import { User } from '@supabase/supabase-js';
import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface PasteState {
  authUser: User | null;
  paste: PasteData | null;
  rootComments: CommentData[];
  getReplies: (parentId: string) => CommentData[];
  createLocalComment: (comment: CommentData) => void;
  updateLocalComment: (id: string, message: string) => void;
  deleteLocalComment: (id: string) => void;
  toggleLocalCommentLike: (id: string, addLike: boolean) => void;
}

interface PasteProviderProps {
  authUser: User | null;
  paste: PasteData | null;
  children: ReactNode;
}

const PasteContext = React.createContext({
  authUser: null,
  paste: null,
  rootComments: [] as CommentData[],
  getReplies: (parentId: string) => [] as CommentData[],
  createLocalComment: (comment: CommentData) => {},
  updateLocalComment: (id: string, message: string) => {},
  deleteLocalComment: (id: string) => {},
  toggleLocalCommentLike: (id: string, addLike: boolean) => {},
} as PasteState);

export const usePost = () => {
  return useContext(PasteContext);
};

export const PasteProvider = ({
  children,
  authUser,
  paste,
}: PasteProviderProps) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const commentsByParentId = useMemo(() => {
    const group: { [key: string]: CommentData[] } = {};

    comments.forEach((comment) => {
      group[comment.parentId || ''] ||= [];
      group[comment.parentId || ''].push(comment);
    });
    return group;
  }, [comments]);

  useEffect(() => {
    if (!paste || paste.comments === null) return;
    setComments(paste.comments);
  }, [paste?.comments]);

  const getReplies = (parentId: string) => {
    return commentsByParentId[parentId];
  };

  const createLocalComment = (comment: CommentData) => {
    setComments((prevComments) => {
      return [comment, ...prevComments];
    });
  };

  const updateLocalComment = (id: string, message: string) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, message };
        } else {
          return comment;
        }
      });
    });
  };

  const deleteLocalComment = (id: string) => {
    setComments((prevComments) => {
      return prevComments.filter((comment) => comment.id !== id);
    });
  };

  const toggleLocalCommentLike = (id: string, addLike: boolean) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (id === comment.id) {
          if (addLike) {
            return {
              ...comment,
              likeCount: comment._count.likes + 1,
              likedByMe: true,
            };
          } else {
            return {
              ...comment,
              likeCount: comment._count.likes - 1,
              likedByMe: false,
            };
          }
        } else {
          return comment;
        }
      });
    });
  };

  return (
    <PasteContext.Provider
      value={{
        authUser,
        paste,
        rootComments: commentsByParentId[''],
        getReplies,
        createLocalComment,
        updateLocalComment,
        deleteLocalComment,
        toggleLocalCommentLike,
      }}
    >
      {children}
    </PasteContext.Provider>
  );
};
