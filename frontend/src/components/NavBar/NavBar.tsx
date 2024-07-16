import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoSearch } from 'react-icons/io5';
import { RiInbox2Line } from 'react-icons/ri';
import { FiMenu, FiPlus } from 'react-icons/fi';
import classNames from 'classnames';
import { IoMdClose } from 'react-icons/io';
import { headers } from 'next/headers';
import Logo from '@/icons/Logo';
import TextLogo from '@/icons/TextLogo';

import styles from './NavBar.module.css';

const NavBar = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pageNavigations = [
    { name: 'Home', path: '/', active: false, requiresUser: false },
    {
      name: 'Pastes',
      path: `/user/${user?.id}/pastes`,
      active: false,
      requiresUser: true,
    },
    {
      name: 'Comments',
      path: `/user/${user?.id}/comments`,
      active: false,
      requiresUser: true,
    },
  ];

  const profileNavigations = [
    { name: 'Your profile', path: `/user/${user?.id}` },
    { name: 'Change password', path: `/auth/update_password` },
    { name: 'Sign out', path: '/auth/signout' },
  ];

  // Setup active page in navigation menu
  const nextHeaders = headers();
  const pathname = nextHeaders.get('x-pathname');
  if (pathname) {
    if (pathname === '/') {
      pageNavigations[0].active = true;
    } else {
      for (let i = 1; i < pageNavigations.length; i++) {
        if (pathname.startsWith(pageNavigations[i].path)) {
          pageNavigations[i].active = true;
          break;
        }
      }
    }
  }

  return (
    <nav className="bg-white shadow-md w-full relative">
      <div className="mx-auto px-2 sm:px-4 lg:px-8">
        <div className="navbar justify-between p-0">
          <div className="flex items-center h-16 px-2 lg:px-0">
            <Link
              className="flex items-center h-full"
              href="/"
              rel="noopener noreferrer"
            >
              <Logo className="max-w-full w-auto h-8 text-teal-700" />
              <TextLogo className="max-w-full w-auto h-7 text-teal-700 ml-2 hidden md:block" />
            </Link>

            <div className="hidden lg:ml-6 lg:flex h-full space-x-4">
              {pageNavigations.map((navigation, index) => {
                if (!user && navigation.requiresUser) return <></>;

                return (
                  <Link
                    key={index}
                    className={
                      navigation.active
                        ? 'inline-flex items-center font-medium text-sm px-1 pt-1 border-b-2 border-indigo-500 text-gray-900'
                        : 'inline-flex items-center font-medium text-sm px-1 pt-1 text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700'
                    }
                    href={navigation.path}
                  >
                    {navigation.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex grow shrink basis-0 justify-center px-2 lg:justify-end lg:ml-6">
            <div className="relative w-full max-w-lg lg:max-w-80">
              <div className="flex items-center absolute left-0 top-0 bottom-0 pl-3 pointer-events-none">
                <IoSearch className="size-5 text-gray-400" />
              </div>
              <input
                id="search"
                name="search"
                type="search"
                className="text-gray-900 placeholder-gray-400 rounded-md w-full pr-3 pl-10 py-1.5 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
                placeholder="Search"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex items-center lg:hidden">
            {user ? (
              <>
                <input
                  type="checkbox"
                  className={styles.dropdownActive}
                  id="dropdown-active"
                  hidden
                  aria-hidden
                />

                <label
                  htmlFor="dropdown-active"
                  className={classNames(
                    'text-gray-500 p-2 rounded-md inline-flex justify-center cursor-pointer hover:text-gray-600 hover:bg-gray-100',
                    styles.menuOpen
                  )}
                >
                  <FiMenu className="size-6 text-inherit" />
                </label>

                <label
                  htmlFor="dropdown-active"
                  className={classNames(
                    'text-gray-500 p-2 rounded-md inline-flex justify-center cursor-pointer hover:text-gray-600 hover:bg-gray-100',
                    styles.menuClose
                  )}
                >
                  <IoMdClose className="size-6 text-inherit" />
                </label>

                <div
                  className={classNames(
                    'absolute left-0 top-full w-full z-[10] bg-white shadow-md',
                    styles.menu
                  )}
                >
                  <div className="pt-2 pb-3 space-y-1">
                    {pageNavigations.map((navigation, index) => {
                      if (!user && navigation.requiresUser) return <></>;

                      return (
                        <Link
                          key={index}
                          className={
                            navigation.active
                              ? 'text-indigo-700 bg-indigo-50 border-l-4 border-indigo-500 font-medium text-base pr-4 pl-3 py-2 block'
                              : 'text-gray-600 border-l-4 border-transparent font-medium text-base pr-4 pl-3 py-2 block hover:text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                          }
                          href={navigation.path}
                        >
                          {navigation.name}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="pt-4 pb-3 border-gray-200 border-y border-b-0">
                    <div className="flex items-center px-4">
                      <Image
                        className="size-10 max-w-full rounded-full"
                        alt="Profile"
                        src={user.user_metadata.avatar || '/img/avatar.svg'}
                        width={40}
                        height={40}
                      />
                      <div className="ml-3">
                        <div className="text-gray-800 font-medium text-base">
                          {user.user_metadata.first_name}&nbsp;
                          {user.user_metadata.last_name}
                        </div>
                        <div className="text-gray-500 font-medium text-sm">
                          {user.email || 'Email not set'}
                        </div>
                      </div>
                      <Link
                        href="/notifications"
                        className="ml-auto text-gray-500 border border-gray-400 border-solid rounded-md p-1 hover:bg-gray-50"
                      >
                        <RiInbox2Line className="size-5" />
                      </Link>
                    </div>
                    <div className="mt-3">
                      {profileNavigations.map((navigation, index) => {
                        return (
                          <Link
                            key={index}
                            className="text-gray-500 font-medium text-base px-4 py-2 block hover:text-gray-600 hover:bg-gray-50"
                            href={navigation.path}
                          >
                            {navigation.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/auth/signin" className="ml-2">
                <button className="font-medium text-sm py-1.5 px-2 rounded-md border border-gray-400 border-solid text-gray-500 hover:bg-gray-50">
                  Login
                </button>
              </Link>
            )}
          </div>

          <div className="hidden lg:block">
            <div
              className={classNames('flex items-center', styles.dividerBefore)}
            >
              {user ? (
                <>
                  <Link href="/paste" className="ml-2">
                    <button className="btn btn-primary text-sm h-auto min-h-0 py-1.5 px-2 rounded-md font-semibold">
                      <FiPlus className="size-5 text-inherit" />
                      New Paste
                    </button>
                  </Link>

                  <Link
                    href="/notifications"
                    className="ml-3 text-gray-500 border border-gray-400 border-solid rounded-md p-1 hover:bg-gray-50"
                  >
                    <RiInbox2Line className="size-5" />
                  </Link>

                  <div className="ml-3 dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="rounded-full flex items-center cursor-pointer"
                    >
                      <Image
                        className="size-8 max-w-full rounded-full"
                        alt="Profile"
                        src={user.user_metadata.avatar || '/img/avatar.svg'}
                        width={40}
                        height={40}
                      />
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content border border-solid border-opacity-10 border-black  text-gray-700 bg-white rounded-md w-80 z-[10] py-1 px-0 mt-2 shadow-lg"
                    >
                      <li key={99}>
                        <div className="flex items-center px-4 py-2">
                          <Image
                            className="size-10 max-w-full rounded-full"
                            alt="Profile"
                            src={user.user_metadata.avatar || '/img/avatar.svg'}
                            width={40}
                            height={40}
                          />
                          <div className="ml-3">
                            <div className="text-gray-800 font-medium text-base">
                              {user.user_metadata.first_name}&nbsp;
                              {user.user_metadata.last_name}
                            </div>
                            <div className="text-gray-500 font-medium text-sm">
                              {user.email || 'Email not set'}
                            </div>
                          </div>
                        </div>
                      </li>
                      {profileNavigations.map((navigation, index) => {
                        return (
                          <li key={index} className="text-sm hover:bg-gray-100">
                            <Link
                              className="block px-4 py-2"
                              href={navigation.path}
                            >
                              {navigation.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="ml-2">
                    <button className="font-medium text-sm py-1.5 px-2 rounded-md border border-gray-400 border-solid text-gray-500 hover:bg-gray-50">
                      Login
                    </button>
                  </Link>
                  <Link href="/auth/signin" className="ml-3">
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
