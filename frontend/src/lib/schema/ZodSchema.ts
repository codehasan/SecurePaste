import { z } from 'zod';

export const NewPasteSchema = z
  .object({
    title: z
      .string()
      .min(4, { message: 'Paste name must be at least 4 characters long.' })
      .max(100, { message: 'Paste name must not exceed 100 characters.' }),
    syntax: z.string().min(1, { message: 'Syntax is required.' }),
    body: z
      .string()
      .min(4, { message: 'Paste name must be at least 4 characters long.' })
      .max(524_288, {
        message: 'Paste name must not exceed 524,288 characters',
      }),
    visibility: z.string().min(1, { message: 'Encryption is required.' }),
    tags: z
      .array(z.string())
      .max(10, { message: 'At most 10 tags are allowed.' }),
  })
  .strict();

export const NewCommentSchema = z
  .object({
    parentId: z.string().nullable(),
    pasteId: z.string().min(1, { message: 'Paste ID is required.' }),
    message: z
      .string()
      .min(4, { message: 'Message must be at least 4 characters long' })
      .max(1024, { message: 'Message must not exceed 1024 characters' }),
  })
  .strict();

export const EditCommentSchema = z
  .object({
    commentId: z.string().min(1, { message: 'Comment ID is required.' }),
    message: z
      .string()
      .min(4, { message: 'Message must be at least 4 characters long' })
      .max(1024, { message: 'Message must not exceed 1024 characters' }),
  })
  .strict();

export const ResendVerificationSchema = z
  .object({
    email: z.string().email({ message: 'A valid email address is required.' }),
    options: z.object({
      captchaToken: z
        .string()
        .min(0, { message: 'Captcha token is required.' }),
    }),
  })
  .strict();

export const SignUpSchema = z
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

export const TokenVerificationSchema = z
  .object({
    email: z.string().email({ message: 'A valid email address is required.' }),
    token: z.string().min(0, { message: 'OTP is required.' }),
  })
  .strict();

export const IdVerificationSchema = z
  .string()
  .min(0, { message: 'ID is required.' });
