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
    if (currentPath === '/') return currentPath === path;
    return currentPath.startsWith(path);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {open ? (
        <button
          className="text-gray-500 p-2 rounded-md inline-flex justify-center cursor-pointer hover:text-gray-600 hover:bg-gray-100"
          onClick={handleToggle}
        >
          <IoMdClose className="size-6 text-inherit" />
        </button>
      ) : (
        <button
          className="text-gray-500 p-2 rounded-md inline-flex justify-center cursor-pointer hover:text-gray-600 hover:bg-gray-100"
          onClick={handleToggle}
        >
          <FiMenu className="size-6 text-inherit" />
        </button>
      )}

      {open && (
        <div className="absolute left-0 top-full w-full z-[10] bg-white shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            {pageNavigations.map((navigation) => {
              return (
                <Link
                  key={navigation.name}
                  className={
                    isActive(navigation.path)
                      ? 'text-primary bg-[rgb(228,242,254)] border-l-4 border-primary font-medium text-base pr-4 pl-3 py-2 block'
                      : 'text-gray-600 border-l-4 border-transparent font-medium text-base pr-4 pl-3 py-2 block hover:text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                  }
                  href={navigation.path}
                  onClick={handleToggle}
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
                    className="text-gray-500 font-medium text-base px-4 py-2 block hover:text-gray-600 hover:bg-gray-50"
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
