// models/Achievement.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const achievementSchema = new Schema(
  {
    achievement: {
      type: String,
      required: true,
    },
  },
  { _id: false } // use _id: false if you plan to embed in another schema like projects/certs
);

export default achievementSchema;
