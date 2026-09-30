import mongoose from 'mongoose';
const s = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverLetter: String, matchScore: Number,
  status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'hired'], default: 'applied' },
}, { timestamps: true });
s.index({ job: 1, candidate: 1 }, { unique: true });
export default mongoose.model('Application', s);
