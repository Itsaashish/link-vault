import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/link-saver";

// Add this type declaration for the global object
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(MONGODB_URI);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db();
}
