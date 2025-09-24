// src/server.js — local server (use `node src/server.js` locally)
import app from "./app.js";
import { connectDB } from "./db/index.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
