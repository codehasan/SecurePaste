'use client';
import { useWallet } from '@/hooks/useWallet';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { MdVerified } from 'react-icons/md';
import Avatar from '../Avatar';
import DropdownProps from './DropdownProps';

const ProfileDropdownLg = ({
  authUser,
  dbUser,
  profileNavigations,
}: Omit<DropdownProps, 'pageNavigations'>) => {
  const { showWalletConnectDialog, showMyWalletDialog, isActive, account } =
    useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const navigations = useMemo(() => {
    const items = profileNavigations.map((navigation) => {
      return (
        <li
          key={navigation.name}
          className="text-sm hover:bg-gray-100 active:bg-gray-200"
        >
          <Link
            className="block px-4 py-2"
            href={navigation.path}
            onClick={closeDropdown}
          >
            {navigation.name}
          </Link>
        </li>
      );
    });

    items.splice(
      1,
      0,
      <li
        className="text-sm hover:bg-gray-100 active:bg-gray-200"
        key={'wallet'}
      >
        {isActive && account ? (
          <div
            tabIndex={0}
            role="button"
            className="block cursor-pointer px-4 py-2"
            onClick={() => {
              closeDropdown();
              showMyWalletDialog();
            }}
          >
            My wallet
          </div>
        ) : (
          <div
            tabIndex={0}
            role="button"
            className="block cursor-pointer px-4 py-2"
            onClick={() => {
              closeDropdown();
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
      <div className="dropdown dropdown-end ml-3">
        <Avatar
          src={dbUser.avatar}
          parentClassName="size-8"
          onClick={() => setDropdownOpen(true)}
        />

        {dropdownOpen && (
          <ul className="dropdown-content z-[10] mt-2 w-80 rounded-md border border-solid border-black border-opacity-10 bg-white px-0 py-1 text-gray-700 shadow-lg">
            <li>
              <div className="flex items-center px-4 py-2">
                <Avatar src={dbUser.avatar} parentClassName="size-10" />

                <div className="ml-3">
                  <div className="flex items-center gap-1 text-base font-medium text-gray-800">
                    <span>{dbUser.name}</span>
                    {dbUser.verified && (
                      <span
                        className="text-primary tooltip"
                        data-tip="Verified"
                      >
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
            {navigations}
          </ul>
        )}
      </div>
    </>
  );
};

export default ProfileDropdownLg;
