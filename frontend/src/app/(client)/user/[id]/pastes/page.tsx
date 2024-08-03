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

  return <div>Pastes</div>;
};

export default UserPastes;
