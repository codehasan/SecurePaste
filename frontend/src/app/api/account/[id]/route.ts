import { getClient } from '@/lib/mongodb';
import { User, UserSchema } from '@/schema/ZodSchema';
import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

interface AccountProps {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: AccountProps) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  const client: MongoClient = await getClient();
  const securepaste: Db = client.db('securepaste');
  const users: Collection = securepaste.collection('users');

  const user = await users.findOne(
    { _id: new ObjectId(params.id) },
    {
      maxTimeMS: 5_000,
    }
  );

  if (!user) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}

export async function PATCH(request: NextRequest, { params }: AccountProps) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

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

  const result = await users.updateOne(
    { _id: new ObjectId(params.id), uid: user.uid, username: user.username },
    {
      $set: {
        wallet: user.wallet || undefined,
        email: user.email || undefined,
        jsonWebToken: user.jsonWebToken || undefined,
        profileUrl: user.profileUrl || undefined,
      },
    },
    {
      upsert: false,
      maxTimeMS: 5_000,
    }
  );

  if (!result.acknowledged || result.matchedCount === 0) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json(
    {
      message: `Account has been updated`,
    },
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest, { params }: AccountProps) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  const client: MongoClient = await getClient();
  const securepaste: Db = client.db('securepaste');
  const users: Collection = securepaste.collection('users');

  const result = await users.deleteOne({ _id: new ObjectId(params.id) });

  if (!result.acknowledged || result.deletedCount === 0) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json(
    {
      message: `Account has been deleted`,
    },
    { status: 200 }
  );
}
