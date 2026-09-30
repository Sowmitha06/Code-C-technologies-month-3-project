import { Router } from 'express'; import bcrypt from 'bcryptjs'; import multer from 'multer'; import pdf from 'pdf-parse';
import User from '../models/User.js'; import { protect, sign } from '../middleware/auth.js'; import { parseResume } from '../utils/resume.js';
const r = Router(); const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5e6 } });
r.post('/register', async (req, res) => {
  const { name, email, password, role, company } = req.body;
  if (!email || !password || password.length < 6) return res.status(400).json({ message: 'Email and a 6+ character password are required' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });
  const u = await User.create({ name, email, company, role: role === 'employer' ? 'employer' : 'candidate', password: await bcrypt.hash(password, 10) });
  res.json({ token: sign(u), user: { ...u.toObject(), password: undefined } });
});
r.post('/login', async (req, res) => {
  const u = await User.findOne({ email: req.body.email });
  if (!u?.password || !(await bcrypt.compare(req.body.password, u.password))) return res.status(401).json({ message: 'Wrong email or password' });
  if (u.blocked) return res.status(403).json({ message: 'Account blocked' });
  res.json({ token: sign(u), user: { ...u.toObject(), password: undefined } });
});
r.get('/me', protect, (req, res) => res.json({ ...req.user.toObject(), password: undefined }));
r.post('/resume', protect, upload.single('resume'), async (req, res) => {
  const { text } = await pdf(req.file.buffer);
  req.user.resumeText = text.slice(0, 20000); req.user.skills = parseResume(text).skills; await req.user.save();
  res.json({ skills: req.user.skills });
});
export default r;
