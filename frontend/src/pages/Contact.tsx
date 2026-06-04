import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const WA = '9879556507';
const WA_LINK = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) { alert('Please fill in required fields'); return; }
    setSending(true);

    // Send message via WhatsApp to business number
    const msg = `🍽️ *NEW MESSAGE - Maa Superior Caterers*\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n${form.email ? `*Email:* ${form.email}\n` : ''}*Message:*\n${form.message}`;
    const waUrl = WA_LINK(msg);

    setTimeout(() => {
      setSending(false);
      setSent(true);
      window.open(waUrl, '_blank');
    }, 600);
  };

  return (
    <>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #2D0000, #4A0000)', padding: '52px 0', textAlign: 'center' }}>
          <div className="container">
            <div className="chip" style={{ background: 'rgba(201,150,26,0.18)', color: '#F5C842', borderColor: 'rgba(201,150,26,0.35)', margin: '0 auto 14px' }}>Get In Touch</div>
            <h1 style={{ fontFamily: 'Cinzel,serif', color: '#F5C842', fontSize: 'clamp(1.8rem,4vw,2.6rem)', marginBottom: 10, fontWeight: 900 }}>Contact Us</h1>
            <div className="divider divider-center" />
            <p style={{ color: 'rgba(245,200,66,0.65)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem' }}>
              We're always happy to hear from you
            </p>
          </div>
        </div>

        <section style={{ padding: '60px 0 80px', background: 'var(--cream)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>

              {/* Info */}
              <div>
                <h2 style={{ fontFamily: 'Cinzel,serif', color: '#4A0000', fontSize: '1.2rem', fontWeight: 800, marginBottom: 28 }}>Reach Us Directly</h2>

                {[
                  {
                    icon: '📞',
                    title: 'Phone / WhatsApp',
                    content: <a href={`tel:${WA}`} style={{ color: '#4A0000', fontWeight: 800, fontSize: '1.15rem', textDecoration: 'none', fontFamily: 'Cinzel,serif' }}>+91 98795 56507</a>,
                  },
                  {
                    icon: '💬',
                    title: 'WhatsApp Chat',
                    content: <a href={WA_LINK("Hello! I need catering services.")} target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 700, textDecoration: 'none' }}>Chat instantly on WhatsApp →</a>,
                  },
                  {
                    icon: '👤',
                    title: 'Owner',
                    content: <span style={{ color: '#2D0000', fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem' }}>Vipul Gandhi</span>,
                  },
                  {
                    icon: '📍',
                    title: 'Address',
                    content: (
                      <span style={{ color: '#4A2800', lineHeight: 1.8, fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem' }}>
                        Maa Superior Caterers<br />
                        Nr Shantivan School,<br />
                        Opp Mataji Mandir,<br />
                        Old Mahavir Ice-Cream Godown,<br />
                        Vadodara, Gujarat
                      </span>
                    ),
                  },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', gap: 14, marginBottom: 20, padding: '16px 18px', background: 'white', borderRadius: 12, border: '1px solid rgba(201,150,26,0.2)', boxShadow: '0 2px 10px rgba(74,0,0,0.07)' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gold-pale)', border: '1px solid rgba(201,150,26,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'Cinzel,serif', color: '#C9961A', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 5 }}>{item.title}</div>
                      <div>{item.content}</div>
                    </div>
                  </div>
                ))}

                <a href="https://maps.google.com/?q=22.302866,73.225555" target="_blank" rel="noreferrer"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 150, background: 'linear-gradient(135deg, #C9961A, #E5B732)', borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(201,150,26,0.35)', marginTop: 4 }}>
                  <span style={{ fontSize: '2.4rem', marginBottom: 8 }}>📍</span>
                  <span style={{ fontFamily: 'Cinzel,serif', color: '#2D0000', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Open in Google Maps</span>
                  <span style={{ color: 'rgba(45,0,0,0.65)', fontSize: '0.75rem', marginTop: 4 }}>22.302866, 73.225555</span>
                </a>
              </div>

              {/* Form */}
              <div>
                <h2 style={{ fontFamily: 'Cinzel,serif', color: '#4A0000', fontSize: '1.2rem', fontWeight: 800, marginBottom: 28 }}>Send Us a Message</h2>
                {sent ? (
                  <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
                    <h3 style={{ fontFamily: 'Cinzel,serif', color: '#4A0000', marginBottom: 12 }}>Message Sent!</h3>
                    <p style={{ color: '#6A4A2A', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 24 }}>
                      Your message has been sent to Vipul Gandhi via WhatsApp. We will get back to you shortly!
                    </p>
                    <button className="btn btn-maroon" onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', message: '' }); }}>
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <div className="card" style={{ padding: '32px' }}>
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="form-group">
                        <label className="form-label">Your Name *</label>
                        <input className="form-input" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone / WhatsApp *</label>
                        <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email (Optional)</label>
                        <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Message *</label>
                        <textarea className="form-textarea" placeholder="Tell us about your event, requirements, or any queries..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                      </div>
                      <button type="submit" className="btn btn-maroon" style={{ width: '100%', justifyContent: 'center' }} disabled={sending}>
                        {sending ? '⏳ Sending...' : '💬 Send via WhatsApp'}
                      </button>
                      <div style={{ marginTop: 12, textAlign: 'center', fontSize: '0.78rem', color: '#8B5E3C', fontFamily: 'Cormorant Garamond,serif' }}>
                        Your message will open in WhatsApp to +91 98795 56507
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
