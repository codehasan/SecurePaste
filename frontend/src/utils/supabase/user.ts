import { SupabaseClient, User } from '@supabase/supabase-js';
import prisma from '../prisma/db';
import { User as PrismaUser } from '@prisma/client';

export default async function getUser(supabase: SupabaseClient, id?: string) {
  let authUser: User | null = null;
  let dbUser: PrismaUser | null = null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authUser = user;
  } catch (error) {
    console.error('Supabase user error:', JSON.stringify(error));
  }

  try {
    if (id || authUser) {
      dbUser = await prisma.user.findUnique({
        where: {
          id: id || authUser?.id,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching user:', JSON.stringify(error));
  }

  return { authUser, dbUser };
}

export async function getUserInfoById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error('Error fetching user by ID:', JSON.stringify(error));
    return null;
  }
}
