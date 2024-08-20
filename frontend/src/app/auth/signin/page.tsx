import Alert, { Type } from '@/components/Alert';
import { MemoizedLabel } from '@/components/Label';
import Logo from '@/icons/Logo';
import { signIn } from '@/utils/supabase/actions/auth';
import classNames from 'classnames';
import Link from 'next/link';
import { MemoizedOAuth } from '../signup/OAuthProvider';

import { getCopyrightText } from '@/lib/copyright';
import Script from 'next/script';
import styles from '../auth.module.css';

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
      className={classNames(styles.base, 'flex w-full flex-col items-center')}
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div id="logo-container" className="mb-8 mt-16">
        <Link href="/" rel="noopener noreferrer">
          <Logo className={styles.logo} width={50} height={50} />
        </Link>
      </div>
      <div id="signup-form" className={styles.container}>
        <h1
          className={classNames(styles.header, 'p-1 pl-0 text-xl font-normal')}
        >
          Sign in to your account
        </h1>
        <MemoizedOAuth />
        <div className="divider mb-6 mt-6 text-sm text-gray-500">OR</div>

        {searchParams?.error && (
          <Alert message={searchParams.error} type={Type.ERROR} />
        )}

        <form className="mt-2">
          <MemoizedLabel className="mt-3" primaryText="Email address" required>
            <input
              className="input w-full shadow-md"
              type="email"
              name="email"
              inputMode="email"
              placeholder="your@email.com"
              defaultValue={searchParams.email ?? ''}
              required
            />
          </MemoizedLabel>

          <MemoizedLabel
            className="mb-1 mt-3"
            primaryText="Password"
            topRight="8-32 characters"
            required
          >
            <input
              className="input w-full shadow-md"
              type="password"
              name="password"
              placeholder="●●●●●●●●"
              minLength={8}
              maxLength={32}
              required
            />
          </MemoizedLabel>
          <a
            href="/auth/forgot_password"
            className="label-text-alt text-xs text-sky-600"
          >
            Forgot your password?
          </a>

          {/* Turnstile captcha */}
          <div className="label mb-4 mt-4 justify-start">
            <div
              className="cf-turnstile bg-transparent"
              data-theme="light"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
            />
          </div>

          <button
            className="btn btn-primary mb-3 w-full shadow-md"
            formAction={signIn}
          >
            Sign in to your account
          </button>

          <div className="flex justify-center text-sm">
            <span className="mr-1">Don&apos;t have an account?</span>
            <a href="/auth/signup" className="text-sky-600">
              Sign up
            </a>
          </div>
        </form>
      </div>
      <div className="text-sm text-gray-500">
        <span>{getCopyrightText()}</span>
      </div>
    </div>
  );
};

export default SignIn;
