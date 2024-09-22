import logger from '@/lib/logging/server';
import { constructUrl } from '@/lib/RedirectHelper';
import { getAuthErrorMessage } from '@/utils/supabase/errors';
import { createClient } from '@/utils/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;

    if (token_hash && type && type === 'signup') {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      });

      if (verifyError) {
        logger.error(`Verify user error: ${verifyError}`);

        return NextResponse.redirect(
          new URL(
            constructUrl('/error', {
              next: '/auth/confirm_account',
              nextText: 'Try Again',
              message: getAuthErrorMessage(verifyError),
            }),
            request.url
          )
        );
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          email_verified: true,
        },
      });

      if (error) {
        logger.error(`User update error: ${error}`);

        return NextResponse.redirect(
          new URL(
            constructUrl('/error', {
              next: '/auth/confirm_account',
              nextText: 'Try Again',
              message: getAuthErrorMessage(error),
            }),
            request.url
          )
        );
      }

      revalidatePath('/', 'layout');
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (e) {
    logger.error(`Unexpected error: ${e}`);

    return NextResponse.redirect(
      new URL(
        constructUrl('/error', {
          next: '/auth/confirm_account',
          nextText: 'Try Again',
          message: 'An unexpected error occurred. Please try again later.',
        }),
        request.url
      )
    );
  }

  return NextResponse.redirect(new URL('/error', request.url));
}
