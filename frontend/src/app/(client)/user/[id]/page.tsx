import Avatar from '@/components/Avatar';
import { MemoizedLabel } from '@/components/Label';
import { getFormattedDate } from '@/lib/DateFormat';
import logger from '@/lib/logging/server';
import OneLightModified from '@/lib/prism-themes/OneLightModified';
import getUser from '@/utils/services/user';
import { updateUserInfo } from '@/utils/supabase/actions/user';
import { createClient } from '@/utils/supabase/server';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { Prism } from 'react-syntax-highlighter';
import styles from '../../client.module.css';
import UploadProfile from './UploadProfile';

interface UserProps {
  params: { id: string };
}

const User = async ({ params }: UserProps) => {
  const supabase = createClient();
  const { authUser, dbUser } = await getUser(supabase, params.id);
  const owner = authUser ? authUser.id === params.id : false;

  const { data, error } = await supabase.rpc('get_user_pastes', {
    user_id: params.id,
  });

  if (error) {
    logger.error(`Get user paste error: ${error}`);
  }

  const pastes = data as {
    id: string;
    bodyoverview: string;
    title: string;
    syntax: string;
    createdat: string;
    likes_count: number;
    comments_count: number;
  }[];

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        {dbUser ? (
          <>
            <div className="my-8 text-2xl font-semibold">
              {owner
                ? 'My profile'
                : `${dbUser.name.split(/\s+/)[0]}'s profile`}
            </div>
            <div className="flex flex-col items-center px-4 py-2">
              <Avatar src={dbUser.avatar} parentClassName="size-40" />

              <div className="mt-3 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1 text-center text-xl font-medium text-gray-800 lg:text-2xl">
                  <span>{dbUser.name}</span>
                  {dbUser.verified && (
                    <span className="text-primary tooltip" data-tip="Verified">
                      <MdVerified aria-label="Verified" />
                    </span>
                  )}
                </div>

                {dbUser.bio && (
                  <div className="mt-1 text-wrap text-center text-base text-gray-600">
                    {dbUser.bio}
                  </div>
                )}
              </div>

              {owner && (
                <UploadProfile
                  className="mt-3"
                  text={
                    dbUser!.avatar
                      ? 'Change profile picture'
                      : 'Upload profile picture'
                  }
                />
              )}

              <div className="mt-3 flex w-full items-center justify-center gap-6">
                <div className="flex flex-col items-center text-lg text-gray-700">
                  <div className="text-center font-medium">
                    {dbUser.pastes_count}
                  </div>
                  <span className="text-sm">Pastes</span>
                </div>

                <div className="flex flex-col items-center text-end text-gray-700">
                  <div className="text-center text-lg font-medium">
                    {getFormattedDate(dbUser.created_at)}
                  </div>
                  <span className="text-sm">Joined</span>
                </div>

                <div className="flex flex-col items-center text-start text-gray-700">
                  <div className="text-center text-lg font-medium">
                    {dbUser.comments_count}
                  </div>
                  <span className="text-sm">Comments</span>
                </div>
              </div>
            </div>

            {owner && (
              <div className="mt-2 md:mt-4">
                <div className="text-lg font-medium">Personal</div>
                <div className="divider mb-1 mt-1"></div>
                <form action={updateUserInfo}>
                  <MemoizedLabel
                    primaryText="Full name"
                    topRight="4 character minimum"
                    required
                  >
                    <input
                      className="input w-full"
                      type="text"
                      name="name"
                      inputMode="text"
                      placeholder="John Doe"
                      defaultValue={dbUser.name}
                      minLength={4}
                      maxLength={50}
                      required
                    />
                  </MemoizedLabel>

                  <MemoizedLabel
                    className="mt-3"
                    primaryText="Email address"
                    required
                  >
                    <input
                      className="input w-full"
                      type="email"
                      value={authUser!.email}
                      readOnly
                    />
                  </MemoizedLabel>

                  <MemoizedLabel className="mt-3" primaryText="Bio">
                    <input
                      className="input w-full"
                      placeholder="Lorem ipsum dolor sit amet"
                      name="bio"
                      inputMode="text"
                      type="text"
                      defaultValue={dbUser.bio || ''}
                      maxLength={150}
                    />
                  </MemoizedLabel>

                  <div className="mt-6 flex w-full justify-end">
                    <button
                      type="submit"
                      className="btn btn-accent btn-custom text-sm font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-2">
              <div className="text-lg font-medium">Pastes</div>
              <div className="divider mb-1 mt-1"></div>

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
                            <div className="flex items-center justify-center">
                              <Avatar
                                src={dbUser.avatar}
                                parentClassName="size-7"
                              />

                              <div className="ml-2">
                                <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                                  <span>{dbUser.name}</span>
                                  {dbUser.verified && (
                                    <span className="text-primary">
                                      <MdVerified data-tooltip="Verified" />
                                    </span>
                                  )}
                                </div>
                              </div>
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
                              'relative overflow-hidden rounded-md border border-solid border-black border-opacity-10 bg-[#fafafa]'
                            )}
                          >
                            <Prism
                              language={paste.syntax}
                              style={OneLightModified}
                            >
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
                <div className="flex items-center justify-center py-8 text-gray-700">
                  No pastes found!
                </div>
              )}
            </div>
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
              No user found with the id{' '}
              <span className="font-medium">{params.id}</span>!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
