import { User as PrismaUser } from '@prisma/client';
import { User } from '@supabase/supabase-js';

export default interface DropdownProps {
  authUser: User;
  dbUser: PrismaUser;
  profileNavigations: {
    name: string;
    path: string;
  }[];
  pageNavigations: {
    name: string;
    path: string;
    requiresUser: boolean;
  }[];
  className?: string;
}
