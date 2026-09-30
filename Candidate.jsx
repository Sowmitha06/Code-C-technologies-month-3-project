import { useEffect, useState } from 'react'; import api from '../api'; import { useAuth } from '../App'; import { JobCard } from './Jobs';
export default function Candidate() {
  const { user, reload } = useAuth(); const [apps, setApps] = useState([]); const [rec, setRec] = useState([]); const [msg, setMsg] = useState('');
  const load = () => { api.get('/applications/mine').then((r) => setApps(r.data)); api.get('/jobs/recommended').then((r) => setRec(r.data)); }; useEffect(load, []);
  const upload = async (e) => { const fd = new FormData(); fd.append('resume', e.target.files[0]);
    try { const r = await api.post('/auth/resume', fd); setMsg(`Found ${r.data.skills.length} skills: ${r.data.skills.join(', ')}`); await reload(); load(); } catch { setMsg('Could not read that PDF'); } };
  return (<main><div className="card row between"><div><h3 style={{ margin: 0 }}>{user.name}</h3><div className="muted">{user.email}</div>
    <div className="row" style={{ marginTop: 6 }}>{user.skills?.map((s) => <span key={s} className="tag">{s}</span>)}</div></div>
    <div><label className="muted">Upload resume (PDF)</label><input type="file" accept="application/pdf" onChange={upload} /><div>{msg}</div></div></div>
    <h3>Recommended for you</h3>{rec.slice(0, 5).map((j) => <JobCard key={j._id} j={j} />)}{!rec.length && <p className="muted">No jobs yet.</p>}
    <h3>My applications</h3>{apps.map((a) => <div className="card row between" key={a._id}><span>{a.job?.title} · {a.job?.company}</span><span className="tag">{a.status}</span></div>)}
    {!apps.length && <p className="muted">You haven't applied to any jobs yet.</p>}</main>);
}
