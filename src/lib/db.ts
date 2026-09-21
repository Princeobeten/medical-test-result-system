import mongoose from "mongoose";

// Next.js compiles Route Handlers and Server Component pages into separate
// module graphs, so `mongoose.models` registration doesn't carry over between
// them. Importing every model here for its registration side effect ensures
// populate() works regardless of which graph calls connectDB() first.
import "@/models/User";
import "@/models/Patient";
import "@/models/TestType";
import "@/models/TestRecord";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    }).catch((err) => {
      cache.promise = null;
      throw err;
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
