import { Router } from 'express'; import User from '../models/User.js'; import Job from '../models/Job.js'; import Application from '../models/Application.js';
import { protect, allow } from '../middleware/auth.js';
const r = Router(); r.use(protect, allow('admin'));
r.get('/stats', async (_, res) => res.json({ users: await User.countDocuments(), jobs: await Job.countDocuments(), applications: await Application.countDocuments(), pending: await Job.countDocuments({ status: 'pending' }) }));
r.get('/jobs', async (req, res) => res.json(await Job.find(req.query.status ? { status: req.query.status } : {}).sort('-createdAt')));
r.patch('/jobs/:id', async (req, res) => res.json(await Job.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })));
r.get('/users', async (_, res) => res.json(await User.find().select('-password -resumeText').sort('-createdAt')));
r.patch('/users/:id/block', async (req, res) => { const u = await User.findById(req.params.id); u.blocked = !u.blocked; await u.save(); res.json(u); });
export default r;
