export const getTrimmedAddress = (address: string) => {
  let newAddress = address.startsWith('0x') ? address : `0x${address}`;
  return `${newAddress.slice(0, 7)}...${newAddress.slice(newAddress.length - 5)}`;
};
