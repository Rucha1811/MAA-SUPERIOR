import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { to: '/admin/quotations', icon: '📋', label: 'Quotations' },
  { to: '/admin/events', icon: '🎉', label: 'Event Records' },
  { to: '/admin/customers', icon: '👥', label: 'Customers' },
  { to: '/admin/menu', icon: '🍽️', label: 'Menu Manager' },
  { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin-login');
  };

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5EDD8' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 62 : 234, flexShrink: 0,
        background: 'linear-gradient(180deg, #1C0000 0%, #2D0000 50%, #1C0000 100%)',
        borderRight: '1px solid rgba(201,150,26,0.25)',
        transition: 'width 0.3s ease', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '18px 12px' : '18px 16px', borderBottom: '1px solid rgba(201,150,26,0.18)', display: 'flex', alignItems: 'center', gap: 10, minHeight: 64 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, #C9961A, #E5B732)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cinzel,serif', fontWeight: 900, fontSize: '1rem', color: '#2D0000' }}>मा</div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'Cinzel,serif', color: '#F5C842', fontSize: '0.8rem', fontWeight: 800, lineHeight: 1.2 }}>Maa Superior</div>
              <div style={{ color: 'rgba(201,150,26,0.6)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = isActive(item.to, item.exact);
            return (
              <Link key={item.to} to={item.to} title={collapsed ? item.label : undefined} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: collapsed ? '12px 13px' : '11px 16px',
                textDecoration: 'none',
                background: active ? 'linear-gradient(90deg, rgba(201,150,26,0.2), rgba(201,150,26,0.05))' : 'transparent',
                borderLeft: active ? '3px solid #C9961A' : '3px solid transparent',
                color: active ? '#F5C842' : 'rgba(245,200,66,0.5)',
                fontSize: '0.82rem', fontWeight: active ? 700 : 400,
                fontFamily: 'Nunito,sans-serif', transition: 'all 0.2s', marginBottom: 2,
              }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(201,150,26,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,200,66,0.85)'; }}}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(245,200,66,0.5)'; }}}
              >
                <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(201,150,26,0.18)' }}>
          {!collapsed && (
            <div style={{ padding: '8px 12px', background: 'rgba(201,150,26,0.08)', borderRadius: 8, marginBottom: 10, border: '1px solid rgba(201,150,26,0.15)' }}>
              <div style={{ color: 'rgba(201,150,26,0.6)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Cinzel,serif', marginBottom: 2 }}>Signed in as</div>
              <div style={{ color: '#F5C842', fontSize: '0.8rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            </div>
          )}
          <button onClick={handleLogout} title={collapsed ? 'Logout' : undefined} style={{
            width: '100%', padding: collapsed ? '10px' : '8px 12px',
            background: 'rgba(139,0,0,0.2)', border: '1px solid rgba(139,0,0,0.3)',
            borderRadius: 8, cursor: 'pointer', color: 'rgba(255,120,120,0.8)',
            fontSize: '0.78rem', fontFamily: 'Nunito,sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 7,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,0,0,0.35)'; (e.currentTarget as HTMLElement).style.color = '#FF8888'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,0,0,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,120,120,0.8)'; }}
          >
            <span>🚪</span>{!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ height: 60, background: 'white', borderBottom: '1px solid rgba(201,150,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(74,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A0000', fontSize: '1rem', padding: 6, borderRadius: 6 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-pale)')} onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              {collapsed ? '▶' : '◀'}
            </button>
            <span style={{ fontFamily: 'Cinzel,serif', fontSize: '0.72rem', color: '#8B5E3C', letterSpacing: '0.08em' }}>
              {navItems.find(n => isActive(n.to, n.exact))?.label || 'Admin'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <a href="/" target="_blank" style={{ color: '#C9961A', fontSize: '0.75rem', textDecoration: 'none', fontFamily: 'Cinzel,serif', letterSpacing: '0.06em', fontWeight: 600 }}>
              🌐 View Site
            </a>
            <a href="https://wa.me/9879556507" target="_blank" rel="noreferrer" style={{ color: '#25D366', fontSize: '0.75rem', textDecoration: 'none', fontWeight: 700 }}>💬</a>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4A0000, #C9961A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5C842', fontFamily: 'Cinzel,serif', fontWeight: 900, fontSize: '0.85rem', cursor: 'default' }}>
              {user?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
