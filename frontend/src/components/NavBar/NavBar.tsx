import Logo from '@/icons/Logo';
import TextLogo from '@/icons/TextLogo';
import { createClient } from '@/utils/supabase/server';
import getUser from '@/utils/services/user';
import classNames from 'classnames';
import { headers } from 'next/headers';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import { RiInbox2Line } from 'react-icons/ri';
import styles from './NavBar.module.css';
import ProfileDropdownLg from './ProfileDropdownLg';
import DropdownMenuSm from './DropdownMenuSm';
import NavLinksLg from './NavLinksLg';

const NavBar = async () => {
  const supabase = createClient();
  const { authUser, dbUser } = await getUser(supabase);
  const isValidUser = Boolean(authUser && dbUser);

  const pageNavigations = [
    { name: 'Home', path: '/', requiresUser: false },
    {
      name: 'Pastes',
      path: `/user/${authUser?.id}/pastes`,
      requiresUser: true,
    },
    {
      name: 'Comments',
      path: `/user/${authUser?.id}/comments`,
      requiresUser: true,
    },
  ];

  const profileNavigations = [
    { name: 'My profile', path: `/user/${authUser?.id}` },
    { name: 'Change password', path: `/auth/update_password` },
    { name: 'Sign out', path: '/auth/signout' },
  ];

  return (
    <nav className="relative max-h-16 w-full border-b border-solid border-b-stone-300 bg-white shadow-md">
      <div className="mx-auto px-2 sm:px-4 lg:px-8">
        <div className="navbar justify-between p-0">
          <div className="flex h-16 items-center px-2 lg:px-0">
            <Link
              className="flex h-full items-center"
              href="/"
              rel="noopener noreferrer"
            >
              <Logo className="h-8 w-auto max-w-full text-teal-700" />
              <TextLogo className="ml-2 hidden h-7 w-auto max-w-full text-teal-700 md:block" />
            </Link>

            <NavLinksLg
              authUser={authUser}
              dbUser={dbUser}
              pageNavigations={pageNavigations}
            />
          </div>

          <div className="flex shrink grow basis-0 justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-80">
              <div className="pointer-events-none absolute bottom-0 left-0 top-0 flex items-center pl-3">
                <IoSearch className="size-5 fill-gray-500" />
              </div>
              <input
                id="search"
                name="search"
                type="search"
                className="focus:ring-primary w-full rounded-md bg-transparent py-1.5 pl-10 pr-3 text-gray-900 placeholder-gray-500 ring-1 ring-gray-400 focus:ring-2 sm:text-sm sm:leading-6"
                placeholder="Search"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex items-center lg:hidden">
            {isValidUser ? (
              <DropdownMenuSm
                authUser={authUser!}
                dbUser={dbUser!}
                pageNavigations={pageNavigations}
                profileNavigations={profileNavigations}
              />
            ) : (
              <Link href="/auth/signin" className="ml-2">
                <button className="btn btn-custom btn-neutral">Login</button>
              </Link>
            )}
          </div>

          <div className="hidden lg:block">
            <div
              className={classNames('flex items-center', styles.dividerBefore)}
            >
              {isValidUser ? (
                <>
                  <Link href="/paste" className="ml-2">
                    <button className="btn btn-custom btn-primary">
                      <FiPlus className="size-5 text-inherit" />
                      New Paste
                    </button>
                  </Link>

                  <Link
                    href="/notifications"
                    className="ml-3 rounded-md border border-solid border-gray-400 p-1 text-gray-500 hover:bg-gray-50"
                  >
                    <RiInbox2Line className="size-5" />
                  </Link>

                  <ProfileDropdownLg
                    authUser={authUser!}
                    dbUser={dbUser!}
                    profileNavigations={profileNavigations}
                  />
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="ml-2">
                    <button className="btn btn-custom">Login</button>
                  </Link>
                  <Link href="/auth/signin" className="ml-2">
                    <button className="btn btn-custom btn-primary">
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
