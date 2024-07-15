import { z } from 'zod';

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
    userId: z.string().min(1, { message: 'User ID is required' }),
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
    userId: z.string().min(1, { message: 'User ID is required' }),
    pasteId: z.string().min(1, { message: 'Paste ID is required' }),
    parentId: z.string().optional(),
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

export const SignUpShcema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Name must be at least 4 characters long.' })
      .max(50, { message: 'Name must not exceed 50 characters.' }),
    email: z.string().email({ message: 'A valid email address is required.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(32, { message: 'Password must not exceed 32 characters.' }),
    captchaToken: z.string().min(0, { message: 'Captcha token is required.' }),
  })
  .strict();

export const SignInSchema = z
  .object({
    email: z.string().email({ message: 'A valid email address is required.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(32, { message: 'Password must not exceed 32 characters.' }),
    options: z.object({
      captchaToken: z
        .string()
        .min(0, { message: 'Captcha token is required.' }),
    }),
  })
  .strict();

export const ForgotPasswordSchema = z
  .object({
    email: z.string().email({ message: 'A valid email address is required.' }),
    captchaToken: z.string().min(0, { message: 'Captcha token is required.' }),
  })
  .strict();

export const PasswordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(32, { message: 'Password must not exceed 32 characters.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .max(32, { message: 'Password must not exceed 32 characters.' }),
  })
  .strict()
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Both passwords should match.',
  });

export const TokenVerificationShcema = z
  .object({
    email: z.string().email({ message: 'A valid email address is required.' }),
    token: z.string().min(0, { message: 'OTP is required.' }),
  })
  .strict();

export type Paste = z.infer<typeof PasteSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type NewUser = z.infer<typeof SignUpShcema>;
