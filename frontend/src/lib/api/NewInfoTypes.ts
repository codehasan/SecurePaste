import { ObjectId } from 'mongodb';

export interface NewPaste {
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

export interface NewPasteLike {
  userId: ObjectId;
  pasteId: ObjectId;
}

export interface NewComment {
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

export interface NewCommentLike {
  userId: ObjectId;
  commentId: ObjectId;
}

export interface NewUser {
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
