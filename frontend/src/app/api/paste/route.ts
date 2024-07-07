import {
  MongoClient,
  Db,
  Collection,
  Document,
  ServerApiVersion,
} from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Missing environment variable MONGO_URI');
}

const client: MongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: false,
  },
});

export async function POST(request: NextRequest) {
  await client.connect();

  try {
    const database: Db = client.db('sample_mflix');
    const collection: Collection<Document> = database.collection('movies');

    return NextResponse.json({ message: 'Finally it worked' }, { status: 200 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json(
      { error: 'Failed to insert data' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
