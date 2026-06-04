import React, { useEffect, useState } from 'react';
import { settingsApi } from '../../lib/api';
import toast from 'react-hot-toast';

const GROUPS = [
  {
    title:'Business Information', icon:'🏢',
    fields:[
      { key:'business_name', label:'Business Name', type:'text', placeholder:'Maa Superior Caterers' },
      { key:'tagline', label:'Tagline / Slogan', type:'text', placeholder:'Best Quality & Service Is Our Aim' },
      { key:'owner_name', label:'Owner Name', type:'text', placeholder:'Vipul Gandhi' },
    ],
  },
  {
    title:'Contact Details', icon:'📞',
    fields:[
      { key:'phone', label:'Phone Number', type:'tel', placeholder:'9879556507' },
      { key:'whatsapp', label:'WhatsApp Number', type:'tel', placeholder:'9879556507' },
      { key:'address', label:'Address', type:'textarea', placeholder:'Nr Shantivan School, Opp Mataji Mandir...' },
      { key:'google_maps_url', label:'Google Maps URL', type:'url', placeholder:'https://maps.google.com/?q=...' },
    ],
  },
  {
    title:'Business Rules', icon:'⚖️',
    fields:[
      { key:'advance_percent', label:'Advance Payment (%)', type:'number', placeholder:'50' },
      { key:'currency', label:'Currency', type:'text', placeholder:'INR' },
    ],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    settingsApi.get()
      .then(r => setSettings(r.data))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(s => ({ ...s, [key]: value }));
    setChanged(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(settings);
      toast.success('Settings saved successfully!');
      setChanged(false);
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>;

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Settings</h1>
          <p style={{ color:'#8A8A9A', fontSize:'0.875rem' }}>Manage business information and preferences</p>
        </div>
        <button className="btn btn-maroon" onClick={handleSave} disabled={saving||!changed} style={{ opacity:!changed?0.5:1 }}>
          {saving ? '⏳ Saving...' : '💾 Save All Changes'}
        </button>
      </div>

      {changed && (
        <div className="alert alert-warning" style={{ marginBottom:24 }}>
          ⚠️ You have unsaved changes. Click "Save All Changes" to apply.
        </div>
      )}

      <div style={{ display:'grid', gap:20 }}>
        {GROUPS.map(group => (
          <div key={group.title} className="card" style={{ padding:'28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24, paddingBottom:14, borderBottom:'1px solid #F0EDE8' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:'#FEF0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>{group.icon}</div>
              <h2 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'1rem', fontWeight:700 }}>{group.title}</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:18 }}>
              {group.fields.map(field => (
                <div key={field.key} className="form-group" style={{ margin:0 }}>
                  <label className="form-label">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea className="form-textarea" style={{ minHeight:80 }} placeholder={field.placeholder} value={settings[field.key]||''} onChange={e=>handleChange(field.key, e.target.value)} />
                  ) : (
                    <input className="form-input" type={field.type} placeholder={field.placeholder} value={settings[field.key]||''} onChange={e=>handleChange(field.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Preview */}
        <div className="card" style={{ padding:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'#FEF0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>👁️</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'1rem', fontWeight:700 }}>Footer Preview</h2>
          </div>
          <div style={{ background:'#2D0000', borderRadius:12, padding:'20px 24px', color:'#9898A8' }}>
            <div style={{ fontFamily:'Playfair Display,serif', color:'white', fontWeight:800, fontSize:'1rem', marginBottom:4 }}>{settings.business_name||'Maa Superior Caterers'}</div>
            <div style={{ fontStyle:'italic', color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', marginBottom:14 }}>{settings.tagline||'Best Quality & Service Is Our Aim'}</div>
            <div style={{ fontSize:'0.83rem', lineHeight:2 }}>
              <div>👤 <span style={{ color:'white' }}>{settings.owner_name||'Vipul Gandhi'}</span></div>
              <div>📞 <span style={{ color:'white' }}>+91 {settings.phone||'98795 56507'}</span></div>
              <div>📍 <span style={{ color:'rgba(255,255,255,0.7)' }}>{settings.address||'Anand, Gujarat'}</span></div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="card" style={{ padding:'24px 28px', border:'1px solid #FCA5A5' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <span style={{ fontSize:'1.2rem' }}>🔐</span>
            <h3 style={{ fontFamily:'Playfair Display,serif', color:'#991B1B', fontSize:'0.95rem', fontWeight:700 }}>Security Reminder</h3>
          </div>
          <div className="alert alert-error" style={{ margin:0 }}>
            <strong>Default Admin Credentials:</strong> admin@maasuperior.com / Admin@1234<br/>
            ⚠️ Please change the admin password immediately by running <code>node database/create-admin.js</code> with a new password before going live.
          </div>
        </div>
      </div>
    </div>
  );
}
