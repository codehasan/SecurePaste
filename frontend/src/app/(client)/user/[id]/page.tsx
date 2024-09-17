import Avatar from '@/components/Avatar';
import CodeEditor from '@/components/CodeEditor/CodeEditor';
import { MemoizedLabel } from '@/components/Label';
import { getFormattedDate, getTimePassed } from '@/lib/DateFormat';
import getUser from '@/utils/services/user';
import { createClient } from '@/utils/supabase/server';
import classNames from 'classnames';
import Link from 'next/link';
import { FaImage } from 'react-icons/fa6';
import { MdVerified } from 'react-icons/md';
import styles from '../../client.module.css';

interface UserProps {
  params: { id: string };
}

const User = async ({ params }: UserProps) => {
  const supabase = createClient();
  const { authUser, dbUser } = await getUser(supabase);
  const isValidUser = Boolean(authUser && dbUser);

  const owner: boolean = (() => {
    if (!isValidUser) return false;
    return authUser!.id === params.id;
  })();

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className={classNames('text-2xl font-semibold', styles.header)}>
          My profile
        </div>
        <div className="flex flex-col items-center px-4 py-2 sm:flex-row">
          <Avatar src={dbUser!.avatar} parentClassName="size-20" />

          <div className="mt-3 sm:ml-8 sm:mt-0">
            <div className="flex items-center justify-center gap-1 text-center text-lg font-medium text-gray-800 sm:justify-start md:text-xl lg:text-2xl">
              <span>{dbUser!.name}</span>
              {dbUser!.verified && (
                <span className="text-primary tooltip" data-tip="Verified">
                  <MdVerified aria-label="Verified" />
                </span>
              )}
            </div>
            <div className="text-wrap text-base font-medium text-gray-500">
              {authUser!.email || 'Email not set'}
            </div>
            <form className="mt-3">
              <button className="btn btn-custom border-gray-300 bg-gray-300 text-gray-900">
                <FaImage />
                <span>
                  {dbUser!.avatar
                    ? 'Change profile picture'
                    : 'Upload profile picture'}
                </span>
              </button>
            </form>
          </div>
        </div>
        <div className="mt-4 text-base">
          <span className="font-medium text-gray-700">Joined: </span>
          <span className="text-gray-900">
            {getFormattedDate(authUser!.created_at)}
          </span>
          <span className="mx-2 text-sm text-gray-500">|</span>
          <span className="font-medium text-gray-700">Last sign in: </span>
          <span className="text-gray-900">
            {getTimePassed(authUser!.last_sign_in_at)} ago
          </span>
        </div>
        <div className="mt-4">
          <div className="text-lg font-medium">Metrics</div>
          <div className="divider mb-1 mt-1"></div>
          <div className="flex w-full px-4">
            <div className="flex grow flex-col items-center justify-center">
              <span className="font-medium">Pastes</span>
              <span>{0}</span>
            </div>
            <div className="flex grow flex-col items-center justify-center">
              <span className="font-medium">Comments</span>
              <span>{1}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-6">
          <div className="text-lg font-medium">Personal</div>
          <div className="divider mb-1 mt-1"></div>
          <form>
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
                defaultValue={dbUser!.name}
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
                inputMode="email"
                placeholder="your@email.com"
                value={authUser!.email}
                required
                readOnly
              />
            </MemoizedLabel>

            <div className="ml-1 mt-1 text-sm text-sky-600">
              <Link href="/auth/change_email">Change email</Link>
            </div>

            <MemoizedLabel className="mt-3" primaryText="Bio">
              <CodeEditor
                className="min-h-32 w-full bg-transparent"
                placeholder="Lorem ipsum dolor sit amet consectetur adipiscing elit"
                name="bio"
                inputMode="text"
                defaultValue={dbUser!.bio || ''}
                minLength={4}
              />
            </MemoizedLabel>

            <div className="mt-6 w-full">
              <button
                type="submit"
                className="btn btn-accent text-sm font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default User;
