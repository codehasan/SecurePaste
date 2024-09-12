'use client';
import { useWallet } from '@/hooks/useWallet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { MdVerified } from 'react-icons/md';
import { RiInbox2Line } from 'react-icons/ri';
import Avatar from '../Avatar';
import DropdownProps from './DropdownProps';

const DropdownMenuSm = ({
  authUser,
  dbUser,
  profileNavigations,
  pageNavigations,
}: DropdownProps) => {
  const { showWalletConnectDialog, showMyWalletDialog, isActive, account } =
    useWallet();
  const [open, setOpen] = useState(false);
  const currentPath = usePathname();

  const isActivePath = (path: string) => {
    if (path === '/') return currentPath === path;
    return currentPath.startsWith(path);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const openMenu = () => {
    setOpen(true);
  };

  const navigations = useMemo(() => {
    const items = profileNavigations.map((navigation) => {
      return (
        <Link
          key={navigation.name}
          className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100"
          href={navigation.path}
          onClick={closeMenu}
        >
          {navigation.name}
        </Link>
      );
    });

    items.splice(
      1,
      0,
      <li
        className="block cursor-pointer px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100"
        key={'wallet'}
      >
        {isActive && account ? (
          <div
            tabIndex={0}
            role="button"
            className="block"
            onClick={() => {
              closeMenu();
              showMyWalletDialog();
            }}
          >
            My wallet
          </div>
        ) : (
          <div
            tabIndex={0}
            role="button"
            className="block"
            onClick={() => {
              closeMenu();
              showWalletConnectDialog();
            }}
          >
            Connect wallet
          </div>
        )}
      </li>
    );

    return items;
  }, [profileNavigations, account, isActive]);

  return (
    <>
      {open ? (
        <button
          className="inline-flex cursor-pointer justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
          onClick={closeMenu}
        >
          <IoMdClose className="size-6 text-inherit" />
        </button>
      ) : (
        <button
          className="inline-flex cursor-pointer justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
          onClick={openMenu}
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
                    isActivePath(navigation.path)
                      ? 'text-primary border-primary block border-l-4 bg-[rgb(228,242,254)] py-2 pl-3 pr-4 text-base font-medium'
                      : 'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100'
                  }
                  href={navigation.path}
                  onClick={closeMenu}
                >
                  {navigation.name}
                </Link>
              );
            })}
          </div>
          <div className="border-y border-b-0 border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-4">
              <Avatar src={dbUser.avatar} parentClassName="size-10" />

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
                href={`/user/${authUser.id}/notifications`}
                className="ml-auto rounded-md border border-solid border-gray-400 p-1 text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                onClick={closeMenu}
              >
                <RiInbox2Line className="size-5" />
              </Link>
            </div>
            <div className="mt-3">{navigations}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default DropdownMenuSm;
