import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom'; import api from '../api';
export const JobCard = ({ j }) => (<div className="card"><div className="row between"><Link to={`/jobs/${j._id}`}><b>{j.title}</b></Link>
  {j.matchScore != null && <span className="tag">{j.matchScore}% match</span>}</div>
  <div className="muted">{j.company} · {j.location} · {j.type} {j.salary && `· ${j.salary}`}</div>
  <div className="row" style={{ marginTop: 8 }}>{j.skills?.map((s) => <span key={s} className="tag">{s}</span>)}</div></div>);
export default function Jobs() {
  const [jobs, setJobs] = useState([]); const [f, setF] = useState({ q: '', location: '', type: '' });
  const load = () => api.get('/jobs', { params: f }).then((r) => setJobs(r.data)); useEffect(() => { load(); }, []);
  return (<main><div className="row card"><input placeholder="Title, company or skill" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
    <input placeholder="Location" value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
    <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option value="">Any type</option><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select>
    <button onClick={load}>Search</button></div>
    {jobs.map((j) => <JobCard key={j._id} j={j} />)}{!jobs.length && <p className="muted">No jobs match your search.</p>}</main>);
}
