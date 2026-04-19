import mongoose from 'mongoose';

const cacheSchema = new mongoose.Schema({
  cacheKey: { type: String, unique: true },
  publications: Array,
  clinicalTrials: Array,
  fetchedAt: { type: Date, default: Date.now, expires: 86400 }, // 24h TTL
});

export default mongoose.model('ResearchCache', cacheSchema);
