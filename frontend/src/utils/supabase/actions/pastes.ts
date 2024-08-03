'use server';
import { getLines, getTags } from '@/lib/ArrayHelper';
import logger from '@/lib/logging/server';
import { NewPasteSchema } from '@/lib/schema/ZodSchema';
import prisma from '@/utils/prisma/db';
import { redirect } from 'next/navigation';
import { v4 } from 'uuid';
import { getAuthErrorMessage } from '../errors';
import { createClient } from '../server';

export async function newComment(formData: FormData) {
  // 1. Validate the form data sent from the app
  const data = {
    title: formData.get('title') as string,
    syntax: formData.get('syntax') as string,
    body: formData.get('body') as string,
    visibility: formData.get('visibility') as string,
    tags: getTags((formData.get('tags') as string) || ''),
  };

  const validation = NewPasteSchema.safeParse(data);

  if (!validation.success) {
    logger.warn(JSON.stringify(validation.error));
    redirect(`/error?message=${validation.error.issues[0].message}`);
  }

  // 2. Verify if user is logged in
  const supabase = createClient();
  const userResponse = await supabase.auth.getUser();

  if (userResponse.error) {
    logger.error(JSON.stringify(userResponse.error));
    redirect(`/error?message=${getAuthErrorMessage(userResponse.error)}`);
  }

  if (!userResponse.data.user) {
    redirect(
      `/error?message=An unexpected error occurred. Please try again later.`
    );
  }

  // Upload file to supabase storage bucket
  const filePath = `${userResponse.data.user.id}/${v4()}.txt`;
  const sorageResponse = await supabase.storage
    .from('pastes')
    .upload(filePath, data.body, {
      contentType: 'text/plain',
    });

  if (sorageResponse.error) {
    logger.error(`path: ${filePath}, ${JSON.stringify(sorageResponse.error)}`);
    redirect(
      `/error?message=Unable to upload your paste data. Please try again later.`
    );
  }
  const bodyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${sorageResponse.data.fullPath}`;

  // Upload file content in postgresql
  try {
    await prisma.paste.create({
      data: {
        title: data.title,
        bodyOverview: getLines(data.body, 5),
        bodyUrl,
        syntax: data.syntax,
        tags: data.tags,
        user: {
          connect: {
            id: userResponse.data.user.id,
          },
        },
      },
    });
  } catch (e) {
    logger.error(JSON.stringify(e));
    redirect(
      `/error?message=Unable to create your paste. Please try again later.`
    );
  }

  redirect(`/user/${userResponse.data.user.id}/pastes`);
}
