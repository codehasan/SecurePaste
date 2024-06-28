import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaSearch } from 'react-icons/fa';

import ThemeToggle from './ThemeToggle';

const NavBar = () => {
  return (
    <nav className="flex justify-center px-6 w-full">
      <div className="navbar justify-between w-full lg:max-w-screen-lg xl:max-w-screen-xl">
        <div className="flex grow justify-start">
          <Link className="flex justify-center items-center" href="/">
            <Image
              className="mr-2"
              alt="Logo"
              src="/icon.png"
              width={40}
              height={40}
            />
            <h1 className="text-2xl font-semibold">SecurePaste</h1>
          </Link>
        </div>
        <div className="flex grow justify-center ml-2">
          <label className="input input-bordered flex items-center">
            <input type="text" className="grow" placeholder="Search" />
            <FaSearch className="h-4 w-4 opacity-70" />
          </label>
        </div>
        <div className="flex grow justify-end">
          <ThemeToggle />
          <button className="btn btn-primary px-5">Connect</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
