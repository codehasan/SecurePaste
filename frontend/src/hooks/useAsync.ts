import { useCallback, useEffect, useState } from 'react';

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

export const useAsync = <T>(
  func: AsyncFunction<T>,
  dependencies: React.DependencyList = []
) => {
  const { execute, ...state } = useAsyncInternal<T>(func, dependencies, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
};

export const useAsyncFn = <T>(
  func: AsyncFunction<T>,
  dependencies: React.DependencyList = []
) => {
  return useAsyncInternal<T>(func, dependencies, false);
};

const useAsyncInternal = <T>(
  func: AsyncFunction<T>,
  dependencies: React.DependencyList,
  initialLoading: boolean
) => {
  const [loading, setLoading] = useState(initialLoading);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback((...params: any[]) => {
    setLoading(true);

    return func(...params)
      .then((data: T) => {
        setValue(data);
        return data;
      })
      .catch((e: Error) => {
        setError(e);
        return Promise.reject(e);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { loading, value, error, execute, setValue };
};
