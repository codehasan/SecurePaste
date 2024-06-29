import { getClient } from '@/lib/mongodb';
import { User, UserSchema } from '@/schema/ZodSchema';
import { Collection, Db, MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = UserSchema.safeParse(body);

  if (!validation.success) {
    const error: ZodError = validation.error;
    return NextResponse.json(
      { error: error.issues[0].message },
      { status: 400 }
    );
  }

  const client: MongoClient = await getClient();
  const securepaste: Db = client.db('securepaste');
  const users: Collection = securepaste.collection('users');
  const user: User = validation.data;

  const duplicate = await users.findOne(
    { uid: user.uid },
    {
      maxTimeMS: 5_000,
    }
  );

  if (duplicate) {
    return NextResponse.json(
      { error: 'Account already exists' },
      { status: 409 }
    );
  }

  const result = await users.insertOne(user, {
    writeConcern: {
      w: 'majority',
      wtimeoutMS: 5_000,
    },
  });

  if (!result.acknowledged) {
    return NextResponse.json(
      { error: 'Unable to create account' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: `Account has been created`,
      userId: result.insertedId.toHexString(),
    },
    { status: 201 }
  );
}
