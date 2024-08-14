import logger from '@/lib/logging/server';
import prisma from '@/utils/prisma/db';
import { getAuthErrorMessage } from '@/utils/supabase/errors';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    // Check for errors in supabase auth
    if (error) {
      logger.error(`Auth error: ${JSON.stringify(error)}`);

      return NextResponse.json(
        {
          error: getAuthErrorMessage(error),
        },
        { status: 500 }
      );
    }

    // There are no errors, now check if the user is valid
    if (!user) {
      logger.error('No user returned from Supabase after signup.');

      return NextResponse.json(
        {
          error: 'An internal error occurred. Please try again later.',
        },
        { status: 500 }
      );
    }

    const like = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId: params.commentId,
        },
      },
    });

    if (like == null) {
      await prisma.commentLike.create({
        data: {
          userId: user.id,
          commentId: params.commentId,
        },
      });
      return NextResponse.json({ addLike: true }, { status: 200 });
    } else {
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId: user.id,
            commentId: params.commentId,
          },
        },
      });
      return NextResponse.json({ addLike: false }, { status: 200 });
    }
  } catch (err) {
    logger.error(`Unexpected error: ${JSON.stringify(err)}`);

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}