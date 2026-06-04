import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { customerApi } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await customerApi.list({ search: search || undefined });
      setCustomers(data);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetch(); };

  const handleToggle = async (id: string, name: string, active: boolean) => {
    try {
      await customerApi.toggle(id);
      setCustomers(cs => cs.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
      toast.success(`${name} ${active ? 'disabled' : 'enabled'}`);
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Cinzel, serif', color: '#2D0000', fontSize: '1.5rem', marginBottom: 4 }}>Customers</h1>
        <p style={{ color: '#8B6914', fontSize: '0.85rem' }}>{customers.length} registered customers</p>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input className="form-input" style={{ maxWidth: 320 }} placeholder="🔍 Search by name, email, phone..." value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit" className="btn btn-maroon btn-sm">Search</button>
        {search && <button type="button" className="btn btn-outline-gold btn-sm" onClick={() => { setSearch(''); fetch(); }}>Clear</button>}
      </form>

      <div className="card" style={{ overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>
        ) : customers.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#8B6914' }}>No customers found</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Quotes</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#2D0000', fontSize: '0.88rem' }}>{c.name}</div>
                  </td>
                  <td>
                    <a href={`tel:${c.phone}`} style={{ color: '#B8860B', textDecoration: 'none', fontSize: '0.85rem' }}>{c.phone || '—'}</a>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#5C3D00' }}>{c.email}</td>
                  <td>
                    <span style={{ background: 'rgba(184,134,11,0.15)', color: '#4A0000', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>
                      {c.quote_count || 0}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#8B6914' }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  <td>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                      background: c.is_active ? '#D1FAE5' : '#FEE2E2',
                      color: c.is_active ? '#065F46' : '#991B1B',
                    }}>
                      {c.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/customers/${c.id}`} className="btn btn-sm btn-maroon" style={{ fontSize: '0.72rem', padding: '6px 12px' }}>View</Link>
                      <button
                        onClick={() => handleToggle(c.id, c.name, c.is_active)}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.72rem', padding: '6px 12px', borderColor: c.is_active ? '#EF4444' : '#10B981', color: c.is_active ? '#EF4444' : '#10B981' }}
                      >
                        {c.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
