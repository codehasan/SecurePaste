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
import { constructUrl } from '@/lib/RedirectHelper';
import { CommentData } from '@/utils/services/paste';
import { toggleLike } from '@/utils/supabase/actions/pastes';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useRef, useTransition } from 'react';
import { BiDuplicate } from 'react-icons/bi';
import { FaRegComment, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlinePrint, MdVerified } from 'react-icons/md';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 } from 'uuid';
import codeStyles from '../../client.module.css';
import styles from './page.module.css';

const ViewPaste = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    authUser,
    paste,
    rootComments,
    createLocalComment,
    toggleLocalPasteLike,
  } = usePaste();
  const { showToast } = useToast();
  const [pendingPasteLike, startPasteLikeTransition] = useTransition();
  const [pendingNewComment, startNewCommentTransition] = useTransition();
  const codeViewerRef = useRef(null);

  const bodySize = useMemo(() => getSize(paste?.body || ''), [paste?.body]);
  const bodyLines = useMemo(
    () => getLinesCount(paste?.body || ''),
    [paste?.body]
  );

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

  const onClonePaste = () => {
    if (paste && authUser) {
      router.push(pathname + '/clone');
    }
  };

  const onPrintPaste = () => {};

  const onEditPaste = () => {
    if (paste && authUser) {
      router.push(pathname + '/edit');
    }
  };

  const onDeletePaste = () => {};

  const onNewComment = async (message: string) => {
    if (authUser) {
      startNewCommentTransition(async () => {
        try {
          const comment: CommentData = {
            id: v4(),
            likedByMe: false,
            message,
            owner: true,
            parentId: null,
            user: {
              avatar: null,
              id: authUser.id,
              name: 'Test Account',
              verified: false,
            },
            updatedAt: new Date(),
            createdAt: new Date(),
            _count: {
              likes: 0,
            },
          };

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
            <div className="mb-4 mt-8 text-2xl font-semibold">
              {paste.title}
            </div>

            <div className="mb-4 flex items-center">
              <Avatar src={paste.user.avatar} parentClassName="size-10" />

              <div className="ml-3">
                <div className="flex items-center gap-1 text-lg font-medium text-gray-800">
                  <span>{paste.user.name}</span>
                  {paste.user.verified && (
                    <span className="text-primary tooltip" data-tip="Verified">
                      <MdVerified data-tooltip="Verified" />
                    </span>
                  )}
                </div>
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

                    {paste.owner ? (
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
                            onClick={onClonePaste}
                          >
                            <BiDuplicate className="size-4 font-bold" />
                          </button>
                          <button
                            className="text-[#636c76]"
                            data-tooltip="Print this paste"
                            onClick={onPrintPaste}
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
                            onClick={onEditPaste}
                          >
                            <Edit />
                          </button>
                          <button
                            className="text-[#636c76]"
                            data-tooltip="Delete this paste"
                            onClick={onDeletePaste}
                          >
                            <MdDeleteOutline className="size-4 font-medium text-[#d1242f]" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={classNames(styles.buttons)}>
                        <button
                          className="!border-transparent text-[#636c76]"
                          data-tooltip="Print this paste"
                          onClick={onPrintPaste}
                        >
                          <MdOutlinePrint className="size-5 font-bold" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="block min-[700px]:hidden">
                  <div className={classNames(styles.buttons)}>
                    <button className="!border-transparent text-[#636c76]">
                      <HorizontalMenu />
                    </button>
                  </div>
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
                  style={coy}
                  customStyle={{ background: 'transparent' }}
                  useInlineStyles
                  showLineNumbers
                >
                  {'The fuck\nNope'}
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

            <div id="comments" className="mb-3 text-xl font-semibold">
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
          </>
        ) : (
          <div className="flex h-full flex-col items-center gap-1 py-10">
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
};

export default ViewPaste;
