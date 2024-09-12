import styles from '@/app/(client)/client.module.css';
import Avatar from '@/components/Avatar';
import { getFormattedDate } from '@/lib/DateFormat';
import { getUserComments } from '@/utils/services/comment';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { FaComment, FaThumbsUp } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';

interface UserProps {
  params: { id: string };
}

const UserComments = async ({ params }: UserProps) => {
  const comments = await getUserComments(params.id);

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        {comments ? (
          <div className="size-full">
            {comments.map((comment, index) => {
              return (
                <Link
                  href={`/paste/${comment.paste.id}`}
                  className="mt-6 flex w-full flex-col items-center"
                  key={index}
                >
                  <div className="flex w-full cursor-pointer flex-col gap-1">
                    <div className="flex items-center">
                      <Link
                        href={`/user/${comment.paste.user.id}`}
                        className="flex items-center justify-center"
                      >
                        <Avatar
                          src={comment.paste.user.avatar}
                          parentClassName="size-7"
                        />
                      </Link>

                      <div className="ml-2">
                        <Link href={`/user/${comment.paste.user.id}`}>
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                            <span>{comment.paste.user.name}</span>
                            {comment.paste.user.verified && (
                              <span className="text-primary">
                                <MdVerified data-tooltip="Verified" />
                              </span>
                            )}
                          </div>
                        </Link>
                        <div className="text-xs text-gray-600">
                          <span>
                            {getFormattedDate(comment.paste.createdAt)}
                          </span>
                          <span className="px-1">·</span>
                          <span>{comment.paste._count.likes} likes</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-title items-start justify-start">
                      {comment.paste.title}
                    </div>

                    {comment.parent && (
                      <div className="flex flex-col gap-1 border-l-[3px] border-solid border-gray-300 bg-gray-100 px-2 py-1">
                        <div className="flex items-center">
                          <Link
                            href={`/user/${comment.parent.user.id}`}
                            className="flex items-center justify-center"
                          >
                            <Avatar
                              src={comment.parent.user.avatar}
                              parentClassName="size-7"
                            />
                          </Link>

                          <div className="ml-2">
                            <Link href={`/user/${comment.parent.user.id}`}>
                              <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                                <span>{comment.parent.user.name}</span>
                                {comment.parent.user.verified && (
                                  <span className="text-primary">
                                    <MdVerified data-tooltip="Verified" />
                                  </span>
                                )}
                              </div>
                            </Link>
                            <div className="text-xs text-gray-600">
                              <span>
                                {getFormattedDate(comment.parent.createdAt)}
                              </span>
                              <span className="px-1">·</span>
                              <span>{comment.parent._count.likes} likes</span>
                            </div>
                          </div>
                        </div>

                        <span>{comment.parent.message}</span>
                      </div>
                    )}
                    <div
                      className={classNames(
                        { 'ml-2': comment.parent },
                        'flex flex-col gap-1 border-l-[3px] border-solid border-gray-300 bg-gray-100 px-2 py-1'
                      )}
                    >
                      <div className="flex items-center">
                        <Link
                          href={`/user/${comment.user.id}`}
                          className="flex items-center justify-center"
                        >
                          <Avatar
                            src={comment.user.avatar}
                            parentClassName="size-7"
                          />
                        </Link>

                        <div className="ml-2">
                          <Link href={`/user/${comment.user.id}`}>
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
                              <span>{comment.user.name}</span>
                              {comment.user.verified && (
                                <span className="text-primary">
                                  <MdVerified data-tooltip="Verified" />
                                </span>
                              )}
                            </div>
                          </Link>
                          <div className="text-xs text-gray-600">
                            <span>{getFormattedDate(comment.createdAt)}</span>
                            <span className="px-1">·</span>
                            <span>{comment._count.likes} likes</span>
                          </div>
                        </div>
                      </div>

                      <span>{comment.message}</span>
                    </div>
                  </div>

                  {index < comments.length - 1 && (
                    <div
                      id="divider"
                      className="mt-6 h-0 w-full border-b border-solid border-b-[#f2f2f2]"
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
            <span className="text-gray-700">No comments found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserComments;
