import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../lib/api';

const StatCard = ({ icon, value, label, color, sub }: any) => (
  <div className="card" style={{ padding:'20px 24px', display:'flex', alignItems:'center', gap:16, borderLeft:`4px solid ${color}` }}>
    <div style={{ width:50, height:50, borderRadius:14, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>{icon}</div>
    <div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:'1.7rem', fontWeight:900, color:'#2D0000', lineHeight:1 }}>{value}</div>
      <div style={{ color:'#6A6A8A', fontSize:'0.78rem', marginTop:4, fontWeight:500 }}>{label}</div>
      {sub && <div style={{ color, fontSize:'0.72rem', marginTop:2, fontWeight:600 }}>{sub}</div>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.stats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string,string> = {
    pending:'#F59E0B', reviewed:'#3B82F6', quoted:'#8B5CF6',
    confirmed:'#10B981', completed:'#059669', cancelled:'#EF4444',
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:80 }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Dashboard</h1>
        <p style={{ color:'#8A8A9A', fontSize:'0.875rem' }}>Welcome back! Here's your business overview.</p>
      </div>

      {/* Notification alert for pending quotes */}
      {stats?.pendingQuotes > 0 && (
        <div className="alert alert-warning" style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <span style={{ fontSize:'1.2rem' }}>🔔</span>
          <div>
            <strong>{stats.pendingQuotes} pending quote{stats.pendingQuotes > 1 ? 's' : ''}</strong> awaiting your review.{' '}
            <Link to="/admin/quotations?status=pending" style={{ color:'#92400E', fontWeight:700 }}>View now →</Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:28 }}>
        <StatCard icon="📋" value={stats?.totalQuotes || 0} label="Total Quote Requests" color="#C9961A" />
        <StatCard icon="⏳" value={stats?.pendingQuotes || 0} label="Pending Reviews" color="#F59E0B" sub={stats?.pendingQuotes > 0 ? 'Needs attention' : 'All clear!'} />
        <StatCard icon="👥" value={stats?.totalCustomers || 0} label="Registered Customers" color="#4A0000" />
        <StatCard icon="💰" value={`₹${(stats?.totalRevenue||0).toLocaleString('en-IN')}`} label="Confirmed Revenue" color="#059669" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:20 }}>
        {/* Recent Quotes */}
        <div className="card">
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #F0F0F0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'0.95rem', fontWeight:700 }}>Recent Quote Requests</h3>
            <Link to="/admin/quotations" style={{ color:'#C9961A', fontSize:'0.78rem', textDecoration:'none', fontWeight:600 }}>View All →</Link>
          </div>
          {(!stats?.recentQuotes || stats.recentQuotes.length === 0) ? (
            <div style={{ padding:'32px 20px', textAlign:'center', color:'#8A8A9A', fontSize:'0.875rem' }}>No quote requests yet</div>
          ) : stats.recentQuotes.map((q: any) => (
            <Link key={q.quote_number} to={`/admin/quotations/${q.id || q.quote_number}`} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'13px 20px', textDecoration:'none',
              borderBottom:'1px solid #F8F8F8', transition:'background 0.15s',
            }}
              onMouseEnter={e=>(e.currentTarget.style.background='#FEF9F6')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
            >
              <div>
                <div style={{ fontSize:'0.875rem', fontWeight:600, color:'#2D0000' }}>{q.customer_name}</div>
                <div style={{ fontSize:'0.75rem', color:'#8A8A9A', marginTop:2 }}>{q.event_type || 'Event'} • {q.quote_number}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {q.status === 'pending' && (
                  <a href={`https://wa.me/9879556507?text=New+quote+from+${encodeURIComponent(q.customer_name)}+needs+review!+Quote:+${q.quote_number}`}
                    target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                    style={{ fontSize:'0.72rem', background:'#25D366', color:'white', padding:'3px 8px', borderRadius:6, textDecoration:'none', fontWeight:600 }}>
                    Notify
                  </a>
                )}
                <span className={`badge badge-${q.status}`}>{q.status}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Status Breakdown */}
        <div className="card">
          <div style={{ padding:'16px 20px', borderBottom:'1px solid #F0F0F0' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'0.95rem', fontWeight:700 }}>Quote Status Breakdown</h3>
          </div>
          <div style={{ padding:'20px' }}>
            {(!stats?.quotesByStatus || stats.quotesByStatus.length === 0) ? (
              <div style={{ textAlign:'center', color:'#8A8A9A', fontSize:'0.875rem', padding:20 }}>No data yet</div>
            ) : stats.quotesByStatus.map((s: any) => (
              <div key={s.status} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:'0.85rem' }}>
                  <span style={{ color:'#2D0000', fontWeight:500, textTransform:'capitalize' }}>{s.status}</span>
                  <span style={{ color:'#8A8A9A', fontWeight:600 }}>{s.count}</span>
                </div>
                <div style={{ height:6, background:'#F0F0F0', borderRadius:3, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', borderRadius:3,
                    background: statusColors[s.status] || '#C9961A',
                    width:`${Math.min((parseInt(s.count)/(stats.totalQuotes||1))*100, 100)}%`,
                    transition:'width 0.6s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop:20, padding:'20px' }}>
        <h3 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'0.9rem', fontWeight:700, marginBottom:14 }}>Quick Actions</h3>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <Link to="/admin/quotations" className="btn btn-maroon btn-sm">📋 All Quotes</Link>
          <Link to="/admin/quotations?status=pending" className="btn btn-sm" style={{ background:'#FEF3C7', color:'#92400E' }}>⏳ Pending</Link>
          <Link to="/admin/customers" className="btn btn-maroon btn-sm">👥 Customers</Link>
          <Link to="/admin/menu" className="btn btn-outline-gold btn-sm">🍽️ Edit Menu</Link>
          <Link to="/admin/settings" className="btn btn-outline-gold btn-sm">⚙️ Settings</Link>
          <a href="https://wa.me/9879556507" target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background:'#25D366', color:'white' }}>💬 WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
