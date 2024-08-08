'use client';
import { getNameFromCode } from '@/components/CodeView/languages';
import CommentForm from '@/components/CommentList/CommentForm';
import CommentList from '@/components/CommentList/CommentList';
import Tag from '@/components/TagInput/Tag';
import { useAsyncFn } from '@/hooks/useAsync';
import { usePost } from '@/hooks/usePaste';
import Copy from '@/icons/Copy';
import Download from '@/icons/Download';
import Edit from '@/icons/Edit';
import HorizontalMenu from '@/icons/HorizontalMenu';
import { getFormattedDate } from '@/lib/DateFormat';
import { getLinesCount, getSize } from '@/lib/PasteHelper';
import { createNewComment } from '@/utils/services/comment';
import { CommentData, togglePasteLike } from '@/utils/services/paste';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { BiDuplicate } from 'react-icons/bi';
import { FaRegComment, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlinePrint, MdVerified } from 'react-icons/md';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import codeStyles from '../../client.module.css';
import styles from './page.module.css';

export default async function ViewPaste() {
  const {
    authUser,
    paste,
    rootComments,
    createLocalComment,
    toggleLocalPasteLike,
  } = usePost();
  const createCommentFn = useAsyncFn(createNewComment);
  const togglePasteLikeFn = useAsyncFn(togglePasteLike);

  const bodySize = useMemo(() => getSize(paste?.body || ''), [paste?.body]);
  const bodyLines = useMemo(
    () => getLinesCount(paste?.body || ''),
    [paste?.body]
  );

  const onNewComment = async (message: string) => {
    return createCommentFn
      .execute({ pasteId: paste!.id, message, parentId: null })
      .then((comment: CommentData) => {
        createLocalComment(comment);
      });
  };

  function onTogglePasteLike() {
    return togglePasteLikeFn
      .execute({ id: paste!.id })
      .then(({ addLike }: { addLike: boolean }) =>
        toggleLocalPasteLike(addLike)
      );
  }

  return (
    <div className="size-full">
      <div className={classNames(codeStyles.container)}>
        {paste ? (
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
                  className="size-10 max-w-full rounded-full"
                  alt="Profile"
                  src={paste.user.avatar || '/img/avatar.svg'}
                  width={60}
                  height={60}
                />
              </div>
              <div className="ml-3">
                <div className="flex items-center gap-1 text-gray-800 font-medium text-lg">
                  <span>{paste.user.name}</span>
                  {paste.user.verified && (
                    <span className="text-primary tooltip" data-tip="Verified">
                      <MdVerified data-tooltip="Verified" />
                    </span>
                  )}
                </div>
                <div className="text-gray-600 text-sm">
                  <span>{bodyLines} lines</span>
                  <span className="px-1">·</span>
                  <span>{getFormattedDate(paste.createdAt)}</span>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                styles.bodyContainer,
                'my-4 rounded-md relative'
              )}
            >
              <div
                className={classNames(
                  styles.topBar,
                  'flex items-center justify-between text-sm gap-1'
                )}
              >
                <div className="flex items-center text-sm text-[#636c76]">
                  <span className="bg-slate-200 text-[#1f2328] rounded-md py-1 px-3 border-solid border border-slate-300">
                    {getNameFromCode(paste.syntax)}
                  </span>
                  <span className="ml-2 text-xs">{bodySize}</span>
                  <span className="px-1 min-[370px]:px-2">·</span>
                  <button
                    className={classNames(
                      styles.actionButton,
                      'mr-1 min-[370px]:mr-2'
                    )}
                    disabled={togglePasteLikeFn.loading}
                    onClick={onTogglePasteLike}
                  >
                    {paste.likedByMe ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    <span>{paste._count.likes}</span>
                  </button>
                  <Link
                    href="#comments"
                    className={classNames(
                      styles.actionButton,
                      'cursor-pointer'
                    )}
                  >
                    <FaRegComment />
                    <span>{rootComments ? rootComments.length : 0}</span>
                  </Link>
                </div>

                <div className="hidden min-[700px]:block">
                  <div className="flex justify-center items-center gap-2">
                    <div
                      className={classNames(styles.buttons, 'text-[#24292f]')}
                    >
                      <a
                        href={paste.bodyUrl}
                        className="px-2 !w-auto"
                        target="_blank"
                      >
                        Raw
                      </a>
                      <button
                        className="text-[#636c76]"
                        data-tooltip="Copy raw paste"
                      >
                        <Copy />
                      </button>
                      <button
                        className="text-[#636c76]"
                        data-tooltip="Download raw file"
                      >
                        <Download />
                      </button>
                    </div>

                    {authUser ? (
                      <>
                        <div
                          className={classNames(
                            styles.buttons,
                            'text-[#24292f]'
                          )}
                        >
                          <button
                            className="text-[#636c76]"
                            data-tooltip="Clone this paste"
                          >
                            <BiDuplicate className="size-4 font-bold" />
                          </button>
                          <button
                            className="text-[#636c76]"
                            data-tooltip="Print this paste"
                          >
                            <MdOutlinePrint className="size-4 font-bold" />
                          </button>
                        </div>

                        <div
                          className={classNames(
                            styles.buttons,
                            'text-[#24292f]'
                          )}
                        >
                          <button
                            className="text-[#636c76]"
                            data-tooltip="Edit this paste"
                          >
                            <Edit />
                          </button>
                          <button
                            className="text-[#636c76]"
                            data-tooltip="Delete this paste"
                          >
                            <MdDeleteOutline className="size-4 font-medium text-[#d1242f]" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={classNames(styles.buttons)}>
                        <button
                          className="text-[#636c76] !border-transparent"
                          data-tooltip="Print this paste"
                        >
                          <MdOutlinePrint className="size-5 font-bold" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="block min-[700px]:hidden">
                  <div className={classNames(styles.buttons)}>
                    <button className="text-[#636c76] !border-transparent">
                      <HorizontalMenu />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className={classNames(
                  'bg-white p-2 px-4 rounded-b-[6px]',
                  codeStyles.codeMockup
                )}
              >
                <Prism
                  language={paste.syntax}
                  style={coy}
                  customStyle={{ background: 'transparent' }}
                  useInlineStyles
                  showLineNumbers
                >
                  {paste.body}
                </Prism>
              </div>
            </div>

            {paste.tags && (
              <div className="mb-4">
                {paste.tags.map((tag, index) => (
                  <Tag
                    className={classNames('my-1', {
                      'ml-1': index > 0,
                    })}
                    key={tag}
                    value={tag}
                  />
                ))}
              </div>
            )}

            <div id="comments" className="text-xl font-semibold mb-3">
              Comments
            </div>
            <CommentForm
              className="mb-2"
              onSubmit={onNewComment}
              loading={createCommentFn.loading}
              error={
                createCommentFn.error
                  ? createCommentFn.error.message ||
                    'An unexpected error occured.'
                  : null
              }
            />
            {rootComments ? (
              <CommentList comments={rootComments} />
            ) : (
              <div className="text-gray-700">No comments found!</div>
            )}
          </>
        ) : (
          <div className="flex items-center flex-col h-full py-10 gap-1">
            <div className="text-2xl font-bold">Not Found</div>
            <span className="text-gray-700">
              This paste is no longer available. It has either been removed by
              its creator, or removed by one of the SecurePaste staff.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
