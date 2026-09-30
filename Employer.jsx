import { useEffect, useState } from 'react'; import api from '../api';
export default function Employer() {
  const [jobs, setJobs] = useState([]); const [f, setF] = useState({ title: '', location: '', type: 'Full-time', salary: '', skills: '', description: '' }); const [open, setOpen] = useState(null); const [apps, setApps] = useState([]);
  const load = () => api.get('/jobs/mine').then((r) => setJobs(r.data)); useEffect(() => { load(); }, []);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const post = async (e) => { e.preventDefault(); await api.post('/jobs', f); setF({ ...f, title: '', description: '', skills: '' }); load(); };
  const view = async (id) => { setOpen(id); setApps((await api.get(`/applications/job/${id}`)).data); };
  const setStatus = async (id, status) => { await api.patch(`/applications/${id}`, { status }); view(open); };
  return (<main><form className="card" onSubmit={post}><h3 style={{ margin: 0 }}>Post a job</h3><input placeholder="Job title" value={f.title} onChange={set('title')} required />
    <div className="row"><input placeholder="Location" value={f.location} onChange={set('location')} /><input placeholder="Salary" value={f.salary} onChange={set('salary')} />
      <select value={f.type} onChange={set('type')}><option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option></select></div>
    <input placeholder="Required skills, comma separated (react, node)" value={f.skills} onChange={set('skills')} />
    <textarea rows={4} placeholder="Description" value={f.description} onChange={set('description')} required /><button>Submit for approval</button></form>
    <h3>My jobs</h3>{jobs.map((j) => <div className="card" key={j._id}><div className="row between"><b>{j.title}</b><span className="row"><span className="tag">{j.status}</span>
      <button className="ghost" onClick={() => view(j._id)}>Applicants</button><button className="danger" onClick={() => api.delete(`/jobs/${j._id}`).then(load)}>Delete</button></span></div>
      {open === j._id && (apps.length ? apps.map((a) => <div key={a._id} className="row between" style={{ marginTop: 8 }}><span>{a.candidate.name} · {a.candidate.email} <span className="tag">{a.matchScore}% match</span></span>
        <select value={a.status} onChange={(e) => setStatus(a._id, e.target.value)}>{['applied', 'shortlisted', 'rejected', 'hired'].map((s) => <option key={s}>{s}</option>)}</select></div>) : <p className="muted">No applicants yet.</p>)}</div>)}</main>);
}
