// import mongoose from "mongoose";
// import { ApiError } from "../utils/ApiError.js";

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: "ai_resume_builder",
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//     return conn;
//   } catch (err) {
//     throw new ApiError(500, "Database connection failed", [], err.stack);
//   }
// };

// export { connectDB };

// src/db/index.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI must be set in environment variables");
}

// Use a cached global variable to avoid multiple connections in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((m) => m.connection);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

