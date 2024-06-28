export const mbToCharacter = (mb: number) => {
  return kbToCharacter(mb * 1000);
};

export const kbToCharacter = (kb: number) => {
  return byteToCharacter(kb * 1000);
};

export const byteToCharacter = (byte: number) => {
  return byte;
};
