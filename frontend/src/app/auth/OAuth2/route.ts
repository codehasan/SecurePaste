import { constructUrl } from '@/lib/RedirectHelper';
import { getAuthErrorMessage } from '@/utils/supabase/errors';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL('/', request.url));
    } else {
      return NextResponse.redirect(
        new URL(
          constructUrl('/error', {
            next: '/auth/signin',
            nextText: 'Try Again',
            message: getAuthErrorMessage(error),
          }),
          request.url
        )
      );
    }
  }

  return NextResponse.redirect(new URL('/error', request.url));
}
