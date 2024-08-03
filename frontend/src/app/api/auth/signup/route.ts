import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { z, ZodError } from 'zod';
import { SignUpSchema } from '@/lib/schema/ZodSchema';
import { getAuthErrorMessage } from '@/utils/supabase/errors';
import logger from '@/lib/logging/server';
import prisma from '@/utils/prisma/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = SignUpSchema.safeParse(body);

    // Valildate the request body
    if (!validation.success) {
      const error: ZodError = validation.error;

      logger.warn(`Validation error: ${JSON.stringify(error.issues)}`);

      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    const inputData: z.infer<typeof SignUpSchema> = validation.data;
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({
      email: inputData.email,
      password: inputData.password,
      options: {
        captchaToken: inputData.captchaToken,
      },
    });

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

    // Supabase returned a user, now save the info in postgresql
    try {
      await prisma.user.create({
        data: {
          id: user.id,
          name: inputData.name,
        },
      });
    } catch (e) {
      logger.error(`Postgresql error: ${JSON.stringify(e)}`);

      return NextResponse.json(
        {
          error: 'An internal error occured. Please try again later.',
        },
        { status: 500 }
      );
    }

    // The account is created
    return NextResponse.json(
      {
        message: `Account has been created.`,
      },
      { status: 201 }
    );
  } catch (err) {
    logger.error(`Unexpected error: ${JSON.stringify(err)}`);

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
