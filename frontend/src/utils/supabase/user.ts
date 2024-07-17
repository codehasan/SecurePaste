import { SupabaseClient, User } from '@supabase/supabase-js';
import prisma from '../prisma/db';
import { User as PrismaUser } from '@prisma/client';

export default async function getUser(supabase: SupabaseClient) {
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    let dbUser: PrismaUser | null = null;

    if (authUser) {
      dbUser = await prisma.user.findUnique({
        where: {
          id: authUser.id,
        },
      });
    }

    return { authUser, dbUser };
  } catch (error) {
    console.error('Error fetching user:', JSON.stringify(error));
    return { authUser: null, dbUser: null };
  }
}

export async function getUserInfoById(user: User) {
  try {
    return await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
  } catch (error) {
    console.error('Error fetching user by ID:', JSON.stringify(error));
    return null;
  }
}
