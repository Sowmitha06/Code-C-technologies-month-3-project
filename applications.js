import { Router } from 'express'; import Application from '../models/Application.js'; import Job from '../models/Job.js';
import { protect, allow } from '../middleware/auth.js'; import { matchScore } from '../utils/resume.js';
const r = Router();
r.post('/:jobId', protect, allow('candidate'), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, status: 'approved' });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  try { res.json(await Application.create({ job: job._id, candidate: req.user._id, coverLetter: req.body.coverLetter, matchScore: matchScore(req.user.skills, job.skills) })); }
  catch { res.status(409).json({ message: 'You already applied' }); }
});
r.get('/mine', protect, allow('candidate'), async (req, res) => res.json(await Application.find({ candidate: req.user._id }).populate('job').sort('-createdAt')));
r.get('/job/:jobId', protect, allow('employer'), async (req, res) => {
  if (!(await Job.exists({ _id: req.params.jobId, employer: req.user._id }))) return res.status(403).json({ message: 'Not your job' });
  res.json(await Application.find({ job: req.params.jobId }).populate('candidate', 'name email skills headline').sort('-matchScore'));
});
r.patch('/:id', protect, allow('employer'), async (req, res) => {
  const a = await Application.findById(req.params.id).populate('job');
  if (String(a.job.employer) !== String(req.user._id)) return res.status(403).json({ message: 'Not allowed' });
  a.status = req.body.status; res.json(await a.save());
});
export default r;
