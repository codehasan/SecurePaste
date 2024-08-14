'use server';
import { redirect, RedirectType } from 'next/navigation';

export const push = (pathname: string, params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value);
  }

  const url =
    searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
  redirect(url, RedirectType.push);
};
