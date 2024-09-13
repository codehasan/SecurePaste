import Avatar from '@/components/Avatar';
import { getFormattedDate } from '@/lib/DateFormat';
import { getAllPublicPastes } from '@/utils/services/paste';
import classNames from 'classnames';
import Link from 'next/link';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import styles from './client.module.css';
import { Prism } from 'react-syntax-highlighter';
import OneLightModified from '@/lib/prism-themes/OneLightModified';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const pastes = await getAllPublicPastes();

  const supabase = createClient();
  let { data, error } = await supabase.rpc('paste_search', {
    topic: 'Deez Nuts',
  });
  if (error) console.error(error);
  else console.log(data);

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        {pastes ? (
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
                        href={`/user/${paste.user.id}`}
                        className="flex items-center justify-center"
                      >
                        <Avatar
                          src={paste.user.avatar}
                          parentClassName="size-7"
                        />
                      </Link>

                      <div className="ml-2">
                        <Link href={`/user/${paste.user.id}`}>
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                            <span>{paste.user.name}</span>
                            {paste.user.verified && (
                              <span className="text-primary">
                                <MdVerified data-tooltip="Verified" />
                              </span>
                            )}
                          </div>
                        </Link>
                      </div>
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
                        'relative overflow-hidden rounded-md bg-[#fafafa]'
                      )}
                    >
                      <Prism language={paste.syntax} style={OneLightModified}>
                        {paste.bodyOverview}
                      </Prism>
                    </div>

                    <div
                      className={classNames(
                        styles.pasteBody,
                        'flex w-full items-center gap-4 text-sm text-gray-500'
                      )}
                    >
                      <div>{getFormattedDate(paste.createdAt)}</div>
                      <div className="flex items-center gap-1">
                        <FaThumbsUp />
                        <span>{paste._count.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaComment />
                        <span>{paste._count.comments}</span>
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
}
