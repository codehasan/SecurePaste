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
    <div className="dropdown dropdown-end ml-3">
      <div
        tabIndex={0}
        role="button"
        className="flex cursor-pointer items-center rounded-full"
        onClick={() => setOpen(true)}
      >
        <Image
          className="size-8 max-w-full rounded-full border border-solid border-black border-opacity-5"
          alt="Profile"
          src={dbUser.avatar || '/img/avatar.svg'}
          width={40}
          height={40}
        />
      </div>
      {open && (
        <ul className="dropdown-content z-[10] mt-2 w-80 rounded-md border border-solid border-black border-opacity-10 bg-white px-0 py-1 text-gray-700 shadow-lg">
          <li key={'hero'}>
            <div className="flex items-center px-4 py-2">
              <Image
                className="size-10 max-w-full rounded-full border border-solid border-black border-opacity-5"
                alt="Profile"
                src={dbUser.avatar || '/img/avatar.svg'}
                width={40}
                height={40}
              />
              <div className="ml-3">
                <div className="flex items-center gap-1 text-base font-medium text-gray-800">
                  <span>{dbUser.name}</span>
                  {dbUser.verified && (
                    <span className="text-primary tooltip" data-tip="Verified">
                      <MdVerified aria-label="Verified" />
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-500">
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
