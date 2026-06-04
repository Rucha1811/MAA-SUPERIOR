import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import jsPDF from 'jspdf';

const WA = '9879556507';

// All categories & items (same data as Menu.tsx)
const ALA_CARTE: Record<string, { note?: string; items: string[] }> = {
  'Cold Appetizer': { note: 'Choose any One', items: ['Narial Pani','Orange Juice','Chocktail Juice','Black Grape Juice','Pineapple Juice','Pineapple Mosambi Juice','Ganga Jamuna','Orange Blossom','Coconut Punch','Cocktail Shake','Fresh Lime Soda','Strawberry Shake','Pista Punch','Fruit Punch','Trupti Chiled Milk Lasala'] },
  'Hot Appetizer': { note: 'Choose any One', items: ['Tomato-Corn Soup','Tomato Soup','Vegetable Soup','Sweet Corn Soup','Hot N Sour Soup','Coconut Shorba','Noodles Soup','Tomato Mint','Chilli Beans'] },
  'Bitting / Starters': { note: 'Choose any Two', items: ['Chiria Samosa','Alu Pudina Roll','Paneer Tikka Fried','Potato Finger','Cheese Ball','Pineapple Cheese Stick','Tiranga Vada','Cheese Samosa','Kesar Pak','Cocktail Spring Roll','Mini Bhakhar Vadi','Palak Paneer Roll','Harra Barra Kabab','Mushroom Tikka','Mini Stuffed Puff'] },
  'Chatni & Sauce': { note: 'Choose any Two', items: ['Sweet Chatani','Fruit Chatani','Pudina Chatani','Garlic Chatani','Methi Ki Longi','Tomato Chatani','Mix Achar'] },
  'Namkeen': { note: 'Choose any One', items: ['Khasta Kachori','Mutter Kachori','Dosa Roll (Mini)','Silver Ball','Veg Cutlets','Khandvi','Alu Mutter Samosa','Dahi Vada','Dahi Bhalla','Raita Bundi/Alu/Veg','Bhel Sanjauri','Idli-Dahi Vada'] },
  'Salad': { note: 'Choose any Two', items: ['Green Salad','Kathor','Sprouted','Vinegar Onion','Pineapple Cheese Salad','Sprouted Beans','Beans & Veg Salad','Spicy Potato Salad','American Salad','Lebanese','Russian','Sun Shine Salad','Pasta Nut','Pasta with French Dressing'] },
  'Chat': { note: 'Choose any Two', items: ['Pani Puri','Dahi Papdi Chat','Delhi Chat','Paneer Tikka Roasted','Alu Tikki','Kele Ki Tikki','Fruit Chat','Bhel Puri','Lachha Katori','Cheese Basket','Pao-Bhaji','Raj Kachori','Sweet Corn Kiss','Tiranga Pettis','Banarasi Tohfa'] },
  'Dal & Kadhi': { items: ['Dal Panch Masala','Dal Makhani','Rajama Masala','Dal Fry','Dal Marwari','Dal Gujarati','Kadi Punjabi','Kadi Marwari','Kadi Gujarati','Dal Jaipuri (Dry)','Dal Lachka'] },
  'Vegetables A — Paneer': { note: 'Choose any One', items: ['Paneer Pasanda','Shahi Paneer','Stuffed Paneer','Cream Paneer','Chilli Paneer','Butter Paneer Masala','Mutter Paneer','Palak Paneer','Paneer Makhanwala','Panner Korma','Triranga Paneer','Methi Paner','Paneer Kofta','Kesari Paneer','Orange Paneer Masala','Pineapple Paneer','Baby Corn + Paneer','Cappsicum + Paneer'] },
  'Vegetables B': { note: 'Choose any Two', items: ['Mutter Maharani','Khoya Mutter Kaju','Bhindi Masala','Gobhi Masala','Veg Singapuri','Green Peas with Pineapple','Veg Jal Frazee','Navratna Korma','Stuff Tinda','Malai Kofta','Nargis Kofta','Veg Kofta','Palak Kofta','Chhole Masala','Mix Veg','Methi Malai','Undhiya','Kaju Kerala','Jeera Alu','Dum Alu (Kashmiri)','Alu Gobhi'] },
  'From China With Love': { items: ['Veg Hakka Noodles','Singapuri Noodles','Veg Manchurian','American Chopsuey','Spring Roll','Sweet N Sour','Paneer Chilly','Fried Rice'] },
  'Pulao & Rice': { note: 'Choose any One', items: ['Plain Rice','Jeera Rice','Mutter Pulao','Veg Pulao','Biryani Veg','Kashmiri Pulao','Navratna Pulao','Hydrabadi Biryani'] },
  'Papad': { items: ['Fried Papad','Roasted Papad','Disco Papad'] },
  'From Karai (Breads)': { items: ['Plain Puri','Tirangi Puri','Culcutti Puri','Bedmi','Bhature'] },
  'From Tawa (Breads)': { items: ['Plain Parotha','Roomali Roti','Fulka','Methi Thepla'] },
  'From Clay Tandoor': { note: 'Choose any One', items: ['Khasta Roti','Butter Nan','Missi Roti','Makka Ki Roti','Kashmiri Nan','Reshmi Parotha','Baby Nan'] },
  'Hot Sweet Dishes': { note: 'Choose any One', items: ['Stuffed Gulab Jamun','Kala Jamun','Mava Bati','Jalebi Kesaria','Mal Puva','Mung Ki Dal Ka Halwa','Kheer','Gajar Ka Halwa (Seasonal)','Anjeer Halwa','Dry Fruit Halwa','Puran Puri'] },
  'Cold Sweet Dishes': { note: 'Choose any Two', items: ['Lacchha Rubadi','Ras Malai','Raj Bhog','Rasgulla','Malai Champ','Shrikhand (Mango/Kesar/Elaichi)','Aam Ras','Fresh Fruit Rabadi','Basoodi','Basoodi (Dry Fruit)','Inderani'] },
  'Special Sweets': { note: 'Additional Charge', items: ['Badam Ki Katali','Kaju Pista Roll','Badam Pista Sandwich','Pista Rasgulla','Tri Colour Katali','Badam Pista Basket Halwa'] },
  'Ice Cream': { items: ['Kesar Pista','Kaju Draksh','American Dry Fruit','Butter Scotch','Rajbhog','Anjeer','Pineapple','Mango','Matka Kulfi'] },
  'Mukhwas & Pan': { items: ['Ghana Ni Dal','Lili Variyali','Mithu Pan','Oltaim Raj Mukhwas','Shingoda Pan','Lilo Mukhwas'] },
  'South Indian': { items: ['Assorted Dosa','Uttapam Assorted','Idly','Medu Vada','Sambar','Nariyal Chatni'] },
  'Garvi Gujarat': { items: ['Khati-Mithi Kadhi','Khichadi','Bazara Ni Roti + Makhan','Ringan-Bataka Nu Saag','Makai Ka Handwa','Chhash'] },
  'Rangila Rajasthani': { items: ['Dal Bati Churma','Gata Ka Saag','Lehsun Ki Chatni','Kair-Sangri Ka Achar','Methi Ki Loongi'] },
};

const CAT_ICONS: Record<string, string> = {
  'Cold Appetizer':'🥤','Hot Appetizer':'🍲','Bitting / Starters':'🍢',
  'Chatni & Sauce':'🥣','Namkeen':'🥟','Salad':'🥗','Chat':'🌮',
  'Dal & Kadhi':'🍛','Vegetables A — Paneer':'🧀','Vegetables B':'🥘',
  'From China With Love':'🍜','Pulao & Rice':'🍚','Papad':'🫓',
  'From Karai (Breads)':'🥙','From Tawa (Breads)':'🫔',
  'From Clay Tandoor':'🍞','Hot Sweet Dishes':'🍮','Cold Sweet Dishes':'🍨',
  'Special Sweets':'🍬','Ice Cream':'🍧','Mukhwas & Pan':'🌿',
  'South Indian':'🍲','Garvi Gujarat':'🙏','Rangila Rajasthani':'🏜️',
};

type SelectionMap = Record<string, Set<string>>;

export default function CustomMenu() {
  const [customerName, setCustomerName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selections, setSelections] = useState<SelectionMap>({});
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [step, setStep] = useState<'build' | 'review'>('build');

  const toggleItem = (cat: string, item: string) => {
    setSelections(prev => {
      const next = { ...prev };
      if (!next[cat]) next[cat] = new Set();
      else next[cat] = new Set(next[cat]);
      if (next[cat].has(item)) next[cat].delete(item);
      else next[cat].add(item);
      return next;
    });
  };

  const totalSelected = Object.values(selections).reduce((s, set) => s + set.size, 0);

  const selectedSummary = Object.entries(selections)
    .filter(([, set]) => set.size > 0)
    .map(([cat, set]) => ({ cat, items: Array.from(set) }));

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;
    const pageH = 297;
    const margin = 16;
    const contentW = pageW - margin * 2;

    const addPageHeader = (isFirst = false) => {
      // Full-width deep burgundy header
      doc.setFillColor(45, 0, 8);
      doc.rect(0, 0, pageW, isFirst ? 58 : 18, 'F');

      // Gold top border line
      doc.setFillColor(184, 134, 11);
      doc.rect(0, 0, pageW, 2.5, 'F');

      if (isFirst) {
        // Ornament lines
        doc.setFillColor(184, 134, 11);
        doc.rect(margin, 55.5, contentW, 1.5, 'F');

        // Brand name
        doc.setFont('times', 'bold');
        doc.setFontSize(28);
        doc.setTextColor(240, 192, 64);
        doc.text('MAA SUPERIOR CATERERS', pageW / 2, 20, { align: 'center' });

        // Decorative line under brand
        doc.setDrawColor(184, 134, 11);
        doc.setLineWidth(0.5);
        doc.line(margin + 20, 23, pageW - margin - 20, 23);

        // Tagline
        doc.setFont('times', 'italic');
        doc.setFontSize(11);
        doc.setTextColor(200, 160, 70);
        doc.text('"Best Quality & Service Is Our Aim"', pageW / 2, 30, { align: 'center' });

        // Address
        doc.setFont('times', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(160, 120, 40);
        doc.text('Nr Shantivan School, Opp Mataji Mandir, Vadodara, Gujarat  |  +91 98795 56507', pageW / 2, 37, { align: 'center' });

        // Document title
        doc.setFont('times', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(255, 220, 80);
        doc.text('✦   PERSONALISED MENU SELECTION   ✦', pageW / 2, 50, { align: 'center' });
      } else {
        doc.setFont('times', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(240, 192, 64);
        doc.text('MAA SUPERIOR CATERERS  |  Custom Menu Selection (continued)', pageW / 2, 12, { align: 'center' });
      }
    };

    const addPageFooter = () => {
      doc.setFillColor(45, 0, 8);
      doc.rect(0, pageH - 18, pageW, 18, 'F');
      doc.setFillColor(184, 134, 11);
      doc.rect(0, pageH - 18, pageW, 1.5, 'F');
      doc.setFont('times', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(240, 192, 64);
      doc.text('Maa Superior Caterers  |  Vipul Gandhi  |  +91 98795 56507  |  Vadodara, Gujarat', pageW / 2, pageH - 10, { align: 'center' });
      doc.setFont('times', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(160, 120, 40);
      doc.text('"We make your celebration truly royal  🍽️"', pageW / 2, pageH - 4, { align: 'center' });
    };

    // ── PAGE 1 ──
    addPageHeader(true);
    let y = 68;

    // Customer info card
    doc.setFillColor(251, 240, 208);
    doc.roundedRect(margin, y, contentW, 28, 3, 3, 'F');
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(0.6);
    doc.roundedRect(margin, y, contentW, 28, 3, 3, 'S');

    // Gold accent left bar
    doc.setFillColor(184, 134, 11);
    doc.roundedRect(margin, y, 3, 28, 1, 1, 'F');

    const qW = contentW / 4;
    const infoData = [
      ['Prepared For', customerName || 'Valued Customer'],
      ['Event', eventName || 'Special Event'],
      ['Date', eventDate ? new Date(eventDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'To Be Confirmed'],
      ['Created On', new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
    ];
    infoData.forEach(([label, value], i) => {
      const x = margin + 6 + i * qW;
      if (i > 0) {
        doc.setDrawColor(184, 134, 11);
        doc.setLineWidth(0.3);
        doc.line(x - 3, y + 4, x - 3, y + 24);
      }
      doc.setFont('times', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(107, 0, 16);
      doc.text(label.toUpperCase(), x, y + 9);
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(20, 0, 5);
      doc.text(value, x, y + 18, { maxWidth: qW - 8 });
    });
    y += 34;

    // Summary banner
    doc.setFillColor(61, 0, 8);
    doc.roundedRect(margin, y, contentW, 12, 2, 2, 'F');
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(240, 192, 64);
    doc.text(
      `✦  Total: ${totalSelected} Dishes Selected  |  ${selectedSummary.length} Categories  ✦`,
      pageW / 2, y + 8, { align: 'center' }
    );
    y += 18;

    // ── Category sections ──
    for (let si = 0; si < selectedSummary.length; si++) {
      const { cat, items } = selectedSummary[si];
      const note = ALA_CARTE[cat]?.note || '';
      const rowsNeeded = Math.ceil(items.length / 3);
      const sectionH = 10 + rowsNeeded * 7 + 6;

      if (y + sectionH > pageH - 24) {
        addPageFooter();
        doc.addPage();
        addPageHeader(false);
        y = 26;
      }

      // Category header with gradient effect
      doc.setFillColor(61, 0, 8);
      doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');

      // Small gold left accent
      doc.setFillColor(184, 134, 11);
      doc.roundedRect(margin, y, 4, 10, 1, 1, 'F');

      doc.setFont('times', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(240, 192, 64);
      doc.text(cat.toUpperCase(), margin + 8, y + 7);

      if (note) {
        doc.setFont('times', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(184, 134, 11);
        doc.text(note, pageW - margin - 3, y + 7, { align: 'right' });
      }

      // Count badge
      doc.setFillColor(184, 134, 11);
      doc.roundedRect(pageW - margin - 22, y + 1.5, 18, 7, 2, 2, 'F');
      doc.setFont('times', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(45, 0, 8);
      doc.text(`${items.length} dishes`, pageW - margin - 13, y + 6.5, { align: 'center' });

      y += 12;

      // Items in 3-column grid
      const cellW = contentW / 3;
      let col = 0, row = 0;
      items.forEach((item) => {
        const ix = margin + col * cellW;
        const iy = y + row * 7;

        // Alternating row background
        if (col === 0 && row % 2 === 0) {
          doc.setFillColor(251, 246, 232);
          doc.rect(margin, iy - 0.5, contentW, 7, 'F');
        }

        // Gold diamond bullet
        doc.setFillColor(184, 134, 11);
        doc.circle(ix + 3, iy + 3, 1, 'F');

        doc.setFont('times', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(20, 0, 5);
        doc.text(item, ix + 7, iy + 4.5, { maxWidth: cellW - 10 });

        col++;
        if (col >= 3) { col = 0; row++; }
      });

      y += rowsNeeded * 7 + 8;

      // Thin gold separator between categories
      doc.setDrawColor(184, 134, 11);
      doc.setLineWidth(0.2);
      doc.line(margin + 10, y - 4, pageW - margin - 10, y - 4);
    }

    // ── Final page footer ──
    addPageFooter();

    const filename = `Maa-Superior-${(customerName || 'Custom').replace(/\s+/g, '-')}-Menu.pdf`;
    doc.save(filename);
    setPdfGenerated(true);
    setTimeout(() => setPdfGenerated(false), 4000);
  };

  const sendToWhatsApp = () => {
    if (selectedSummary.length === 0) { alert('Please select at least one dish.'); return; }
    let msg = `🍽️ *CUSTOM MENU REQUEST — Maa Superior Caterers*\n\n`;
    msg += `*Name:* ${customerName || 'N/A'}\n`;
    msg += `*Event:* ${eventName || 'N/A'}\n`;
    msg += `*Date:* ${eventDate ? new Date(eventDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}\n\n`;
    msg += `*Selected Dishes (${totalSelected} items):*\n\n`;
    selectedSummary.forEach(({ cat, items }) => {
      msg += `*${cat}:*\n`;
      items.forEach(item => { msg += `• ${item}\n`; });
      msg += '\n';
    });
    msg += `_Please confirm availability and pricing. Thank you! 🙏_`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const clearAll = () => {
    if (window.confirm('Clear all selections?')) { setSelections({}); setStep('build'); }
  };

  return (
    <>
      <Header />
      <div style={{ paddingTop: 70 }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #1A0003, #3D0008, #6B0010)', padding: '52px 0', textAlign: 'center', borderBottom: '3px solid rgba(184,134,11,0.4)' }}>
          <div className="container">
            <div className="chip" style={{ background: 'rgba(184,134,11,0.18)', color: '#F0C040', borderColor: 'rgba(184,134,11,0.4)', margin: '0 auto 14px' }}>Build Your Dream Menu</div>
            <h1 style={{ fontFamily: 'Cinzel,serif', fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#F0C040', marginBottom: 10, fontWeight: 900, letterSpacing: '0.02em' }}>
              Custom Menu Builder
            </h1>
            <div className="divider divider-center" />
            <p style={{ color: 'rgba(240,192,64,0.7)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.15rem', maxWidth: 560, margin: '0 auto 20px' }}>
              Handpick every dish for your event. Export as a beautiful PDF or send directly to us on WhatsApp.
            </p>
            {totalSelected > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(184,134,11,0.25)', border: '1px solid rgba(184,134,11,0.5)', borderRadius: 50, padding: '8px 24px' }}>
                <span style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '0.85rem', fontWeight: 700 }}>
                  ✦ {totalSelected} dish{totalSelected !== 1 ? 'es' : ''} selected across {selectedSummary.length} categor{selectedSummary.length !== 1 ? 'ies' : 'y'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--cream)', padding: '40px 0 80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

              {/* LEFT: Category selector */}
              <div>
                {step === 'build' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                      <h2 style={{ fontFamily: 'Cinzel,serif', color: 'var(--maroon-dark)', fontSize: '1rem', fontWeight: 800 }}>
                        Select Your Dishes
                      </h2>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {totalSelected > 0 && (
                          <>
                            <button onClick={() => setStep('review')} className="btn btn-gold btn-sm">Review & Export →</button>
                            <button onClick={clearAll} className="btn btn-outline-gold btn-sm">Clear All</button>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {Object.entries(ALA_CARTE).map(([cat, { note, items }]) => {
                        const selectedInCat = selections[cat]?.size || 0;
                        const isOpen = expandedCat === cat;
                        return (
                          <div key={cat} className="card" style={{
                            border: selectedInCat > 0 ? '1.5px solid rgba(184,134,11,0.5)' : '1px solid rgba(184,134,11,0.18)',
                            transition: 'all 0.2s',
                          }}>
                            <button onClick={() => setExpandedCat(isOpen ? null : cat)} style={{
                              width: '100%', padding: '13px 18px', border: 'none', cursor: 'pointer', textAlign: 'left',
                              background: isOpen ? 'linear-gradient(135deg, #3D0008, #6B0010)' : selectedInCat > 0 ? 'linear-gradient(135deg, #FBF0D0, #F5E8C0)' : 'white',
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              borderRadius: isOpen ? '10px 10px 0 0' : 10, transition: 'all 0.2s',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: '1.2rem' }}>{CAT_ICONS[cat] || '🍴'}</span>
                                <div>
                                  <div style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, color: isOpen ? '#F0C040' : 'var(--maroon-dark)', fontSize: '0.85rem' }}>{cat}</div>
                                  {note && <div style={{ fontSize: '0.65rem', color: isOpen ? 'rgba(240,192,64,0.7)' : 'var(--gold)', marginTop: 2, fontFamily: 'Cinzel,serif', fontWeight: 600, letterSpacing: '0.06em' }}>{note}</div>}
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {selectedInCat > 0 && (
                                  <span style={{ background: 'linear-gradient(135deg, #B8860B, #D4A520)', color: '#1A0000', padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 800, fontFamily: 'Cinzel,serif' }}>
                                    {selectedInCat} selected
                                  </span>
                                )}
                                <span style={{ color: isOpen ? '#F0C040' : 'var(--gold)', fontSize: '0.75rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                              </div>
                            </button>

                            {isOpen && (
                              <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(184,134,11,0.15)' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                                  {items.map(item => {
                                    const isSelected = selections[cat]?.has(item) || false;
                                    return (
                                      <button key={item}
                                        onClick={() => toggleItem(cat, item)}
                                        style={{
                                          padding: '5px 12px', borderRadius: 20, border: isSelected ? '1.5px solid var(--gold)' : '1px solid rgba(184,134,11,0.3)',
                                          cursor: 'pointer', fontFamily: 'Cormorant Garamond,serif', fontSize: '0.95rem',
                                          background: isSelected ? 'linear-gradient(135deg, #6B0010, #3D0008)' : 'var(--ivory)',
                                          color: isSelected ? '#F0C040' : 'var(--maroon-dark)',
                                          fontWeight: isSelected ? 700 : 400,
                                          transition: 'all 0.18s',
                                          boxShadow: isSelected ? '0 2px 8px rgba(184,134,11,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
                                        }}>
                                        {isSelected ? '✦ ' : ''}{item}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* REVIEW STEP */}
                {step === 'review' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                      <button onClick={() => setStep('build')} className="btn btn-outline-gold btn-sm">← Back to Edit</button>
                      <h2 style={{ fontFamily: 'Cinzel,serif', color: 'var(--maroon-dark)', fontSize: '1rem', fontWeight: 800 }}>Your Custom Menu</h2>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, #3D0008, #6B0010)', borderRadius: 14, padding: '24px', marginBottom: 20, border: '1px solid rgba(184,134,11,0.4)' }}>
                      <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '1.1rem', fontWeight: 900, textAlign: 'center', marginBottom: 6 }}>
                        ✦ Maa Superior Caterers ✦
                      </div>
                      <div style={{ textAlign: 'center', color: 'rgba(240,192,64,0.65)', fontFamily: 'Cormorant Garamond,serif', fontSize: '0.9rem', marginBottom: 16, fontStyle: 'italic' }}>
                        Custom Menu — {customerName || 'Your Name'} · {eventName || 'Event'}
                      </div>
                      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.5), transparent)', marginBottom: 16 }} />

                      {selectedSummary.map(({ cat, items }) => (
                        <div key={cat} style={{ marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: '1rem' }}>{CAT_ICONS[cat] || '🍴'}</span>
                            <div style={{ fontFamily: 'Cinzel,serif', color: '#F0C040', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{cat}</div>
                            <div style={{ flex: 1, height: 1, background: 'rgba(184,134,11,0.3)' }} />
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 8 }}>
                            {items.map(item => (
                              <span key={item} style={{ background: 'rgba(184,134,11,0.2)', border: '1px solid rgba(184,134,11,0.3)', color: 'rgba(240,192,64,0.9)', padding: '3px 10px', borderRadius: 16, fontFamily: 'Cormorant Garamond,serif', fontSize: '0.95rem' }}>
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}

                      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(184,134,11,0.5), transparent)', margin: '16px 0 12px' }} />
                      <div style={{ textAlign: 'center', color: 'rgba(240,192,64,0.7)', fontFamily: 'Cinzel,serif', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
                        {totalSelected} DISHES · {selectedSummary.length} CATEGORIES
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button onClick={generatePDF} className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }}>
                        📄 Download PDF
                      </button>
                      <button onClick={sendToWhatsApp} className="btn btn-maroon" style={{ flex: 1, justifyContent: 'center' }}>
                        💬 Send on WhatsApp
                      </button>
                    </div>

                    {pdfGenerated && (
                      <div className="alert alert-success" style={{ marginTop: 14, textAlign: 'center' }}>
                        ✅ PDF downloaded! Check your Downloads folder.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: Sticky summary + info */}
              <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Customer Info */}
                <div className="card" style={{ padding: '22px', border: '1px solid rgba(184,134,11,0.3)' }}>
                  <h3 style={{ fontFamily: 'Cinzel,serif', color: 'var(--maroon-dark)', fontSize: '0.85rem', fontWeight: 800, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(184,134,11,0.2)' }}>
                    📝 Your Details
                  </h3>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Your Name</label>
                    <input className="form-input" placeholder="Full name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 12 }}>
                    <label className="form-label">Event Name</label>
                    <input className="form-input" placeholder="e.g. Wedding Reception" value={eventName} onChange={e => setEventName(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Event Date</label>
                    <input className="form-input" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>

                {/* Selection Summary */}
                <div className="card" style={{ padding: '20px', border: '1px solid rgba(184,134,11,0.3)' }}>
                  <h3 style={{ fontFamily: 'Cinzel,serif', color: 'var(--maroon-dark)', fontSize: '0.85rem', fontWeight: 800, marginBottom: 14 }}>
                    🍽️ Selection Summary
                  </h3>
                  {totalSelected === 0 ? (
                    <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', fontStyle: 'italic' }}>
                      No dishes selected yet.<br/>Click any category to start.
                    </div>
                  ) : (
                    <>
                      {selectedSummary.map(({ cat, items }) => (
                        <div key={cat} style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                            <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.65rem', color: 'var(--maroon)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{cat}</div>
                            <span style={{ background: 'var(--gold-pale)', color: 'var(--gold)', padding: '2px 8px', borderRadius: 10, fontSize: '0.65rem', fontWeight: 700 }}>{items.length}</span>
                          </div>
                          <div style={{ color: 'var(--text-mid)', lineHeight: 1.6, fontFamily: 'Cormorant Garamond,serif', fontSize: '0.9rem' }}>
                            {items.slice(0, 3).join(', ')}{items.length > 3 ? ` +${items.length - 3} more` : ''}
                          </div>
                          <div style={{ height: 1, background: 'rgba(184,134,11,0.12)', marginTop: 8 }} />
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
                        <span style={{ fontFamily: 'Cinzel,serif', fontSize: '0.7rem', color: 'var(--maroon)', fontWeight: 700 }}>TOTAL DISHES</span>
                        <span style={{ background: 'linear-gradient(135deg, #B8860B, #D4A520)', color: '#1A0000', padding: '4px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, fontFamily: 'Cinzel,serif' }}>{totalSelected}</span>
                      </div>
                    </>
                  )}
                </div>

                {totalSelected > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={() => setStep('review')} className="btn btn-gold" style={{ justifyContent: 'center', width: '100%' }}>
                      Review & Export →
                    </button>
                    <button onClick={sendToWhatsApp} className="btn btn-maroon" style={{ justifyContent: 'center', width: '100%', fontSize: '0.72rem' }}>
                      💬 Send on WhatsApp
                    </button>
                  </div>
                )}

                {/* Tips */}
                <div style={{ background: 'linear-gradient(135deg, #FBF0D0, #F5E4B0)', border: '1px solid rgba(184,134,11,0.35)', borderRadius: 12, padding: '16px' }}>
                  <div style={{ fontFamily: 'Cinzel,serif', fontSize: '0.68rem', color: 'var(--maroon)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>✦ Tips</div>
                  <div style={{ color: 'var(--text-mid)', lineHeight: 1.7, fontFamily: 'Cormorant Garamond,serif', fontSize: '0.95rem' }}>
                    • Select dishes from each category<br />
                    • Categories show "Choose any One/Two" guidance<br />
                    • Export PDF for a beautiful printout<br />
                    • Send via WhatsApp for instant booking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @media (max-width: 900px) {
          .custom-menu-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
