'use server';

/**
 * Make request to an async function and return the data and error as an object.
 * @param func - Async function that should be called.
 */
const makeRequest = async <T>(func: () => Promise<T>) => {
  let data: T | null = null;
  let error: unknown = null;

  try {
    data = await func();
  } catch (e) {
    error = e;
  }

  return { data, error };
};

export default makeRequest;
