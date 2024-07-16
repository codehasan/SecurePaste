import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Logo from '@/icons/Logo';
import Alert, { Type } from '@/components/Alert';
import { MemoizedLabel } from '@/components/Label';
import { sendPasswordReset, verifyRecoveryOtp } from '@/utils/supabase/actions';
import Script from 'next/script';

import styles from '../auth.module.css';

const ForgotPassword = async ({
  searchParams,
}: {
  searchParams: {
    email: string;
    error: string;
    message: string;
    success: string;
  };
}) => {
  return (
    <div
      className={classNames(styles.base, 'flex flex-col items-center w-full')}
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div id="logo-container" className="mt-16 mb-8">
        <Link href="/" rel="noopener noreferrer">
          <Logo className={styles.logo} width={50} height={50} />
        </Link>
      </div>
      <div id="signup-form" className={styles.container}>
        <h1
          className={classNames(styles.header, 'text-xl p-1 pl-0 font-medium')}
        >
          Reset your password
        </h1>

        {searchParams?.message && (
          <Alert message={searchParams.message} type={Type.SUCCESS} />
        )}

        {searchParams?.error && (
          <Alert message={searchParams.error} type={Type.ERROR} />
        )}

        {searchParams?.success && searchParams?.success === 'true' ? (
          <form action={verifyRecoveryOtp} className="mt-2">
            <div>Enter the otp sent to your email address.</div>

            <MemoizedLabel
              className="mt-3"
              primaryText="Email address"
              required
            >
              <input
                className="input shadow-md w-full"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={searchParams.email ?? ''}
                required
              />
            </MemoizedLabel>

            <MemoizedLabel className="mt-3" primaryText="OTP" required>
              <input
                className="input shadow-md w-full"
                type="text"
                name="otp"
                placeholder="●●●●●●"
                autoFocus
                required
              />
            </MemoizedLabel>

            <button className="btn btn-primary w-full shadow-md mt-8 mb-3">
              Reset your password
            </button>

            <div className="flex justify-center text-sm">
              <a href="/auth/signin" className="text-gray-700">
                Go back to sign in
              </a>
            </div>
          </form>
        ) : (
          // Send password reset form
          <form action={sendPasswordReset} className="mt-2">
            <div>
              Enter your email address below, and we&apos;ll send you an otp to
              reset your password.
            </div>

            <MemoizedLabel
              className="mt-3"
              primaryText="Email address"
              required
            >
              <input
                className="input shadow-md w-full"
                type="email"
                name="email"
                placeholder="your@email.com"
                defaultValue={searchParams.email ?? ''}
                required
              />
            </MemoizedLabel>

            {/* Turnstile captcha */}
            <div className="label justify-start mt-4 mb-4">
              <div
                className="cf-turnstile bg-transparent"
                data-theme="light"
                data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
              />
            </div>

            <button className="btn btn-primary w-full shadow-md mb-3">
              Send reset link
            </button>

            <div className="flex justify-center text-sm">
              <a href="/auth/signin" className="text-gray-700">
                Go back to sign in
              </a>
            </div>
          </form>
        )}
      </div>
      <div className="text-gray-500 text-sm">
        <span>©&nbsp;</span>
        <span>{new Date().getFullYear()}</span>
        <span>&nbsp;SecurePaste, All rights reserved.</span>
      </div>
    </div>
  );
};

export default ForgotPassword;
