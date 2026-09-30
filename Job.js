import mongoose from 'mongoose';
export default mongoose.model('Job', new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String, company: String, location: String, type: { type: String, default: 'Full-time' },
  salary: String, description: String, skills: [String],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true }));
