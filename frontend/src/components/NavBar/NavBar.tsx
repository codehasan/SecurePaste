import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoSearch } from 'react-icons/io5';
import { RiInbox2Line } from 'react-icons/ri';
import classNames from 'classnames';

import styles from './NavBar.module.css';

const NavBar = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="mx-auto px-2 sm:px-4 lg:px-8">
        <div className="navbar justify-between py-0">
          <div className="flex items-center h-16 px-2 lg:px-0">
            <Link
              className="flex items-center h-full"
              href="/"
              rel="noopener noreferrer"
            >
              <Image
                className="max-w-full w-auto h-8"
                alt="Logo"
                src="/icon.svg"
                width={40}
                height={40}
              />
              <Image
                className="max-w-full w-auto h-8 ml-2 hidden lg:block"
                alt="Logo"
                src="/logo-text.svg"
                width={40}
                height={40}
              />
            </Link>

            <div className="hidden lg:ml-6 lg:flex h-full space-x-4">
              <Link
                className="inline-flex items-center font-medium text-sm px-1 pt-1 border-b-2 border-indigo-500 text-gray-900"
                href="/"
              >
                Home
              </Link>
              <Link
                className="inline-flex items-center font-medium text-sm px-1 pt-1 text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700"
                href="/"
              >
                Pastes
              </Link>
              <Link
                className="inline-flex items-center font-medium text-sm px-1 pt-1 text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700"
                href="/"
              >
                Comments
              </Link>
            </div>
          </div>

          <div className="flex grow shrink basis-0 justify-center px-2 lg:justify-end lg:ml-6">
            <div className="w-full max-w-lg lg:max-w-80">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="flex items-center absolute left-0 top-0 bottom-0 pl-3 pointer-events-none">
                  <IoSearch className="size-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  type="search"
                  className="text-gray-900 rounded-md w-full pr-3 pl-10 py-1.5 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Search"
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div
              className={classNames('flex items-center', styles.dividerBefore)}
            >
              {user ? (
                <>
                  <Link href="/paste" className="ml-2">
                    <button className="btn btn-primary text-sm h-auto min-h-0 py-1.5 px-2 rounded-md font-semibold">
                      New Paste
                    </button>
                  </Link>

                  <Link
                    href="/notifications"
                    className="ml-3 text-gray-400 border border-gray-300 border-solid rounded-md relative p-1.5 hover:bg-gray-50"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">View notifications</span>
                    <RiInbox2Line className="size-5" />
                  </Link>

                  <div className="ml-3 relative">
                    <button className="rounded-full flex items-center relative cursor-pointer">
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Open user menu</span>
                      <Image
                        className="size-8 max-w-full rounded-full"
                        alt="Profile"
                        src="/img/avatar.svg"
                        width={40}
                        height={40}
                      />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/signin" className="ml-2">
                    <button className="font-medium text-sm py-1.5 px-2 rounded-md border border-gray-400 border-solid text-gray-500 hover:bg-gray-50">
                      Login
                    </button>
                  </Link>
                  <Link href="/signin" className="ml-3">
                    <button className="btn btn-primary text-sm h-auto min-h-0 py-1.5 px-2 rounded-md font-medium">
                      Create account
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
