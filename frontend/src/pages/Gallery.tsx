import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UPLOAD_PASSWORD = 'Nehal@0512';
const DB_NAME = 'maa_gallery_db';
const DB_VERSION = 1;
const STORE_NAME = 'media';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  blob: Blob;
  objectUrl?: string;
  uploadedAt: string;
  size: number;
}

interface GalleryItemMeta {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  uploadedAt: string;
  size: number;
}

const DEFAULT_PLACEHOLDERS = [
  { id: 'def1', title: 'Grand Wedding Feast', category: 'Wedding' },
  { id: 'def2', title: 'Birthday Celebration', category: 'Birthday' },
  { id: 'def3', title: 'Chaat & Starters Counter', category: 'Starters' },
  { id: 'def4', title: 'Royal Sweet Platter', category: 'Sweets' },
  { id: 'def5', title: 'Paneer Specialties', category: 'Main Course' },
  { id: 'def6', title: 'Biryani & Pulao Station', category: 'Rice' },
  { id: 'def7', title: 'Gujarati Thali Spread', category: 'Gujarati' },
  { id: 'def8', title: 'Clay Tandoor Breads', category: 'Breads' },
];

const EMOJI_MAP: Record<string, string> = {
  Wedding: '💍', Birthday: '🎂', Starters: '🍢', Sweets: '🍬',
  'Main Course': '🥘', Rice: '🍚', Gujarati: '🙏', Rajasthani: '🏜️',
  Breads: '🫓', Chinese: '🍜', Desserts: '🍦', General: '📸', Video: '🎬',
};

const UPLOAD_CATS = ['General', 'Wedding', 'Birthday', 'Starters', 'Sweets', 'Main Course', 'Rice', 'Gujarati', 'Rajasthani', 'Breads', 'Chinese', 'Desserts', 'Video'];

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// IndexedDB helpers
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveItem(item: GalleryItem): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const { objectUrl: _, ...toStore } = item; // don't store objectUrl
    store.put(toStore);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllItems(): Promise<GalleryItem[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function deleteItem(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordAccepted, setPasswordAccepted] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCat, setUploadCat] = useState('General');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const stored = await getAllItems();
      // Create object URLs for display
      const withUrls = stored.map(item => ({
        ...item,
        objectUrl: item.blob ? URL.createObjectURL(item.blob) : undefined,
      }));
      setItems(withUrls);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordCheck = () => {
    if (passwordInput === UPLOAD_PASSWORD) { setPasswordAccepted(true); setPasswordError(''); }
    else { setPasswordError('Incorrect password.'); setPasswordInput(''); }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isImage && !isVideo) { alert('Please select an image or video file.'); return; }

    const MAX = 1024 * 1024 * 1024; // 1 GB
    if (file.size > MAX) { alert('File too large. Maximum size is 1 GB.'); return; }

    setUploadFile(file);
    setUploadType(isVideo ? 'video' : 'image');

    if (isImage) {
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
    } else {
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) { alert('Please select a file.'); return; }
    if (!uploadTitle.trim()) { alert('Please enter a title.'); return; }

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress for large files
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 5, 90));
    }, 100);

    try {
      const newItem: GalleryItem = {
        id: `media_${Date.now()}`,
        title: uploadTitle.trim(),
        category: uploadCat,
        type: uploadType,
        blob: uploadFile,
        uploadedAt: new Date().toLocaleDateString('en-IN'),
        size: uploadFile.size,
      };
      await saveItem(newItem);
      clearInterval(progressInterval);
      setUploadProgress(100);

      await loadItems();
      setUploadTitle('');
      setUploadCat('General');
      setUploadFile(null);
      setUploadPreview('');
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        alert(`${uploadType === 'video' ? 'Video' : 'Photo'} uploaded successfully!`);
      }, 400);
    } catch (err) {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Revoke old object URL
      const item = items.find(i => i.id === id);
      if (item?.objectUrl) URL.revokeObjectURL(item.objectUrl);
      await deleteItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      setDeleteConfirm(null);
      if (lightbox?.id === id) setLightbox(null);
    } catch { alert('Failed to delete.'); }
  };

  // Build display list: uploaded + default placeholders
  const allItems = [
    ...items,
    ...DEFAULT_PLACEHOLDERS
      .filter(d => !items.find(i => i.id === d.id))
      .map(d => ({ ...d, type: 'image' as const, blob: new Blob(), objectUrl: undefined, uploadedAt: '', size: 0 })),
  ];
  const allCats = ['All', ...Array.from(new Set(allItems.map(i => i.category)))];
  const filtered = filter === 'All' ? allItems : allItems.filter(i => i.category === filter);

  return (
    <>
      <Header />
      <div style={{ paddingTop: 70 }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #1A0003, #3D0008, #6B0010)', padding: '52px 0', textAlign: 'center', borderBottom: '3px solid rgba(184,134,11,0.4)' }}>
          <div className="container">
            <div className="chip" style={{ background: 'rgba(184,134,11,0.18)', color: '#F0C040', borderColor: 'rgba(184,134,11,0.4)', margin: '0 auto 14px' }}>Our Work</div>
            <h1 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#F0C040', marginBottom: 10, fontWeight: 900 }}>Gallery</h1>
            <div className="divider divider-center" />
            <p style={{ color: 'rgba(240,192,64,0.7)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.15rem' }}>
              Photos & videos from our royal feasts across thousands of events
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(184,134,11,0.2)', border: '1px solid rgba(184,134,11,0.4)', color: 'rgba(240,192,64,0.8)', padding: '5px 16px', borderRadius: 20, fontSize: '0.75rem', fontFamily: 'Cinzel,serif' }}>📸 Photos</span>
              <span style={{ background: 'rgba(184,134,11,0.2)', border: '1px solid rgba(184,134,11,0.4)', color: 'rgba(240,192,64,0.8)', padding: '5px 16px', borderRadius: 20, fontSize: '0.75rem', fontFamily: 'Cinzel,serif' }}>🎬 Videos</span>
              <span style={{ background: 'rgba(184,134,11,0.2)', border: '1px solid rgba(184,134,11,0.4)', color: 'rgba(240,192,64,0.8)', padding: '5px 16px', borderRadius: 20, fontSize: '0.75rem', fontFamily: 'Cinzel,serif' }}>💾 Up to 1 GB per file</span>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <section style={{ padding: '48px 0 72px', background: 'var(--cream)' }}>
          <div className="container">

            {/* Filters + Upload button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {allCats.map(c => (
                  <button key={c} onClick={() => setFilter(c)} style={{
                    padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
                    background: filter === c ? 'linear-gradient(135deg, #B8860B, #D4A520)' : 'white',
                    color: filter === c ? '#1A0000' : '#6A4A2A',
                    fontFamily: 'Cinzel,serif', fontSize: '0.68rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    border: filter === c ? 'none' : '1px solid rgba(184,134,11,0.3)',
                    boxShadow: filter === c ? '0 3px 12px rgba(184,134,11,0.35)' : '0 1px 4px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s',
                  }}>{c}</button>
                ))}
              </div>
              <button onClick={() => { setShowUpload(true); setPasswordAccepted(false); setPasswordInput(''); setPasswordError(''); }}
                className="btn btn-maroon btn-sm">
                📤 Upload Photo / Video
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
            ) : (
              /* Media Grid */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
                {filtered.map(item => (
                  <div key={item.id} style={{
                    position: 'relative', aspectRatio: '4/3', borderRadius: 14,
                    overflow: 'hidden', cursor: 'pointer',
                    border: '1px solid rgba(184,134,11,0.25)',
                    boxShadow: '0 4px 16px rgba(61,0,8,0.12)',
                    transition: 'all 0.3s',
                    background: item.objectUrl
                      ? (item.type === 'video' ? '#0D0003' : `url(${item.objectUrl}) center/cover no-repeat`)
                      : 'linear-gradient(135deg, var(--cream-dark), var(--gold-pale))',
                  }}
                    onClick={() => item.uploadedAt ? setLightbox(item) : undefined}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'scale(1.03)'; el.style.boxShadow = '0 10px 32px rgba(61,0,8,0.25)'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 4px 16px rgba(61,0,8,0.12)'; }}
                  >
                    {/* Video thumbnail */}
                    {item.type === 'video' && item.objectUrl && (
                      <video src={item.objectUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} preload="metadata" muted />
                    )}

                    {/* Placeholder for defaults */}
                    {!item.objectUrl && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '3.2rem', marginBottom: 10 }}>{EMOJI_MAP[item.category] || '📸'}</div>
                        <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.8rem', color: '#4A0000', fontWeight: 700, textAlign: 'center', padding: '0 16px' }}>{item.title}</div>
                      </div>
                    )}

                    {/* Video play icon */}
                    {item.type === 'video' && item.objectUrl && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(240,192,64,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                          <span style={{ fontSize: '1.4rem', marginLeft: 3 }}>▶</span>
                        </div>
                      </div>
                    )}

                    {/* Overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 45%, rgba(30,0,8,0.88) 100%)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      padding: '14px', opacity: item.objectUrl ? 1 : 0,
                    }}>
                      <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '0.82rem', fontWeight: 700 }}>{item.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ color: 'rgba(240,192,64,0.7)', fontSize: '0.68rem' }}>{item.category}</span>
                        {item.size > 0 && <span style={{ color: 'rgba(240,192,64,0.5)', fontSize: '0.65rem' }}>{formatSize(item.size)}</span>}
                      </div>
                    </div>

                    {/* Type badge */}
                    {item.uploadedAt && (
                      <div style={{ position: 'absolute', top: 8, left: 8, background: item.type === 'video' ? 'rgba(184,134,11,0.9)' : 'rgba(61,0,8,0.85)', color: item.type === 'video' ? '#1A0000' : '#F0C040', padding: '3px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Cinzel,serif' }}>
                        {item.type === 'video' ? '🎬 VIDEO' : '📸 PHOTO'}
                      </div>
                    )}

                    {/* Delete button (only when password accepted) */}
                    {item.uploadedAt && passwordAccepted && (
                      <button onClick={e => { e.stopPropagation(); setDeleteConfirm(item.id); }}
                        style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(107,0,16,0.9)', border: 'none', borderRadius: 8, color: '#F0C040', cursor: 'pointer', padding: '4px 8px', fontSize: '0.72rem', fontWeight: 700, zIndex: 2 }}>
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {items.length > 0 && (
              <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ background: 'white', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '10px 20px', fontSize: '0.82rem', color: '#4A2800' }}>
                  📸 {items.filter(i => i.type === 'image').length} Photos
                </div>
                <div style={{ background: 'white', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '10px 20px', fontSize: '0.82rem', color: '#4A2800' }}>
                  🎬 {items.filter(i => i.type === 'video').length} Videos
                </div>
                <div style={{ background: 'white', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 10, padding: '10px 20px', fontSize: '0.82rem', color: '#4A2800' }}>
                  💾 {formatSize(items.reduce((s, i) => s + i.size, 0))} Total
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <div style={{ textAlign: 'center', marginTop: 48, padding: '32px', background: 'linear-gradient(135deg, #1A0003, #3D0008)', borderRadius: 16, border: '1px solid rgba(184,134,11,0.3)' }}>
              <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '1.2rem', marginBottom: 10, fontWeight: 800 }}>Want to See More Event Photos & Videos?</div>
              <p style={{ color: 'rgba(240,192,64,0.65)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.05rem', marginBottom: 20 }}>Connect with us on WhatsApp to see live event coverage and references from happy clients.</p>
              <a href="https://wa.me/9879556507?text=Hi! I'd like to see photos and videos from your recent catering events." target="_blank" rel="noreferrer"
                className="btn btn-gold">📱 WhatsApp for More</a>
            </div>
          </div>
        </section>

        {/* ── UPLOAD MODAL ──────────────────────────── */}
        {showUpload && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={e => { if (e.target === e.currentTarget) setShowUpload(false); }}>
            <div className="card" style={{ maxWidth: 500, width: '100%', padding: '36px 32px', maxHeight: '92vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'Cinzel,serif', color: '#3D0008', fontSize: '1rem', fontWeight: 800 }}>📤 Upload Photo / Video</h3>
                <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#8B5E3C' }}>✕</button>
              </div>

              {!passwordAccepted ? (
                <div>
                  <div className="alert alert-info" style={{ marginBottom: 20 }}>🔐 Enter the upload password to continue.</div>
                  <div className="form-group">
                    <label className="form-label">Upload Password</label>
                    <input className="form-input" type="password" placeholder="Enter password" value={passwordInput}
                      onChange={e => { setPasswordInput(e.target.value); setPasswordError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handlePasswordCheck()} autoFocus />
                    {passwordError && <div className="form-error">{passwordError}</div>}
                  </div>
                  <button className="btn btn-maroon" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePasswordCheck}>🔑 Verify Password</button>
                </div>
              ) : (
                <div>
                  <div className="alert alert-success" style={{ marginBottom: 20 }}>✅ Access granted! Upload photos or videos up to 1 GB.</div>

                  {/* File picker */}
                  <div className="form-group">
                    <label className="form-label">Select File * (Images & Videos, max 1 GB)</label>
                    <label style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      minHeight: uploadPreview ? 'auto' : 160,
                      border: '2px dashed rgba(184,134,11,0.5)', borderRadius: 10,
                      cursor: 'pointer', background: 'var(--gold-pale)', transition: 'all 0.2s',
                      padding: uploadPreview ? 0 : '24px', overflow: 'hidden',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#B8860B')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(184,134,11,0.5)')}>
                      <input ref={fileInputRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileSelect} />
                      {uploadPreview ? (
                        uploadType === 'video' ? (
                          <video src={uploadPreview} controls style={{ width: '100%', borderRadius: 8, maxHeight: 220 }} />
                        ) : (
                          <img src={uploadPreview} alt="preview" style={{ width: '100%', borderRadius: 8, maxHeight: 220, objectFit: 'cover' }} />
                        )
                      ) : (
                        <>
                          <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                            <span style={{ fontSize: '2.5rem' }}>📷</span>
                            <span style={{ fontSize: '2.5rem' }}>🎬</span>
                          </div>
                          <span style={{ fontFamily: 'Cinzel,serif', fontSize: '0.72rem', color: '#3D0008', letterSpacing: '0.1em', marginBottom: 6 }}>CLICK TO SELECT PHOTO OR VIDEO</span>
                          <span style={{ color: '#8B5E3C', fontSize: '0.75rem' }}>JPG, PNG, WebP, MP4, MOV, AVI — Max 1 GB</span>
                        </>
                      )}
                    </label>
                    {uploadFile && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.78rem', color: '#8B5E3C' }}>
                        <span>{uploadType === 'video' ? '🎬 Video' : '📸 Photo'} — {formatSize(uploadFile.size)}</span>
                        <button onClick={() => { setUploadFile(null); setUploadPreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          style={{ background: 'none', border: 'none', color: '#8B0000', cursor: 'pointer', fontWeight: 600 }}>✕ Remove</button>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input className="form-input" placeholder="e.g. Grand Wedding — Patel Family 2024" value={uploadTitle} onChange={e => setUploadTitle(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={uploadCat} onChange={e => setUploadCat(e.target.value)}>
                      {UPLOAD_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Progress bar */}
                  {uploading && (
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#8B5E3C', marginBottom: 6 }}>
                        <span>Uploading {uploadType === 'video' ? 'video' : 'photo'}...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div style={{ height: 8, background: 'rgba(184,134,11,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg, #B8860B, #D4A520)', borderRadius: 4, width: `${uploadProgress}%`, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-maroon" style={{ flex: 1, justifyContent: 'center' }} onClick={handleUpload}
                      disabled={uploading || !uploadFile || !uploadTitle.trim()}>
                      {uploading ? `⏳ Uploading (${uploadProgress}%)...` : '📤 Upload'}
                    </button>
                    <button className="btn btn-outline-gold" onClick={() => setShowUpload(false)} disabled={uploading}>Cancel</button>
                  </div>

                  {/* Uploaded list */}
                  {items.length > 0 && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(184,134,11,0.2)' }}>
                      <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.68rem', color: '#8B5E3C', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                        Uploaded Media ({items.length})
                      </div>
                      {items.slice(0, 5).map(item => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '8px 10px', background: 'var(--gold-pale)', borderRadius: 8, border: '1px solid rgba(184,134,11,0.2)' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#1A0003', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.type === 'video' ? (
                              <span style={{ fontSize: '1.2rem' }}>🎬</span>
                            ) : item.objectUrl ? (
                              <img src={item.objectUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.title} />
                            ) : (
                              <span style={{ fontSize: '1.2rem' }}>📸</span>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1A0008', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                            <div style={{ fontSize: '0.68rem', color: '#8B5E3C' }}>{item.category} · {formatSize(item.size)} · {item.uploadedAt}</div>
                          </div>
                          <button onClick={() => setDeleteConfirm(item.id)} style={{ background: 'rgba(107,0,16,0.1)', border: 'none', color: '#6B0010', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>🗑️</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRM ─────────────────────────── */}
        {deleteConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="card" style={{ maxWidth: 360, width: '100%', padding: '28px' }}>
              <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontFamily: 'Cinzel,serif', color: '#3D0008', textAlign: 'center', marginBottom: 12, fontSize: '0.95rem' }}>Delete this file?</h3>
              <p style={{ color: '#6A4A2A', textAlign: 'center', marginBottom: 24, fontSize: '0.875rem' }}>This cannot be undone.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-maroon" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
                <button className="btn btn-outline-gold" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* ── LIGHTBOX ──────────────────────────────── */}
        {lightbox && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={() => setLightbox(null)}>
            <div style={{ maxWidth: 900, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
              {lightbox.type === 'video' && lightbox.objectUrl ? (
                <video src={lightbox.objectUrl} controls autoPlay style={{ width: '100%', maxHeight: '80vh', borderRadius: 12 }} />
              ) : lightbox.objectUrl ? (
                <img src={lightbox.objectUrl} alt={lightbox.title} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12 }} />
              ) : (
                <div style={{ width: '100%', height: 400, background: 'linear-gradient(135deg, #1A0003, #3D0008)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '5rem', marginBottom: 16 }}>{EMOJI_MAP[lightbox.category] || '📸'}</div>
                  <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '1.1rem' }}>{lightbox.title}</div>
                </div>
              )}
              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '0.9rem', fontWeight: 700 }}>{lightbox.title}</div>
                <div style={{ color: 'rgba(184,134,11,0.6)', fontSize: '0.78rem', marginTop: 4 }}>{lightbox.category} {lightbox.size > 0 ? `· ${formatSize(lightbox.size)}` : ''}</div>
              </div>
              <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: -12, right: -12, width: 38, height: 38, borderRadius: '50%', background: '#3D0008', border: '2px solid #B8860B', color: '#F0C040', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
