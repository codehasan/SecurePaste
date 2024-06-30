import { getClient } from '@/lib/mongodb';
import { Paste } from '@/schema/ZodSchema';
import { Db, Collection, Document } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body: Paste = await request.json();

  try {
    const client = await getClient();
    const database: Db = client.db('securepaste');
    const collection: Collection<Document> = database.collection('pastes');

    return NextResponse.json({ message: 'Finally it worked' }, { status: 200 });
  } catch (e) {
    console.error('Error while running operations', e);
    return NextResponse.json(
      { error: 'Failed to insert data' },
      { status: 500 }
    );
  }
}
