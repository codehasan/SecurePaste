import Image, { ImageProps } from 'next/image';
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
        <Image
          className="rounded-full border border-solid border-black border-opacity-5"
          src={src || '/img/avatar.svg'}
          alt={alt || 'Avatar'}
          width={40}
          height={40}
          {...props}
        />
      </div>
    </div>
  );
};

export default Avatar;
