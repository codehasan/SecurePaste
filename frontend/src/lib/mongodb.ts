import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGO_URI!;

let client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: false,
  },
  maxIdleTimeMS: 30_000,
  retryReads: false,
  retryWrites: true,
  maxPoolSize: 10,
  minPoolSize: 1,
  tls: true,
});

const status = {
  connected: false,
};

client.on('open', () => {
  status.connected = true;
});

client.on('topologyClosed', () => {
  status.connected = false;
});

const getClient = async () => {
  if (!status.connected) {
    await client.connect();
  }
  return client;
};

const closeClient = async () => {
  if (status.connected) {
    await client.close();
    status.connected = false;
  }
};

process.on('SIGINT', async () => {
  await closeClient();
  process.exit(0);
});

export { getClient, closeClient };
