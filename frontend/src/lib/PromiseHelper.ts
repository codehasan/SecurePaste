export const raceWithTimeout = <T>(
  promises: Promise<T>[],
  timeout: number,
  timeoutValue: T
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timeoutHandler = setTimeout(() => resolve(timeoutValue), timeout);

    Promise.race([...promises])
      .then((result) => {
        clearTimeout(timeoutHandler);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutHandler);
        reject(error);
      });
  });
};
