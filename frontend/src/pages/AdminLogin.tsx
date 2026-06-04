import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await adminLogin(form.email.trim().toLowerCase(), form.password);
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Invalid credentials. Check email and password.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D0000 0%, #1C0000 50%, #2D0000 100%)',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Pattern */}
      <div style={{ position: 'fixed', inset: 0, opacity: 0.05, backgroundImage: 'repeating-linear-gradient(45deg, #C9961A 0, #C9961A 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
      {/* Gold orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,26,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,26,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 420, width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 68, height: 68, borderRadius: 18, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #C9961A, #F5C842)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cinzel,serif', fontWeight: 900, fontSize: '1.6rem',
            color: '#2D0000', boxShadow: '0 8px 28px rgba(201,150,26,0.5)',
          }}>मा</div>
          <h1 style={{ fontFamily: 'Cinzel,serif', color: '#F5C842', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.08em', marginBottom: 4 }}>
            Admin Portal
          </h1>
          <div className="ornament" style={{ marginBottom: 4 }}>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(201,150,26,0.55)', textTransform: 'uppercase' }}>
              Maa Superior Caterers
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(201,150,26,0.25)', borderRadius: 18,
          padding: '36px 32px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(201,150,26,0.08)', borderRadius: 10, border: '1px solid rgba(201,150,26,0.18)', marginBottom: 28, fontSize: '0.8rem', color: 'rgba(245,200,66,0.6)', fontFamily: 'Cormorant Garamond,serif' }}>
            🔐 Restricted access. Authorised personnel only.
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: 'rgba(201,150,26,0.8)', fontFamily: 'Cinzel,serif', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Admin Email</label>
              <input type="email" required autoComplete="username"
                placeholder="admin@maasuperior.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(201,150,26,0.25)', borderRadius: 10, color: '#F5EDD8', fontFamily: 'Nunito,sans-serif', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => (e.target.style.borderColor = '#C9961A')}
                onBlur={e => (e.target.style.borderColor = 'rgba(201,150,26,0.25)')} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', color: 'rgba(201,150,26,0.8)', fontFamily: 'Cinzel,serif', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} required autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ width: '100%', padding: '12px 44px 12px 14px', background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(201,150,26,0.25)', borderRadius: 10, color: '#F5EDD8', fontFamily: 'Nunito,sans-serif', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => (e.target.style.borderColor = '#C9961A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(201,150,26,0.25)')} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(201,150,26,0.5)', fontSize: '1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(201,150,26,0.3)' : 'linear-gradient(135deg, #C9961A, #E5B732)',
              border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
              color: '#2D0000', fontFamily: 'Cinzel,serif', fontWeight: 800,
              fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(201,150,26,0.4)', transition: 'all 0.2s',
            }}>
              {loading ? '⏳ Authenticating...' : '🔑 Enter Admin Panel'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ color: 'rgba(201,150,26,0.4)', fontSize: '0.72rem', textDecoration: 'none', fontFamily: 'Cinzel,serif', letterSpacing: '0.1em' }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
