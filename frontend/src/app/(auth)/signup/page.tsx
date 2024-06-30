'use client';
import React, { FormEvent, useState } from 'react';

import classNames from 'classnames';
import Link from 'next/link';
import Logo from '@/icons/Logo';

import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const router = useRouter();

  const handleForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
    } catch (error) {}

    router.push('/');
  };

  const onVerifyCaptcha = (token: string, ekey: string) => {
    setCaptchaToken(token);
  };

  return (
    <div
      className={classNames(styles.base, 'flex flex-col items-center w-full')}
    >
      <div id="logo-container" className="mt-16 mb-8">
        <Link href="/" rel="noopener noreferrer">
          <Logo className={styles.logo} width={50} height={50} />
        </Link>
      </div>
      <div id="signup-form" className={classNames(styles.container)}>
        <h1 className="text-xl mt-16 mb-4 p-1 pl-0 font-medium">
          Sign up for an account
        </h1>
        <form onSubmit={handleForm}>
          <label className="label" htmlFor="username">
            <span className="label-text text-sm">
              <span className="mr-1">Username</span>
              <span className="text-red-900">*</span>
            </span>
            <span className="label-text-alt">4 character minimum</span>
          </label>
          <input
            type="text"
            id="username"
            placeholder="codehasan"
            className="input shadow-md w-full mb-3"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength={4}
            maxLength={15}
            required
          />

          <label className="label" htmlFor="email">
            <span className="label-text text-sm">
              <span className="mr-1">Email address</span>
              <span className="text-red-900">*</span>
            </span>
          </label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            className="input shadow-md w-full mb-3"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label className="label" htmlFor="password">
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
            className="input shadow-md w-full mb-3"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            maxLength={32}
            required
          />

          <label
            className="label justify-start w-fit cursor-pointer mb-3"
            htmlFor="terms"
          >
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="checkbox text-gray-700 mr-2"
            />
            <span className="label-text">
              By creating an account, I agree to use SecurePaste in legal means.
            </span>
          </label>

          <div className="flex justify-center items-center mb-4">
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
              onVerify={onVerifyCaptcha}
              loadAsync
            />
          </div>

          <button className="btn btn-primary w-full shadow-md mb-3">
            Create an account
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
