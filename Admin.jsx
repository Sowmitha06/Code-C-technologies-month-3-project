import { useEffect, useState } from 'react'; import api from '../api';
export default function Admin() {
  const [s, setS] = useState({}); const [jobs, setJobs] = useState([]); const [users, setUsers] = useState([]);
  const load = () => { api.get('/admin/stats').then((r) => setS(r.data)); api.get('/admin/jobs').then((r) => setJobs(r.data)); api.get('/admin/users').then((r) => setUsers(r.data)); }; useEffect(load, []);
  const mod = (id, status) => api.patch(`/admin/jobs/${id}`, { status }).then(load); const block = (id) => api.patch(`/admin/users/${id}/block`).then(load);
  return (<main><div className="row">{Object.entries(s).map(([k, v]) => <div key={k} className="card" style={{ flex: 1 }}><div className="muted">{k}</div><b style={{ fontSize: 24 }}>{v}</b></div>)}</div>
    <h3>Job moderation</h3>{jobs.map((j) => <div key={j._id} className="card row between"><span>{j.title} · {j.company} <span className="tag">{j.status}</span></span>
      <span className="row"><button onClick={() => mod(j._id, 'approved')}>Approve</button><button className="danger" onClick={() => mod(j._id, 'rejected')}>Reject</button></span></div>)}
    <h3>Users</h3>{users.map((u) => <div key={u._id} className="card row between"><span>{u.name || u.email} · {u.role}</span>
      {u.role !== 'admin' && <button className={u.blocked ? '' : 'danger'} onClick={() => block(u._id)}>{u.blocked ? 'Unblock' : 'Block'}</button>}</div>)}</main>);
}
