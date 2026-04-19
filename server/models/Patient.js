import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dob: { type: String, default: '' },
  primaryCondition: { type: String, required: true },
  secondaryConditions: { type: [String], default: [] },
  location: { type: String, required: true },
  additionalContext: { type: String, default: '' },
  initials: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save to auto-generate initials if not provided
patientSchema.pre('save', function (next) {
  if (this.name && !this.initials) {
    this.initials = this.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  next();
});

export default mongoose.model('Patient', patientSchema);
