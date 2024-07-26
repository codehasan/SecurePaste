'use client';
import Link from 'next/link';
import DropdownProps from './DropdownProps';
import { usePathname } from 'next/navigation';

type Partial<T> = { [P in keyof T]?: T[P] | null };

const NavLinksLg = ({
  authUser,
  dbUser,
  pageNavigations,
}: Partial<Omit<DropdownProps, 'profileNavigations'>>) => {
  const currentPath = usePathname();
  const isValidUser = Boolean(authUser && dbUser);

  const isActive = (path: string) => {
    if (path === '/') return currentPath === path;
    return currentPath.startsWith(path);
  };

  return (
    <div className="hidden lg:ml-6 lg:flex h-full space-x-4">
      {pageNavigations!.map((navigation) => {
        if (!isValidUser && navigation.requiresUser) return <></>;

        return (
          <Link
            key={navigation.name}
            className={
              isActive(navigation.path)
                ? 'inline-flex items-center font-medium text-sm px-1 pt-1 border-b-2 border-indigo-500 text-gray-900'
                : 'inline-flex items-center font-medium text-sm px-1 pt-1 text-gray-500 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700'
            }
            href={navigation.path}
          >
            {navigation.name}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinksLg;
