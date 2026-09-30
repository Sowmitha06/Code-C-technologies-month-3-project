import { createContext, useContext, useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import api from './api'; import Jobs from './pages/Jobs'; import JobDetail from './pages/JobDetail'; import Auth from './pages/Auth';
import Candidate from './pages/Candidate'; import Employer from './pages/Employer'; import Admin from './pages/Admin';
const Ctx = createContext(); export const useAuth = () => useContext(Ctx);
export default function App() {
  const [user, setUser] = useState(null); const [ready, setReady] = useState(false);
  const reload = () => api.get('/auth/me').then((r) => setUser(r.data)).catch(() => setUser(null)).finally(() => setReady(true));
  useEffect(() => { reload(); }, []);
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  if (!ready) return null;
  const Dash = { candidate: Candidate, employer: Employer, admin: Admin }[user?.role];
  return (<Ctx.Provider value={{ user, setUser, reload }}>
    <nav><b>JobPortal</b><Link to="/">Jobs</Link><span className="grow" />
      {user ? <><Link to="/dashboard">Dashboard</Link><span className="muted">{user.name}</span><button className="ghost" onClick={logout}>Log out</button></>
        : <><Link to="/login">Log in</Link><Link to="/register">Sign up</Link></>}</nav>
    <Routes><Route path="/" element={<Jobs />} /><Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/login" element={<Auth mode="login" />} /><Route path="/register" element={<Auth mode="register" />} />
      <Route path="/dashboard" element={Dash ? <Dash /> : <Navigate to="/login" />} /></Routes></Ctx.Provider>);
}
