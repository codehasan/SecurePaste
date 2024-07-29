import Alert, { Type } from '@/components/Alert';
import Logo from '@/icons/Logo';
import classNames from 'classnames';
import Link from 'next/link';

import { getCopyrightText } from '@/lib/copyright';
import {
  signOutGlobal,
  signOutLocal,
  signOutOthers,
} from '@/utils/supabase/actions/auth';
import styles from '../auth.module.css';

const SignOut = async ({
  searchParams,
}: {
  searchParams: {
    error: string;
  };
}) => {
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
          Sign out of your account
        </h1>

        {searchParams?.error && (
          <Alert message={searchParams.error} type={Type.ERROR} />
        )}

        <form className="mt-2 flex flex-col items-center">
          <button
            formAction={signOutLocal}
            className="btn btn-primary w-full shadow-md mt-4 mb-3"
          >
            Sign out of the current device
          </button>

          <button
            formAction={signOutGlobal}
            className="btn btn-primary w-full shadow-md mb-3"
          >
            Sign out of all devices
          </button>

          <button
            formAction={signOutOthers}
            className="btn btn-primary w-full shadow-md mb-3"
          >
            Sign out of all devices except this one
          </button>

          <Link href="/" className="text-sky-600 mt-6">
            Back to App
          </Link>
        </form>
      </div>
      <div className="text-gray-500 text-sm">
        <span>{getCopyrightText()}</span>
      </div>
    </div>
  );
};

export default SignOut;
