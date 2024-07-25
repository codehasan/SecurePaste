export const map = <T>(
  array: T[],
  max: number,
  callback: (element: T, index: number) => JSX.Element
): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  for (let i = 0; i < array.length; i++) {
    if (i === max) break;
    elements[i] = callback(array[i], i);
  }
  return elements;
};
