import { redirect, RedirectType } from 'next/navigation';

export const push = (pathname: string, params: Record<string, string> = {}) => {
  const url = constructUrl(pathname, params);
  redirect(url, RedirectType.push);
};

export const constructUrl = (pathname: string, params: Record<string, any>) => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value);
  }

  return searchParams.size > 0
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
};
