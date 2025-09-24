// import app from "./app.js";
// import { connectDB } from "./db/index.js";
// import { config } from "dotenv";
// config();

// connectDB().then(() => {
//   app.listen(process.env.PORT, () => {
//     console.log("Server is running on http://localhost:" + process.env.PORT);
//   });
// });

import app from "./app.js";
import { connectDB } from "./db/index.js";

let dbConnected = false;

async function ensureDB() {
  if (dbConnected) return;
  await connectDB();
  dbConnected = true;
}

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    await ensureDB();
    return app(req, res); // Express works like a handler
  } catch (err) {
    console.error("Serverless handler error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
