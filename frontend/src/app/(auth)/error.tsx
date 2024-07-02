'use client';
import React from 'react';

import styles from './signup/page.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import Logo from '@/icons/Logo';

interface UnexpectedErrorProps {
  error: Error;
  statusCode: number;
  reset: () => void;
}

const UnexpectedError: React.FC<UnexpectedErrorProps> = ({
  error,
  reset,
  statusCode,
}) => {
  console.log(error);

  return (
    <div
      className={classNames(styles.base, 'flex flex-col items-center w-full')}
    >
      <div id="logo-container" className="mt-16 mb-8">
        <Link href="/" rel="noopener noreferrer">
          <Logo className={styles.logo} width={50} height={50} />
        </Link>
      </div>
      <div
        className={classNames(styles.container, 'flex flex-col items-center')}
      >
        <h1 className="text-xl mt-10 mb-6 p-1 pl-0 text-gray-500">
          Oops, something went wrong.
        </h1>

        {statusCode ? (
          <button onClick={reset} className="text-sky-600 mt-6">
            Retry
          </button>
        ) : (
          <Link href={'/'} className="text-sky-600 mt-6">
            Back to App
          </Link>
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

export default UnexpectedError;
