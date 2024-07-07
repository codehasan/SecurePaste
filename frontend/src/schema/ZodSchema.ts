import { ObjectId } from 'mongodb';
import { z } from 'zod';

const objectId = ({ message }: { message: string }) => {
  return z
    .string()
    .refine((val) => ObjectId.isValid(val), message)
    .transform((val) => new ObjectId(val));
};

const date = () => {
  return z
    .string()
    .refine(
      (str) => {
        return str.endsWith('Z') && !isNaN(new Date(str).getTime());
      },
      { message: 'Invalid date! Must be in UTC format and a valid date.' }
    )
    .transform((str) => new Date(str));
};

export const PasteSchema = z
  .object({
    title: z
      .string()
      .min(4, { message: 'Paste name must be at least 4 characters long' })
      .max(100, { message: 'Paste name must not exceed 100 characters' }),
    userId: objectId({
      message: 'Invalid user ID',
    }),
    createdAt: date(),
    syntax: z.string().min(1, { message: 'Syntax is required' }),
    bodyUrl: z.string().url({
      message: 'Body URL must be a valid URL',
    }),
    metrics: z.object({
      size: z
        .number()
        .min(0, { message: 'Size cannot be negative' })
        .max(524_288, {
          message: 'Size can not exceed 512 KB',
        }),
      views: z.number().min(0, { message: 'Views cannot be negative' }),
      likes: z.number().min(0, { message: 'Likes cannot be negative' }),
      dislikes: z.number().min(0, { message: 'Dislikes cannot be negative' }),
    }),
    tags: z
      .array(z.string())
      .max(10, { message: 'At most 10 tags are allowed' }),
  })
  .strict();

export const CommentSchema = z
  .object({
    userId: objectId({
      message: 'Invalid user ID',
    }),
    pasteId: objectId({
      message: 'Invalid paste ID',
    }),
    parentId: objectId({
      message: 'Invalid comment ID',
    }).optional(),
    message: z
      .string()
      .min(4, { message: 'Message must be at least 4 characters long' })
      .max(1024, { message: 'Message must not exceed 1024 characters' }),
    createdAt: date(),
    metrics: z.object({
      children: z.number().min(0, { message: 'Children cannot be negative' }),
      likes: z.number().min(0, { message: 'Likes cannot be negative' }),
      dislikes: z.number().min(0, { message: 'Dislikes cannot be negative' }),
    }),
  })
  .strict();

export const UserSchema = z
  .object({
    uid: z.string().min(1, { message: 'UID is required' }),
    wallet: z
      .string()
      .length(42, { message: 'Invalid Ethereum wallet address' })
      .optional(),
    email: z.string().email().optional(),
    oauthProvider: z.string().min(1, { message: 'OAuth provider is required' }),
    jwt: z
      .string()
      .min(1, { message: 'Json Web Token is required' })
      .optional(),
    name: z
      .string()
      .min(4, { message: 'Name must be at least 4 characters long' })
      .max(50, { message: 'Name must not exceed 50 characters' }),
    profileUrl: z
      .string()
      .url({
        message: 'Profile URL must be a valid URL',
      })
      .optional(),
    createdAt: date(),
  })
  .strict()
  .refine(
    (val) => {
      return val.email || val.wallet;
    },
    {
      message: 'Either wallet or OAuth information is required',
    }
  );

export const PasteLikeSchema = z
  .object({
    userId: objectId({
      message: 'Invalid user ID',
    }),
    pasteId: objectId({
      message: 'Invalid paste ID',
    }),
  })
  .strict();

export const CommentLikeSchema = z
  .object({
    userId: objectId({
      message: 'Invalid user ID',
    }),
    commentId: objectId({
      message: 'Invalid comment ID',
    }),
  })
  .strict();

export type Paste = z.infer<typeof PasteSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type User = z.infer<typeof UserSchema>;

export type PasteLike = z.infer<typeof PasteLikeSchema>;
export type CommentLike = z.infer<typeof CommentLikeSchema>;
