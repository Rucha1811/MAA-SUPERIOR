import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quotationApi } from '../../lib/api';
import toast from 'react-hot-toast';

const STATUSES = ['pending','reviewed','quoted','confirmed','completed','cancelled'];

export default function AdminQuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ status:'', admin_notes:'', estimated_amount:'', final_amount:'' });

  useEffect(() => {
    if (!id) return;
    quotationApi.adminGet(id)
      .then(r => {
        setQuote(r.data);
        setForm({
          status: r.data.status,
          admin_notes: r.data.admin_notes || '',
          estimated_amount: r.data.estimated_amount || '',
          final_amount: r.data.final_amount || '',
        });
      })
      .catch(() => { toast.error('Quote not found'); navigate('/admin/quotations'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await quotationApi.adminUpdate(id!, {
        status: form.status,
        admin_notes: form.admin_notes || null,
        estimated_amount: form.estimated_amount ? parseFloat(form.estimated_amount) : null,
        final_amount: form.final_amount ? parseFloat(form.final_amount) : null,
      });
      setQuote(data);
      toast.success('Quote updated!');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:80 }}><div className="spinner"/></div>;
  if (!quote) return null;

  const Field = ({ label, value }: { label:string; value:any }) => (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#C9961A', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>{label}</div>
      <div style={{ color:'#2D0000', fontSize:'0.9rem', fontWeight:500 }}>{value || '—'}</div>
    </div>
  );

  const wa = (msg: string) => `https://wa.me/${(quote.customer_phone||'').replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24, fontSize:'0.85rem' }}>
        <Link to="/admin/quotations" style={{ color:'#8A8A9A', textDecoration:'none' }}>← Quotations</Link>
        <span style={{ color:'#CCCCCC' }}>›</span>
        <span style={{ color:'#C9961A', fontWeight:600 }}>{quote.quote_number}</span>
      </div>

      {/* Status Banner */}
      <div style={{
        padding:'12px 20px', borderRadius:10, marginBottom:24,
        background: quote.status==='pending' ? '#FEF3C7' : quote.status==='confirmed' ? '#D1FAE5' : '#F0F0F0',
        border: `1px solid ${quote.status==='pending' ? '#FCD34D' : quote.status==='confirmed' ? '#6EE7B7' : '#E0E0E0'}`,
        display:'flex', alignItems:'center', gap:10,
      }}>
        <span style={{ fontSize:'1.1rem' }}>
          {quote.status==='pending'?'⏳':quote.status==='confirmed'?'✅':quote.status==='completed'?'🎉':quote.status==='cancelled'?'❌':'📋'}
        </span>
        <div>
          <span style={{ fontWeight:700, textTransform:'capitalize' }}>{quote.status}</span>
          {quote.status==='pending' && <span style={{ marginLeft:8, fontSize:'0.82rem', color:'#92400E' }}>— This quote needs your attention</span>}
        </div>
        {quote.status==='pending' && (
          <a href={`https://wa.me/9879556507?text=🔔 New quote ${quote.quote_number} from ${quote.customer_name} needs review! Event: ${quote.event_type||'N/A'}, Date: ${quote.event_date||'N/A'}, Guests: ${quote.guest_count||'N/A'}`}
            target="_blank" rel="noreferrer"
            style={{ marginLeft:'auto', background:'#25D366', color:'white', padding:'6px 14px', borderRadius:8, textDecoration:'none', fontSize:'0.8rem', fontWeight:600 }}>
            🔔 Notify Self
          </a>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:20 }}>
        {/* Quote Info */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Customer */}
          <div className="card" style={{ padding:'24px' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'0.95rem', fontWeight:700, marginBottom:20, paddingBottom:12, borderBottom:'1px solid #F0EDE8' }}>Customer Information</h3>
            <Field label="Name" value={quote.customer_name} />
            <Field label="Phone" value={<a href={`tel:${quote.customer_phone}`} style={{ color:'#C9961A', textDecoration:'none', fontWeight:700 }}>{quote.customer_phone}</a>} />
            <Field label="Email" value={quote.customer_email} />
            <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap' }}>
              <a href={`tel:${quote.customer_phone}`} className="btn btn-outline-gold btn-sm">📞 Call</a>
              <a href={wa(`Dear ${quote.customer_name},\n\nRegarding your catering quote ${quote.quote_number}...`)} target="_blank" rel="noreferrer"
                className="btn btn-sm" style={{ background:'#25D366', color:'white' }}>💬 WhatsApp</a>
            </div>
          </div>

          {/* Event */}
          <div className="card" style={{ padding:'24px' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'0.95rem', fontWeight:700, marginBottom:20, paddingBottom:12, borderBottom:'1px solid #F0EDE8' }}>Event Details</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <Field label="Event Type" value={quote.event_type} />
              <Field label="Event Date" value={quote.event_date ? new Date(quote.event_date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'}) : null} />
              <Field label="Guest Count" value={quote.guest_count ? `${quote.guest_count} persons` : null} />
              <Field label="Set Menu" value={quote.menu_number ? `Menu ${quote.menu_number} — ${quote.menu_title||''}` : null} />
            </div>
            <Field label="Venue / Location" value={quote.event_location} />
            {quote.special_requests && <Field label="Special Requests" value={quote.special_requests} />}
          </div>

          {/* Timeline */}
          <div className="card" style={{ padding:'24px' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'0.95rem', fontWeight:700, marginBottom:16 }}>Timeline</h3>
            <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'#6A6A8A' }}>
              <span>📅</span> Submitted: {new Date(quote.created_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
            </div>
            {quote.updated_at !== quote.created_at && (
              <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'#6A6A8A', marginTop:8 }}>
                <span>✏️</span> Updated: {new Date(quote.updated_at).toLocaleString('en-IN',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
              </div>
            )}
          </div>
        </div>

        {/* Admin Panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Update Form */}
          <div className="card" style={{ padding:'24px', border:'2px solid rgba(232,98,26,0.2)' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'0.95rem', fontWeight:700, marginBottom:20, paddingBottom:12, borderBottom:'1px solid #F0EDE8' }}>⚙️ Update Quote</h3>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s} value={s} style={{textTransform:'capitalize'}}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">Estimated Amount (₹)</label>
                <input className="form-input" type="number" placeholder="0.00" value={form.estimated_amount} onChange={e=>setForm(f=>({...f,estimated_amount:e.target.value}))} />
              </div>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">Final Amount (₹)</label>
                <input className="form-input" type="number" placeholder="0.00" value={form.final_amount} onChange={e=>setForm(f=>({...f,final_amount:e.target.value}))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Internal Notes</label>
              <textarea className="form-textarea" style={{ minHeight:100 }} placeholder="Notes about this quote (not visible to customer)..." value={form.admin_notes} onChange={e=>setForm(f=>({...f,admin_notes:e.target.value}))} />
            </div>
            <button className="btn btn-maroon" style={{ width:'100%', justifyContent:'center' }} onClick={handleSave} disabled={saving}>
              {saving ? '⏳ Saving...' : '💾 Save Changes'}
            </button>
          </div>

          {/* WhatsApp Templates */}
          <div className="card" style={{ padding:'24px' }}>
            <h4 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'0.9rem', fontWeight:700, marginBottom:14 }}>💬 Quick WhatsApp Messages</h4>
            {[
              {
                label:'Acknowledge Receipt',
                msg:`Dear ${quote.customer_name},\n\nThank you for choosing Maa Superior Caterers! 🍽️\n\nWe have received your quote request *${quote.quote_number}* for your ${quote.event_type||'event'}. Our team will review your requirements and get back to you within 24 hours.\n\nFor any urgent queries, please call: *+91 98795 56507*\n\nBest Regards,\n*Vipul Gandhi*\nMaa Superior Caterers`,
              },
              {
                label:'Request More Details',
                msg:`Dear ${quote.customer_name},\n\nThank you for your catering inquiry (${quote.quote_number}). To provide you with the best quote, could you please share:\n\n• Your preferred menu items\n• Any dietary restrictions\n• Venue/location details\n• Any special arrangements needed\n\nLooking forward to making your event special! 🎉\n\n*Vipul Gandhi* | Maa Superior Caterers\n📞 +91 98795 56507`,
              },
              {
                label:'Send Quote Amount',
                msg:`Dear ${quote.customer_name},\n\nYour catering quote is ready! 🍽️\n\n*Quote #:* ${quote.quote_number}\n*Event:* ${quote.event_type||'Your Event'}\n*Date:* ${quote.event_date ? new Date(quote.event_date).toLocaleDateString('en-IN') : 'TBD'}\n*Guests:* ${quote.guest_count||'TBD'}\n*Estimated Amount:* ₹${form.estimated_amount||'____'}\n\n*Terms:* 50% advance, balance on event day.\n\nPlease call/WhatsApp to confirm & discuss details.\n\n*Vipul Gandhi*\n📞 +91 98795 56507`,
              },
              {
                label:'Booking Confirmed',
                msg:`Dear ${quote.customer_name},\n\n✅ *Your booking is CONFIRMED!*\n\n*Quote #:* ${quote.quote_number}\n*Event:* ${quote.event_type||'Your Event'}\n*Date:* ${quote.event_date ? new Date(quote.event_date).toLocaleDateString('en-IN') : 'TBD'}\n*Final Amount:* ₹${form.final_amount||'____'}\n\nThank you for choosing Maa Superior Caterers. We look forward to making your event truly special! 🎊\n\n*Vipul Gandhi* | +91 98795 56507`,
              },
            ].map(item => (
              <a key={item.label} href={wa(item.msg)} target="_blank" rel="noreferrer" style={{
                display:'block', padding:'10px 14px', marginBottom:8,
                background:'#F0FFF4', border:'1px solid #86EFAC', borderRadius:8,
                textDecoration:'none', color:'#166534', fontSize:'0.82rem', fontWeight:600,
                transition:'all 0.15s',
              }}
                onMouseEnter={e=>(e.currentTarget.style.background='#DCFCE7')}
                onMouseLeave={e=>(e.currentTarget.style.background='#F0FFF4')}
              >
                💬 {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
