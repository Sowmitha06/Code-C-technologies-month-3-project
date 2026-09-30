import { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import api from '../api'; import { useAuth } from '../App';
export default function Auth({ mode }) {
  const [f, setF] = useState({ role: 'candidate' }); const [err, setErr] = useState(''); const { setUser } = useAuth(); const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => { e.preventDefault(); try { const r = await api.post(`/auth/${mode}`, f); localStorage.setItem('token', r.data.token); setUser(r.data.user); nav('/dashboard'); } catch (x) { setErr(x.response?.data?.message || 'Something went wrong'); } };
  return (<main style={{ maxWidth: 400 }}><form className="card" onSubmit={submit}><h2>{mode === 'login' ? 'Log in' : 'Create account'}</h2>
    {mode === 'register' && <><input placeholder="Full name" onChange={set('name')} required />
      <select onChange={set('role')}><option value="candidate">I'm looking for a job</option><option value="employer">I'm hiring</option></select>
      {f.role === 'employer' && <input placeholder="Company name" onChange={set('company')} />}</>}
    <input type="email" placeholder="Email" onChange={set('email')} required /><input type="password" placeholder="Password (6+ characters)" onChange={set('password')} required />
    {err && <div className="err">{err}</div>}<button>{mode === 'login' ? 'Log in' : 'Sign up'}</button></form></main>);
}
