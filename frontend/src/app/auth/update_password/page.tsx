'use client';

import React, { ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Logo from '@/icons/Logo';
import Alert, { Type } from '@/components/Alert';
import { MemoizedLabel } from '@/components/Label';
import { PasswordRequirement } from '@/components/PasswordRequirement';
import { updatePassword } from '@/utils/supabase/actions/auth';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

import styles from '../auth.module.css';

const UpdatePassword = ({
  searchParams,
}: {
  searchParams: {
    error: string;
  };
}) => {
  const [passwordStatus, setPasswordStatus] = useState({
    value: '',
    lowercase: false,
    uppercase: false,
    number: false,
    symbols: false,
    minimumChars: false,
    noTrailingSpace: false,
  });
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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
    <div
      className={classNames(styles.base, 'flex flex-col items-center w-full')}
    >
      <div id="logo-container" className="mt-16 mb-8">
        <Link href="/" rel="noopener noreferrer">
          <Logo className={styles.logo} width={50} height={50} />
        </Link>
      </div>
      <div id="signup-form" className={styles.container}>
        <h1
          className={classNames(styles.header, 'text-xl p-1 pl-0 font-normal')}
        >
          Update your password
        </h1>

        {searchParams?.error && (
          <Alert message={searchParams.error} type={Type.ERROR} />
        )}

        <form className="mt-2">
          <MemoizedLabel
            className="mt-3"
            primaryText="Password"
            topRight="8-32 characters"
            required
          >
            <div className="relative">
              <input
                className="input shadow-md w-full pr-10"
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="●●●●●●●●"
                value={passwordStatus.value}
                onChange={handlePassword}
                min={8}
                max={32}
              />
              <div
                className="flex justify-center items-center absolute right-0 top-0 bottom-0 mr-4 cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {!showPass ? (
                  <IoEyeOutline className="size-5 text-gray-400 hover:text-gray-500" />
                ) : (
                  <IoEyeOffOutline className="size-5 text-gray-400 hover:text-gray-500" />
                )}
              </div>
            </div>
          </MemoizedLabel>

          {passwordStatus.value && (
            <div className="text-sm mt-2 text-gray-500 grid grid-cols-1 sm:grid-cols-2">
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

          <MemoizedLabel
            className="mt-3 mb-2"
            primaryText="Confirm Password"
            required
          >
            <div className="relative">
              <input
                className={classNames('input shadow-md w-full pr-10', {
                  'border-error':
                    confirmedPassword &&
                    confirmedPassword !== passwordStatus.value,
                })}
                type={showConfirmPass ? 'text' : 'password'}
                name="confirm_password"
                placeholder="●●●●●●●●"
                value={confirmedPassword}
                onChange={(e) => setConfirmedPassword(e.target.value)}
              />
              <div
                className="flex justify-center items-center absolute right-0 top-0 bottom-0 mr-4 cursor-pointer"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {!showConfirmPass ? (
                  <IoEyeOutline className="size-5 text-gray-400 hover:text-gray-500" />
                ) : (
                  <IoEyeOffOutline className="size-5 text-gray-400 hover:text-gray-500" />
                )}
              </div>
            </div>
          </MemoizedLabel>

          {confirmedPassword && confirmedPassword !== passwordStatus.value && (
            <div className="label-text-alt mb-2 text-red-700">
              Passwords don&apos;t match
            </div>
          )}

          <button
            className={classNames(
              'btn btn-primary w-full shadow-md mt-6 mb-3',
              {
                'btn-disabled':
                  !passwordStatus.value ||
                  !passwordStatus.lowercase ||
                  !passwordStatus.uppercase ||
                  !passwordStatus.minimumChars ||
                  !passwordStatus.noTrailingSpace ||
                  !passwordStatus.number ||
                  !passwordStatus.symbols ||
                  confirmedPassword !== passwordStatus.value,
              }
            )}
            formAction={updatePassword}
          >
            Update your password
          </button>

          <div className="flex justify-center text-sm">
            <a href="/" className="text-gray-700">
              Back to app
            </a>
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

export default UpdatePassword;
