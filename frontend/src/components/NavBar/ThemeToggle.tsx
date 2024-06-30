'use client';
import { useTheme } from '@/context/ThemeContext';
import classNames from 'classnames';
import React from 'react';
import { FaMoon } from 'react-icons/fa';
import { IoSunny } from 'react-icons/io5';

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();
  const classes = 'h-6 w-6';

  return (
    <label htmlFor="input" className="mx-4 cursor-pointer swap swap-rotate">
      <input type="checkbox" onChange={toggleTheme} />
      <FaMoon className={classNames('swap-off', classes)} />
      <IoSunny className={classNames('swap-on', classes)} />
    </label>
  );
};

export default ThemeToggle;
