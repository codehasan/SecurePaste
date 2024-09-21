'use server';

import { isJpegFile, isPngFile, isWebPFile } from '@/lib/FileHelper';
import logger from '@/lib/logging/server';
import axios from 'axios';
import prisma from '../prisma/db';
import { getAuthErrorMessage } from '../supabase/errors';
import { createClient } from '../supabase/server';

export async function setProfilePicture(imageFile: File) {
  if (imageFile.size > 524_288) {
    throw new Error("Image size can't be greater than 512 KB");
  }

  const isPng = await isPngFile(imageFile);
  const isJpeg = await isJpegFile(imageFile);
  const isWebP = await isWebPFile(imageFile);

  if (isPng || isJpeg || isWebP) {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('type', 'file');

    let imageLink: string | undefined;

    try {
      const response = await axios.post(
        'https://api.imgur.com/3/image',
        formData,
        {
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response);
      console.log(JSON.stringify(response));

      imageLink = response.data.data.link;
    } catch (error: any) {
      logger.error(`Imgur upload error: ${error}`);

      throw new Error(
        'Unable to upload image to server. Please try again later!'
      );
    }

    if (imageLink) {
      const supabase = createClient();
      const userResponse = await supabase.auth.getUser();

      if (userResponse.error) {
        logger.error(userResponse.error);

        throw new Error(getAuthErrorMessage(userResponse.error));
      }

      if (!userResponse.data.user) {
        throw new Error('An unexpected error occurred.');
      }

      try {
        await prisma.user.update({
          where: {
            id: userResponse.data.user.id,
          },
          data: {
            avatar: imageLink,
          },
        });
      } catch (error) {
        logger.error(`Profile update error: ${error}`);

        throw new Error(
          'Unable to set image as profile. Please try again later!'
        );
      }
    }
  } else {
    throw new Error(
      'Invalid image mime type. Please select PNG, JPEG, or WebP images only.'
    );
  }
}
