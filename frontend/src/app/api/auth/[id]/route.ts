import { NewUser, NewUserSchema } from '@/lib/schema/ZodSchema';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

interface AccountProps {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: AccountProps) {
  return NextResponse.json({}, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: AccountProps) {
  return NextResponse.json(
    {
      message: `Account has been updated`,
    },
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest, { params }: AccountProps) {
  return NextResponse.json(
    {
      message: `Account has been deleted`,
    },
    { status: 200 }
  );
}
