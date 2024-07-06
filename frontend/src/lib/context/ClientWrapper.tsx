'use client';

import { ThemeProvider } from './ThemeContext';

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default ClientWrapper;
