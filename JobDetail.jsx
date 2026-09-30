import { useEffect, useState } from 'react'; import { useParams } from 'react-router-dom'; import api from '../api'; import { useAuth } from '../App';
export default function JobDetail() {
  const { id } = useParams(); const { user } = useAuth(); const [job, setJob] = useState(); const [cover, setCover] = useState(''); const [msg, setMsg] = useState('');
  useEffect(() => { api.get(`/jobs/${id}`).then((r) => setJob(r.data)); }, [id]);
  const apply = () => api.post(`/applications/${id}`, { coverLetter: cover }).then((r) => setMsg(`Applied. Your skill match: ${r.data.matchScore}%`)).catch((e) => setMsg(e.response?.data?.message));
  if (!job) return null;
  return (<main><div className="card"><h2>{job.title}</h2><div className="muted">{job.company} · {job.location} · {job.type} {job.salary && `· ${job.salary}`}</div>
    <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p><div className="row">{job.skills.map((s) => <span key={s} className="tag">{s}</span>)}</div></div>
    {user?.role === 'candidate' && <div className="card"><textarea rows={4} placeholder="Cover letter (optional)" value={cover} onChange={(e) => setCover(e.target.value)} />
      <p><button onClick={apply}>Apply now</button> <span>{msg}</span></p></div>}
    {!user && <p>Log in as a candidate to apply.</p>}</main>);
}
