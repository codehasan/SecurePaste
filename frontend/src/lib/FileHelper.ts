export async function isJpegFile(file: File) {
  const blob = file.slice(0, 2);
  const arrayBuffer = await blob.arrayBuffer();

  return arrayToHex(new Uint8Array(arrayBuffer)) === 'ffd8';
}

export async function isPngFile(file: File) {
  const blob = file.slice(0, 8);
  const arrayBuffer = await blob.arrayBuffer();

  return arrayToHex(new Uint8Array(arrayBuffer)) === '89504e470d0a1a0a';
}

export async function isWebPFile(file: File) {
  const blob = file.slice(0, 12);
  const arrayBuffer = await blob.arrayBuffer();
  const arr = new Uint8Array(arrayBuffer);

  const riffSignature = arr.slice(0, 4);
  const isRiff = arrayToHex(riffSignature) === '52494646';

  const webpSignature = arr.slice(8, 12);
  const isWebp = arrayToHex(webpSignature) === '57454250';

  const sizeBytes = arr.slice(4, 8);
  const fileSize =
    sizeBytes[0] +
    (sizeBytes[1] << 8) +
    (sizeBytes[2] << 16) +
    (sizeBytes[3] << 24);
  const expectedSize = fileSize + 8;

  return isRiff && isWebp && expectedSize === file.size;
}

export function isJpeg(arrayBuffer: ArrayBuffer) {
  if (arrayBuffer.byteLength < 2) return false;
  return arrayToHex(new Uint8Array(arrayBuffer).subarray(0, 2)) === 'ffd8';
}

export function isPng(arrayBuffer: ArrayBuffer) {
  if (arrayBuffer.byteLength < 8) return false;
  return (
    arrayToHex(new Uint8Array(arrayBuffer).subarray(0, 8)) ===
    '89504e470d0a1a0a'
  );
}

export function isWebP(arrayBuffer: ArrayBuffer) {
  if (arrayBuffer.byteLength < 12) return false;

  const arr = new Uint8Array(arrayBuffer);
  const isRiff = arrayToHex(arr.subarray(0, 4)) === '52494646';
  const isWebp = arrayToHex(arr.subarray(8, 12)) === '57454250';

  const fileSize = arr[4] + (arr[5] << 8) + (arr[6] << 16) + (arr[7] << 24);

  const expectedSize = fileSize + 8;
  return isRiff && isWebp && expectedSize === arrayBuffer.byteLength;
}

function arrayToHex(arr: Uint8Array): string {
  return arr.reduce(
    (acc, byte) => acc + byte.toString(16).padStart(2, '0'),
    ''
  );
}
