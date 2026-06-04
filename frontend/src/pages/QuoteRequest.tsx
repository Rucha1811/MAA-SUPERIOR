import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { quotationApi } from '../lib/api';

const WA = '9879556507';
const EVENT_TYPES = ['Wedding', 'Reception Party', 'Birthday Party', 'Vastu Pujan', 'Anniversary', 'Corporate Event', 'Religious Function', 'Engagement', 'Other'];

const PRESET_MENUS: Record<number, { title: string; items: string[] }> = {
  1:  { title: 'Classic Vegetarian',   items: ['Tomato Soup','Sitafal Basoodi','Kaju Pina Sandwich','Garam Puri','Butter Nan','Paneer Korma','Sev Boondi Capsicum','Lilva Wonton','Makai Corn','Lili Chatni','Delhi Chat','Paneer Chilla','Hakka Noodles','Dal Fry','Mix Achar','Mukhwas','Ice Cream','Mineral Water'] },
  2:  { title: 'Festive Special',       items: ['Minestrone Soup','Anjeer Kedabari Basoodi','Coconut Delight','Puri Garam','Amali Roti','Chainese Bhel','Lachha Kachori','Alu Tikka','Bar Becyu Chat','Manchurian Gravy','Papad Fry','Gujarati Dal','Plain Rice','Tawa Thalji','Mini Undhiyu','Red Sauce','Mukhwas','Ice Cream','Mineral Water'] },
  3:  { title: 'Grand Celebration',     items: ['Minestrone Soup','Anjeer Kedabari Basoodi','Coconut Delight','Puri Garam','Amali Roti','Chainese Bhel','Lachha Kachori','Alu Tikka','Bar Becyu Chat','Manchurian Gravy','Papad Fry','Gujarati Dal','Plain Rice','Tawa Thalji','Mini Undhiyu','Mukhwas','Ice Cream','Mix Achar','Mineral Water'] },
  4:  { title: 'Royal Thali',           items: ['Hot & Sour Soup','Shahi Rabdi','Halwo','Locha Puri','Mithi Roti','Paneer Pasanda','Rajasthani Bataki','Tava Vegetable','Lilva Korns','Mini Honsa','Red Sauce','Dal Hyderabadi','Jeera Rice','Chilli Paneer','Manchurian','Papad Fry','Mukhwas','Lemon Chilli Achar','Mineral Water'] },
  5:  { title: 'Premium Select',        items: ['Corn Tomato Soup','Rabdi Jvadi','Anjeer Halwa','Locha Puri','Amali Roti','Jodhpuri Bataki','Mini Undhiyu','Paneer Capsicum','In Mutter','Bel','Hyderabadi Chilla','Sbaka Kadhi','Pulav Dry Fruit','Palak Paneer','Capsicum Alu Tikki','Papads','Red Sauce','Mukhwas','Mix Achar','Mineral Water'] },
  6:  { title: 'Spice Garden',          items: ['Chilli Beans Soup','Cream Flavour','Kaju Anjeer Tapapuri','Tanduri Roti','Locha Puri','Sarso Da Shak','Chilli Boondi Shak','Paneer Tikka','Batakani Chips','Red Sauce','Chat Basket','Gujarati Dal','Plain Bhat','Papad Mix Fry','Mukhwas','Draksanu Athanu','Mineral Water'] },
  7:  { title: 'Fusion Feast',          items: ['Vegetable Noodles with Tomato Soup','Anguri Rabdi','Badam Halwa','Methina Thepla','Locha Puri','Naan','Jayapuri Vegetable','Panjabi Flavar','Potato Chips','Chainese Samosa','Khasta Kachori','Delhi Chat','Mini Uttapam','American Chopsi','Fry Chilli Paneer','Red Sauce','Green Chatni','Raiwala Vadavani Marcha','Kadhi Sbokavali','Pulav Kaju Flas','Papads Bested','Mineral Water'] },
  8:  { title: 'Maharaja Special',      items: ['Palak Flavar Soup','Kala Jam','Locha Puri','Angur Basoodi','Butter Nan','Shahi Paneer','Rajasthani Bataka','Sev Boondi Capsicum','Lilva Konas','Chat Basket','Red Sauce','Dasabari Kabab','Manchurian with Fry Rice','Dal Kadhi','Veg Oli Ariyani','Papads Fry','Samtanu','Mineral Water'] },
  9:  { title: 'Exotic Blend',          items: ['Noodles with Butter Stick Soup','Basoodi','Coconut Halwa','Locha Puri','Methi Na Thepla','Malai Kofta','Sev Boondi Capsicum','Potato Chips','Ratala Pettis','Corn Basket','Red Sauce','Green Chatni','Gujarati Kadhi','Green Pis Pulav','Papad Fry','Mix Khadu Athanu','Mineral Water'] },
  10: { title: 'Heritage Menu',         items: ['Corn Soup','Kaju Paina Sendvich','Locha Puri','Amali Roti','Methi Chaman with Paneer','Falavar Vatana','Barel Parvar','Dhosana Rolls','Dhdhino Halwo','Green Chatni','Alu Tikki','Chainese Bhel','Rai Vala Marcha','Green Salad','Plain Bhat','Papad Mix Fry','Mukhwas','Draksanu Athanu','Mineral Water'] },
  11: { title: 'South-North Fusion',    items: ['Tomato Rasm','Dry Fruit Cream with Anguri','Kaju Pista Kamal','Locha Puri','Masala Naan','Tava Thalji','Fansdi Makai','Vatana In Palak Grevi','Idskola Fry','Paneer Chilla','Methi Bajina Dhokla','Red Sauce','Paneer Cholla','Dhis-Ko Rolls','Green Dal','Plain Basmati Rice','Rajasthani Khchida','Mix Papads','Gajar Libunu Athanu','Mineral Water'] },
  12: { title: 'Palak Corn Special',    items: ['Palakno Corn Soup','Indhrani','Kaju Koprana Rolls','Locha Puri','Methi Naan','Butter Paneer Korma','Mini Undhiyu','Bindi Masala','Bermis Roll','Ratala Handvo','Red Sauce','Samosa Chat','Manchurian n Fry Rice','Dal Kadhi','Veg Oily Ariyani','Papad Fry','Samtanu','Mineral Water'] },
  13: { title: 'Rajasthani Thali',      items: ['Dal (Panchranga)','Baati','Churma','Gatta Nu Shak','Ringan Batakanu Shak','Khasta Kachori','Lili Chatni','Rajasthani Kadhi','Rajasthani Khichida','Mula Nu Salad','Ghewer'] },
  14: { title: 'Makai Special',         items: ['Makaini Roti','Sarso Da Shak','Tanduri','Paneer Korma','Rajbhog Motha','Dal Fry','Jeera Rice','Jwar Mix Fry Chayms'] },
  15: { title: 'Simple Gujarati',       items: ['Chole','Bhature','Dal Fry','Jeera Rice','Kala Jamun','Green Salad','Papads'] },
  16: { title: 'Mini Thali',            items: ['Parotha','Shak','Kadhi','Pulao','Jalebi','Papdi'] },
  17: { title: 'Puri Moti Bhoj',        items: ['Puri Moti','Shak','Dal-Bhat','Papads','Mahi'] },
  18: { title: 'Traditional Gujarati',  items: ['Fada Lapsi','Puri','Gota','Batakanu Shak','Deshi Chana','Dal','Bhat','Papads','Salad'] },
  19: { title: 'Festive Bhoj',          items: ['Chokha Ghina Ladu','Puri','Fulvadi','Batakanu Rasavalu Shak','Ek Green Shak','Deshi Chana/Val','Gujarati Dal','Plain Bhat','Papads','Green Salad','Ravanu'] },
};

export default function QuoteRequest() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [quoteNum, setQuoteNum] = useState('');
  const [menuPreview, setMenuPreview] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    event_type: '', event_date: '', event_location: '',
    guest_count: '', selected_menu: '', special_requests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?[\d\s\-]{8,15}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const generateQuoteNum = () => {
    const now = new Date();
    return `MSC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleSubmit = async () => {
    const qNum = generateQuoteNum();
    setQuoteNum(qNum);

    // Build WhatsApp message to admin
    const menuInfo = form.selected_menu
      ? `Menu ${form.selected_menu} — ${PRESET_MENUS[parseInt(form.selected_menu)]?.title || ''}`
      : 'Custom / No preference';

    const adminMsg =
      `🔔 *NEW QUOTE REQUEST — Maa Superior Caterers*\n\n` +
      `*Quote #:* ${qNum}\n` +
      `*Name:* ${form.name}\n` +
      `*Phone:* ${form.phone}\n` +
      (form.email ? `*Email:* ${form.email}\n` : '') +
      `*Event:* ${form.event_type || 'Not specified'}\n` +
      `*Date:* ${form.event_date ? new Date(form.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not specified'}\n` +
      `*Guests:* ${form.guest_count || 'Not specified'}\n` +
      `*Venue:* ${form.event_location || 'Not specified'}\n` +
      `*Menu:* ${menuInfo}\n` +
      (form.special_requests ? `*Special Requests:* ${form.special_requests}\n` : '') +
      `\n_Please respond promptly! 🙏_`;

    // Save to backend DB (fire and forget — don't block WhatsApp redirect)
    try {
      await quotationApi.submit({
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || null,
        event_type: form.event_type || null,
        event_date: form.event_date || null,
        event_location: form.event_location || null,
        guest_count: form.guest_count ? parseInt(form.guest_count) : null,
        selected_menu_number: form.selected_menu ? parseInt(form.selected_menu) : null,
        special_requests: form.special_requests || null,
      });
    } catch {
      // Silently ignore DB errors — WhatsApp notification is the primary flow
    }

    setSubmitted(true);
    setTimeout(() => {
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(adminMsg)}`, '_blank');
    }, 1200);
  };

  const sendCustomerConfirmation = () => {
    const cleanPhone = form.phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const msg =
      `Dear ${form.name},\n\n` +
      `Thank you for choosing *Maa Superior Caterers* 🍽️\n\n` +
      `Your catering quote request has been received!\n` +
      `*Quote Reference:* ${quoteNum}\n\n` +
      `Our team will review your requirements and contact you within 24 hours.\n\n` +
      `For urgent queries:\n📞 *+91 98795 56507* (Vipul Gandhi)\n\n` +
      `_Best Regards,_\n*Vipul Gandhi*\nMaa Superior Caterers 🙏`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (submitted) return (
    <>
      <Header />
      <div style={{ paddingTop: 70, minHeight: '100vh', background: 'linear-gradient(135deg, #1C0000, #2D0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ maxWidth: 540, width: '100%' }}>
          <div className="card" style={{ padding: '44px 40px', textAlign: 'center', border: '1px solid rgba(201,150,26,0.3)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #C9961A, #E5B732)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px', boxShadow: '0 6px 20px rgba(201,150,26,0.4)' }}>✓</div>
            <h2 style={{ fontFamily: 'Cinzel,serif', color: '#4A0000', fontSize: '1.4rem', marginBottom: 8, fontWeight: 800 }}>Quote Request Submitted!</h2>
            <p style={{ color: '#6A4A2A', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.05rem', marginBottom: 20 }}>Thank you, {form.name}!</p>

            <div style={{ background: 'linear-gradient(135deg, #FDF5DC, #FFF8E8)', border: '2px dashed rgba(201,150,26,0.5)', borderRadius: 12, padding: '16px 24px', marginBottom: 24 }}>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.62rem', color: '#C9961A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Your Quote Reference</div>
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: '1.4rem', fontWeight: 900, color: '#2D0000' }}>{quoteNum}</div>
            </div>

            {/* Summary */}
            <div style={{ background: '#FDF8F0', borderRadius: 10, padding: '14px 18px', marginBottom: 24, textAlign: 'left' }}>
              {[
                ['Event', form.event_type],
                ['Date', form.event_date ? new Date(form.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null],
                ['Guests', form.guest_count ? `${form.guest_count} persons` : null],
                ['Menu', form.selected_menu ? `Menu ${form.selected_menu} — ${PRESET_MENUS[parseInt(form.selected_menu)]?.title}` : 'Custom'],
              ].filter(([, v]) => v).map(([l, v]) => (
                <div key={l as string} style={{ display: 'flex', gap: 10, marginBottom: 7, fontSize: '0.875rem' }}>
                  <span style={{ color: '#8B5E3C', minWidth: 50 }}>{l}:</span>
                  <span style={{ color: '#1A0A00', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 8, padding: '11px 16px', marginBottom: 20, fontSize: '0.875rem', color: '#065F46', textAlign: 'left' }}>
              ✅ Admin has been notified via WhatsApp. We will contact you within 24 hours.
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={sendCustomerConfirmation} className="btn btn-maroon" style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem' }}>
                💬 Send Me Confirmation
              </button>
              <a href="/" className="btn btn-outline-gold btn-sm" style={{ flex: 1, justifyContent: 'center' }}>← Home</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #2D0000, #4A0000)', padding: '52px 0', textAlign: 'center' }}>
          <div className="container">
            <div className="chip" style={{ background: 'rgba(201,150,26,0.18)', color: '#F5C842', borderColor: 'rgba(201,150,26,0.35)', margin: '0 auto 14px' }}>Free Consultation</div>
            <h1 style={{ fontFamily: 'Cinzel,serif', color: '#F5C842', fontSize: 'clamp(1.8rem,4vw,2.6rem)', marginBottom: 10, fontWeight: 900 }}>Request a Quote</h1>
            <div className="divider divider-center" />
            <p style={{ color: 'rgba(245,200,66,0.65)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem' }}>Fill in the details and we'll get back to you within 24 hours</p>
          </div>
        </div>

        <div style={{ background: 'var(--cream)', padding: '48px 0 64px' }}>
          <div className="container">
            {/* Steps */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, marginBottom: 40, maxWidth: 440, margin: '0 auto 40px' }}>
              {[{ n: 1, label: 'Your Info', icon: '👤' }, { n: 2, label: 'Event', icon: '📅' }, { n: 3, label: 'Menu & Notes', icon: '🍽️' }].map((s, i) => (
                <React.Fragment key={s.n}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: step > s.n ? 'linear-gradient(135deg, #27AE60, #2ECC71)' : step === s.n ? 'linear-gradient(135deg, #C9961A, #E5B732)' : 'rgba(201,150,26,0.15)',
                      color: step >= s.n ? (step === s.n ? '#2D0000' : 'white') : '#8B5E3C',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: step > s.n ? '1.1rem' : '0.95rem', fontWeight: 800,
                      boxShadow: step === s.n ? '0 4px 16px rgba(201,150,26,0.45)' : 'none',
                      transition: 'all 0.3s',
                    }}>
                      {step > s.n ? '✓' : s.icon}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: step >= s.n ? '#2D0000' : '#8B5E3C', marginTop: 6, fontFamily: 'Cinzel,serif', letterSpacing: '0.06em' }}>{s.label}</div>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: 2, background: step > s.n ? '#27AE60' : 'rgba(201,150,26,0.25)', maxWidth: 60, margin: '0 4px', marginBottom: 24, transition: 'background 0.3s' }} />}
                </React.Fragment>
              ))}
            </div>

            <div className="card" style={{ maxWidth: 620, margin: '0 auto', padding: '36px 40px', border: '1px solid rgba(201,150,26,0.25)' }}>
              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <h3 style={{ fontFamily: 'Cinzel,serif', color: '#2D0000', fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>Your Contact Details</h3>
                  <p style={{ color: '#8B5E3C', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', marginBottom: 24 }}>We'll use these to reach you with the personalised quote.</p>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)} />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone / WhatsApp *</label>
                    <input className="form-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                    <div style={{ fontSize: '0.75rem', color: '#8B5E3C', marginTop: 4 }}>Confirmation will be sent via WhatsApp</div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email (Optional)</label>
                    <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <button className="btn btn-maroon" style={{ width: '100%', justifyContent: 'center' }} onClick={() => { if (validateStep1()) setStep(2); }}>
                    Continue to Event Details →
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <h3 style={{ fontFamily: 'Cinzel,serif', color: '#2D0000', fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>Event Details</h3>
                  <p style={{ color: '#8B5E3C', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', marginBottom: 24 }}>Tell us about your event so we can plan the perfect menu.</p>
                  <div className="form-group">
                    <label className="form-label">Type of Event</label>
                    <select className="form-select" value={form.event_type} onChange={e => update('event_type', e.target.value)}>
                      <option value="">Select event type</option>
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Event Date</label>
                      <input className="form-input" type="date" value={form.event_date} onChange={e => update('event_date', e.target.value)} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">No. of Guests</label>
                      <input className="form-input" type="number" placeholder="e.g. 200" min="1" value={form.guest_count} onChange={e => update('guest_count', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Venue / Location</label>
                    <input className="form-input" placeholder="Venue name, area, city" value={form.event_location} onChange={e => update('event_location', e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-outline-gold" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-maroon" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(3)}>Continue to Menu →</button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div>
                  <h3 style={{ fontFamily: 'Cinzel,serif', color: '#2D0000', fontSize: '1.1rem', fontWeight: 800, marginBottom: 6 }}>Menu Preference</h3>
                  <p style={{ color: '#8B5E3C', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', marginBottom: 24 }}>Choose a preset menu or describe your custom requirements below.</p>

                  <div className="form-group">
                    <label className="form-label">Select a Set Menu (Optional)</label>
                    <select className="form-select" value={form.selected_menu}
                      onChange={e => { update('selected_menu', e.target.value); setMenuPreview(e.target.value ? parseInt(e.target.value) : null); }}>
                      <option value="">No preference / Describe below</option>
                      {Object.entries(PRESET_MENUS).map(([num, m]) => (
                        <option key={num} value={num}>Menu {num} — {m.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Menu Preview */}
                  {menuPreview && PRESET_MENUS[menuPreview] && (
                    <div style={{ background: 'linear-gradient(135deg, #FDF5DC, #FFF8E8)', border: '1.5px solid rgba(201,150,26,0.4)', borderRadius: 12, padding: '16px 18px', marginBottom: 18 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontFamily: 'Cinzel,serif', fontWeight: 800, color: '#4A0000', fontSize: '0.85rem' }}>Menu {menuPreview} — {PRESET_MENUS[menuPreview].title}</div>
                        <span style={{ background: 'linear-gradient(135deg, #C9961A, #E5B732)', color: '#2D0000', padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 800, fontFamily: 'Cinzel,serif' }}>
                          {PRESET_MENUS[menuPreview].items.length} Dishes
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 6 }}>
                        {PRESET_MENUS[menuPreview].items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#4A2800', fontFamily: 'Cormorant Garamond,serif', fontSize: '0.95rem' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9961A', flexShrink: 0 }} />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Special Requests / Requirements</label>
                    <textarea className="form-textarea" style={{ minHeight: 100 }}
                      placeholder="E.g. Jain food, no onion-garlic, extra sweet dishes, specific items, service style..."
                      value={form.special_requests} onChange={e => update('special_requests', e.target.value)} />
                  </div>

                  {/* Summary */}
                  <div style={{ background: '#FDF8F0', border: '1px solid rgba(201,150,26,0.2)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                    <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.62rem', color: '#C9961A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Booking Summary</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px', fontSize: '0.83rem' }}>
                      {[['Name', form.name], ['Phone', form.phone], ['Event', form.event_type || 'Not set'], ['Date', form.event_date || 'Not set'], ['Guests', form.guest_count || 'Not set'], ['Menu', form.selected_menu ? `Menu ${form.selected_menu}` : 'Custom']].map(([l, v]) => (
                        <div key={l} style={{ display: 'flex', gap: 6 }}>
                          <span style={{ color: '#8B5E3C', minWidth: 42, fontFamily: 'Cinzel,serif', fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', paddingTop: 2 }}>{l}:</span>
                          <span style={{ color: '#1A0A00', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-outline-gold" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn btn-maroon" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }} onClick={handleSubmit}>
                      🎯 Submit & Notify Admin
                    </button>
                  </div>
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8B5E3C', marginTop: 10, fontFamily: 'Cormorant Garamond,serif' }}>
                    On submit, WhatsApp will open to notify Vipul Gandhi (+91 98795 56507) instantly.
                  </p>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: 28, color: '#8B5E3C', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem' }}>
              Prefer to talk directly? Call or WhatsApp{' '}
              <a href={`tel:${WA}`} style={{ color: '#C9961A', fontWeight: 700, textDecoration: 'none' }}>+91 98795 56507</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
