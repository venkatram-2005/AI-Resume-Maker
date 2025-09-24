// models/Certification.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const certificationSchema = new Schema({
  certificateName: {
    type: String
  },
  issuedBy: {
    type: String
  }
}, { _id: false });

export default certificationSchema;
