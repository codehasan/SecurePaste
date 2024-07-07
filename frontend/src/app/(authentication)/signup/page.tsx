'use client';
import React, {
  FormEvent,
  startTransition,
  useCallback,
  useRef,
  useState,
} from 'react';
import useRecaptcha from '@/hooks/useRecaptcha';
import classNames from 'classnames';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import Logo from '@/icons/Logo';
import { MemoizedUserAgreement } from './UserAgreement';
import { MemoizedOAuth } from './OAuthProvider';
import { MemoizedCaptcha } from './Captcha';
import Alert, { Type } from '@/components/Alert';
import { MemoizedLabel } from '@/components/Label';

import styles from './page.module.css';

const validateForm = (formValues: {
  name: string;
  email: string;
  password: string;
  terms: boolean;
  captchaToken: string;
}) => {
  const result = {
    filled: true,
    error: '',
  };
  const checks = [
    {
      condition: !formValues.name.trim(),
      error: 'Please enter your full name.',
    },
    {
      condition: !formValues.email.trim(),
      error: 'Please enter your email address.',
    },
    {
      condition: !formValues.password.trim(),
      error: 'Please enter a password for your account.',
    },
    {
      condition: !formValues.terms,
      error: 'Please accept the terms of service.',
    },
    {
      condition: !formValues.captchaToken.trim(),
      error: 'Please complete the captcha.',
    },
  ];

  for (let check of checks) {
    if (check.condition) {
      result.filled = false;
      result.error = check.error;
      break;
    }
  }

  return result;
};

const SignUp = ({ searchParams }: { searchParams: { message: string } }) => {
  const { captchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();
  const [error, setError] = useState('');
  const userAgreementRef = useRef<HTMLDialogElement>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formValues = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      terms: formData.get('terms') === 'on',
      captchaToken,
    };
    let runtimeError = '';
    const { error } = validateForm(formValues);

    if (error) {
      return setError(error);
    }

    try {
      await axios.post(
        'api/auth/signup',
        {
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          captchaToken,
        },
        { timeout: 5_000 }
      );
      await axios.get('auth/revalidate', { timeout: 5000 });
    } catch (error) {
      console.error(error);

      const data = (error as AxiosError).response?.data as {
        error: string;
      };
      runtimeError = data
        ? data.error
        : 'An unexpected error occured. Please try again later.';
    } finally {
      recaptchaRef.current?.reset();

      startTransition(() => {
        if (runtimeError) {
          setError(runtimeError);
        }
        handleRecaptcha(null);
      });
    }
  };

  const showTerms = useCallback(() => {
    userAgreementRef.current?.showModal();
  }, []);

  return (
    <div
      className={classNames(styles.base, 'flex flex-col items-center w-full')}
    >
      <MemoizedUserAgreement ref={userAgreementRef} singleButton />
      <div id="logo-container" className="mt-16 mb-8">
        <Link href="/" rel="noopener noreferrer">
          <Logo className={styles.logo} width={50} height={50} />
        </Link>
      </div>
      <div id="signup-form" className={styles.container}>
        <h1 className="text-xl mt-16 mb-6 p-1 pl-0 font-medium">
          Sign up for an account
        </h1>
        <MemoizedOAuth />
        <div className="divider text-gray-500 text-sm mt-6 mb-6">OR</div>

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
              className="input shadow-md w-full"
              type="text"
              name="name"
              placeholder="John Doe"
              min={4}
              max={50}
              required
            />
          </MemoizedLabel>

          <MemoizedLabel className="mt-3" primaryText="Email address" required>
            <input
              className="input shadow-md w-full"
              type="email"
              name="email"
              placeholder="your@email.com"
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
              className="input shadow-md w-full"
              type="password"
              name="password"
              placeholder="●●●●●●●●"
              min={8}
              max={32}
              required
            />
          </MemoizedLabel>

          <div className="label justify-start my-3">
            <input
              className="checkbox text-gray-700 mr-2"
              type="checkbox"
              name="terms"
              required
            />
            <span className="label-text">
              By creating an account, I agree to SecurePaste&apos;s&nbsp;
              <button className="ml-1 underline" onClick={showTerms}>
                Terms of Service
              </button>
              .
            </span>
          </div>

          <div className="flex justify-center items-center mb-4">
            <MemoizedCaptcha
              ref={recaptchaRef}
              handleRecaptcha={handleRecaptcha}
            />
          </div>

          <button
            className={classNames(
              {
                'btn-disabled': !captchaToken,
              },
              'btn btn-primary w-full shadow-md mb-3'
            )}
          >
            Create account
          </button>

          <div className="flex justify-center text-sm">
            <span className="mr-1">Already have an account?</span>
            <Link href="/signin" className="text-sky-600">
              Sign in
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

export default SignUp;
