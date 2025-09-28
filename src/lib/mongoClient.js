import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "profitway";

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

let cached = global._mongoClientCache || (global._mongoClientCache = { client: null, promise: null });

export async function getClient() {
  if (cached.client) return cached.client;
  if (!cached.promise) {
    const client = new MongoClient(MONGODB_URI);
    cached.promise = client.connect().then((c) => {
      cached.client = c;
      return c;
    });
  }
  return cached.promise;
}

export async function getCollection(collectionName) { 
  const client = await getClient();
  return client.db(DB_NAME).collection(collectionName);
}

