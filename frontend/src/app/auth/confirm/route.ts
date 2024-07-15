import getErrorMessage from '@/utils/supabase/errors';
import { createClient } from '@/utils/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') || '/';

  if (token_hash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.updateUser({
        data: {
          email_verified: true,
        },
      });

      if (!user) {
        return NextResponse.redirect(
          new URL(
            '/error?message=An unexpected error occurred. Please try again later.',
            request.url
          )
        );
      }

      if (next === '/') {
        revalidatePath('/', 'layout');
      } else {
        revalidatePath(next, 'page');
      }
      return NextResponse.redirect(new URL(next, request.url));
    }

    const errorUrl = new URL('/error', request.url);
    errorUrl.searchParams.append('message', getErrorMessage(error));

    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.redirect(new URL('/error', request.url));
}
