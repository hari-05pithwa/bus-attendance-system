import { MongoClient } from "mongodb";

const uri = process.env.DATA_MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.DATA_MONGODB_URI) {
  throw new Error("Please add DATA_MONGODB_URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromiseData) {
    client = new MongoClient(uri, options);
    global._mongoClientPromiseData = client.connect();
  }
  clientPromise = global._mongoClientPromiseData;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;