'use client';
import { getTimePassedFromDate } from '@/lib/DateFormat';
import { deleteComment, editComment } from '@/utils/supabase/actions/pastes';
import { Comment as PrismaComment } from '@prisma/client';
import classNames from 'classnames';
import { useState } from 'react';
import { FaEdit, FaRegMinusSquare, FaRegPlusSquare } from 'react-icons/fa';
import { FaRegThumbsUp, FaReply } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import CodeEditor from '../CodeEditor/CodeEditor';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentProps {
  comment: PrismaComment;
  comments: PrismaComment[];
  pasteId: string;
}

enum CommentAction {
  NONE,
  REPLY,
  EDIT,
  DELETE,
}

/**
 * Check the time difference between two dates in seconds time format
 * @param {Date} start - The starting date
 * @param {Date} end - The ending date
 * @returns {number} Time difference between the two given dates in seconds
 */
const timeDifference = (start: Date, end: Date): number => {
  return (end.getTime() - start.getTime()) / 1000;
};

const Comment = ({ comment, comments, pasteId }: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [commentAction, setCommentAction] = useState(CommentAction.NONE);

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

  return (
    <>
      <div
        className={classNames('p-4 bg-gray-100 rounded-md', {
          'mb-2': comment.childrenCount === 0,
          'mb-1': comment.childrenCount > 0,
        })}
      >
        <div className="flex gap-2 mb-2">
          <span className="grow font-medium text-ellipsis">
            {comment.userId}
          </span>
          <span className="flex items-center gap-1 mb-auto">
            {timeDifference(comment.createdAt, comment.updatedAt) > 1 && (
              <span className="text-gray-700">(Edit)</span>
            )}
            <span>{getTimePassedFromDate(comment.createdAt)}</span>
          </span>
        </div>

        {commentAction === CommentAction.EDIT ? (
          <form
            className="flex flex-col justify-center items-end gap-1 mb-2 sm:mb-0"
            onSubmit={handleCancelAction}
          >
            <input
              type="text"
              name="commentId"
              value={comment.id}
              hidden
              readOnly
            />
            <CodeEditor
              className="bg-white grow min-h-24 w-full text-base"
              name="message"
              inputMode="text"
              defaultValue={comment.message}
              minLength={4}
              maxLength={1024}
              autoFocus
              required
            />
            <div className="flex items-center gap-1">
              <div
                className="btn btn-custom btn-error sm:w-24 cursor-pointer"
                onClick={handleCancelAction}
              >
                Cancel
              </div>

              <button
                type="submit"
                className="btn btn-custom btn-primary sm:w-24"
                formAction={editComment}
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-4">{comment.message}</div>
        )}

        {commentAction === CommentAction.DELETE && (
          <div className="flex flex-col mb-2 text-sm bg-red-300 p-2 rounded-md sm:px-4 min-[450px]:flex-row">
            <div className="flex items-center mb-1 sm:mb-0 grow">
              <span>Do you want to delete this comment?</span>
            </div>
            <form
              className="flex justify-end items-center font-medium"
              onSubmit={handleCancelAction}
            >
              <input
                type="text"
                name="commentId"
                value={comment.id}
                hidden
                readOnly
              />
              <div
                className="rounded-md hover:bg-red-200 px-2 py-1.5 cursor-pointer"
                onClick={handleCancelAction}
              >
                No
              </div>
              <button
                className="rounded-md hover:bg-red-200 px-2 py-1.5"
                formAction={deleteComment}
              >
                Yes
              </button>
            </form>
          </div>
        )}

        <div className="flex gap-3 items-center">
          <button className="inline-flex justify-center items-center gap-1 text-gray-900 hover:text-gray-700">
            <FaRegThumbsUp />
            <span>{comment.likesCount}</span>
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
            'mb-2': comment.childrenCount === 0,
          })}
          parentId={comment.id}
          pasteId={comment.pasteId}
          showCancel
          onCancel={handleCancelAction}
          onSubmit={handleCancelAction}
        />
      )}

      {comment.childrenCount > 0 && (
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
              <span>Show Replies ({comment.childrenCount})</span>
            </>
          )}
        </button>
      )}

      {comment.childrenCount > 0 && showReplies && (
        <div className="pl-2 ml-3 relative">
          <div className="absolute top-0 left-0 bottom-0 bg-gray-300 mb-2">
            <div className="h-full w-[1px]"></div>
          </div>
          <CommentList
            comments={comments}
            parent={comment.id}
            pasteId={pasteId}
          />
        </div>
      )}
    </>
  );
};

export default Comment;
