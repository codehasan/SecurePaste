import Logo from '@/icons/Logo';
import classNames from 'classnames';
import Link from 'next/link';

import { getCopyrightText } from '@/lib/copyright';
import styles from '../auth/auth.module.css';

interface ErrorProps {
  searchParams: {
    message: string;
    nextText: string;
    next: string;
    retry: boolean;
  };
}

const Error = ({ searchParams }: ErrorProps) => {
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
          {searchParams?.message || 'Oops, something went wrong.'}
        </h1>

        <a href={searchParams?.next || '/'} className="text-sky-600 mt-6">
          {searchParams?.retry ? 'Try again' : 'Back to App'}
        </a>
      </div>
      <div className="text-gray-500 text-sm">
        <span>{getCopyrightText()}</span>
      </div>
    </div>
  );
};

export default Error;
