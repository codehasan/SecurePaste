'use client';
import { Theme } from '@/lib/DaisyThemes';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { FaMoon } from 'react-icons/fa';
import { IoSunny } from 'react-icons/io5';

const getThemeName = (light: boolean) => {
  return light ? Theme.light : Theme.dark;
};

const setDocumentTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme);
};

const ThemeToggle = () => {
  const [lightTheme, setLightTheme] = useState(true);
  const classes = 'h-6 w-6';

  const toggleTheme = () => {
    setLightTheme((prevTheme) => {
      const newTheme = !prevTheme;
      localStorage.setItem('theme', getThemeName(newTheme));
      return newTheme;
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const theme = getThemeName(lightTheme);

    if (savedTheme && theme != savedTheme) {
      setLightTheme(false);
    } else {
      setDocumentTheme(theme);
    }
  }, [lightTheme]);

  return (
    <label className="mx-4 cursor-pointer swap swap-rotate">
      <input type="checkbox" onChange={toggleTheme} />
      <FaMoon className={classNames('swap-off', classes)} />
      <IoSunny className={classNames('swap-on', classes)} />
    </label>
  );
};

export default ThemeToggle;
