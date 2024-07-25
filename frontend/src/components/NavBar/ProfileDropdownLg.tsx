'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MdVerified } from 'react-icons/md';
import DropdownProps from './DropdownProps';

const ProfileDropdownLg = ({
  authUser,
  dbUser,
  profileNavigations,
}: Omit<DropdownProps, 'pageNavigations'>) => {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  return (
    <div className="ml-3 dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="rounded-full flex items-center cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Image
          className="size-8 max-w-full rounded-full"
          alt="Profile"
          src={dbUser.avatar || '/img/avatar.svg'}
          width={40}
          height={40}
        />
      </div>
      {open && (
        <ul className="dropdown-content border border-solid border-opacity-10 border-black  text-gray-700 bg-white rounded-md w-80 z-[10] py-1 px-0 mt-2 shadow-lg">
          <li key={'hero'}>
            <div className="flex items-center px-4 py-2">
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
            </div>
          </li>
          {profileNavigations.map((navigation) => {
            return (
              <li key={navigation.name} className="text-sm hover:bg-gray-100">
                <Link
                  className="block px-4 py-2"
                  href={navigation.path}
                  onClick={close}
                >
                  {navigation.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdownLg;
