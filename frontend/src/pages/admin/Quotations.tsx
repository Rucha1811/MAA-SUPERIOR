import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { quotationApi } from '../../lib/api';
import toast from 'react-hot-toast';

const STATUSES = ['all','pending','reviewed','quoted','confirmed','completed','cancelled'];
const STATUS_COLORS: Record<string,{bg:string;color:string}> = {
  pending:{bg:'#FEF3C7',color:'#92400E'}, reviewed:{bg:'#DBEAFE',color:'#1E40AF'},
  quoted:{bg:'#EDE9FE',color:'#5B21B6'}, confirmed:{bg:'#D1FAE5',color:'#065F46'},
  completed:{bg:'#CCFBF1',color:'#0F766E'}, cancelled:{bg:'#FEE2E2',color:'#991B1B'},
};

export default function AdminQuotations() {
  const [searchParams] = useSearchParams();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 25 };
      if (status !== 'all') params.status = status;
      const { data } = await quotationApi.adminList(params);
      setQuotes(data.data || []);
      setTotal(data.total || 0);
    } catch { toast.error('Failed to load quotations'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchQuotes(); }, [status, page]);

  const filtered = search.trim()
    ? quotes.filter(q =>
        q.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        q.quote_number?.toLowerCase().includes(search.toLowerCase()) ||
        q.customer_phone?.includes(search) ||
        q.event_type?.toLowerCase().includes(search.toLowerCase())
      )
    : quotes;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Quotations</h1>
          <p style={{ color:'#8A8A9A', fontSize:'0.875rem' }}>{total} total requests</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <input className="form-input" style={{ maxWidth:300 }} placeholder="🔍 Search name, phone, quote#..." value={search} onChange={e=>setSearch(e.target.value)} />
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={()=>{ setStatus(s); setPage(1); }} style={{
              padding:'7px 14px', borderRadius:20, cursor:'pointer', fontSize:'0.78rem', fontWeight:600,
              background: status===s ? '#2D0000' : 'white',
              color: status===s ? 'white' : '#6A6A8A',
              border: status===s ? 'none' : '1px solid #E8E8E8',
              textTransform:'capitalize', transition:'all 0.2s',
              boxShadow: status===s ? '0 2px 8px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              {s === 'all' ? `All (${total})` : s}
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ overflow:'auto' }}>
        {loading ? (
          <div style={{ padding:60, display:'flex', justifyContent:'center' }}><div className="spinner"/></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:60, textAlign:'center', color:'#8A8A9A' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>📋</div>
            No quotations found
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Customer</th>
                <th>Event</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id}>
                  <td>
                    <span style={{ fontFamily:'Playfair Display,serif', fontSize:'0.8rem', color:'#C9961A', fontWeight:700 }}>{q.quote_number}</span>
                    <div style={{ fontSize:'0.7rem', color:'#AAAAAA', marginTop:2 }}>{new Date(q.created_at).toLocaleDateString('en-IN')}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight:600, color:'#2D0000', fontSize:'0.875rem' }}>{q.customer_name}</div>
                    <a href={`tel:${q.customer_phone}`} style={{ fontSize:'0.75rem', color:'#8A8A9A', textDecoration:'none' }}>{q.customer_phone}</a>
                  </td>
                  <td style={{ fontSize:'0.85rem', color:'#4A4A6A' }}>{q.event_type || '—'}</td>
                  <td style={{ fontSize:'0.82rem', color:'#4A4A6A' }}>
                    {q.event_date ? new Date(q.event_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : '—'}
                  </td>
                  <td style={{ fontSize:'0.85rem', color:'#4A4A6A' }}>{q.guest_count ? `${q.guest_count}` : '—'}</td>
                  <td>
                    <span style={{
                      padding:'4px 10px', borderRadius:20, fontSize:'0.7rem', fontWeight:700, textTransform:'capitalize',
                      background: STATUS_COLORS[q.status]?.bg || '#F0F0F0',
                      color: STATUS_COLORS[q.status]?.color || '#666',
                    }}>{q.status}</span>
                  </td>
                  <td style={{ fontSize:'0.85rem', color:'#4A4A6A' }}>
                    {q.final_amount ? `₹${Number(q.final_amount).toLocaleString('en-IN')}` :
                     q.estimated_amount ? <span style={{ color:'#8A8A9A' }}>~₹{Number(q.estimated_amount).toLocaleString('en-IN')}</span> : '—'}
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <Link to={`/admin/quotations/${q.id}`} className="btn btn-maroon btn-sm" style={{ fontSize:'0.72rem', padding:'5px 12px' }}>View</Link>
                      {q.customer_phone && (
                        <a href={`https://wa.me/${q.customer_phone.replace(/\D/g,'')}?text=Hello ${q.customer_name}! Regarding your catering quote ${q.quote_number}...`}
                          target="_blank" rel="noreferrer"
                          style={{ display:'inline-flex', alignItems:'center', padding:'5px 10px', background:'#25D366', color:'white', borderRadius:8, fontSize:'0.72rem', textDecoration:'none', fontWeight:600 }}>
                          💬
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > 25 && (
        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:10, marginTop:20 }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn btn-outline-gold btn-sm">← Prev</button>
          <span style={{ color:'#6A6A8A', fontSize:'0.85rem' }}>Page {page} of {Math.ceil(total/25)}</span>
          <button onClick={()=>setPage(p=>p+1)} disabled={page>=Math.ceil(total/25)} className="btn btn-outline-gold btn-sm">Next →</button>
        </div>
      )}
    </div>
  );
}
