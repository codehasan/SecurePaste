import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { MdVerified } from 'react-icons/md';
import { RiInbox2Line } from 'react-icons/ri';
import DropdownProps from './DropdownProps';
import styles from './NavBar.module.css';

const ProfileDropdownSm = ({
  authUser,
  dbUser,
  profileNavigations,
  pageNavigations,
}: DropdownProps) => {
  return (
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
            return (
              <Link
                key={navigation.name}
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
              src={dbUser.avatar || '/img/avatar.svg'}
              width={40}
              height={40}
            />
            <div className="ml-3">
              <div className="flex items-center gap-1 text-gray-800 font-medium text-base">
                <span>{dbUser.name}</span>
                {dbUser.verified && (
                  <span className="text-primary tooltip" data-tip="Verified">
                    <MdVerified aria-label="Verified" />
                  </span>
                )}
              </div>
              <div className="text-gray-500 font-medium text-sm">
                {authUser.email || 'Email not set'}
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
                  key={navigation.name}
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
  );
};

export default ProfileDropdownSm;
