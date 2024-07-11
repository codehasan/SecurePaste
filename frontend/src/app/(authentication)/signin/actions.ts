'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import getErrorMessage from '@/utils/supabase/errors';

export async function login(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error: validationError } = validateForm(data);

  if (validationError) {
    redirect(`/signin?error=${validationError}`);
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(`/signin?error=${getErrorMessage(error)}`);
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

const validateForm = (formValues: { email: string; password: string }) => {
  const result = {
    filled: true,
    error: '',
  };
  const checks = [
    {
      condition: !formValues.email.trim(),
      error: 'Please enter your email address.',
    },
    {
      condition: !formValues.password.trim(),
      error: 'Please enter a password for your account.',
    },
  ];

  for (let check of checks) {
    if (check.condition) {
      result.filled = false;
      result.error = check.error;
      break;
    }
  }

  return result;
};
