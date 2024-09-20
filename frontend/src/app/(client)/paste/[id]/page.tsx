'use client';

import Avatar from '@/components/Avatar';
import { getNameFromCode } from '@/components/CodeView/languages';
import CommentForm from '@/components/CommentList/CommentForm';
import CommentList from '@/components/CommentList/CommentList';
import Tag from '@/components/TagInput/Tag';
import { usePaste } from '@/hooks/usePaste';
import { ToastDuration, useToast } from '@/hooks/useToast';
import Copy from '@/icons/Copy';
import Download from '@/icons/Download';
import Edit from '@/icons/Edit';
import HorizontalMenu from '@/icons/HorizontalMenu';
import { getFormattedDate } from '@/lib/DateFormat';
import { logError } from '@/lib/logging/client';
import { getLinesCount, getSize } from '@/lib/PasteHelper';
import OneLightModified from '@/lib/prism-themes/OneLightModified';
import { createNewComment } from '@/utils/supabase/actions/comments';
import { deletePaste, toggleLike } from '@/utils/supabase/actions/pastes';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useRef, useState, useTransition } from 'react';
import { BiDuplicate } from 'react-icons/bi';
import { FaRegComment, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import {
  MdDeleteOutline,
  MdOpenInNew,
  MdOutlinePrint,
  MdVerified,
} from 'react-icons/md';
import { Prism } from 'react-syntax-highlighter';
import codeStyles from '../../client.module.css';
import styles from './page.module.css';
import Image from 'next/image';

interface PasteProps {
  params: { id: string };
}

const ViewPaste = ({ params }: PasteProps) => {
  const router = useRouter();
  const {
    authUser,
    paste,
    rootComments,
    createLocalComment,
    toggleLocalPasteLike,
  } = usePaste();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingPasteLike, startPasteLikeTransition] = useTransition();
  const [pendingNewComment, startNewCommentTransition] = useTransition();
  const [pendingPasteDeletion, startPasteDeletionTransition] = useTransition();
  const pasteDeleteDialogRef = useRef<HTMLDialogElement>(null);
  const bodySize = useMemo(() => getSize(paste?.body || ''), [paste?.body]);
  const bodyLines = useMemo(
    () => getLinesCount(paste?.body || ''),
    [paste?.body]
  );

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const openDropdown = () => {
    setDropdownOpen(true);
  };

  const copyPasteBody = async () => {
    if (paste) {
      try {
        if (navigator?.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(paste.body);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = paste.body;

          // Apply styles to make it invisible
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          textarea.style.left = '-9999px';
          textarea.style.top = '-9999px';

          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast('Paste copied', 'info', ToastDuration.short);
      } catch (error) {
        logError(`Unexpected copy paste error: ${JSON.stringify(error)}`);
        showToast('Unable to copy paste content.', 'error');
      }
    }
  };

  const downloadPaste = async () => {
    if (paste) {
      try {
        const blob = new Blob([paste.body], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${paste.title}.txt`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        logError(`Unexpected download paste error: ${JSON.stringify(error)}`);
        showToast('Unable to download paste.', 'error');
      }
    }
  };

  const onDeletePaste = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const confirmation = formData.get('confirmation') as string;

    if (confirmation !== 'CONFIRM') {
      pasteDeleteDialogRef.current?.close();
      showToast('Invalid confirmation text', 'error');
      return;
    }

    if (paste && authUser && paste.user.id === authUser.id) {
      startPasteDeletionTransition(async () => {
        try {
          await deletePaste(paste.id);
          router.push(`/user/${authUser.id}/pastes`);
        } catch (e) {
          if (e instanceof Error) {
            showToast(e.message, 'error');
          } else {
            logError(`Unexpected new comment error: ${JSON.stringify(e)}`);
            showToast('An unexpected error occured.', 'error');
          }
        }
      });
    } else {
      pasteDeleteDialogRef.current?.close();
      showToast('Something went wrong', 'error');
    }
  };

  const onNewComment = async (message: string) => {
    if (paste && authUser && message) {
      startNewCommentTransition(async () => {
        try {
          const comment = await createNewComment({
            pasteId: paste.id,
            parentId: null,
            message,
            userId: authUser.id,
          });
          createLocalComment(comment);
        } catch (e) {
          if (e instanceof Error) {
            showToast(e.message, 'error');
          } else {
            logError(`Unexpected new comment error: ${JSON.stringify(e)}`);
            showToast('An unexpected error occured.', 'error');
          }
        }
      });
    }
  };

  const onTogglePasteLike = () => {
    if (paste && authUser) {
      startPasteLikeTransition(async () => {
        try {
          const addLike = !paste.likedByMe;

          await toggleLike(authUser.id, paste.id, addLike);
          toggleLocalPasteLike(addLike);
        } catch (e) {
          if (e instanceof Error) {
            showToast(e.message, 'error');
          } else {
            logError(`Unexpected paste like error: ${JSON.stringify(e)}`);
            showToast('An unexpected error occured.', 'error');
          }
        }
      });
    }
  };

  return (
    <div className="size-full">
      <div className={classNames(codeStyles.container)}>
        {paste ? (
          <>
            <div className="mb-4 mt-4 text-2xl font-semibold sm:mt-8">
              {paste.title}
            </div>

            <div className="mb-4 flex items-center">
              <Link
                href={`/user/${paste.user.id}`}
                className="flex items-center justify-center"
              >
                <Avatar src={paste.user.avatar} parentClassName="size-10" />
              </Link>

              <div className="ml-3">
                <Link href={`/user/${paste.user.id}`}>
                  <div className="flex items-center gap-1 text-lg font-medium text-gray-800">
                    <span>{paste.user.name}</span>
                    {paste.user.verified && (
                      <span
                        className="text-primary tooltip"
                        data-tip="Verified"
                      >
                        <MdVerified data-tooltip="Verified" />
                      </span>
                    )}
                  </div>
                </Link>
                <div className="text-sm text-gray-600">
                  <span>{bodyLines} lines</span>
                  <span className="px-1">·</span>
                  <span>{getFormattedDate(paste.createdAt)}</span>
                </div>
              </div>
            </div>

            <div
              className={classNames(
                styles.bodyContainer,
                'relative my-4 rounded-md'
              )}
            >
              <div
                className={classNames(
                  styles.topBar,
                  'flex items-center justify-between gap-1 text-sm'
                )}
              >
                <div className="flex items-center text-sm text-[#636c76]">
                  <span className="rounded-md border border-solid border-slate-300 bg-slate-200 px-3 py-1 text-[#1f2328]">
                    {getNameFromCode(paste.syntax)}
                  </span>
                  <span className="ml-2 text-xs">{bodySize}</span>
                  <span className="px-1 min-[370px]:px-2">·</span>
                  <button
                    className={classNames(
                      styles.actionButton,
                      'mr-1 min-[370px]:mr-2',
                      {
                        'btn-disabled': pendingPasteLike,
                      }
                    )}
                    disabled={pendingPasteLike}
                    onClick={onTogglePasteLike}
                  >
                    {paste.likedByMe ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    {pendingPasteLike ? (
                      <span className="loading loading-spinner my-0.5 w-4"></span>
                    ) : (
                      <span>{paste._count.likes}</span>
                    )}
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
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={classNames(styles.buttons, 'text-[#24292f]')}
                    >
                      <a
                        href={paste.bodyUrl}
                        className="!w-auto px-2"
                        target="_blank"
                      >
                        Raw
                      </a>
                      <button
                        className="text-[#636c76]"
                        data-tooltip="Copy raw paste"
                        onClick={copyPasteBody}
                      >
                        <Copy />
                      </button>
                      <button
                        className="text-[#636c76]"
                        data-tooltip="Download raw file"
                        onClick={downloadPaste}
                      >
                        <Download />
                      </button>
                    </div>

                    {authUser && (
                      <div
                        className={classNames(styles.buttons, 'text-[#24292f]')}
                      >
                        <Link
                          className="text-[#636c76]"
                          data-tooltip="Clone this paste"
                          href="clone"
                        >
                          <BiDuplicate className="size-4 font-bold" />
                        </Link>
                        <Link
                          className="text-[#636c76]"
                          data-tooltip="Print this paste"
                          href="print"
                        >
                          <MdOutlinePrint className="size-4 font-bold" />
                        </Link>
                      </div>
                    )}

                    {paste.owner && (
                      <div
                        className={classNames(styles.buttons, 'text-[#24292f]')}
                      >
                        <Link
                          className="text-[#636c76]"
                          data-tooltip="Edit this paste"
                          href="edit"
                        >
                          <Edit />
                        </Link>
                        <button
                          className="text-[#636c76]"
                          data-tooltip="Delete this paste"
                          onClick={() =>
                            pasteDeleteDialogRef.current?.showModal()
                          }
                        >
                          <MdDeleteOutline className="size-4 font-medium text-[#d1242f]" />
                        </button>
                      </div>
                    )}

                    {!authUser && (
                      <div className={classNames(styles.buttons)}>
                        <Link
                          className="!border-transparent text-[#636c76]"
                          data-tooltip="Print this paste"
                          href="print"
                        >
                          <MdOutlinePrint className="size-5 font-bold" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="dropdown dropdown-end min-[700px]:hidden">
                  <div
                    tabIndex={0}
                    role="button"
                    className={classNames(styles.buttons)}
                    onClick={openDropdown}
                  >
                    <button className="!border-transparent text-[#636c76]">
                      <HorizontalMenu />
                    </button>
                  </div>

                  {dropdownOpen && (
                    <ul className="dropdown-content z-[10] w-48 rounded-md border border-solid border-black border-opacity-10 bg-white px-0 py-2 text-gray-700 shadow-lg">
                      <li>
                        <div className="px-4 py-[6px] text-xs font-semibold text-gray-600">
                          Raw paste content
                        </div>
                        <ul className="text-sm">
                          <li className="px-4 hover:bg-gray-100 active:bg-gray-200">
                            <button
                              className="flex w-full items-center justify-start gap-2 py-[6px]"
                              onClick={() => {
                                closeDropdown();
                                copyPasteBody();
                              }}
                            >
                              <Copy className="size-4 text-gray-500" />
                              <span>Copy</span>
                            </button>
                          </li>
                          <li className="px-4 hover:bg-gray-100 active:bg-gray-200">
                            <Link
                              className="flex w-full items-center justify-start gap-2 py-[6px]"
                              target="_blank"
                              href={paste.bodyUrl}
                            >
                              <MdOpenInNew className="size-4 text-gray-500" />
                              <span>View</span>
                            </Link>
                          </li>
                          <li className="px-4 hover:bg-gray-100 active:bg-gray-200">
                            <button
                              className="flex w-full items-center justify-start gap-2 py-[6px]"
                              onClick={() => {
                                closeDropdown();
                                downloadPaste();
                              }}
                            >
                              <Download className="size-4 text-gray-500" />
                              <span>Download</span>
                            </button>
                          </li>
                        </ul>
                      </li>

                      <li className="my-2 h-px w-full bg-[#d0d7deb3]"></li>

                      {authUser && (
                        <li className="px-4 hover:bg-gray-100 active:bg-gray-200">
                          <Link
                            href="clone"
                            className="flex w-full items-center justify-start gap-2 py-[6px]"
                          >
                            <BiDuplicate className="size-4 text-gray-500" />
                            <span>Clone</span>
                          </Link>
                        </li>
                      )}
                      <li className="px-4 hover:bg-gray-100 active:bg-gray-200">
                        <Link
                          href="print"
                          className="flex w-full items-center justify-start gap-2 py-[6px]"
                        >
                          <MdOutlinePrint className="size-4 text-gray-500" />
                          <span>Print</span>
                        </Link>
                      </li>

                      <li className="my-2 h-px w-full bg-[#d0d7deb3]"></li>

                      <li>
                        <div className="px-4 py-[6px] text-xs font-semibold text-gray-600">
                          Owner action
                        </div>
                        <ul className="text-sm">
                          <li className="px-4 hover:bg-gray-100 active:bg-gray-200">
                            <Link
                              className="flex w-full items-center justify-start gap-2 py-[6px]"
                              href="edit"
                            >
                              <Edit className="size-4 text-gray-500" />
                              <span>Edit</span>
                            </Link>
                          </li>
                          <li className="px-4 hover:bg-gray-100 active:bg-gray-200">
                            <button
                              className="flex w-full items-center justify-start gap-2 py-[6px] text-[#d1242a]"
                              onClick={() => {
                                closeDropdown();
                                pasteDeleteDialogRef.current?.showModal();
                              }}
                            >
                              <MdDeleteOutline className="size-4" />
                              <span>Delete</span>
                            </button>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <div
                className={classNames(
                  'rounded-b-[6px] bg-white py-2 pl-4',
                  codeStyles.codeMockup
                )}
              >
                <Prism
                  language={paste.syntax}
                  style={OneLightModified}
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

            <div id="comments" className="mb-3 text-lg font-semibold">
              Comments
            </div>
            <CommentForm
              className="mb-2"
              onSubmit={onNewComment}
              loading={pendingNewComment}
            />
            {rootComments ? (
              <CommentList comments={rootComments} />
            ) : (
              <div className="text-gray-700">No comments found!</div>
            )}

            <dialog
              id="paste-delete"
              ref={pasteDeleteDialogRef}
              className="modal modal-middle"
            >
              <div className="modal-box bg-white">
                <form method="dialog">
                  <button
                    disabled={pendingPasteDeletion}
                    className={classNames(
                      'btn btn-sm btn-circle btn-ghost absolute right-2 top-2',
                      {
                        'btn-disabled': pendingPasteDeletion,
                      }
                    )}
                  >
                    <IoClose className="size-5" />
                  </button>
                </form>

                <div>
                  <div className="flex flex-1 flex-col items-center justify-start gap-4 text-base">
                    <div className="flex w-full flex-wrap items-center pr-8 text-lg font-medium">
                      Delete paste
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="text-gray-700">
                        This will permanently delete the paste (
                        <span className="font-medium">{paste.id}</span>). Along
                        with all available data relating this paste, including
                        likes and comments.
                      </div>

                      <form
                        className="flex w-full flex-col gap-2"
                        onSubmit={onDeletePaste}
                      >
                        <span className="font-medium text-gray-700">
                          To confirm, type "CONFIRM" in the box below
                        </span>
                        <input
                          id="confirmation"
                          name="confirmation"
                          type="text"
                          minLength={1}
                          maxLength={7}
                          className="input h-auto min-h-0 w-full px-2 py-1.5"
                        />
                        <button
                          type="submit"
                          disabled={pendingPasteDeletion}
                          className={classNames(
                            'btn btn-custom btn-error w-full',
                            {
                              'btn-disabled': pendingPasteDeletion,
                            }
                          )}
                        >
                          {pendingPasteDeletion ? (
                            <span className="loading loading-spinner loading-md"></span>
                          ) : (
                            <span>Delete this paste</span>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              {!pendingPasteDeletion && (
                <form method="dialog" className="modal-backdrop">
                  <button className="cursor-default">close</button>
                </form>
              )}
            </dialog>
          </>
        ) : (
          <div className="h-fill flex flex-col items-center justify-center gap-4">
            <Image
              width="200"
              height="200"
              src="/img/content-unavailable.png"
              alt="Unavailable"
              className="size-28"
            />
            <span className="text-gray-700">
              No paste found with the id{' '}
              <span className="font-medium">{params.id}</span>!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPaste;
