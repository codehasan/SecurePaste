'use client';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useRecaptcha from '@/hooks/useRecaptcha';
import ReCAPTCHA from 'react-google-recaptcha';
import classNames from 'classnames';
import Link from 'next/link';
import axios from 'axios';
import Logo from '@/icons/Logo';
import { UserAgreement } from './UserAgreement';
import OAuthProvider from '../form/OAuthProvider';

import styles from './page.module.css';
import Alert, { Icon } from '@/components/Alert';

const SignUp = () => {
  const { capchaToken, recaptchaRef, handleRecaptcha } = useRecaptcha();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const onSubmit = async (data: {}) => {
    if (capchaToken && termsAccepted) {
      const result = await axios.post('https://your-login-endpoint', {
        ...data,
        capchaToken,
      });

      if (result.data.recaptchaValid === false) {
        alert('ReCAPTCHA validation failed. Please try again.');
        handleRecaptcha('');
        recaptchaRef.current?.reset();
        return;
      }

      recaptchaRef.current?.reset();

      if (result.data.success) {
        console.log('Login successful');
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    } else {
      alert('Please fill in all fields and complete the captcha.');
    }
    router.push('/');
  };

  const handleTerms = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.checked) {
      dialogRef.current?.showModal();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div
      className={classNames(styles.base, 'flex flex-col items-center w-full')}
    >
      <UserAgreement
        ref={dialogRef}
        onClose={() => setTermsAccepted(false)}
        onAgree={() => setTermsAccepted(true)}
      />
      <div id="logo-container" className="mt-16 mb-8">
        <Link href="/" rel="noopener noreferrer">
          <Logo className={styles.logo} width={50} height={50} />
        </Link>
      </div>
      <div id="signup-form" className={styles.container}>
        <h1 className="text-xl mt-16 mb-6 p-1 pl-0 font-medium">
          Sign up for an account
        </h1>
        <OAuthProvider />
        <div className="divider text-gray-500 text-sm mt-6 mb-6">OR</div>
        {error && (
          <Alert
            message={error}
            className="alert-error"
            iconClassName="text-error-content"
            icon={Icon.ERROR}
          />
        )}
        <form onSubmit={onSubmit} className="mt-2">
          <label className="label" htmlFor="name">
            <span className="label-text text-sm">
              <span className="mr-1">Full name</span>
              <span className="text-red-900">*</span>
            </span>
            <span className="label-text-alt">4 character minimum</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            className="input shadow-md w-full"
            value={formValues.name}
            onChange={handleChange}
            min={4}
            max={50}
            required
          />

          <label className="label mt-3" htmlFor="email">
            <span className="label-text text-sm">
              <span className="mr-1">Email address</span>
              <span className="text-red-900">*</span>
            </span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            className="input shadow-md w-full"
            value={formValues.email}
            onChange={handleChange}
            required
          />

          <label className="label mt-3" htmlFor="password">
            <span className="label-text text-sm">
              <span className="mr-1">Password</span>
              <span className="text-red-900">*</span>
            </span>
            <span className="label-text-alt">8-32 characters</span>
          </label>
          <input
            type="password"
            id="password"
            placeholder="●●●●●●●●"
            className="input shadow-md w-full"
            value={formValues.password}
            onChange={handleChange}
            min={8}
            max={32}
            required
          />

          <label
            className="label justify-start w-fit cursor-pointer my-3"
            htmlFor="terms"
          >
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={handleTerms}
              className="checkbox text-gray-700 mr-2"
              required
            />
            <span className="label-text">
              By creating an account, I agree to SecurePaste&apos;s{' '}
              <u className="ml-1">Terms of Service</u>.
            </span>
          </label>

          <div className="flex justify-center items-center mb-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY!}
              onChange={handleRecaptcha}
            />
          </div>

          <button
            className={classNames(
              {
                'btn-disabled':
                  !formValues.name ||
                  !formValues.email ||
                  !formValues.password ||
                  !termsAccepted ||
                  !capchaToken,
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
