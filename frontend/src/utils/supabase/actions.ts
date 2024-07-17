'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import getErrorMessage from '@/utils/supabase/errors';
import {
  ForgotPasswordSchema,
  PasswordResetSchema,
  ResendVerificationSchema,
  SignInSchema,
  TokenVerificationShcema,
} from '@/lib/schema/ZodSchema';
import logger from '@/lib/logging/server';

export async function resendSignUpConfirmation(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    options: {
      captchaToken: formData.get('cf-turnstile-response') as string,
    },
  };
  const validation = ResendVerificationSchema.safeParse(data);

  if (!validation.success) {
    redirect(
      `/auth/verify_account?error=${validation.error.issues[0].message}`
    );
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resend({
    ...data,
    type: 'signup',
  });

  if (error) {
    logger.error(JSON.stringify(error));
    redirect(`/auth/verify_account?error=${getErrorMessage(error)}`);
  }

  revalidatePath('/auth/verify_account', 'page');
  redirect(
    "/auth/verify_account?message=Check your inbox for confirmation email. If you can't find it, check the spam or junk folder."
  );
}

export async function signIn(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      captchaToken: formData.get('cf-turnstile-response') as string,
    },
  };
  const validation = SignInSchema.safeParse(data);

  if (!validation.success) {
    redirect(`/auth/signin?error=${validation.error.issues[0].message}`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    logger.error(JSON.stringify(error));
    redirect(`/auth/signin?error=${getErrorMessage(error)}`);
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signOutLocal() {
  await signOutInternal('local');
}

export async function signOutGlobal() {
  await signOutInternal('global');
}

export async function signOutOthers() {
  await signOutInternal('others');
}

async function signOutInternal(scope: 'global' | 'local' | 'others') {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut({ scope });

  if (error) {
    redirect(`/auth/signout?error=${getErrorMessage(error)}`);
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function sendPasswordReset(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    captchaToken: formData.get('cf-turnstile-response') as string,
  };
  const validation = ForgotPasswordSchema.safeParse(data);

  if (!validation.success) {
    redirect(
      `/auth/forgot_password?error=${validation.error.issues[0].message}`
    );
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    captchaToken: data.captchaToken,
  });

  if (error) {
    redirect(`/auth/forgot_password?error=${getErrorMessage(error)}`);
  }

  revalidatePath('/auth/forgot_password', 'page');
  redirect(`/auth/forgot_password?success=true&email=${data.email}`);
}

export async function verifyRecoveryOtp(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    token: formData.get('otp') as string,
  };
  const validation = TokenVerificationShcema.safeParse(data);

  if (!validation.success) {
    redirect(
      `/auth/forgot_password?success=true&email=${data.email}&error=${validation.error.issues[0].message}`
    );
  }

  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email: data.email,
    token: data.token,
    type: 'recovery',
  });

  if (error) {
    redirect(
      `/auth/forgot_password?success=true&email=${data.email}&error=${getErrorMessage(error)}`
    );
  }

  if (session) {
    const { error: sessionError } = await supabase.auth.setSession(session);

    if (sessionError) {
      redirect(
        `/auth/forgot_password?success=true&email=${data.email}&error=${getErrorMessage(sessionError)}`
      );
    }

    redirect('/auth/update_password');
  }

  redirect(
    `/auth/forgot_password?success=true&email=${data.email}&error=An unknown error occurred. Please try again later.`
  );
}

export async function updatePassword(formData: FormData) {
  const data = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirm_password') as string,
  };
  const validation = PasswordResetSchema.safeParse(data);

  if (!validation.success) {
    redirect(
      `/auth/update_password?error=${validation.error.issues[0].message}`
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.updateUser({ password: data.password });

  if (!user) {
    redirect(
      `/auth/update_password?error=An unexpected error occurred. Please try again later.`
    );
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
