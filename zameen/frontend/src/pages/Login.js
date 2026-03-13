import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email:'', password:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(''); };

  const submit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      localStorage.setItem('zameenToken', res.token);
      localStorage.setItem('zameenUser',  JSON.stringify(res.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">Z</div>
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-sub">Login to your Zameen account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Email Address</label>
          <input type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" placeholder="Your password" value={form.password} onChange={e => set('password', e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        <button className="btn-green auth-btn" onClick={submit} disabled={loading}>
          {loading ? <><span className="spinner" /> Logging in…</> : 'Login →'}
        </button>

        <div className="auth-demo">
          <div className="demo-title">No backend? Use demo login:</div>
          <button className="demo-btn" onClick={() => { localStorage.setItem('zameenToken','demo'); localStorage.setItem('zameenUser', JSON.stringify({id:'demo',name:'Demo User',email:'demo@zameen.in',role:'buyer'})); navigate('/dashboard'); }}>
            Login as Demo User
          </button>
        </div>

        <p className="auth-switch">Don't have an account? <Link to="/register">Register here →</Link></p>
      </div>
    </div>
  );
}
