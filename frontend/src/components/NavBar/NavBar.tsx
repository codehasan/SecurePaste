import Logo from '@/icons/Logo';
import TextLogo from '@/icons/TextLogo';
import { createClient } from '@/utils/supabase/server';
import getUser from '@/utils/supabase/user';
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
    { name: 'Your profile', path: `/user/${authUser?.id}` },
    { name: 'Change password', path: `/auth/update_password` },
    { name: 'Sign out', path: '/auth/signout' },
  ];

  return (
    <nav className="bg-white max-h-16 w-full relative border-b border-solid border-b-stone-300 shadow-md">
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

            <NavLinksLg
              authUser={authUser}
              dbUser={dbUser}
              pageNavigations={pageNavigations}
            />
          </div>

          <div className="flex grow shrink basis-0 justify-center px-2 lg:justify-end lg:ml-6">
            <div className="relative w-full max-w-lg lg:max-w-80">
              <div className="flex items-center absolute left-0 top-0 bottom-0 pl-3 pointer-events-none">
                <IoSearch className="size-5 fill-gray-500" />
              </div>
              <input
                id="search"
                name="search"
                type="search"
                className="text-gray-900 placeholder-gray-500 rounded-md w-full pr-3 pl-10 py-1.5 ring-1 ring-gray-400 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 bg-transparent"
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
                    className="ml-3 text-gray-500 border border-gray-400 border-solid rounded-md p-1 hover:bg-gray-50"
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
