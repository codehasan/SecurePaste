import { SecurePaste__factory } from '../typechain-types';
import hardhat, { ethers } from 'hardhat';
import * as path from 'path';
import * as fsp from 'fs/promises';

interface Config {
  [chain: number]: {
    address: string;
  };
}

const copyFile = async (sourceFilePath: string, destinationDir: string) => {
  try {
    await fsp.mkdir(destinationDir, { recursive: true });
    const fileName = path.basename(sourceFilePath);
    const destinationFilePath = path.join(destinationDir, fileName);

    await fsp.copyFile(sourceFilePath, destinationFilePath);
    console.log(`File copied to: ${destinationFilePath}`);
  } catch (error) {
    console.error(`Error copying file: ${error}`);
    throw error;
  }
};

const copyDirectory = async (sourceDir: string, destinationDir: string) => {
  try {
    await fsp.mkdir(destinationDir, { recursive: true });
    const entries = await fsp.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const destinationPath = path.join(destinationDir, entry.name);

      if (entry.isDirectory()) {
        await copyDirectory(sourcePath, destinationPath);
      } else if (entry.isFile()) {
        await fsp.copyFile(sourcePath, destinationPath);
      }
    }
    console.log(`Directory copied to: ${destinationDir}`);
  } catch (error) {
    console.error(`Error copying directory: ${error}`);
    throw error;
  }
};

const appendToFile = async (sourceFilePath: string, config: Config) => {
  try {
    let content;

    try {
      content = await fsp.readFile(sourceFilePath, { encoding: 'utf-8' });
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        content = '{}';
      } else {
        throw e;
      }
    }

    const currConfig: Config = JSON.parse(content);

    await fsp.writeFile(
      sourceFilePath,
      JSON.stringify({ ...currConfig, ...config })
    );

    console.log('Appended config to file');
  } catch (error) {
    console.error(`Error appending to file: ${error}`);
    throw error;
  }
};

const main = async () => {
  const factory: SecurePaste__factory =
    await ethers.getContractFactory('SecurePaste');

  const securePaste = await factory.deploy();
  await securePaste.waitForDeployment();

  const address = await securePaste.getAddress();

  console.log('Contract deployed at:', address);
  console.log('Contract owned by:', await securePaste.owner());

  const config: Config = {};

  if (hardhat.network.config.chainId) {
    config[hardhat.network.config.chainId] = {
      address,
    };
  }

  await copyDirectory(
    'typechain-types',
    'frontend/src/contract/typechain-types'
  );
  await copyFile(
    'artifacts/contracts/SecurePaste.sol/SecurePaste.json',
    'frontend/src/contract/abi'
  );
  await appendToFile('frontend/src/contract/config.json', config);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
