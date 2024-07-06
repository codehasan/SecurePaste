import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ZodError } from 'zod';
import { NewUser, NewUserSchema } from '@/lib/schema/ZodSchema';
import axios from 'axios';
import logger from '@/lib/logger';

const validateCaptcha = async (token: string) => {
  try {
    const params = new URLSearchParams();
    params.append('secret', process.env.RECAPTCHA_SECRET!);
    params.append('response', token);

    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 5000,
    };
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      params,
      options
    );
    const result = response.data;

    if (!result.success) {
      logger.info(`Captcha Validation Result: ${JSON.stringify(result)}`);
    }

    return result.success;
  } catch (error) {
    logger.error(`Captcha validation error: ${error}`);
    return false;
  }
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = NewUserSchema.safeParse(body);

  // Valildate the request body
  if (!validation.success) {
    const error: ZodError = validation.error;

    logger.warn(`Validation error: ${error.toString()}`);

    return NextResponse.json(
      { error: error.issues[0].message },
      { status: 400 }
    );
  }

  const inputData: NewUser = validation.data;
  // Validate the captcha token
  const captchaValidated: boolean = await validateCaptcha(
    inputData.captchaToken
  );
  if (!captchaValidated) {
    return NextResponse.json(
      {
        error: 'Captcha token invalid! Please try again.',
        invalidCaptcha: true,
      },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: inputData.email,
    password: inputData.password,
  });

  if (!error) {
    return NextResponse.json(
      {
        message: `Account has been created.`,
      },
      { status: 201 }
    );
  } else {
    logger.error(`Auth error: ${JSON.stringify(error)}`);

    return NextResponse.json(
      {
        error: error.message,
      },
      { status: error.status }
    );
  }
}
