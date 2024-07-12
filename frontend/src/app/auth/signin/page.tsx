import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Logo from '@/icons/Logo';
import { MemoizedOAuth } from '../signup/OAuthProvider';
import Alert, { Type } from '@/components/Alert';
import { MemoizedLabel } from '@/components/Label';
import { login } from './actions';

import styles from '../signup/page.module.css';

const SignIn = async ({
  searchParams,
}: {
  searchParams: {
    email: string;
    error: string;
  };
}) => {
  return (
    <div
      className={classNames(styles.base, 'flex flex-col items-center w-full')}
    >
      <div id="logo-container" className="mt-16 mb-8">
        <Link href="/" rel="noopener noreferrer">
          <Logo className={styles.logo} width={50} height={50} />
        </Link>
      </div>
      <div id="signup-form" className={styles.container}>
        <h1 className="text-xl mt-16 mb-6 p-1 pl-0 font-medium">
          Sign in to your account
        </h1>
        <MemoizedOAuth />
        <div className="divider text-gray-500 text-sm mt-6 mb-6">OR</div>

        {searchParams?.error && (
          <Alert message={searchParams.error} type={Type.ERROR} />
        )}

        <form action={login} className="mt-2">
          <MemoizedLabel className="mt-3" primaryText="Email address" required>
            <input
              className="input shadow-md w-full"
              type="email"
              name="email"
              placeholder="your@email.com"
              defaultValue={searchParams.email ?? ''}
              required
            />
          </MemoizedLabel>

          <MemoizedLabel
            className="mt-3 mb-1"
            primaryText="Password"
            topRight="8-32 characters"
            required
          >
            <input
              className="input shadow-md w-full"
              type="password"
              name="password"
              placeholder="●●●●●●●●"
              min={8}
              max={32}
              required
            />
          </MemoizedLabel>
          <Link
            href="/forgot_password"
            className="label-text-alt text-xs text-sky-600"
          >
            Forgot your password?
          </Link>

          <button className="btn btn-primary w-full shadow-md mt-8 mb-3">
            Sign in to your account
          </button>

          <div className="flex justify-center text-sm">
            <span className="mr-1">Don&apos;t have an account?</span>
            <Link href="/auth/signup" className="text-sky-600">
              Sign up
            </Link>
          </div>
        </form>
      </div>
      <div className="text-gray-500 text-sm">
        <span>©&nbsp;</span>
        <span>{new Date().getFullYear()}</span>
        <span>&nbsp;SecurePaste, All rights reserved.</span>
      </div>
    </div>
  );
};

export default SignIn;
