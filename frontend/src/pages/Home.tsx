import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const WA = '9879556507';
const WA_LINK = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const services = [
  { icon: '💍', title: 'Wedding Catering', desc: 'Make your special day unforgettable with royal wedding catering.' },
  { icon: '🎉', title: 'Reception Party', desc: 'Elegant setups and exquisite food for your reception celebrations.' },
  { icon: '🎂', title: 'Birthday Party', desc: 'From intimate gatherings to grand celebrations, we cater it all.' },
  { icon: '🙏', title: 'Vastu Pujan', desc: 'Sacred occasions deserve the finest food, prepared with devotion.' },
  { icon: '🏢', title: 'Corporate Events', desc: 'Professional catering for conferences and corporate functions.' },
  { icon: '🎊', title: 'All Occasions', desc: 'No event too big or small — we bring the feast to every celebration.' },
];

const stats = [
  { value: '25+', label: 'Years Experience' },
  { value: '10,000+', label: 'Events Catered' },
  { value: '19', label: 'Set Menu Options' },
  { value: '500+', label: 'Menu Items' },
];

const testimonials = [
  { name: 'Priya Sharma', event: 'Wedding Reception', text: 'Maa Superior made our wedding feast absolutely royal. Every guest was amazed by the variety and taste!' },
  { name: 'Rajesh Patel', event: 'Birthday Celebration', text: 'Outstanding service and food quality. The paneer dishes were extraordinary. Highly recommended!' },
  { name: 'Kavita Desai', event: 'Vastu Pujan', text: 'Very professional and punctual. The Gujarati thali was authentic and delicious. Will always choose them.' },
];

export default function Home() {
  const [testi, setTesti] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTesti(p => (p + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Header />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D0000 0%, #2D0000 40%, #4A0000 70%, #1C0000 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', position: 'relative', overflow: 'hidden', paddingTop: 70,
      }}>
        {/* Gold orbs */}
        <div style={{ position: 'absolute', top: '8%', left: '4%', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,26,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '6%', right: '4%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,150,26,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Diagonal pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #C9961A 0, #C9961A 1px, transparent 0, transparent 50%)', backgroundSize: '22px 22px', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-up">
            {/* Ornament top */}
            <div className="ornament" style={{ marginBottom: 24 }}>
              <span style={{ fontFamily: 'Cinzel,serif', fontSize: '0.6rem', letterSpacing: '0.4em', color: 'rgba(201,150,26,0.8)', textTransform: 'uppercase' }}>
                Est. Since Decades · Best Quality & Service Is Our Aim
              </span>
            </div>

            {/* Gujarati script badge */}
            <div style={{ marginBottom: 20 }}>
              <span style={{
                fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 400, color: 'rgba(245,200,66,0.55)', letterSpacing: '0.1em', fontStyle: 'italic',
              }}>
                || श्री गणेशाय नमः ||
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Cinzel,serif', fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
              fontWeight: 900, lineHeight: 1.05, marginBottom: 6, letterSpacing: '0.02em',
            }}>
              <span className="gold-shimmer">Maa Superior</span>
            </h1>
            <h2 style={{
              fontFamily: 'Cinzel,serif', fontSize: 'clamp(1.1rem, 3vw, 2rem)',
              fontWeight: 400, color: 'rgba(245,200,66,0.7)',
              letterSpacing: '0.35em', marginBottom: 6, textTransform: 'uppercase',
            }}>
              Caterers
            </h2>

            {/* Tagline badge */}
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(74,0,0,0.8), rgba(107,0,0,0.8))',
              border: '1px solid rgba(201,150,26,0.5)',
              borderRadius: 50, padding: '7px 24px', margin: '12px 0 28px',
            }}>
              <span style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', color: '#F5C842', fontStyle: 'italic', letterSpacing: '0.08em' }}>
                मा सुपीरियर कैटरर्स — Maa Superior Caterers
              </span>
            </div>

            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #C9961A, #F5C842, #C9961A, transparent)', maxWidth: 480, margin: '0 auto 28px' }} />

            <p style={{
              fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              color: 'rgba(245,200,66,0.75)', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px',
            }}>
              "Best Quality & Service Is Our Aim"
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/quote" className="btn btn-gold btn-lg">🍽️ Get Free Quote</Link>
              <Link to="/menu" className="btn btn-outline-light btn-lg">View Our Menu</Link>
              <a href={WA_LINK("Hello! I'd like to inquire about catering services for my event.")}
                target="_blank" rel="noreferrer"
                className="btn btn-lg" style={{ background: '#25D366', color: 'white' }}>
                💬 WhatsApp Us
              </a>
            </div>

            {/* Contact quick */}
            <div style={{ marginTop: 40, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={`tel:${WA}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(201,150,26,0.8)', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'Cinzel,serif', letterSpacing: '0.06em' }}>
                📞 <span style={{ color: '#F5C842', fontWeight: 700 }}>+91 98795 56507</span>
              </a>
              <div style={{ color: 'rgba(201,150,26,0.5)', fontSize: '0.78rem', fontFamily: 'Cinzel,serif', letterSpacing: '0.06em' }}>
                📍 Vadodara, Gujarat
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)' }}>
          <div style={{ width: 26, height: 44, border: '2px solid rgba(201,150,26,0.4)', borderRadius: 13, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: '#C9961A', borderRadius: 2, animation: 'scrollDot 1.5s infinite' }} />
          </div>
        </div>
        <style>{`@keyframes scrollDot{0%{transform:translateY(0);opacity:1}100%{transform:translateY(12px);opacity:0}}`}</style>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #C9961A, #E5B732, #C9961A)', padding: '36px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 24, textAlign: 'center' }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, color: '#2D0000', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'rgba(45,0,0,0.75)', marginTop: 6, fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>
            <div>
              <div className="chip">Our Story</div>
              <h2 className="section-title">Royal Catering <span className="accent">Experience</span> in Gujarat</h2>
              <div className="divider" />
              <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.15rem', lineHeight: 1.9, color: '#4A2800', marginBottom: 18 }}>
                Maa Superior Caterers has been serving families across Vadodara and Gujarat for decades. Under the dedicated leadership of <strong>Vipul Gandhi</strong>, we have built an unmatched reputation for excellence, authenticity, and royal hospitality.
              </p>
              <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem', lineHeight: 1.85, color: '#4A2800', marginBottom: 32 }}>
                From intimate family gatherings to grand wedding celebrations, our team ensures every meal is prepared with love, the finest ingredients, and presented with royal elegance befitting the occasion.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/quote" className="btn btn-maroon">Book Now</Link>
                <Link to="/menu" className="btn btn-outline-gold">Explore Menu</Link>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #2D0000, #4A0000)', borderRadius: 20, padding: 36, border: '1px solid rgba(201,150,26,0.35)', boxShadow: '0 16px 60px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(201,150,26,0.12)' }} />
              <div style={{ fontFamily: 'Cinzel,serif', fontSize: '2.5rem', color: '#F5C842', marginBottom: 4 }}>मा</div>
              <div style={{ fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', color: 'rgba(201,150,26,0.7)', fontSize: '0.9rem', marginBottom: 24, letterSpacing: '0.08em' }}>
                Maa Superior Caterers
              </div>
              {[
                ['🏅', 'Premium Quality Ingredients'],
                ['👨‍🍳', 'Expert Chefs & Dedicated Staff'],
                ['🎨', 'Beautiful Royal Presentation'],
                ['⏰', 'Always On Time, Every Time'],
                ['🤝', 'Trusted by 10,000+ Families'],
                ['💬', 'Easy WhatsApp Booking'],
                ['🍽️', '500+ Dishes, 19 Set Menus'],
              ].map(([icon, text]) => (
                <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 13 }}>
                  <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                  <span style={{ color: 'rgba(245,200,66,0.85)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.05rem' }}>{text as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--cream-dark)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="chip" style={{ margin: '0 auto 14px' }}>What We Offer</div>
          <h2 className="section-title">Our <span className="accent">Catering</span> Services</h2>
          <div className="divider divider-center" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginTop: 40 }}>
            {services.map(s => (
              <div key={s.title} className="card" style={{ padding: 28, textAlign: 'center', transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 16px 48px rgba(201,150,26,0.22)'; el.style.borderColor = 'rgba(201,150,26,0.4)'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = ''; el.style.borderColor = ''; }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'Cinzel,serif', fontSize: '0.85rem', color: '#4A0000', marginBottom: 10, fontWeight: 700, letterSpacing: '0.06em' }}>{s.title}</h3>
                <p style={{ color: '#6A4A2A', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENU PREVIEW ──────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #1C0000, #2D0000, #4A0000)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="chip" style={{ background: 'rgba(201,150,26,0.18)', color: '#F5C842', borderColor: 'rgba(201,150,26,0.35)', margin: '0 auto 14px' }}>Our Cuisine</div>
          <h2 className="section-title" style={{ color: '#F5C842' }}>A <span style={{ color: '#E5B732' }}>Royal Feast</span> For Every Occasion</h2>
          <div className="divider divider-center" />
          <p style={{ color: 'rgba(245,200,66,0.65)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.15rem', maxWidth: 640, margin: '0 auto 48px', lineHeight: 1.85 }}>
            From refreshing cold appetizers and sumptuous Gujarati thalis to exotic Rajasthani specialties and decadent sweets — our menu spans 500+ dishes across 25+ categories.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: 14, marginBottom: 48 }}>
            {[
              ['🥤', 'Cold Appetizers', '19 varieties'],
              ['🧀', 'Paneer Dishes', '32 specialties'],
              ['🥘', 'Vegetables & Curries', '60+ dishes'],
              ['🍚', 'Rice & Pulao', '12 options'],
              ['🍬', 'Sweets & Desserts', '50+ treats'],
              ['🌍', 'Regional Cuisines', 'Raj / Guj / South'],
            ].map(([emoji, label, count]) => (
              <div key={label as string} style={{
                background: 'rgba(201,150,26,0.1)', border: '1px solid rgba(201,150,26,0.25)',
                borderRadius: 12, padding: '20px 14px', transition: 'all 0.3s', cursor: 'default',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,150,26,0.22)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,150,26,0.1)'}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{emoji}</div>
                <div style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, color: '#F5C842', fontSize: '0.75rem', marginBottom: 4 }}>{label as string}</div>
                <div style={{ color: 'rgba(201,150,26,0.6)', fontSize: '0.72rem' }}>{count as string}</div>
              </div>
            ))}
          </div>
          <Link to="/menu" className="btn btn-gold btn-lg">Explore Full Menu →</Link>
          <Link to="/custom-menu" className="btn btn-lg btn-outline-light" style={{ marginLeft: 12 }}>✦ Build Your Menu</Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--cream)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="chip" style={{ margin: '0 auto 14px' }}>Happy Clients</div>
          <h2 className="section-title">What Our <span className="accent">Guests</span> Say</h2>
          <div className="divider divider-center" />
          <div style={{ maxWidth: 660, margin: '40px auto 0' }}>
            <div className="card" style={{ padding: '36px 40px', position: 'relative', border: '1px solid rgba(201,150,26,0.25)' }}>
              <div style={{ fontSize: '5rem', color: 'rgba(201,150,26,0.18)', position: 'absolute', top: 4, left: 20, lineHeight: 1, fontFamily: 'serif', userSelect: 'none', pointerEvents: 'none' }}>"</div>
              <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.25rem', fontStyle: 'italic', color: '#2D0000', lineHeight: 1.85, marginBottom: 22, position: 'relative', zIndex: 1 }}>
                {testimonials[testi].text}
              </p>
              <div style={{ fontFamily: 'Cinzel,serif', color: '#C9961A', fontSize: '0.82rem', fontWeight: 700 }}>— {testimonials[testi].name}</div>
              <div style={{ color: '#8B5E3C', fontSize: '0.78rem', marginTop: 4, fontFamily: 'Cormorant Garamond,serif' }}>{testimonials[testi].event}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTesti(i)} style={{ width: i === testi ? 24 : 8, height: 8, borderRadius: 4, background: i === testi ? '#C9961A' : 'rgba(201,150,26,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section style={{ padding: '72px 0', background: 'linear-gradient(135deg, #C9961A, #E5B732, #C9961A)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: '#2D0000', marginBottom: 12, fontWeight: 900 }}>
            Ready to Plan Your Event?
          </h2>
          <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.2rem', color: 'rgba(45,0,0,0.8)', marginBottom: 36, maxWidth: 560, margin: '0 auto 36px' }}>
            Contact us today for a free consultation and personalised quote. We make every occasion truly royal.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/quote" className="btn btn-maroon btn-lg">Get Free Quote</Link>
            <a href={WA_LINK("Hello! I need catering for my event.")} target="_blank" rel="noreferrer"
              className="btn btn-lg" style={{ background: '#25D366', color: 'white' }}>💬 WhatsApp Now</a>
            <a href={`tel:${WA}`} className="btn btn-lg" style={{ background: 'rgba(45,0,0,0.85)', color: '#F5C842' }}>📞 Call Us</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
