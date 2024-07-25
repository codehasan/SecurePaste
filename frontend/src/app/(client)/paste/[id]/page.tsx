import CommentForm from '@/components/CommentList/CommentForm';
import CommentList from '@/components/CommentList/CommentList';
import comments from '@/data/comments.json';
import { Comment } from '@prisma/client';
import classNames from 'classnames';
import Image from 'next/image';
import styles from '../../client.module.css';
import { MdVerified } from 'react-icons/md';

export default function ViewPaste() {
  const refinedComments: Comment[] = comments.map((comment, index) => {
    return {
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    };
  });

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="text-2xl font-semibold mt-8 mb-4">
          How to prevent reentrancy attack in solidity smart contract
        </div>

        <div className="flex items-center mb-4">
          <div
            tabIndex={0}
            role="button"
            className="rounded-full flex items-center cursor-pointer"
          >
            <Image
              className="size-8 max-w-full rounded-full"
              alt="Profile"
              src={'/img/avatar.svg'}
              width={40}
              height={40}
            />
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-1 text-gray-800 font-medium text-lg">
              <span>Ratul Hasan</span>
              {true && (
                <span className="text-primary tooltip" data-tip="Verified">
                  <MdVerified aria-label="Verified" />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-md w-full min-h-32 p-2 mb-4">
          <div>This is the first line of message.</div>
          <div>Here comes the second line of message.</div>
          <div>Now comes the third line of message.</div>
          <div>And at the end, comes the fourth line of message.</div>
          <div>Oops, here comes the fifth line of message.</div>
        </div>

        <div className="text-xl font-semibold mb-3">Comments</div>
        <CommentForm
          className="mb-2"
          pasteId={'d529b444-9220-41b6-b370-f2a929e0d80f'}
        />
        <CommentList
          parent={null}
          comments={refinedComments}
          pasteId={'d529b444-9220-41b6-b370-f2a929e0d80f'}
        />
      </div>
    </div>
  );
}
