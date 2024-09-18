import { UserData } from '@/utils/services/user';
import { User } from '@supabase/supabase-js';

export default interface DropdownProps {
  authUser: User;
  dbUser: UserData;
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
