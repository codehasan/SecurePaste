import admin from '@/firebase/admin/config';
import { NewUser, NewUserSchema } from '@/schema/ZodSchema';
import { FirebaseError } from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

const validateCaptcha = async (token: string) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      secret: process.env.RECAPTCHA_SECRET,
      response: token,
    }),
  };
  const response = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    options
  );
  const result = await response.json();

  return result.success;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = NewUserSchema.safeParse(body);

  // Valildate the request body
  if (!validation.success) {
    const error: ZodError = validation.error;
    return NextResponse.json(
      { error: error.issues[0].message },
      { status: 400 }
    );
  }
  const inputData: NewUser = validation.data;

  // Validate the captcha token
  if (!validateCaptcha(inputData.captchaToken)) {
    return NextResponse.json(
      {
        error: 'Captcha token invalid! Please try again.',
        invalidCaptcha: true,
      },
      { status: 400 }
    );
  }

  try {
    const userRecord = await admin.auth().createUser({
      email: inputData.email,
      password: inputData.password,
      displayName: inputData.name,
    });
    const token = await admin.auth().createCustomToken(userRecord.uid);

    return NextResponse.json(
      {
        message: `Account has been created.`,
        uid: userRecord.uid,
        token: token,
      },
      { status: 201 }
    );
  } catch (e) {
    const error = e as FirebaseError;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
