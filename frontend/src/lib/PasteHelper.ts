export const stringToBytes = (input: string) => {};

export const getLinesCount = (input: string) => {
  let count = 1;

  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) === '\n') {
      count += 1;
    }
  }
  return count;
};

export const getSize = (input: string) => {
  let size = new Blob([input]).size;

  if (size > 1024 * 1024) {
    size /= 1024 * 1024;
    return size.toFixed(2) + ' MB';
  }

  if (size > 1024) {
    size /= 1024;
    return size.toFixed(2) + ' KB';
  }

  return size + ' Bytes';
};
