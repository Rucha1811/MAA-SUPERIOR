import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const update = (k: string, v: string) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})); };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (mode === 'register') {
      if (!form.name.trim()) e.name = 'Name is required';
      if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email.trim().toLowerCase(), form.password);
        toast.success('Welcome back!');
      } else {
        await register({ name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim(), password: form.password });
        toast.success('Account created! Welcome to Maa Superior.');
      }
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.errors?.[0]?.msg || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <div style={{
        paddingTop: 68, minHeight: '100vh',
        background: 'linear-gradient(135deg, #FEF9F4 0%, #FEF0E8 50%, #FDF4EC 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px',
      }}>
        <div style={{ maxWidth: 440, width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #E8621A, #F4C430)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Playfair Display,serif', fontWeight: 900, fontSize: '1.6rem', color: 'white', boxShadow: '0 6px 20px rgba(232,98,26,0.4)' }}>M</div>
            <h1 style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.6rem', color: '#1A1A2E', marginBottom: 6 }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ color: '#8A8A9A', fontSize: '0.875rem' }}>Maa Superior Caterers</p>
          </div>

          <div className="card" style={{ padding: '32px 36px' }}>
            {/* Toggle */}
            <div style={{ display: 'flex', background: '#F5F5F0', borderRadius: 10, padding: 4, marginBottom: 28 }}>
              {['login','register'].map(m => (
                <button key={m} onClick={() => setMode(m as any)} style={{
                  flex: 1, padding: '9px', border: 'none', borderRadius: 8, cursor: 'pointer',
                  background: mode === m ? 'white' : 'transparent',
                  color: mode === m ? '#E8621A' : '#8A8A9A',
                  fontFamily: 'Poppins,sans-serif', fontSize: '0.85rem', fontWeight: mode === m ? 700 : 500,
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s',
                }}>
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {mode === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="Your full name" value={form.name} onChange={e=>update('name',e.target.value)} />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e=>update('phone',e.target.value)} />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>update('email',e.target.value)} autoComplete="email" />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e=>update('password',e.target.value)} autoComplete={mode==='login'?'current-password':'new-password'} />
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              {mode === 'register' && (
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input className="form-input" type="password" placeholder="••••••••" value={form.confirm} onChange={e=>update('confirm',e.target.value)} />
                  {errors.confirm && <div className="form-error">{errors.confirm}</div>}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem' }} disabled={loading}>
                {loading ? <><span className="spinner" style={{width:18,height:18,borderWidth:2}} /> Processing...</> : mode === 'login' ? '🔐 Sign In' : '✨ Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid #F0EDE8' }}>
              <p style={{ fontSize: '0.82rem', color: '#8A8A9A' }}>
                Or connect instantly via{' '}
                <a href="https://wa.me/9879556507?text=Hello! I need catering services." target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>WhatsApp</a>
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/" style={{ color: '#8A8A9A', fontSize: '0.82rem', textDecoration: 'none' }}>← Back to Home</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
