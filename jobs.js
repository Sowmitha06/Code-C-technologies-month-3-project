import { Router } from 'express'; import Job from '../models/Job.js'; import { protect, allow } from '../middleware/auth.js'; import { matchScore } from '../utils/resume.js';
const r = Router();
r.get('/', async (req, res) => {
  const { q, location, type } = req.query; const f = { status: 'approved' };
  if (q) f.$or = [{ title: new RegExp(q, 'i') }, { company: new RegExp(q, 'i') }, { skills: new RegExp(q, 'i') }];
  if (location) f.location = new RegExp(location, 'i'); if (type) f.type = type;
  res.json(await Job.find(f).sort('-createdAt').limit(50));
});
r.get('/recommended', protect, allow('candidate'), async (req, res) => {
  const jobs = await Job.find({ status: 'approved' }).lean();
  res.json(jobs.map((j) => ({ ...j, matchScore: matchScore(req.user.skills, j.skills) })).sort((a, b) => b.matchScore - a.matchScore).slice(0, 20));
});
r.get('/mine', protect, allow('employer'), async (req, res) => res.json(await Job.find({ employer: req.user._id }).sort('-createdAt')));
r.get('/:id', async (req, res) => res.json(await Job.findById(req.params.id)));
r.post('/', protect, allow('employer'), async (req, res) => {
  const { title, location, type, salary, description, skills } = req.body;
  res.json(await Job.create({ title, location, type, salary, description, employer: req.user._id, company: req.user.company || req.user.name,
    skills: (Array.isArray(skills) ? skills : String(skills || '').split(',')).map((s) => s.trim()).filter(Boolean) }));
});
r.delete('/:id', protect, allow('employer'), async (req, res) => { await Job.deleteOne({ _id: req.params.id, employer: req.user._id }); res.json({ ok: true }); });
export default r;
