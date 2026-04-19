import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  query: String,
  expandedQuery: String,
  publications: [
    {
      title: String,
      abstract: String,
      authors: [String],
      year: Number,
      source: String,
      url: String,
      relevanceScore: Number,
    },
  ],
  clinicalTrials: [
    {
      title: String,
      status: String,
      eligibility: String,
      location: String,
      contact: String,
      url: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
