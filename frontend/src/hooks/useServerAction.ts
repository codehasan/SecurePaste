import { logError } from '@/lib/logging/client';
import { useState, useTransition } from 'react';

const useServerAction = <T extends (...args: any[]) => Promise<any>>(
  func: T,
  throwErrors: boolean = false
) => {
  const [value, setValue] = useState<ReturnType<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, startTransition] = useTransition();

  const execute = (...params: Parameters<T>) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await func(...params);
        setValue(result);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        } else {
          logError(`Unexpected server action error: ${JSON.stringify(e)}`);
          setError(new Error('Oops! An unexpected error occured.'));
        }

        if (throwErrors) {
          throw e;
        }
      }
    });
  };

  return { loading, value, error, execute };
};

export default useServerAction;
