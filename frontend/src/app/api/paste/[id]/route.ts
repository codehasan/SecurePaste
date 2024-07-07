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

interface PasteParams {
  params: {
    id: string;
  };
}

export async function GET(
  { ...request }: NextRequest,
  { params }: PasteParams
) {
  await client.connect();

  if (params.id.length < 24) {
    return NextResponse.json({ error: 'Invalid paste id' }, { status: 400 });
  }

  try {
    const database: Db = client.db('sample_mflix');
    const collection: Collection<Document> = database.collection('movies');

    const query = { languages: { $eq: ['Hindi'] } };
    const data = await collection.find(query).toArray();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
