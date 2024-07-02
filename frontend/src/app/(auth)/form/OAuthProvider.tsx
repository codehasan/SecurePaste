import Link from 'next/link';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const OAuthProvider = () => {
  return (
    <>
      <Link
        href={''}
        className="flex justify-center items-center h-11 w-full shadow-md p-2 bg-white border border-gray-300 rounded-md gap-2 mb-5"
      >
        <FcGoogle className="h-5 w-5 shrink-0" />
        <span>Continue with Google</span>
      </Link>
      <Link
        href={''}
        className="flex justify-center items-center h-11 w-full shadow-md p-2 bg-white border border-gray-300 rounded-md gap-2"
      >
        <FaGithub className="h-5 w-5 shrink-0" />
        <span>Continue with GitHub</span>
      </Link>
    </>
  );
};

export const MemoizedOAuth = React.memo(OAuthProvider);
