'use client';
import { useAsyncFn } from '@/hooks/useAsync';
import { usePaste } from '@/hooks/usePaste';
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
import {
  FaEdit,
  FaRegMinusSquare,
  FaRegPlusSquare,
  FaThumbsUp,
} from 'react-icons/fa';
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
  } = usePaste();
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
        className={classNames('rounded-md bg-gray-100 p-4', {
          'mb-2': childComments.length === 0,
          'mb-1': childComments.length > 0,
        })}
      >
        <div className="mb-2 flex gap-2">
          <span className="grow text-ellipsis font-medium">
            {comment.user.id}
          </span>
          <span className="mb-auto flex items-center gap-1">
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
              updateCommentFn.error
                ? updateCommentFn.error.message ||
                  'An unexpected error occured.'
                : null
            }
            autoFocus
          />
        ) : (
          <div className="mb-4">{comment.message}</div>
        )}

        {commentAction === CommentAction.DELETE && (
          <div className="mb-2 flex flex-col rounded-md bg-red-300 p-2 text-sm min-[450px]:flex-row sm:px-4">
            <div className="mb-1 flex grow items-center sm:mb-0">
              <span>Do you want to delete this comment?</span>
            </div>
            <div className="flex items-center justify-end font-medium">
              <input
                type="text"
                name="commentId"
                value={comment.id}
                hidden
                readOnly
              />
              <button
                className="cursor-pointer rounded-md px-2 py-1.5 hover:bg-red-200"
                onClick={handleCancelAction}
              >
                No
              </button>
              <button
                className="rounded-md px-2 py-1.5 hover:bg-red-200"
                onClick={onCommentDelete}
              >
                Yes
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center justify-center gap-1 text-gray-900 hover:text-gray-700"
            disabled={toggleCommentLikeFn.loading}
            onClick={onToggleCommentLike}
          >
            {comment.likedByMe ? <FaThumbsUp /> : <FaRegThumbsUp />}
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
          className="mb-1 ml-2 inline-flex cursor-pointer items-center gap-1 text-sm"
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
        <div className="relative ml-3 pl-2">
          <div className="absolute bottom-0 left-0 top-0 mb-2 bg-gray-300">
            <div className="h-full w-[1px]"></div>
          </div>
          <CommentList comments={childComments} />
        </div>
      )}
    </>
  );
};

export default Comment;
