'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { MdVerified } from 'react-icons/md';
import { RiInbox2Line } from 'react-icons/ri';
import DropdownProps from './DropdownProps';

const DropdownMenuSm = ({
  authUser,
  dbUser,
  profileNavigations,
  pageNavigations,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const currentPath = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return currentPath === path;
    return currentPath.startsWith(path);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {open ? (
        <button
          className="inline-flex cursor-pointer justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
          onClick={handleToggle}
        >
          <IoMdClose className="size-6 text-inherit" />
        </button>
      ) : (
        <button
          className="inline-flex cursor-pointer justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
          onClick={handleToggle}
        >
          <FiMenu className="size-6 text-inherit" />
        </button>
      )}

      {open && (
        <div className="absolute left-0 top-full z-[10] w-full bg-white shadow-md">
          <div className="space-y-1 pb-3 pt-2">
            {pageNavigations.map((navigation) => {
              return (
                <Link
                  key={navigation.name}
                  className={
                    isActive(navigation.path)
                      ? 'text-primary border-primary block border-l-4 bg-[rgb(228,242,254)] py-2 pl-3 pr-4 text-base font-medium'
                      : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700'
                  }
                  href={navigation.path}
                  onClick={handleToggle}
                >
                  {navigation.name}
                </Link>
              );
            })}
          </div>
          <div className="border-y border-b-0 border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-4">
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
              <Link
                href="/notifications"
                className="ml-auto rounded-md border border-solid border-gray-400 p-1 text-gray-500 hover:bg-gray-50"
                onClick={handleToggle}
              >
                <RiInbox2Line className="size-5" />
              </Link>
            </div>
            <div className="mt-3">
              {profileNavigations.map((navigation, index) => {
                return (
                  <Link
                    key={navigation.name}
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-600"
                    href={navigation.path}
                    onClick={handleToggle}
                  >
                    {navigation.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DropdownMenuSm;
