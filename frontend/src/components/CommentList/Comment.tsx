'use client';
import { useAsyncFn } from '@/hooks/useAsync';
import { usePost } from '@/hooks/usePaste';
import { getTimePassedFromDate } from '@/lib/DateFormat';
import {
  createNewComment,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from '@/utils/services/comment';
import { CommentData } from '@/utils/services/paste';
import classNames from 'classnames';
import { useState } from 'react';
import { FaEdit, FaRegMinusSquare, FaRegPlusSquare } from 'react-icons/fa';
import { FaRegThumbsUp, FaReply } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

enum CommentAction {
  NONE,
  REPLY,
  EDIT,
  DELETE,
}

const timeDifference = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / 1000;
};

const Comment = (comment: CommentData) => {
  const [showReplies, setShowReplies] = useState(false);
  const [commentAction, setCommentAction] = useState(CommentAction.NONE);
  const {
    paste,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = usePost();
  const createCommentFn = useAsyncFn(createNewComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleCommentLikeFn = useAsyncFn(toggleCommentLike);
  const childComments = getReplies(comment.id);

  const handleToggle = (action: CommentAction) => {
    if (commentAction === action) {
      setCommentAction(CommentAction.NONE);
    } else {
      setCommentAction(action);
    }
  };

  const handleCancelAction = () => {
    setCommentAction(CommentAction.NONE);
  };

  const onCommentReply = async (message: string) => {
    return createCommentFn
      .execute({ pasteId: paste!.id, message, parentId: comment.id })
      .then((comment: CommentData) => {
        handleCancelAction();
        createLocalComment(comment);
      });
  };

  function onCommentUpdate(message: string) {
    return updateCommentFn
      .execute({ pasteId: paste!.id, message, id: comment.id })
      .then((comment: CommentData) => {
        handleCancelAction();
        updateLocalComment(comment.id, comment.message);
      });
  }

  function onCommentDelete() {
    return deleteCommentFn
      .execute({ pasteId: paste!.id, id: comment.id })
      .then((comment: CommentData) => {
        handleCancelAction();
        deleteLocalComment(comment.id);
      });
  }

  function onToggleCommentLike() {
    return toggleCommentLikeFn
      .execute({ id: comment.id, pasteId: paste!.id })
      .then(({ addLike }: { addLike: boolean }) =>
        toggleLocalCommentLike(comment.id, addLike)
      );
  }

  return (
    <>
      <div
        className={classNames('p-4 bg-gray-100 rounded-md', {
          'mb-2': childComments.length === 0,
          'mb-1': childComments.length > 0,
        })}
      >
        <div className="flex gap-2 mb-2">
          <span className="grow font-medium text-ellipsis">
            {comment.user.id}
          </span>
          <span className="flex items-center gap-1 mb-auto">
            {timeDifference(comment.createdAt, comment.updatedAt) > 1 && (
              <span className="text-gray-700">(Edit)</span>
            )}
            <span>{getTimePassedFromDate(comment.createdAt)}</span>
          </span>
        </div>

        {commentAction === CommentAction.EDIT ? (
          <CommentForm
            className="mb-2"
            onSubmit={onCommentUpdate}
            onCancel={handleCancelAction}
            defaultValue={comment.message}
            loading={updateCommentFn.loading}
            error={
              updateCommentFn.error?.message || 'An unexpected error occured.'
            }
            autoFocus
          />
        ) : (
          <div className="mb-4">{comment.message}</div>
        )}

        {commentAction === CommentAction.DELETE && (
          <div className="flex flex-col mb-2 text-sm bg-red-300 p-2 rounded-md sm:px-4 min-[450px]:flex-row">
            <div className="flex items-center mb-1 sm:mb-0 grow">
              <span>Do you want to delete this comment?</span>
            </div>
            <div className="flex justify-end items-center font-medium">
              <input
                type="text"
                name="commentId"
                value={comment.id}
                hidden
                readOnly
              />
              <button
                className="rounded-md hover:bg-red-200 px-2 py-1.5 cursor-pointer"
                onClick={handleCancelAction}
              >
                No
              </button>
              <button
                className="rounded-md hover:bg-red-200 px-2 py-1.5"
                onClick={onCommentDelete}
              >
                Yes
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 items-center">
          <button
            className="inline-flex justify-center items-center gap-1 text-gray-900 hover:text-gray-700"
            disabled={toggleCommentLikeFn.loading}
          >
            <FaRegThumbsUp />
            <span>{comment._count.likes}</span>
          </button>
          <button
            className={classNames('text-gray-900 hover:text-gray-700', {
              'text-secondary': commentAction === CommentAction.REPLY,
            })}
            onClick={() => handleToggle(CommentAction.REPLY)}
          >
            <FaReply />
          </button>
          <button
            className={classNames('text-gray-900 hover:text-gray-700', {
              'text-secondary': commentAction === CommentAction.EDIT,
            })}
            onClick={() => handleToggle(CommentAction.EDIT)}
          >
            <FaEdit />
          </button>
          <button
            className={classNames('text-red-600 hover:text-red-700', {
              'text-secondary': commentAction === CommentAction.DELETE,
            })}
            onClick={() => handleToggle(CommentAction.DELETE)}
          >
            <MdDelete />
          </button>
        </div>
      </div>

      {commentAction === CommentAction.REPLY && (
        <CommentForm
          className={classNames('mt-2', {
            'mb-2': childComments.length === 0,
          })}
          onCancel={handleCancelAction}
          onSubmit={onCommentReply}
          error={
            createCommentFn.error?.message || 'An unexpected error occured.'
          }
          loading={createCommentFn.loading}
          submitText="Reply"
          autoFocus
        />
      )}

      {childComments.length > 0 && (
        <button
          className="mb-1 ml-2 text-sm cursor-pointer inline-flex items-center gap-1"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? (
            <>
              <FaRegMinusSquare />
              <span>Hide Replies</span>
            </>
          ) : (
            <>
              <FaRegPlusSquare />
              <span>Show Replies ({childComments.length})</span>
            </>
          )}
        </button>
      )}

      {childComments.length > 0 && showReplies && (
        <div className="pl-2 ml-3 relative">
          <div className="absolute top-0 left-0 bottom-0 bg-gray-300 mb-2">
            <div className="h-full w-[1px]"></div>
          </div>
          <CommentList comments={childComments} />
        </div>
      )}
    </>
  );
};

export default Comment;
