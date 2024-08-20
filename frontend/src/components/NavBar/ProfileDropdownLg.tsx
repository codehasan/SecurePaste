'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { MdOutlineClose, MdVerified } from 'react-icons/md';
import DropdownProps from './DropdownProps';
import { IoClose } from 'react-icons/io5';
import styles from './NavBar.module.css';
import classNames from 'classnames';
import MetaMask from '@/icons/MetaMask';
import Select from '@/icons/Select';
import Coinbase from '@/icons/Coinbase';
import WalletConnect from '@/icons/WalletConnect';
import Avatar from '../Avatar';

const ProfileDropdownLg = ({
  authUser,
  dbUser,
  profileNavigations,
}: Omit<DropdownProps, 'pageNavigations'>) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const walletModalRef = useRef<HTMLDialogElement>(null);

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const navigations = useMemo(() => {
    const items = profileNavigations.map((navigation) => {
      return (
        <li key={navigation.name} className="text-sm hover:bg-gray-100">
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
      <li className="text-sm hover:bg-gray-100" key={'wallet'}>
        <div
          tabIndex={0}
          role="button"
          className="block cursor-pointer px-4 py-2"
          onClick={() => {
            closeDropdown();
            walletModalRef.current?.showModal();
          }}
        >
          Connect wallet
        </div>
      </li>
    );

    return items;
  }, [profileNavigations]);

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

      <dialog
        id="wallet-modal"
        ref={walletModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              <IoClose className="size-5" />
            </button>
          </form>

          <div>
            <div className="flex flex-1 flex-col items-center justify-start gap-4 text-base">
              <div className="flex w-full flex-wrap items-center pr-8 text-lg font-medium">
                Connect a wallet
              </div>

              <div className="flex flex-1 flex-col items-center justify-start gap-3">
                <div
                  className={classNames(
                    'relative flex max-h-[72px] cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-2xl p-4 hover:bg-[rgba(34,34,34,0.07)]',
                    styles.borderModal
                  )}
                >
                  <MetaMask
                    className={classNames(styles.borderModal, 'rounded-[10px]')}
                  />
                  <div className="flex flex-col items-start justify-center">
                    <span className="whitespace-nowrap break-words text-sm font-medium">
                      MetaMask
                    </span>
                    <span className="whitespace-nowrap break-words text-xs text-stone-500">
                      Available on iOS, Android, Chrome, Firefox, Brave, Opera,
                      and Edge
                    </span>
                  </div>
                </div>
              </div>

              <div className="collapse">
                <input
                  type="checkbox"
                  className="!min-h-0"
                  defaultChecked={true}
                />

                <div className="collapse-title flex !min-h-0 items-center p-0 py-2 text-sm text-gray-600">
                  <div className="h-px w-full bg-gray-200"></div>
                  <div className="mx-4 flex items-center whitespace-nowrap">
                    <span>Other wallets</span>
                    <Select className="size-5" />
                  </div>
                  <div className="h-px w-full bg-gray-200"></div>
                </div>

                <div className="collapse-content mt-4 grid gap-[2px] overflow-hidden rounded-xl !p-0">
                  <div className="relative flex items-stretch justify-between bg-[rgb(249,249,249)] hover:bg-[rgba(34,34,34,0.07)]">
                    <button className="flex w-full flex-auto items-center justify-start p-[18px]">
                      <WalletConnect
                        className={classNames(
                          styles.borderModal,
                          styles.borderMedium,
                          'size-10 rounded-xl'
                        )}
                      />
                      <span className="grow px-2 text-start font-medium">
                        WalletConnect
                      </span>
                      <span className="inline whitespace-pre-wrap break-words text-xs text-gray-600">
                        Detected
                      </span>
                    </button>
                  </div>

                  <div className="relative flex w-full items-stretch justify-between bg-[rgb(249,249,249)] hover:bg-[rgba(34,34,34,0.07)]">
                    <button className="flex w-full flex-auto items-center justify-start p-[18px]">
                      <Coinbase
                        className={classNames(
                          styles.borderModal,
                          styles.borderMedium,
                          'size-10 rounded-xl'
                        )}
                      />
                      <span className="px-2 font-medium">Coinbase Wallet</span>
                    </button>
                  </div>
                </div>
              </div>

              <div id="help" className="w-full px-1 text-sm text-gray-600">
                By connecting a wallet, you will be able to create, edit or
                delete a private paste.
              </div>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default">close</button>
        </form>
      </dialog>
    </>
  );
};

export default ProfileDropdownLg;
