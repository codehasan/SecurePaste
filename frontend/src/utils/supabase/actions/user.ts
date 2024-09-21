'use server';

import { constructUrl } from '@/lib/RedirectHelper';
import logger from '@/lib/logging/server';
import { UpdateUserSchema } from '@/lib/schema/ZodSchema';
import prisma from '@/utils/prisma/db';
import { redirect } from 'next/navigation';
import { getAuthErrorMessage } from '../errors';
import { createClient } from '../server';

export async function updateUserInfo(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
    };
    const validation = UpdateUserSchema.safeParse(data);

    if (!validation.success) {
      redirect(
        constructUrl('/error', {
          error: validation.error.issues[0].message,
        })
      );
    }

    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error) {
      logger.error(`Auth error: ${error}`);
      redirect(
        constructUrl('/error', {
          error: getAuthErrorMessage(error),
        })
      );
    }

    if (!user) {
      logger.error('No user returned from Supabase after signup.');
      redirect(
        constructUrl('/error', {
          error: 'An internal error occurred. Please try again later.',
        })
      );
    }

    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: data.name.trim(),
          bio: data.bio.trim(),
        },
      });
    } catch (e) {
      logger.error(`Prisma user create error: ${e}`);
      redirect(
        constructUrl('/error', {
          error: 'An internal error occurred. Please try again later.',
        })
      );
    }
  } catch (error) {
    logger.error(`Unexpected signup error: ${error}`);
    redirect(
      constructUrl('/error', {
        error: 'An unexpected error occured. Please try again later.',
      })
    );
  }
}
