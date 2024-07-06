import React, { useState, useContext } from 'react';
import { Theme } from '@/lib/DaisyThemes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeState {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeState>({
  theme: Theme.light,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const setDocumentTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || Theme.light;
    }
    return Theme.light;
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === Theme.light ? Theme.dark : Theme.light;
      localStorage.setItem('theme', newTheme);
      setDocumentTheme(newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
