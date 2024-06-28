import { ObjectId } from 'mongodb';

export interface Paste {
  _id: ObjectId;
  title: string;
  userId: ObjectId;
  createdAt: Date;
  syntax: string;
  bodyUrl: string;
  metrics: {
    size: number;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
  };
  tags: string[];
}

export interface PasteLike {
  _id: ObjectId;
  userId: ObjectId;
  pasteId: ObjectId;
}

export interface Comment {
  _id: ObjectId;
  userId: ObjectId;
  pasteId: ObjectId;
  message: string;
  createdAt: Date;
  parentId?: ObjectId;
  metrics: {
    children: number;
    likes: number;
    dislikes: number;
  };
}

export interface CommentLike {
  _id: ObjectId;
  userId: ObjectId;
  commentId: ObjectId;
}

export interface User {
  _id: ObjectId;
  wallet?: string;
  email?: string;
  oauthProvider: string;
  oauthProviderId?: string;
  name: string;
  createdAt: Date;
  engagement: {
    likes: number;
    dislikes: number;
    comments: number;
  };
}
