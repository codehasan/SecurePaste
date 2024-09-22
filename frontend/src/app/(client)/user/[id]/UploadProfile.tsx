'use client';

import { isJpeg, isPng, isWebP } from '@/lib/FileHelper';
import { constructUrl } from '@/lib/RedirectHelper';
import { setProfilePicture } from '@/utils/imgur/actions';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import { FaImage } from 'react-icons/fa';

interface UploadProfileProps {
  text: string;
  className?: string;
}

export default function UploadProfile({ text, className }: UploadProfileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];

      try {
        const formData = new FormData();
        formData.append('file', file);

        await setProfilePicture(formData);
      } catch (error) {
        router.push(
          constructUrl('/error', {
            message:
              error instanceof Error
                ? error.message
                : 'An unexpected error occurred!',
          })
        );
      }
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        className={classNames(
          className,
          'btn btn-custom border-gray-300 bg-gray-200 text-gray-900 hover:!bg-gray-300'
        )}
        onClick={openFilePicker}
      >
        <FaImage />
        <span>{text}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
}
