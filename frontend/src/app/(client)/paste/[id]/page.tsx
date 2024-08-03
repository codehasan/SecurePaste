'use client';
import CommentForm from '@/components/CommentList/CommentForm';
import CommentList from '@/components/CommentList/CommentList';
import classNames from 'classnames';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import styles from '../../client.module.css';
import { usePost } from '@/hooks/usePaste';
import { useAsyncFn } from '@/hooks/useAsync';
import { createNewComment } from '@/utils/services/comment';
import { CommentData } from '@/utils/services/paste';

export default async function ViewPaste() {
  const { paste, rootComments, createLocalComment } = usePost();
  const createCommentFn = useAsyncFn(createNewComment);

  const onNewComment = async (message: string) => {
    return createCommentFn
      .execute({ pasteId: paste!.id, message, parentId: null })
      .then((comment: CommentData) => {
        createLocalComment(comment);
      });
  };

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        {false ? (
          <>
            <div className="text-2xl font-semibold mt-8 mb-4">
              {paste.title}
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
                  src={paste.user.avatar || '/img/avatar.svg'}
                  width={40}
                  height={40}
                />
              </div>
              <div className="ml-3">
                <div className="flex items-center gap-1 text-gray-800 font-medium text-lg">
                  <span>{paste.user.name}</span>
                  {paste.user.verified && (
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
              onSubmit={onNewComment}
              loading={createCommentFn.loading}
              error={
                createCommentFn.error?.message || 'An unexpected error occured.'
              }
            />
            <CommentList comments={rootComments} />
          </>
        ) : (
          <div className="flex justify-center">
            No paste found with the given id!
          </div>
        )}
      </div>
    </div>
  );
}
