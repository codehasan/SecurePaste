import { createClient } from '@/utils/supabase/server';
import getUser from '@/utils/services/user';
import classNames from 'classnames';
import styles from '@/app/(client)/client.module.css';

interface UserProps {
  params: { id: string };
}

const UserPastes = async ({ params }: UserProps) => {
  const supabase = createClient();
  const { authUser, dbUser } = await getUser(supabase);
  const isValidUser = Boolean(authUser && dbUser);

  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div
          role="tablist"
          className="tabs tabs-boxed mt-2 grid-cols-2 !bg-transparent lg:mt-4"
        >
          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab !rounded-md"
            aria-label="Public"
          />
          <div role="tabpanel" className="tab-content p-10">
            Public Pastes
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            role="tab"
            className="tab bg-base-300 !rounded-md"
            aria-label="Private"
            defaultChecked
          />
          <div role="tabpanel" className="tab-content p-10">
            Private Pastes
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPastes;
