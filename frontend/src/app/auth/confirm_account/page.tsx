import Alert, { Type } from '@/components/Alert';
import { MemoizedLabel } from '@/components/Label';
import Logo from '@/icons/Logo';
import { resendSignUpConfirmation } from '@/utils/supabase/actions/auth';
import classNames from 'classnames';
import Link from 'next/link';
import Script from 'next/script';

import { getCopyrightText } from '@/lib/copyright';
import styles from '../auth.module.css';

const VerifyAccount = async ({
  searchParams,
}: {
  searchParams: {
    email: string;
    error: string;
    message: string;
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
      <div className={styles.container}>
        <h1
          className={classNames(styles.header, 'p-1 pl-0 text-xl font-normal')}
        >
          Confirm your account
        </h1>

        {searchParams?.message && (
          <Alert message={searchParams.message} type={Type.SUCCESS} />
        )}

        {searchParams?.error && (
          <Alert message={searchParams.error} type={Type.ERROR} />
        )}

        <form action={resendSignUpConfirmation} className="mt-2">
          <div>
            Enter your email address below, and we&apos;ll send you a
            confirmation link to confirm your account.
          </div>

          <MemoizedLabel className="mt-3" primaryText="Email address" required>
            <input
              className="input w-full shadow-md"
              type="email"
              name="email"
              placeholder="your@email.com"
              defaultValue={searchParams.email ?? ''}
              required
            />
          </MemoizedLabel>

          {/* Turnstile captcha */}
          <div className="label mb-4 mt-4 justify-start">
            <div
              className="cf-turnstile bg-transparent"
              data-theme="light"
              data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
            />
          </div>

          <button className="btn btn-primary mb-3 w-full shadow-md">
            Send confirmation link
          </button>

          <div className="flex justify-center text-sm">
            <a href="/" className="text-gray-700">
              Back to app
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

export default VerifyAccount;
