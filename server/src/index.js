// import app from "./app.js";
// import { connectDB } from "./db/index.js";
// import { config } from "dotenv";
// config();

// connectDB().then(() => {
//   app.listen(process.env.PORT, () => {
//     console.log("Server is running on http://localhost:" + process.env.PORT);
//   });
// });


// src/index.js  — for Vercel
import app from "./app.js";
import { connectDB } from "./db/index.js";

// Keep a flag so we don't reconnect on every invocation
let dbConnected = false;

async function ensureDB() {
  if (dbConnected) return;
  await connectDB();
  dbConnected = true;
}

// Vercel will call this exported default function for every request
export default async function handler(req, res) {
  try {
    await ensureDB();
    // Express apps are callable as a function: app(req, res)
    return app(req, res);
  } catch (err) {
    console.error("Serverless handler error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
