import CodeMockup from '@/icons/CodeMockup';
import classNames from 'classnames';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { Prism } from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './client.module.css';

export default function Home() {
  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="size-full mt-8 sm:mt-12">
          {Array.of('0', '1', '2', '3', '4', '5', '6', '7', '8', '9').map(
            (_value, index) => {
              return (
                <div
                  className="card p-8 bg-gray-100 cursor-pointer mb-8 hover:shadow-sm"
                  key={index}
                >
                  <div className="card-title">
                    How to prevent reentrancy attack in solidity smart contract
                  </div>

                  <div
                    className={classNames(
                      styles.codeMockup,
                      'bg-white pt-4 pb-2 px-2 mt-4 rounded-md relative'
                    )}
                  >
                    <div className="ml-2 mb-4">
                      <CodeMockup />
                    </div>
                    <Prism
                      language="solidity"
                      style={coldarkCold}
                      customStyle={{ background: 'transparent' }}
                      useInlineStyles
                      showLineNumbers
                    >
                      {`//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
...`}
                    </Prism>
                  </div>

                  <div className="flex gap-4 mt-4 text-gray-600 text-sm">
                    <div>Jul 24, 2024</div>
                    <div className="flex gap-1 items-center">
                      <FaThumbsUp />
                      <span>2.5k</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <FaComment />
                      <span>98</span>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
