import { PromiseReturnType } from '@prisma/client/extension';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { validate } from 'uuid';

export interface UserData {
  id: string;
  name: string;
  bio: string | null;
  avatar: string | null;
  verified: boolean;
  created_at: string;
  pastes_count: number;
  comments_count: number;
}

export default async function getUser(supabase: SupabaseClient, id?: string) {
  let authUser: User | null = await getAuthUser(supabase);
  let dbUser: PromiseReturnType<typeof getUserInfoById> | null = null;

  // Retry to get authentication info
  if (!authUser) {
    authUser = await getAuthUser(supabase);
  }

  if (id) {
    dbUser = await getUserInfoById(supabase, id);
  } else if (authUser) {
    dbUser = await getUserInfoById(supabase, authUser.id);
  }

  return { authUser, dbUser };
}

export async function getUserInfoById(supabase: SupabaseClient, id: string) {
  if (!validate(id)) {
    return null;
  }

  try {
    const { data, error } = await supabase.rpc(
      'get_user_data',
      {
        user_id: id,
      },
      { get: true }
    );

    if (error) {
      console.error('Error fetching user by ID:', error);
    } else if (data) {
      return (data as UserData[])[0];
    }
  } catch (error) {
    console.error('Unexpected error fetching user by ID:', error);
  }
  return null;
}

async function getAuthUser(supabase: SupabaseClient) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Supabase user error:', error);
    }

    return user;
  } catch (error) {
    console.error('Unexpected supabase user error:', error);
  }
  return null;
}
