import Avatar from '@/components/Avatar';
import { getFormattedDate } from '@/lib/DateFormat';
import logger from '@/lib/logging/server';
import OneLightModified from '@/lib/prism-themes/OneLightModified';
import { createClient } from '@/utils/supabase/server';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { Prism } from 'react-syntax-highlighter';
import styles from '../client.module.css';

interface PasteData {
  id: string;
  bodyoverview: string;
  title: string;
  syntax: string;
  createdat: string;
  likes_count: number;
  comments_count: number;
  user_id: string;
  user_name: string;
  user_verified: boolean;
  user_avatar: string | null;
}

interface SearchPasteParams {
  searchParams: {
    q: string;
  };
}

const SearchPaste = async ({ searchParams }: SearchPasteParams) => {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    'search_paste',
    {
      query_text: searchParams.q,
    },
    { get: true }
  );
  const pastes = data as PasteData[];

  if (error) {
    logger.error(`Search paste error: ${error}`);
  }

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        {pastes && !error ? (
          <div className="size-full">
            {pastes.map((paste, index) => {
              return (
                <Link
                  href={`/paste/${paste.id}`}
                  className="mt-8 flex w-full flex-col items-center"
                  key={index}
                >
                  <div
                    className={classNames(
                      styles.pasteView,
                      'w-full cursor-pointer'
                    )}
                  >
                    <div
                      className={classNames(
                        styles.pasteBody,
                        'flex items-center'
                      )}
                    >
                      <Link
                        href={`/user/${paste.user_id}`}
                        className="flex items-center justify-center hover:underline"
                      >
                        <Avatar
                          src={paste.user_avatar}
                          parentClassName="size-7"
                        />

                        <div className="ml-2">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                            <span>{paste.user_name}</span>
                            {paste.user_verified && (
                              <span className="text-primary">
                                <MdVerified data-tooltip="Verified" />
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div
                      className={classNames(
                        styles.pasteBody,
                        'card-title items-start justify-start'
                      )}
                    >
                      {paste.title}
                    </div>

                    <div
                      className={classNames(
                        styles.pasteOverview,
                        'relative overflow-hidden rounded-md border border-solid border-black border-opacity-10 bg-[#fafafa]'
                      )}
                    >
                      <Prism language={paste.syntax} style={OneLightModified}>
                        {paste.bodyoverview}
                      </Prism>
                    </div>

                    <div
                      className={classNames(
                        styles.pasteBody,
                        'flex w-full items-center gap-4 text-sm text-gray-500'
                      )}
                    >
                      <div>{getFormattedDate(paste.createdat)}</div>
                      <div className="flex items-center gap-1">
                        <FaThumbsUp />
                        <span>{paste.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaComment />
                        <span>{paste.comments_count}</span>
                      </div>
                    </div>
                  </div>

                  {index < pastes.length - 1 && (
                    <div
                      id="divider"
                      className="mt-8 h-0 w-full border-b border-solid border-b-[#f2f2f2]"
                    ></div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="h-fill flex flex-col items-center justify-center gap-4">
            <Image
              width="200"
              height="200"
              src="/img/content-unavailable.png"
              alt="Unavailable"
              className="size-28"
            />
            <span className="text-gray-700">No pastes found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPaste;
