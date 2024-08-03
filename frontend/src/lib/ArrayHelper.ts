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
  elements.map;
  return elements;
};

/**
 * Calls a defined callback function on each element of an array, and returns an array that contains the results. If the callback function returns null for an element, that element is excluded from the results.
 * @param array - The array to be mapped.
 * @param callbackfn - A function that accepts two arguments. The map method calls the callbackfn function one time for each element in the array.
 * @returns An array of React components.
 */
export const optionalMap = <T>(
  array: T[],
  callback: (element: T, index: number) => JSX.Element | null
): JSX.Element[] => {
  const elements: JSX.Element[] = [];

  for (let i = 0; i < array.length; i++) {
    const element = callback(array[i], i);

    if (element !== null) {
      elements.push(element);
    }
  }
  return elements;
};

export const getTags = (text: string) => {
  let tags: string[] = [];

  if (text && text.trim().length > 0) {
    tags = text.split(/[\s,]+/);
  }

  return tags;
};

export const getLines = (text: string, max: number): string => {
  const lines: string[] = [];
  let currentLine = '';
  let lineCount = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    currentLine += char;

    if (char === '\n') {
      lines.push(currentLine);
      currentLine = '';
      lineCount++;

      if (lineCount === max) {
        lines.push('...');
        break;
      }
    }
  }

  // If we have remaining text after the loop, add it as the last line
  if (currentLine && lineCount < max) {
    lines.push(currentLine);
  }

  return lines.join('');
};
