import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ZodError } from 'zod';
import { NewUser, SignUpShcema } from '@/lib/schema/ZodSchema';
import getErrorMessage from '@/utils/supabase/errors';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = SignUpShcema.safeParse(body);

  // Valildate the request body
  if (!validation.success) {
    const error: ZodError = validation.error;

    logger.warn(`Validation error: ${JSON.stringify(error.issues)}`);

    return NextResponse.json(
      { error: error.issues[0].message },
      { status: 400 }
    );
  }

  const inputData: NewUser = validation.data;
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email: inputData.email,
    password: inputData.password,
    options: {
      data: {
        ...getDisplayName(inputData.name),
      },
      captchaToken: inputData.captchaToken,
    },
  });

  if (error) {
    logger.error(`Auth error: ${JSON.stringify(error)}`);

    return NextResponse.json(
      {
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: `Account has been created.`,
    },
    { status: 201 }
  );
}

const getDisplayName = (fullName: string) => {
  const trimmedName = fullName.trim();
  const nameParts = trimmedName.split(/\s+/);

  let first_name = '';
  let last_name = '';

  if (nameParts.length > 1) {
    first_name = nameParts[0];
    last_name = nameParts.slice(1).join(' ');
  } else {
    first_name = trimmedName;
  }

  return { first_name, last_name };
};
