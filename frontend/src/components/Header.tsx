import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);
  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/custom-menu', label: 'Custom Menu' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
  ];
  const active = (p: string) => location.pathname === p;

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: scrolled
          ? 'rgba(74,0,0,0.97)'
          : 'linear-gradient(180deg, rgba(74,0,0,0.96), rgba(107,0,0,0.92))',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(201,150,26,0.3)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: 'linear-gradient(135deg, #C9961A, #F5C842)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: '1.3rem',
              color: '#4A0000', boxShadow: '0 3px 14px rgba(201,150,26,0.5)',
              flexShrink: 0,
            }}>मा</div>
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.0rem', fontWeight: 800, color: '#F5C842', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                Maa Superior
              </div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(201,150,26,0.8)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Caterers
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desk-nav">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '8px 14px', borderRadius: 7, fontSize: '0.72rem',
                fontFamily: 'Cinzel, serif', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', textDecoration: 'none',
                color: active(l.to) ? '#F5C842' : 'rgba(245,200,66,0.65)',
                background: active(l.to) ? 'rgba(201,150,26,0.18)' : 'transparent',
                borderBottom: active(l.to) ? '2px solid #C9961A' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!active(l.to)) (e.currentTarget as HTMLElement).style.color = '#F5C842'; }}
                onMouseLeave={e => { if (!active(l.to)) (e.currentTarget as HTMLElement).style.color = 'rgba(245,200,66,0.65)'; }}
              >{l.label}</Link>
            ))}
            <Link to="/quote" className="btn btn-gold btn-sm" style={{ marginLeft: 10 }}>Book Now</Link>
          </nav>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="ham-btn"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2,
                background: '#F5C842', borderRadius: 2, transition: 'all 0.3s',
                opacity: menuOpen && i === 1 ? 0 : 1,
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                  : i === 2 ? 'rotate(-45deg) translate(4px,-5px)' : 'none'
                  : 'none',
              }} />
            ))}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: 'rgba(74,0,0,0.98)', borderTop: '1px solid rgba(201,150,26,0.25)', padding: '12px 24px 20px' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{
                display: 'block', padding: '12px 0', fontFamily: 'Cinzel, serif', fontSize: '0.8rem',
                fontWeight: 600, letterSpacing: '0.1em', color: active(l.to) ? '#F5C842' : 'rgba(245,200,66,0.7)',
                textDecoration: 'none', borderBottom: '1px solid rgba(201,150,26,0.15)',
              }}>{l.label}</Link>
            ))}
            <Link to="/quote" className="btn btn-gold" style={{ display: 'block', textAlign: 'center', marginTop: 14 }}>Book Now</Link>
          </div>
        )}
      </header>
      <style>{`@media(max-width:768px){.desk-nav{display:none!important}.ham-btn{display:flex!important}}`}</style>
    </>
  );
}
