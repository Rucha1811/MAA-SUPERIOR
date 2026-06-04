import React, { useEffect, useState } from 'react';
import { menuApi } from '../../lib/api';
import toast from 'react-hot-toast';

export default function AdminMenuManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCat, setExpandedCat] = useState<string|null>(null);
  const [addingItem, setAddingItem] = useState<string|null>(null);
  const [newItem, setNewItem] = useState({ name:'', name_gujarati:'' });
  const [addingCat, setAddingCat] = useState(false);
  const [newCat, setNewCat] = useState({ name:'', description:'' });
  const [saving, setSaving] = useState(false);
  const [searchCat, setSearchCat] = useState('');

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const { data } = await menuApi.getCategories();
      setCategories(data);
    } catch { toast.error('Failed to load menu'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMenu(); }, []);

  const handleAddItem = async (catId: string) => {
    if (!newItem.name.trim()) { toast.error('Item name required'); return; }
    setSaving(true);
    try {
      await menuApi.createItem({ category_id:catId, name:newItem.name.trim(), name_gujarati:newItem.name_gujarati.trim()||null });
      toast.success('Item added!');
      setAddingItem(null);
      setNewItem({ name:'', name_gujarati:'' });
      fetchMenu();
    } catch { toast.error('Failed to add item'); }
    finally { setSaving(false); }
  };

  const handleToggleItem = async (itemId: string, current: boolean) => {
    try {
      await menuApi.updateItem(itemId, { is_available:!current });
      setCategories(cats=>cats.map(c=>({ ...c, items:c.items.map((i:any)=>i.id===itemId?{...i,is_available:!i.is_available}:i) })));
    } catch { toast.error('Failed to update'); }
  };

  const handleDeleteItem = async (itemId: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from menu? This cannot be undone.`)) return;
    try {
      await menuApi.deleteItem(itemId);
      toast.success(`"${name}" deleted`);
      setCategories(cats=>cats.map(c=>({ ...c, items:c.items.filter((i:any)=>i.id!==itemId) })));
    } catch { toast.error('Failed to delete'); }
  };

  const handleToggleCategory = async (catId: string, current: boolean) => {
    try {
      await menuApi.updateCategory(catId, { is_active:!current });
      setCategories(cats=>cats.map(c=>c.id===catId?{...c,is_active:!c.is_active}:c));
      toast.success(current ? 'Category hidden' : 'Category shown');
    } catch { toast.error('Failed to update'); }
  };

  const handleAddCategory = async () => {
    if (!newCat.name.trim()) { toast.error('Category name required'); return; }
    setSaving(true);
    try {
      await menuApi.createCategory({ name:newCat.name.trim(), description:newCat.description.trim()||null });
      toast.success('Category added!');
      setAddingCat(false);
      setNewCat({ name:'', description:'' });
      fetchMenu();
    } catch { toast.error('Failed to add category'); }
    finally { setSaving(false); }
  };

  const filteredCats = searchCat
    ? categories.filter(c=>c.name.toLowerCase().includes(searchCat.toLowerCase()))
    : categories;

  const totalItems = categories.reduce((sum,c)=>(sum+(c.items?.length||0)),0);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Menu Management</h1>
          <p style={{ color:'#8A8A9A', fontSize:'0.875rem' }}>{categories.length} categories · {totalItems} items</p>
        </div>
        <button className="btn btn-maroon" onClick={()=>setAddingCat(true)}>+ Add Category</button>
      </div>

      {/* Add Category Modal */}
      {addingCat && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div className="card" style={{ maxWidth:460, width:'100%', padding:'32px' }}>
            <h3 style={{ fontFamily:'Playfair Display,serif', color:'#2D0000', marginBottom:24, fontSize:'1.1rem' }}>Add New Category</h3>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input className="form-input" placeholder="e.g. Starters" value={newCat.name} onChange={e=>setNewCat(c=>({...c,name:e.target.value}))} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Description / Selection Note</label>
              <input className="form-input" placeholder="e.g. Choose any One" value={newCat.description} onChange={e=>setNewCat(c=>({...c,description:e.target.value}))} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn btn-maroon" onClick={handleAddCategory} disabled={saving} style={{ flex:1 }}>
                {saving ? 'Adding...' : 'Add Category'}
              </button>
              <button className="btn btn-outline-gold" onClick={()=>setAddingCat(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom:16 }}>
        <input className="form-input" style={{ maxWidth:320 }} placeholder="🔍 Search categories..." value={searchCat} onChange={e=>setSearchCat(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filteredCats.map(cat => (
            <div key={cat.id} className="card" style={{ opacity:cat.is_active?1:0.6, border: expandedCat===cat.id ? '1.5px solid rgba(232,98,26,0.3)' : '1px solid #EBEBEB' }}>
              {/* Header */}
              <button onClick={()=>setExpandedCat(expandedCat===cat.id?null:cat.id)} style={{
                width:'100%', padding:'14px 18px', border:'none', cursor:'pointer', textAlign:'left',
                background: expandedCat===cat.id ? '#FEF9F6' : 'white',
                display:'flex', justifyContent:'space-between', alignItems:'center',
                borderRadius: expandedCat===cat.id ? '12px 12px 0 0' : 12, transition:'all 0.2s',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background: expandedCat===cat.id ? '#C9961A' : '#FEF0E8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:800, color: expandedCat===cat.id ? 'white' : '#C9961A', flexShrink:0 }}>
                    {cat.sort_order}
                  </div>
                  <div>
                    <div style={{ fontFamily:'Playfair Display,serif', fontWeight:700, color:'#2D0000', fontSize:'0.9rem' }}>{cat.name}</div>
                    {cat.description && <div style={{ fontSize:'0.72rem', color:'#8A8A9A', marginTop:2 }}>{cat.description}</div>}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ background:'#FEF0E8', color:'#C9961A', padding:'3px 10px', borderRadius:20, fontSize:'0.72rem', fontWeight:700 }}>{cat.items?.length||0}</span>
                  <button onClick={e=>{ e.stopPropagation(); handleToggleCategory(cat.id, cat.is_active); }} style={{
                    padding:'4px 10px', border:'none', borderRadius:20, cursor:'pointer', fontSize:'0.7rem', fontWeight:700,
                    background: cat.is_active ? '#D1FAE5' : '#FEE2E2',
                    color: cat.is_active ? '#065F46' : '#991B1B',
                  }}>
                    {cat.is_active ? '✓ Active' : '✗ Hidden'}
                  </button>
                  <span style={{ color:'#8A8A9A', fontSize:'0.8rem', transform:expandedCat===cat.id?'rotate(180deg)':'none', transition:'transform 0.3s' }}>▼</span>
                </div>
              </button>

              {/* Items */}
              {expandedCat===cat.id && (
                <div style={{ padding:'16px 18px', borderTop:'1px solid #F5F0EC' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:8, marginBottom:14 }}>
                    {(cat.items||[]).map((item: any)=>(
                      <div key={item.id} style={{
                        display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:8,
                        background: item.is_available ? 'white' : '#FFF5F5',
                        border:`1px solid ${item.is_available?'#E8E8E8':'#FECACA'}`,
                      }}>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:'0.83rem', color:'#2D0000', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</div>
                          {item.name_gujarati && <div style={{ fontSize:'0.68rem', color:'#8A8A9A' }}>{item.name_gujarati}</div>}
                        </div>
                        <button onClick={()=>handleToggleItem(item.id, item.is_available)} title={item.is_available?'Hide':'Show'} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem', padding:'2px 3px', opacity:0.7 }}>
                          {item.is_available ? '👁️' : '🚫'}
                        </button>
                        <button onClick={()=>handleDeleteItem(item.id, item.name)} title="Delete" style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem', padding:'2px 3px', color:'#EF4444', opacity:0.7 }}>
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Item */}
                  {addingItem===cat.id ? (
                    <div style={{ display:'flex', gap:10, alignItems:'flex-end', padding:'14px', background:'#FEF9F6', borderRadius:10, border:'1px dashed rgba(232,98,26,0.4)' }}>
                      <div style={{ flex:1 }}>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'#C9961A', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>English Name *</label>
                        <input className="form-input" style={{ padding:'9px 12px', fontSize:'0.875rem' }} placeholder="e.g. Paneer Tikka" value={newItem.name} onChange={e=>setNewItem(n=>({...n,name:e.target.value}))} autoFocus
                          onKeyDown={e=>{ if (e.key==='Enter') handleAddItem(cat.id); if (e.key==='Escape') { setAddingItem(null); }}} />
                      </div>
                      <div style={{ flex:1 }}>
                        <label style={{ fontSize:'0.72rem', fontWeight:700, color:'#8A8A9A', textTransform:'uppercase', letterSpacing:'0.06em', display:'block', marginBottom:5 }}>Gujarati (Optional)</label>
                        <input className="form-input" style={{ padding:'9px 12px', fontSize:'0.875rem' }} placeholder="ગુજરાતી" value={newItem.name_gujarati} onChange={e=>setNewItem(n=>({...n,name_gujarati:e.target.value}))} />
                      </div>
                      <button className="btn btn-maroon btn-sm" onClick={()=>handleAddItem(cat.id)} disabled={saving}>{saving?'...':'Add'}</button>
                      <button className="btn btn-outline-gold btn-sm" onClick={()=>{ setAddingItem(null); setNewItem({name:'',name_gujarati:''}); }}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={()=>{ setAddingItem(cat.id); setNewItem({name:'',name_gujarati:''}); }} style={{
                      width:'100%', padding:'9px', border:'1.5px dashed rgba(232,98,26,0.35)',
                      background:'transparent', borderRadius:8, cursor:'pointer', color:'#C9961A',
                      fontSize:'0.82rem', fontWeight:600, transition:'all 0.2s',
                    }}
                      onMouseEnter={e=>(e.currentTarget.style.background='rgba(232,98,26,0.05)')}
                      onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                    >
                      + Add Item to {cat.name}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
