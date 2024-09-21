'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  parentClassName?: string;
  src: string | null;
  alt?: string;
  onClick?: () => void;
}

const Avatar = ({
  onClick,
  parentClassName,
  src,
  alt,
  ...props
}: AvatarProps & Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'>) => {
  const [error, setError] = useState(false);

  return (
    <div className="avatar">
      <div
        tabIndex={0}
        role="button"
        className={twMerge(
          'flex size-8 cursor-pointer items-center justify-center rounded-full',
          parentClassName
        )}
        onClick={onClick}
      >
        {error ? (
          <Image
            className="rounded-full border border-solid border-black border-opacity-5 object-cover object-center"
            src="/img/avatar.svg"
            alt={alt || 'Avatar'}
            width={40}
            height={40}
            {...props}
          />
        ) : (
          <Image
            className="rounded-full border border-solid border-black border-opacity-5 object-cover object-center"
            src={src || '/img/avatar.svg'}
            alt={alt || 'Avatar'}
            onError={() => setError(true)}
            width={40}
            height={40}
            {...props}
          />
        )}
      </div>
    </div>
  );
};

export default Avatar;
