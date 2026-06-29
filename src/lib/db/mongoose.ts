import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if(!MONGODB_URI) {
    throw new Error("MONGODB_URI not found! Please, check the .env.local file.");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || {conn: null, promise: null};
global.mongoose = cached;

// const cached = (global as any).mongoose || {conn: null, promise: null};
// (global as any).mongoose = cached;

async function connectDB() {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.conn) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        });
    }

    cached.conn = await cached.promise;

    return cached.conn;
}

export default connectDB;