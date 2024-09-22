'use server';

import logger from '@/lib/logging/server';
import { constructUrl } from '@/lib/RedirectHelper';
import {
  ForgotPasswordSchema,
  PasswordResetSchema,
  ResendVerificationSchema,
  SignInSchema,
  SignUpSchema,
  TokenVerificationSchema,
} from '@/lib/schema/ZodSchema';
import { getAuthErrorMessage } from '@/utils/supabase/errors';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signInGitHub() {
  const supabase = createClient();
  const {
    data: { url },
    error,
  } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      scopes: 'read:user user:email',
      redirectTo: process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/auth/OAuth2`
        : 'http://localhost:3000/auth/OAuth2',
    },
  });

  if (error) {
    redirect(
      constructUrl('/error', {
        error: getAuthErrorMessage(error),
      })
    );
  } else if (url) {
    redirect(url);
  }
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  captchaToken: string
) {
  try {
    const validation = SignUpSchema.safeParse({
      name,
      email,
      password,
      captchaToken,
    });

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }

    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      logger.error(`Auth error: ${error}`);
      throw new Error(getAuthErrorMessage(error));
    }

    if (!user) {
      logger.error('No user returned from Supabase after signup.');
      throw new Error('An internal error occurred. Please try again later.');
    }

    return user.id;
  } catch (error) {
    logger.error(`Unexpected signup error: ${error}`);
    throw new Error('An unexpected error occured. Please try again later.');
  }
}

export async function resendSignUpConfirmation(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    options: {
      captchaToken: formData.get('cf-turnstile-response') as string,
    },
  };
  const validation = ResendVerificationSchema.safeParse(data);
  const pathname = '/auth/verify_account';

  if (!validation.success) {
    redirect(
      constructUrl(pathname, {
        error: validation.error.issues[0].message,
      })
    );
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resend({
    ...data,
    type: 'signup',
  });

  if (error) {
    logger.error(error);
    redirect(
      constructUrl(pathname, {
        error: getAuthErrorMessage(error),
      })
    );
  }

  revalidatePath(pathname, 'page');
  redirect(
    constructUrl(pathname, {
      message: 'Check your inbox for confirmation email.',
    })
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
  const pathname = '/auth/signin';

  if (!validation.success) {
    redirect(
      constructUrl(pathname, {
        error: validation.error.issues[0].message,
      })
    );
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    logger.error(JSON.stringify(error));
    redirect(
      constructUrl(pathname, {
        error: getAuthErrorMessage(error),
      })
    );
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
    redirect(
      constructUrl('/auth/signout', {
        error: getAuthErrorMessage(error),
      })
    );
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
  const pathname = '/auth/forgot_password';

  if (!validation.success) {
    redirect(
      constructUrl(pathname, {
        error: validation.error.issues[0].message,
      })
    );
  }

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    captchaToken: data.captchaToken,
  });

  if (error) {
    redirect(
      constructUrl(pathname, {
        error: getAuthErrorMessage(error),
      })
    );
  }

  revalidatePath(pathname, 'page');
  redirect(
    constructUrl(pathname, {
      success: 'true',
      email: data.email,
    })
  );
}

export async function verifyRecoveryOtp(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    token: formData.get('otp') as string,
  };
  const validation = TokenVerificationSchema.safeParse(data);
  const pathname = '/auth/forgot_password';

  if (!validation.success) {
    redirect(
      constructUrl(pathname, {
        success: 'true',
        email: data.email,
        error: validation.error.issues[0].message,
      })
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
      constructUrl(pathname, {
        success: 'true',
        email: data.email,
        error: getAuthErrorMessage(error),
      })
    );
  }

  if (session) {
    const { error: sessionError } = await supabase.auth.setSession(session);

    if (sessionError) {
      redirect(
        constructUrl(pathname, {
          success: 'true',
          email: data.email,
          error: getAuthErrorMessage(sessionError),
        })
      );
    }

    revalidatePath('/', 'layout');
    redirect('/auth/update_password');
  }

  redirect(
    constructUrl(pathname, {
      success: 'true',
      email: data.email,
      error: 'An unknown error occurred. Please try again later.',
    })
  );
}

export async function updatePassword(formData: FormData) {
  const data = {
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirm_password') as string,
  };
  const validation = PasswordResetSchema.safeParse(data);
  const pathname = '/auth/update_password';

  if (!validation.success) {
    redirect(
      constructUrl(pathname, {
        error: validation.error.issues[0].message,
      })
    );
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.updateUser({ password: data.password });

  if (!user) {
    redirect(
      constructUrl(pathname, {
        error: 'An unexpected error occurred. Please try again later.',
      })
    );
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
