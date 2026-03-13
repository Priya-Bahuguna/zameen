import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name:'', email:'', phone:'', password:'', confirm:'', role:'buyer' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState('');

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]:'' })); setApiErr(''); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name     = 'Name is required';
    if (!form.email)        e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password)     e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Invalid mobile number';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const res = await authAPI.register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      localStorage.setItem('zameenToken', res.token);
      localStorage.setItem('zameenUser',  JSON.stringify(res.user));
      navigate('/dashboard');
    } catch (err) {
      setApiErr(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-logo">Z</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join thousands making smarter property decisions</p>

        {apiErr && <div className="alert alert-error">{apiErr}</div>}

        <div className="form-group">
          <label>Full Name <span>*</span></label>
          <input className={`form-control ${errors.name ? 'error' : ''}`} placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label>Email Address <span>*</span></label>
          <input type="email" className={`form-control ${errors.email ? 'error' : ''}`} placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input type="tel" className={`form-control ${errors.phone ? 'error' : ''}`} placeholder="10-digit mobile" value={form.phone} onChange={e => set('phone', e.target.value)} />
          {errors.phone && <span className="form-error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>I am a <span>*</span></label>
          <div className="role-toggle">
            {['buyer','owner'].map(r => (
              <button key={r} className={`role-btn ${form.role === r ? 'active' : ''}`} onClick={() => set('role', r)}>
                {r === 'buyer' ? '🏠 Buyer / Renter' : '🔑 Property Owner'}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Password <span>*</span></label>
          <input type="password" className={`form-control ${errors.password ? 'error' : ''}`} placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password <span>*</span></label>
          <input type="password" className={`form-control ${errors.confirm ? 'error' : ''}`} placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
          {errors.confirm && <span className="form-error">{errors.confirm}</span>}
        </div>

        <button className="btn-green auth-btn" onClick={submit} disabled={loading}>
          {loading ? <><span className="spinner" /> Creating account…</> : 'Create Account →'}
        </button>

        <p className="auth-switch">Already have an account? <Link to="/login">Login here →</Link></p>
      </div>
    </div>
  );
}
