'use client';
import { getAlertClassNameFromType, Type } from '@/components/Alert';
import classNames from 'classnames';
import { createContext, ReactNode, useContext, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { v4 } from 'uuid';

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: Type, duration?: 'long' | 'short') => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

export interface Toast {
  id: string;
  message: string;
  type: Type;
  duration: 'long' | 'short';
  showed: boolean;
}

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
} as ToastState);

const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (
    message: string,
    type?: Type,
    duration?: 'long' | 'short'
  ) => {
    setToasts((prev) => [
      ...prev,
      {
        id: v4(),
        message,
        type: type || Type.INFO,
        duration: duration || 'short',
        showed: false,
      },
    ]);
  };

  const removeToast = (index: number) => {
    setToasts((prev) => prev.filter((_toast, i) => i !== index));
  };

  const removeToastById = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const map = (
    array: Toast[],
    max: number,
    callback: (element: Toast, index: number) => JSX.Element
  ) => {
    const elements: JSX.Element[] = [];

    for (let i = 0; i < array.length && i < max; i++) {
      const toast = array[i];

      if (!toast.showed) {
        setTimeout(
          () => removeToastById(toast.id),
          toast.duration === 'long' ? 5000 : 2500
        );
        toast.showed = true;
      }

      elements[i] = callback(toast, i);
    }
    return elements;
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      <div className="toast toast-end toast-bottom sticky pr-16 pb-16">
        {map(toasts, 5, (toast, index) => {
          return (
            <div
              key={toast.id}
              className={classNames(
                'alert rounded-md',
                getAlertClassNameFromType(toast.type)
              )}
            >
              <span>{toast.message}</span>
              <button className="size-5" onClick={() => removeToast(index)}>
                <IoClose className="size-full" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export { ToastProvider, useToast };
