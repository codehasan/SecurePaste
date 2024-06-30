'use client';

import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
};

export default ClientWrapper;
