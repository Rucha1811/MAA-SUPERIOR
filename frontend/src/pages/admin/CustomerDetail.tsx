import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerApi } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    customerApi.get(id)
      .then(r => setCustomer(r.data))
      .catch(() => toast.error('Customer not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;
  if (!customer) return <div style={{ padding: 40, textAlign: 'center', color: '#8B6914' }}>Customer not found</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link to="/admin/customers" style={{ color: '#B8860B', textDecoration: 'none', fontSize: '0.85rem' }}>← Back to Customers</Link>
        <span style={{ color: '#D4A017' }}>›</span>
        <span style={{ fontFamily: 'Cinzel, serif', color: '#4A0000', fontSize: '0.85rem' }}>{customer.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {/* Profile */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4A0000, #B8860B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Cinzel, serif', fontSize: '1.4rem', color: '#FFD700', fontWeight: 700,
            }}>
              {customer.name[0]}
            </div>
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', color: '#2D0000', fontSize: '1.1rem', fontWeight: 700 }}>{customer.name}</div>
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                background: customer.is_active ? '#D1FAE5' : '#FEE2E2',
                color: customer.is_active ? '#065F46' : '#991B1B',
              }}>
                {customer.is_active ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>

          {[
            { label: 'Email', value: customer.email, href: `mailto:${customer.email}` },
            { label: 'Phone', value: customer.phone, href: `tel:${customer.phone}` },
            { label: 'Member Since', value: new Date(customer.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
            { label: 'Total Quotes', value: `${customer.quotations?.length || 0} requests` },
          ].map(field => (
            <div key={field.label} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(184,134,11,0.1)' }}>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.68rem', color: '#B8860B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{field.label}</div>
              {field.href ? (
                <a href={field.href} style={{ color: '#4A0000', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>{field.value || '—'}</a>
              ) : (
                <div style={{ color: '#2D0000', fontWeight: 500, fontSize: '0.9rem' }}>{field.value || '—'}</div>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {customer.phone && (
              <>
                <a href={`tel:${customer.phone}`} className="btn btn-sm btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}>📞 Call</a>
                <a href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                  className="btn btn-sm" style={{ flex: 1, background: '#25D366', color: 'white', justifyContent: 'center', fontSize: '0.78rem' }}>
                  💬 WhatsApp
                </a>
              </>
            )}
          </div>
        </div>

        {/* Quotation History */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(184,134,11,0.15)' }}>
            <h3 style={{ fontFamily: 'Cinzel, serif', color: '#2D0000', fontSize: '0.95rem' }}>Quote History</h3>
          </div>
          {(!customer.quotations || customer.quotations.length === 0) ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#8B6914', fontSize: '0.88rem' }}>No quotes yet</div>
          ) : (
            <div>
              {customer.quotations.map((q: any) => (
                <div key={q.id} style={{ padding: '16px 24px', borderBottom: '1px solid rgba(184,134,11,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.78rem', color: '#B8860B', fontWeight: 700 }}>{q.quote_number}</div>
                      <div style={{ fontSize: '0.88rem', color: '#2D0000', fontWeight: 500, marginTop: 2 }}>{q.event_type || 'Event'}</div>
                    </div>
                    <span className={`badge badge-${q.status}`}>{q.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: '#8B6914' }}>
                    {q.event_date && <span>📅 {new Date(q.event_date).toLocaleDateString('en-IN')}</span>}
                    {q.guest_count && <span>👥 {q.guest_count} guests</span>}
                    {q.final_amount && <span>💰 ₹{Number(q.final_amount).toLocaleString('en-IN')}</span>}
                  </div>
                  <Link to={`/admin/quotations/${q.id}`} style={{ display: 'inline-block', marginTop: 8, color: '#B8860B', fontSize: '0.78rem', textDecoration: 'none' }}>
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
