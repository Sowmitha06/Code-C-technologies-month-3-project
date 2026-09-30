import mongoose from 'mongoose';
export default mongoose.model('User', new mongoose.Schema({
  name: String, email: { type: String, unique: true, required: true }, password: String,
  role: { type: String, enum: ['candidate', 'employer', 'admin'], default: 'candidate' },
  company: String, headline: String, photo: String,
  resumeText: String, skills: [String], blocked: { type: Boolean, default: false },
}, { timestamps: true }));
