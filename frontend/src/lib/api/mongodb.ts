import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI ?? '';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: false,
  },
});

export async function withMongoClient(
  callback: (client: MongoClient) => Promise<any>
) {
  try {
    return await callback(await client.connect());
  } catch (error) {
    console.error('MongoDB operation failed:', error);
    throw error;
  } finally {
    await client.close();
  }
}
