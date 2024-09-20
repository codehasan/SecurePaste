import { signInGitHub } from '@/utils/supabase/actions/auth';
import Link from 'next/link';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const OAuthProvider = () => {
  return (
    <form>
      <button
        formAction={signInGitHub}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow-md"
      >
        <FaGithub className="h-5 w-5 shrink-0" />
        <span>Continue with GitHub</span>
      </button>
    </form>
  );
};

export const MemoizedOAuth = React.memo(OAuthProvider);
