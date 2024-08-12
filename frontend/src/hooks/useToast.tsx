'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { Bounce, toast, ToastContainer, ToastOptions } from 'react-toastify';

type ToastType = 'warning' | 'error' | 'success' | 'info' | 'normal';
const ToastDuration = {
  short: 2500,
  long: 5000,
};

interface ToastState {
  showToast: (
    message: string,
    type?: ToastType,
    options?: ToastOptions
  ) => void;
}

const ToastContext = createContext({
  showToast: () => {},
} as ToastState);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showToast = (
    message: string,
    type?: ToastType,
    options?: ToastOptions
  ) => {
    switch (type) {
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      case 'success':
        toast.success(message, options);
        break;
      case 'warning':
        toast.warn(message, options);
        break;
      case 'normal':
        toast(message, options);
        break;
    }
  };

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      showToast(decodeURIComponent(error), 'error');
      router.replace(pathname);
    }
  }, [searchParams]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        draggable={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="colored"
        limit={3}
        transition={Bounce}
      />
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  );
};
