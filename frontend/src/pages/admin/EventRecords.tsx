import React, { useState, useEffect } from 'react';
import { quotationApi } from '../../lib/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:   { bg: '#FEF3C7', color: '#92400E' },
  reviewed:  { bg: '#DBEAFE', color: '#1E40AF' },
  quoted:    { bg: '#EDE9FE', color: '#5B21B6' },
  confirmed: { bg: '#D1FAE5', color: '#065F46' },
  completed: { bg: '#CCFBF1', color: '#0F766E' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B' },
};

export default function AdminEventRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for adding new record
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', customer_email: '',
    event_type: '', event_date: '', event_location: '', guest_count: '',
    selected_menu: '', special_requests: '', admin_notes: '',
    estimated_amount: '', final_amount: '', status: 'confirmed',
    custom_menu_items: '' // free-text custom menu
  });

  const EVENT_TYPES = ['Wedding', 'Reception Party', 'Birthday Party', 'Vastu Pujan', 'Anniversary', 'Corporate Event', 'Religious Function', 'Engagement', 'Other'];
  const STATUSES = ['all', 'pending', 'reviewed', 'quoted', 'confirmed', 'completed', 'cancelled'];

  useEffect(() => { fetchRecords(); }, [statusFilter]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await quotationApi.adminList(params);
      setRecords(data.data || []);
    } catch { toast.error('Failed to load records'); }
    finally { setLoading(false); }
  };

  const filtered = search.trim()
    ? records.filter(r =>
        r.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.customer_phone?.includes(search) ||
        r.event_type?.toLowerCase().includes(search.toLowerCase()) ||
        r.quote_number?.toLowerCase().includes(search.toLowerCase()) ||
        r.event_location?.toLowerCase().includes(search.toLowerCase())
      )
    : records;

  const updateField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleAddRecord = async () => {
    if (!form.customer_name || !form.customer_phone) {
      toast.error('Customer name and phone are required');
      return;
    }
    setSaving(true);
    try {
      // Submit via quotationApi then immediately update status
      const { data } = await quotationApi.submit({
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email || null,
        event_type: form.event_type || null,
        event_date: form.event_date || null,
        event_location: form.event_location || null,
        guest_count: form.guest_count ? parseInt(form.guest_count) : null,
        selected_menu_number: form.selected_menu ? parseInt(form.selected_menu) : null,
        special_requests: (form.special_requests + (form.custom_menu_items ? `\n\nCustom Menu Items:\n${form.custom_menu_items}` : '')) || null,
      });
      // Update with admin details
      await quotationApi.adminUpdate(data.id, {
        status: form.status,
        admin_notes: form.admin_notes || null,
        estimated_amount: form.estimated_amount ? parseFloat(form.estimated_amount) : null,
        final_amount: form.final_amount ? parseFloat(form.final_amount) : null,
      });
      toast.success('Event record saved!');
      setShowAddModal(false);
      setForm({ customer_name: '', customer_phone: '', customer_email: '', event_type: '', event_date: '', event_location: '', guest_count: '', selected_menu: '', special_requests: '', admin_notes: '', estimated_amount: '', final_amount: '', status: 'confirmed', custom_menu_items: '' });
      fetchRecords();
    } catch { toast.error('Failed to save record'); }
    finally { setSaving(false); }
  };

  const exportRecordPDF = (rec: any) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210, margin = 18, cW = W - margin * 2;

    // Header bg
    doc.setFillColor(61, 0, 8);
    doc.rect(0, 0, W, 46, 'F');
    doc.setFillColor(184, 134, 11);
    doc.rect(0, 0, W, 2.5, 'F');
    doc.rect(0, 43.5, W, 2.5, 'F');

    // Brand
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(240, 192, 64);
    doc.text('MAA SUPERIOR CATERERS', W / 2, 14, { align: 'center' });
    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(200, 160, 70);
    doc.text('"Best Quality & Service Is Our Aim"', W / 2, 22, { align: 'center' });
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 220, 80);
    doc.text('✦  EVENT RECORD  ✦', W / 2, 33, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160, 120, 40);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}  |  Quote: ${rec.quote_number}`, W / 2, 40, { align: 'center' });

    let y = 56;

    // Status badge
    const statusColors: Record<string, [number,number,number]> = {
      confirmed: [16, 185, 129], completed: [5, 150, 105], pending: [245, 158, 11],
      cancelled: [239, 68, 68], quoted: [139, 92, 246], reviewed: [59, 130, 246],
    };
    const sc = statusColors[rec.status] || [107, 0, 16];
    doc.setFillColor(...sc);
    doc.roundedRect(margin, y, 50, 9, 2, 2, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text((rec.status || 'N/A').toUpperCase(), margin + 25, y + 6, { align: 'center' });
    y += 16;

    const section = (title: string) => {
      doc.setFillColor(61, 0, 8);
      doc.roundedRect(margin, y, cW, 9, 2, 2, 'F');
      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(240, 192, 64);
      doc.text(title, margin + 4, y + 6);
      y += 13;
    };

    const field = (label: string, value: string, x2?: number, fullW = false) => {
      const fw = fullW ? cW : (x2 !== undefined ? cW / 2 - 2 : cW / 2 - 2);
      const xPos = x2 !== undefined ? x2 : margin;
      doc.setFillColor(251, 245, 225);
      doc.roundedRect(xPos, y, fw, 14, 1.5, 1.5, 'F');
      doc.setDrawColor(184, 134, 11);
      doc.setLineWidth(0.3);
      doc.roundedRect(xPos, y, fw, 14, 1.5, 1.5, 'S');
      doc.setFont('times', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(107, 0, 16);
      doc.text(label.toUpperCase(), xPos + 3, y + 5);
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(20, 0, 5);
      doc.text(value || '—', xPos + 3, y + 11, { maxWidth: fw - 6 });
    };

    // Customer section
    section('👤  CUSTOMER INFORMATION');
    const half = cW / 2 - 3;
    field('Full Name', rec.customer_name || '—');
    field('Phone / WhatsApp', rec.customer_phone || '—', margin + half + 6);
    y += 17;
    field('Email', rec.customer_email || '—', undefined, false);
    field('Quote Reference', rec.quote_number || '—', margin + half + 6);
    y += 17;

    // Event section
    section('📅  EVENT DETAILS');
    field('Event Type', rec.event_type || '—');
    field('Event Date', rec.event_date ? new Date(rec.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—', margin + half + 6);
    y += 17;
    field('No. of Guests', rec.guest_count ? `${rec.guest_count} persons` : '—');
    field('Venue / Location', rec.event_location || '—', margin + half + 6);
    y += 17;

    if (rec.menu_number || rec.menu_title) {
      field('Selected Menu', `Menu ${rec.menu_number} — ${rec.menu_title || ''}`, undefined, true);
      y += 17;
    }

    if (rec.special_requests) {
      section('📝  SPECIAL REQUESTS & CUSTOM MENU');
      doc.setFillColor(251, 245, 225);
      const textH = Math.max(18, Math.ceil(rec.special_requests.length / 85) * 6 + 10);
      doc.roundedRect(margin, y, cW, textH, 1.5, 1.5, 'F');
      doc.setDrawColor(184, 134, 11);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, cW, textH, 1.5, 1.5, 'S');
      doc.setFont('times', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(20, 0, 5);
      doc.text(rec.special_requests, margin + 3, y + 6, { maxWidth: cW - 6 });
      y += textH + 6;
    }

    // Financial section
    section('💰  FINANCIAL DETAILS');
    field('Estimated Amount', rec.estimated_amount ? `Rs. ${Number(rec.estimated_amount).toLocaleString('en-IN')}` : '—');
    field('Final Amount', rec.final_amount ? `Rs. ${Number(rec.final_amount).toLocaleString('en-IN')}` : '—', margin + half + 6);
    y += 17;
    field('Advance (50%)', rec.final_amount ? `Rs. ${(Number(rec.final_amount) * 0.5).toLocaleString('en-IN')}` : '—', undefined, false);
    field('Balance Due', rec.final_amount ? `Rs. ${(Number(rec.final_amount) * 0.5).toLocaleString('en-IN')}` : '—', margin + half + 6);
    y += 17;

    if (rec.admin_notes) {
      section('🗒️  ADMIN NOTES (INTERNAL)');
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(margin, y, cW, 18, 1.5, 1.5, 'F');
      doc.setDrawColor(252, 211, 77);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, cW, 18, 1.5, 1.5, 'S');
      doc.setFont('times', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(92, 40, 0);
      doc.text(rec.admin_notes, margin + 3, y + 7, { maxWidth: cW - 6 });
      y += 24;
    }

    // Footer
    doc.setFillColor(61, 0, 8);
    doc.rect(0, 277, W, 20, 'F');
    doc.setFillColor(184, 134, 11);
    doc.rect(0, 277, W, 1.5, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(240, 192, 64);
    doc.text('Maa Superior Caterers  |  Vipul Gandhi  |  +91 98795 56507  |  Vadodara, Gujarat', W / 2, 284, { align: 'center' });
    doc.setFont('times', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(160, 120, 40);
    doc.text('"We make your celebration truly royal"', W / 2, 291, { align: 'center' });

    doc.save(`Event-Record-${rec.quote_number || 'MSC'}.pdf`);
    toast.success('PDF downloaded!');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Cinzel,serif', color: '#2D0000', fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Event Records</h1>
          <p style={{ color: '#8A8A9A', fontSize: '0.875rem' }}>{filtered.length} event records — full customer & event details</p>
        </div>
        <button className="btn btn-maroon" onClick={() => setShowAddModal(true)}>+ Add New Record</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="form-input" style={{ maxWidth: 300 }} placeholder="🔍 Search name, phone, event, venue..." value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '7px 14px', border: statusFilter === s ? 'none' : '1px solid #E8E8E8',
              borderRadius: 20, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
              background: statusFilter === s ? 'linear-gradient(135deg, #3D0008, #6B0010)' : 'white',
              color: statusFilter === s ? '#F0C040' : '#6A6A8A',
              textTransform: 'capitalize', transition: 'all 0.2s',
            }}>{s === 'all' ? `All (${records.length})` : s}</button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      {loading ? (
        <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#8A8A9A' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📂</div>
          <div>No event records found</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filtered.map(rec => (
            <div key={rec.id} className="card" style={{ padding: '20px', border: '1px solid rgba(184,134,11,0.2)', transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(61,0,8,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,11,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,134,11,0.2)'; }}>

              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.95rem', fontWeight: 800, color: '#2D0000', marginBottom: 3 }}>{rec.customer_name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#B8860B', fontWeight: 700, fontFamily: 'Cinzel,serif' }}>{rec.quote_number}</div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700, textTransform: 'capitalize',
                  background: STATUS_COLORS[rec.status]?.bg || '#F0F0F0',
                  color: STATUS_COLORS[rec.status]?.color || '#666',
                }}>{rec.status}</span>
              </div>

              {/* Details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '0.82rem', marginBottom: 14 }}>
                {[
                  ['📞', rec.customer_phone],
                  ['🎉', rec.event_type || '—'],
                  ['📅', rec.event_date ? new Date(rec.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
                  ['👥', rec.guest_count ? `${rec.guest_count} guests` : '—'],
                  ['📍', rec.event_location || '—'],
                  ['🍽️', rec.menu_number ? `Menu ${rec.menu_number}` : 'Custom'],
                ].map(([icon, val], i) => (
                  <div key={i} style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0 }}>{icon}</span>
                    <span style={{ color: '#4A2800', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Amount */}
              {(rec.estimated_amount || rec.final_amount) && (
                <div style={{ background: 'linear-gradient(135deg, #FBF0D0, #F5E8C0)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, display: 'flex', gap: 16 }}>
                  {rec.estimated_amount && <div><div style={{ fontSize: '0.62rem', color: '#8B6914', fontFamily: 'Cinzel,serif', letterSpacing: '0.08em', fontWeight: 700 }}>ESTIMATED</div><div style={{ fontFamily: 'Cinzel,serif', color: '#3D0008', fontWeight: 800 }}>₹{Number(rec.estimated_amount).toLocaleString('en-IN')}</div></div>}
                  {rec.final_amount && <div><div style={{ fontSize: '0.62rem', color: '#8B6914', fontFamily: 'Cinzel,serif', letterSpacing: '0.08em', fontWeight: 700 }}>FINAL</div><div style={{ fontFamily: 'Cinzel,serif', color: '#3D0008', fontWeight: 800 }}>₹{Number(rec.final_amount).toLocaleString('en-IN')}</div></div>}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setSelected(rec); setShowModal(true); }} className="btn btn-maroon btn-sm" style={{ flex: 1, justifyContent: 'center' }}>View Details</button>
                <button onClick={() => exportRecordPDF(rec)} className="btn btn-gold btn-sm" style={{ flex: 1, justifyContent: 'center' }}>📄 PDF</button>
                <a href={`https://wa.me/${(rec.customer_phone || '').replace(/\D/g, '')}?text=Hello ${rec.customer_name}! Regarding your event catering ${rec.quote_number}...`}
                  target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 10px', background: '#25D366', color: 'white', borderRadius: 8, fontSize: '0.75rem', textDecoration: 'none', fontWeight: 700 }}>💬</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── VIEW DETAIL MODAL ─────────────────────── */}
      {showModal && selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ maxWidth: 680, width: '100%', maxHeight: '92vh', overflowY: 'auto', borderRadius: 18, background: 'white', border: '2px solid rgba(184,134,11,0.3)' }}>
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #3D0008, #6B0010)', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '1rem', fontWeight: 800 }}>{selected.customer_name}</div>
                <div style={{ color: 'rgba(240,192,64,0.7)', fontSize: '0.75rem', marginTop: 3 }}>{selected.quote_number}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => exportRecordPDF(selected)} className="btn btn-gold btn-sm">📄 Export PDF</button>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#F0C040', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Status */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <span style={{ padding: '5px 16px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', background: STATUS_COLORS[selected.status]?.bg, color: STATUS_COLORS[selected.status]?.color }}>{selected.status}</span>
                <span style={{ fontSize: '0.75rem', color: '#8A8A9A', padding: '5px 0' }}>Submitted: {new Date(selected.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Two column layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Left */}
                <div>
                  <Section title="Customer Info">
                    <Field label="Name" value={selected.customer_name} />
                    <Field label="Phone" value={selected.customer_phone} />
                    <Field label="Email" value={selected.customer_email} />
                  </Section>
                  <Section title="Event Details">
                    <Field label="Event Type" value={selected.event_type} />
                    <Field label="Date" value={selected.event_date ? new Date(selected.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
                    <Field label="Guests" value={selected.guest_count ? `${selected.guest_count} persons` : null} />
                    <Field label="Venue" value={selected.event_location} />
                  </Section>
                </div>
                {/* Right */}
                <div>
                  <Section title="Menu Selection">
                    <Field label="Set Menu" value={selected.menu_number ? `Menu ${selected.menu_number} — ${selected.menu_title || ''}` : 'Custom / No preference'} />
                    {selected.special_requests && <Field label="Requests / Custom Menu" value={selected.special_requests} />}
                  </Section>
                  <Section title="Financial">
                    <Field label="Estimated" value={selected.estimated_amount ? `₹${Number(selected.estimated_amount).toLocaleString('en-IN')}` : null} />
                    <Field label="Final Amount" value={selected.final_amount ? `₹${Number(selected.final_amount).toLocaleString('en-IN')}` : null} />
                    {selected.final_amount && <Field label="50% Advance" value={`₹${(Number(selected.final_amount) * 0.5).toLocaleString('en-IN')}`} />}
                  </Section>
                  {selected.admin_notes && (
                    <Section title="Admin Notes">
                      <div style={{ fontSize: '0.875rem', color: '#4A2800', lineHeight: 1.7, fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem' }}>{selected.admin_notes}</div>
                    </Section>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(184,134,11,0.2)' }}>
                <a href={`tel:${selected.customer_phone}`} className="btn btn-outline-gold btn-sm">📞 Call</a>
                <a href={`https://wa.me/${(selected.customer_phone || '').replace(/\D/g, '')}?text=Dear ${selected.customer_name},%0ARegarding your event catering quote ${selected.quote_number}...`}
                  target="_blank" rel="noreferrer" className="btn btn-sm" style={{ background: '#25D366', color: 'white' }}>💬 WhatsApp</a>
                <button onClick={() => exportRecordPDF(selected)} className="btn btn-gold btn-sm">📄 Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD RECORD MODAL ──────────────────────── */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div style={{ maxWidth: 720, width: '100%', maxHeight: '92vh', overflowY: 'auto', borderRadius: 18, background: 'white', border: '2px solid rgba(184,134,11,0.3)' }}>
            <div style={{ background: 'linear-gradient(135deg, #3D0008, #6B0010)', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '1rem', fontWeight: 800 }}>+ Add New Event Record</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#F0C040', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <div>
                  <SectionHeader>Customer Details</SectionHeader>
                  <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Customer full name" value={form.customer_name} onChange={e => updateField('customer_name', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Phone / WhatsApp *</label><input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.customer_phone} onChange={e => updateField('customer_phone', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="email@example.com" value={form.customer_email} onChange={e => updateField('customer_email', e.target.value)} /></div>
                </div>
                <div>
                  <SectionHeader>Event Details</SectionHeader>
                  <div className="form-group"><label className="form-label">Event Type</label>
                    <select className="form-select" value={form.event_type} onChange={e => updateField('event_type', e.target.value)}>
                      <option value="">Select type</option>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Event Date</label><input className="form-input" type="date" value={form.event_date} onChange={e => updateField('event_date', e.target.value)} /></div>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">No. of Guests</label><input className="form-input" type="number" placeholder="200" value={form.guest_count} onChange={e => updateField('guest_count', e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Venue / Location</label><input className="form-input" placeholder="Venue name, area" value={form.event_location} onChange={e => updateField('event_location', e.target.value)} /></div>
                </div>
              </div>

              <div style={{ height: 1, background: 'rgba(184,134,11,0.2)', margin: '8px 0 20px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <div>
                  <SectionHeader>Menu & Requests</SectionHeader>
                  <div className="form-group"><label className="form-label">Set Menu Number (1–19)</label><input className="form-input" type="number" placeholder="e.g. 4" min="1" max="19" value={form.selected_menu} onChange={e => updateField('selected_menu', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Custom Menu Items</label><textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="List custom dishes line by line..." value={form.custom_menu_items} onChange={e => updateField('custom_menu_items', e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Special Requests</label><textarea className="form-textarea" style={{ minHeight: 60 }} placeholder="Jain food, no onion-garlic, extra sweets..." value={form.special_requests} onChange={e => updateField('special_requests', e.target.value)} /></div>
                </div>
                <div>
                  <SectionHeader>Financial & Status</SectionHeader>
                  <div className="form-group"><label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => updateField('status', e.target.value)}>
                      {['pending','reviewed','quoted','confirmed','completed','cancelled'].map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Estimated (₹)</label><input className="form-input" type="number" placeholder="0" value={form.estimated_amount} onChange={e => updateField('estimated_amount', e.target.value)} /></div>
                    <div className="form-group" style={{ margin: 0 }}><label className="form-label">Final Amount (₹)</label><input className="form-input" type="number" placeholder="0" value={form.final_amount} onChange={e => updateField('final_amount', e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Admin Notes (Internal)</label><textarea className="form-textarea" style={{ minHeight: 80 }} placeholder="Internal notes about this event..." value={form.admin_notes} onChange={e => updateField('admin_notes', e.target.value)} /></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-maroon" style={{ flex: 1, justifyContent: 'center' }} onClick={handleAddRecord} disabled={saving}>
                  {saving ? '⏳ Saving...' : '💾 Save Event Record'}
                </button>
                <button className="btn btn-outline-gold" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Small helper components
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.65rem', fontWeight: 700, color: '#B8860B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, paddingBottom: 5, borderBottom: '1px solid rgba(184,134,11,0.2)' }}>{title}</div>
    {children}
  </div>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.7rem', fontWeight: 800, color: '#3D0008', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14, paddingBottom: 8, borderBottom: '2px solid rgba(184,134,11,0.25)' }}>{children as string}</div>
);

const Field = ({ label, value }: { label: string; value: any }) => (
  value ? (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#B8860B', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Cinzel,serif', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '0.88rem', color: '#1A0808', fontWeight: 500, lineHeight: 1.5 }}>{value}</div>
    </div>
  ) : null
);
