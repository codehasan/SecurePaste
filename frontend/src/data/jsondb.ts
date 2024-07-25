import { readFile, writeFile } from 'fs/promises';

export const getDb = async (path: string) => {
  return JSON.parse(await readFile(path, { encoding: 'utf-8' }));
};

export const writeToDb = async (path: string, content: string) => {
  await writeFile(path, content, {
    encoding: 'utf-8',
    flush: true,
  });
};
