'use client';
import CryptoJS from 'crypto-js';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { Bounce, toast, ToastContainer, ToastOptions } from 'react-toastify';

type ToastType = 'warning' | 'error' | 'success' | 'info' | 'normal';
const ToastDuration = {
  short: 2500,
  long: 5000,
};

interface ToastState {
  showToast: (content: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext({
  showToast: () => {},
} as ToastState);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showToast = (content: string, type?: ToastType, duration?: number) => {
    const options: ToastOptions = {
      autoClose: duration || ToastDuration.long,
      toastId: CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex),
      theme: 'colored',
    };

    switch (type) {
      case 'error':
        toast.error(content, options);
        break;
      case 'info':
        toast.info(content, options);
        break;
      case 'success':
        toast.success(content, options);
        break;
      case 'warning':
        toast.warn(content, options);
        break;
      case 'normal':
      default:
        toast(content, options);
        break;
    }
  };

  useEffect(() => {
    const error = searchParams.get('error');

    if (error) {
      showToast(decodeURIComponent(error), 'error');

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('error');

      router.replace(
        newParams.size > 0 ? `${pathname}?${newParams.toString()}` : pathname
      );
    }
  }, [searchParams]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        draggable={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        limit={3}
        transition={Bounce}
      />
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  );
};
