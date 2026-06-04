import React from 'react';
import { Link } from 'react-router-dom';
const WA = '9879556507';
const WA_LINK = (msg: string) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #1C0000 0%, #2D0000 100%)', borderTop: '2px solid rgba(201,150,26,0.4)', color: '#C8A87A', paddingTop: 56 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 40, paddingBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #C9961A, #F5C842)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cinzel,serif', fontWeight: 900, fontSize: '1.3rem', color: '#4A0000' }}>मा</div>
              <div>
                <div style={{ fontFamily: 'Cinzel,serif', fontWeight: 800, color: '#F5C842', fontSize: '1rem', lineHeight: 1.1 }}>Maa Superior</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(201,150,26,0.7)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Caterers</div>
              </div>
            </div>
            <p style={{ lineHeight: 1.8, color: '#A08060', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', marginBottom: 18 }}>
              Best Quality & Service Is Our Aim. Trusted for weddings, receptions, birthdays & all auspicious occasions across Gujarat.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={WA_LINK("Hello! I'd like to inquire about catering services.")} target="_blank" rel="noreferrer"
                style={{ width: 36, height: 36, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href={`tel:${WA}`} style={{ width: 36, height: 36, borderRadius: '50%', background: '#C9961A', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel,serif', color: '#F5C842', fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18, fontWeight: 700 }}>Quick Links</h4>
            {[['/', 'Home'], ['/menu', 'Our Menu'], ['/custom-menu', 'Custom Menu'], ['/gallery', 'Gallery'], ['/quote', 'Request Quote'], ['/contact', 'Contact Us']].map(([to, label]) => (
              <Link key={to} to={to} style={{ display: 'block', color: '#A08060', textDecoration: 'none', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F5C842')} onMouseLeave={e => (e.currentTarget.style.color = '#A08060')}>
                ◆ {label}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel,serif', color: '#F5C842', fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18, fontWeight: 700 }}>Our Services</h4>
            {['Wedding Catering', 'Reception Party', 'Birthday Celebrations', 'Vastu Pujan', 'Corporate Events', 'Religious Functions'].map(s => (
              <div key={s} style={{ color: '#A08060', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', marginBottom: 10 }}>◆ {s}</div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: 'Cinzel,serif', color: '#F5C842', fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18, fontWeight: 700 }}>Contact Us</h4>
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: '#C9961A', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Cinzel,serif' }}>Owner</div>
              <div style={{ color: 'rgba(245,200,66,0.9)', fontWeight: 700, fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem' }}>Vipul Gandhi</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: '#C9961A', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Cinzel,serif' }}>Phone / WhatsApp</div>
              <a href={`tel:${WA}`} style={{ color: '#F5C842', fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none', fontFamily: 'Cinzel,serif' }}>+91 98795 56507</a>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ color: '#C9961A', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Cinzel,serif' }}>Address</div>
              <div style={{ color: '#A08060', lineHeight: 1.8, fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem' }}>
                Maa Superior Caterers<br />Nr Shantivan School,<br />Opp Mataji Mandir,<br />Old Mahavir Ice-Cream Godown,<br />Vadodara, Gujarat
              </div>
            </div>
            <a href="https://maps.google.com/?q=22.302866,73.225555" target="_blank" rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #C9961A, #E5B732)', color: '#4A0000', padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: '0.75rem', fontWeight: 800, fontFamily: 'Cinzel,serif', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              📍 View on Map
            </a>
          </div>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,150,26,0.4), transparent)', margin: '0 0 24px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 28, flexWrap: 'wrap', gap: 12, fontSize: '0.8rem', color: '#6A4A2A' }}>
          <div>© {new Date().getFullYear()} Maa Superior Caterers. All rights reserved.</div>
          <div>Made with ❤️ for Vipul Gandhi & Family</div>
        </div>
      </div>

      {/* WhatsApp Float */}
      <a href={WA_LINK("Hello! I'd like to inquire about catering services.")} target="_blank" rel="noreferrer" className="whatsapp-float">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </footer>
  );
}
