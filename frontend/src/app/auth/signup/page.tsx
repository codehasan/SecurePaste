'use client';
import Alert, { Type } from '@/components/Alert';
import { MemoizedLabel } from '@/components/Label';
import Logo from '@/icons/Logo';
import { validateForm } from '@/lib/SignupFormValidation';
import { logError } from '@/lib/logging/client';
import axios, { AxiosError } from 'axios';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import { PasswordRequirement } from '../../../components/PasswordRequirement';
import { MemoizedOAuth } from './OAuthProvider';
import { MemoizedUserAgreement } from './UserAgreement';

import { getCopyrightText } from '@/lib/copyright';
import styles from '../auth.module.css';

const SignUp = ({
  searchParams,
}: {
  searchParams: {
    message: string;
    name: string;
    email: string;
  };
}) => {
  const [error, setError] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({
    value: '',
    lowercase: false,
    uppercase: false,
    number: false,
    symbols: false,
    minimumChars: false,
    noTrailingSpace: false,
  });
  const [loading, setLoading] = useState(false);
  const userAgreementRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formValues = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      terms: formData.get('terms') === 'on',
      captchaToken: formData.get('cf-turnstile-response') as string,
    };
    const { error } = validateForm(formValues, passwordStatus);

    if (error) {
      return setError(error);
    }

    try {
      await axios.post(
        '/api/auth/signup',
        {
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          captchaToken: formValues.captchaToken,
        },
        { timeout: 10_000 }
      );

      router.push(
        "/auth/signup?message=Please check your inbox and follow the instructions to verify your account. If you don't see it, be sure to check your spam or junk folder."
      );
      router.refresh();
    } catch (error) {
      logError(JSON.stringify(error));

      const data = (error as AxiosError).response?.data as {
        error: string;
      };

      setError(
        data?.error || 'An unexpected error occured. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const showTerms = useCallback(() => {
    userAgreementRef.current?.showModal();
  }, []);

  const handlePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const pass = event.target.value;

    const maxLength = Number(event.target.max || '32');
    if (maxLength && pass.length > maxLength) {
      return;
    }

    const passStats = {
      value: pass,
      lowercase: /[a-z]/.test(pass),
      uppercase: /[A-Z]/.test(pass),
      number: /\d/.test(pass),
      symbols: /[^A-Za-z0-9\s]/.test(pass),
      minimumChars: pass.length >= 8,
      noTrailingSpace: pass.length > 0 && pass.trim() === pass,
    };

    setPasswordStatus(passStats);
  };

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div className={classNames(styles.base, 'flex flex-col items-center')}>
        <MemoizedUserAgreement ref={userAgreementRef} singleButton />

        {/* Logo */}
        <div id="logo-container" className="mb-8 mt-16">
          <Link href="/" rel="noopener noreferrer">
            <Logo className={styles.logo} width={50} height={50} />
          </Link>
        </div>

        <div id="signup-form" className={styles.container}>
          {/* Form Header */}
          <h1
            className={classNames(
              styles.header,
              'p-1 pl-0 text-xl font-normal'
            )}
          >
            Sign up for an account
          </h1>

          {/* OAuth Providers */}
          <MemoizedOAuth />
          <div className="divider mb-6 mt-6 text-sm text-gray-500">OR</div>

          {searchParams?.message && (
            <Alert message={searchParams.message} type={Type.SUCCESS} />
          )}
          {error && <Alert message={error} type={Type.ERROR} />}

          <form onSubmit={onSubmit} className="mt-2">
            <MemoizedLabel
              primaryText="Full name"
              topRight="4 character minimum"
              required
            >
              <input
                className="input w-full shadow-md"
                type="text"
                name="name"
                inputMode="text"
                placeholder="John Doe"
                defaultValue={searchParams.name ?? ''}
                minLength={4}
                maxLength={50}
                required
              />
            </MemoizedLabel>

            <MemoizedLabel
              className="mt-3"
              primaryText="Email address"
              required
            >
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
              className="mt-3"
              primaryText="Password"
              topRight="8-32 characters"
              required
            >
              <input
                className="input w-full shadow-md"
                type="password"
                name="password"
                placeholder="●●●●●●●●"
                value={passwordStatus.value}
                onChange={handlePassword}
                minLength={8}
                maxLength={32}
                required
              />
            </MemoizedLabel>

            {passwordStatus.value && (
              <div className="mt-2 grid grid-cols-1 text-sm text-gray-500 sm:grid-cols-2">
                <PasswordRequirement
                  condition={passwordStatus.lowercase}
                  text="One lowercase character"
                />
                <PasswordRequirement
                  condition={passwordStatus.uppercase}
                  text="One uppercase character"
                />
                <PasswordRequirement
                  condition={passwordStatus.number}
                  text="One number"
                />
                <PasswordRequirement
                  condition={passwordStatus.symbols}
                  text="One special character"
                />
                <PasswordRequirement
                  condition={passwordStatus.noTrailingSpace}
                  text="No trailing space"
                />
                <PasswordRequirement
                  condition={passwordStatus.minimumChars}
                  text="8 characters minimum"
                />
              </div>
            )}

            {/* Accept Terms */}
            <div className="label my-3 justify-start">
              <input
                className="checkbox mr-2 text-gray-700"
                type="checkbox"
                name="terms"
                required
              />
              <span className="label-text">
                By creating an account, I agree to SecurePaste&apos;s&nbsp;
                <div
                  className="ml-1 inline cursor-pointer underline"
                  onClick={showTerms}
                >
                  Terms of Service
                </div>
                .
              </span>
            </div>

            {/* Turnstile captcha */}
            <div className="label mb-4 justify-start">
              <div
                className="cf-turnstile bg-transparent"
                data-theme="light"
                data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY}
              />
            </div>

            <button
              type="submit"
              className={classNames(
                { 'btn-disabled': loading },
                'btn btn-primary mb-3 w-full shadow-md'
              )}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <span>Create an account</span>
              )}
            </button>

            <div className="flex justify-center text-sm">
              <span className="mr-1">Already have an account?</span>
              <a href="/auth/signin" className="text-sky-600">
                Sign in
              </a>
            </div>
          </form>
        </div>
        <div className="text-sm text-gray-500">
          <span>{getCopyrightText()}</span>
        </div>
      </div>
    </>
  );
};

export default SignUp;
