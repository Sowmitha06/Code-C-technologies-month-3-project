import 'dotenv/config';
import express from 'express'; import cors from 'cors'; import mongoose from 'mongoose';
import auth from './routes/auth.js'; import jobs from './routes/jobs.js';
import apps from './routes/applications.js'; import admin from './routes/admin.js';
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL })); app.use(express.json());
app.use('/api/auth', auth); app.use('/api/jobs', jobs); app.use('/api/applications', apps); app.use('/api/admin', admin);
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message }));
mongoose.connect(process.env.MONGO_URI).then(() => app.listen(5000, () => console.log('API on :5000')));
