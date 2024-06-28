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
    .min(1, { message: 'Creation date is required' })
    .refine(
      (str) => {
        return str.endsWith('Z') && !isNaN(new Date(str).getTime());
      },
      { message: 'Invalid date! Must be in UTC format and a valid date.' }
    )
    .transform((str) => new Date(str));
};

const positiveNumber = ({ message }: { message: string }) => {
  return z.number().min(0, message);
};

const requiredString = ({ message }: { message: string }) => {
  return z.string().min(1, message);
};

export const NewPasteSchema = z.object({
  title: z
    .string()
    .min(4, { message: 'Paste name must be at least 4 characters long' })
    .max(100, { message: 'Paste name must not exceed 100 characters' }),
  userId: objectId({
    message: 'Invalid user ID',
  }),
  createdAt: date(),
  syntax: requiredString({ message: 'Syntax is required' }),
  bodyUrl: requiredString({ message: 'Body URL is required' }).url({
    message: 'Body URL must be a valid URL',
  }),
  metrics: z.object({
    size: positiveNumber({ message: 'Size cannot be negative' }).max(524_288, {
      message: 'Size can not exceed 512 KB',
    }),
    views: positiveNumber({ message: 'Views cannot be negative' }),
    likes: positiveNumber({ message: 'Likes cannot be negative' }),
    dislikes: positiveNumber({ message: 'Dislikes cannot be negative' }),
  }),
  tags: z.array(z.string()).max(10, { message: 'At most 10 tags are allowed' }),
});

export const NewCommentSchema = z.object({
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
    children: positiveNumber({ message: 'Children cannot be negative' }),
    likes: positiveNumber({ message: 'Likes cannot be negative' }),
    dislikes: positiveNumber({ message: 'Dislikes cannot be negative' }),
  }),
});

export const NewUserSchema = z.object({
  wallet: z
    .string()
    .length(42, { message: 'Invalid Ethereum wallet address' })
    .optional(),
  email: z.string().email().optional(),
  oauthProvider: requiredString({ message: 'OAuth provider is required' }),
  oauthProviderId: z
    .string()
    .min(1, { message: 'OAuth provider ID is required' })
    .optional(),
  name: z
    .string()
    .min(4, { message: 'Name must be at least 4 characters long' })
    .max(50, { message: 'Name must not exceed 50 characters' }),
  profileUrl: z
    .string()
    .min(1, { message: 'Profile URL is required' })
    .url({
      message: 'Profile URL must be a valid URL',
    })
    .optional(),
  createdAt: date(),
});

export const PasteSchema = NewPasteSchema.merge(
  z.object({
    _id: objectId({ message: 'Invalid unique ID' }),
  })
);

export const CommentSchema = NewCommentSchema.merge(
  z.object({
    _id: objectId({ message: 'Invalid unique ID' }),
  })
);

export const UserSchema = NewUserSchema.merge(
  z.object({
    _id: objectId({ message: 'Invalid unique ID' }),
  })
);

export const PasteLikeSchema = z.object({
  userId: objectId({
    message: 'Invalid user ID',
  }),
  pasteId: objectId({
    message: 'Invalid paste ID',
  }),
});

export const CommentLikeSchema = z.object({
  userId: objectId({
    message: 'Invalid user ID',
  }),
  commentId: objectId({
    message: 'Invalid comment ID',
  }),
});

export type NewPaste = z.infer<typeof NewPasteSchema>;
export type NewComment = z.infer<typeof NewCommentSchema>;
export type NewUser = z.infer<typeof NewUserSchema>;

export type Paste = z.infer<typeof PasteSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type User = z.infer<typeof UserSchema>;

export type PasteLike = z.infer<typeof PasteLikeSchema>;
export type CommentLike = z.infer<typeof CommentLikeSchema>;
