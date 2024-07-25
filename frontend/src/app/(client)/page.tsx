import classNames from 'classnames';
import styles from './client.module.css';
import Tag from '@/components/TagInput/Tag';

export default function Home() {
  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="size-full mt-8 sm:mt-12">
          {Array.of('0', '1', '2', '3', '4', '5', '6', '7', '8', '9').map(
            (value, index) => {
              return (
                <div
                  className="card p-8 pb-4 bg-gray-100 border-solid border cursor-pointer shadow-sm mb-8 hover:shadow-md"
                  key={index}
                >
                  <div className="card-title">
                    How to prevent reentrancy attack in solidity smart contract
                  </div>
                  <div className="card-actions pt-3">
                    16k likes &nbsp;|&nbsp; 156k views
                  </div>

                  <code className="card-body p-2 my-4 leading-tight bg-gray-200 rounded-md max-h-32 overflow-hidden">
                    <span>// SPDX-License-Identifier: MIT</span>
                    <span>pragma solidity ^0.8.20;</span>
                    <br />
                    <span>{'contract SecurePaste {'}</span>
                    <span>
                      &nbsp;&nbsp;&nbsp;&nbsp; event NewPaste(bytes24 indexed
                      hash, address indexed owner);
                    </span>
                    <span>
                      &nbsp;&nbsp;&nbsp;&nbsp; event PasteDeleted(bytes24
                      indexed hash, address indexed owner);
                    </span>
                  </code>

                  <div className="flex items-center gap-1 lg:gap-x-2 pb-2 mb-2 overflow-x-scroll modal-scroll">
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
                    <Tag value="ABCDEFGHIJKLMNO" />
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
