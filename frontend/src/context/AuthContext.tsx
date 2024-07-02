import { useEffect, useState, useContext, createContext } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseApp } from '@/firebase/config';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthState {
  user: User | null;
  logout: () => void;
}

const app = getFirebaseApp();
const auth = getAuth(app);

const AuthContext = createContext<AuthState>({
  user: null,
  logout: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Signed in as:', user);
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => {};

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
