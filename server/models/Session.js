import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },   // scopes data per user
  patientContext: {
    name: String,
    disease: String,
    location: String,
    additionalContext: String,
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Session', sessionSchema);
