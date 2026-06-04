import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ALA_CARTE: Record<string, { note?: string; items: string[] }> = {
  'Cold Appetizer': { note: 'Choose any One', items: ['Narial Pani','Orange Juice','Chocktail Juice','Black Grape Juice','Pineapple Juice','Pineapple Mosambi Juice','Ganga Jamuna','Orange Blossom','Coconut Punch','Cocktail Shake','Fresh Lime Soda','Strawberry Shake','Pista Punch','Pineapple Blossom','Soft Drink Assorted','Litchi Limca Float','Pista Shake','Fruit Punch','Trupti Chiled Milk Lasala'] },
  'Hot Appetizer': { note: 'Choose any One', items: ['Tomato-Corn Soup','Tomato Soup','Vegetable Soup','Sweet Corn Soup','Hot N Sour Soup','Coconut Shorba','Noodles Soup','Tomato Mint','Chilli Beans'] },
  'Bitting / Starters': { note: 'Choose any Two', items: ['Chiria Samosa','Alu Pudina Roll','Paneer Tikka Fried','Potato Finger','Cheese Ball','Pineapple Cheese Stick','Mango With Cocktail Stick','Tiranga Vada','Cheese Samosa','Kesar Pak','Colour Strawberry','Petha Ka Angoor','Chhaina Murgi','Mushroom Tikka','Harra Barra Kabab','Pista Ki Longe','Backed Badam Longe','Cocktail Spring Roll','Mini Bhakhar Vadi','Palak Paneer Roll','Mini Stuffed Puff'] },
  'Chatni & Sauce': { note: 'Choose any Two', items: ['Sweet Chatani','Fruit Chatani','Pudina Chatani','Garlic Chatani','Methi Ki Longi','Tomato Chatani','Mix Achar'] },
  'Namkeen': { note: 'Choose any One', items: ['Khasta Kachori','Mutter Kachori','Mutter Puff','Dosa Rooll (Mini)','Silver Ball','Veg Cutlets','Beans Uttapama','Patra Fried','Sandwich Dhokla','Khaman','Khandvi','Alu Mutter Samosa','Dal Ka Samosa','Gobhi Samosa','Kanji Vada or Pakodi','Chinese Samosa','Veg Spring Roll','Dahi Vada','Dahi Bhalla','Raita Bundi/Alu/Veg','Pudina/Pineapple Raita','Marwadi Dahi Wada','Bhel Sanjauri','Imerti Vada','Idli-Dahi Vada'] },
  'Salad': { note: 'Choose any Two', items: ['Green Salad','Kathor','Sprouted','Vinegar Onion','Pineapple Cheese Salad','Sprouted Beans','Beans & Veg Salad','Spicy Potato Salad','Chahha Salad','Japanese','American Salad','French Dressing','Lebanese','Russian','Sun Shine Salad','Valdrop Salad','Dhatta Mitha Salad','Green Channa Salad','Pasta Nut','Pasta with French Dressing'] },
  'Chat': { note: 'Choose any Two', items: ['Pani Puri','Dahi Papdi Chat','Delhi Chat','Dhiwada Matkawala','Kanji Ki Padodi','Paneer Bara','Green Peas Chilla','Paneer Tikka Roasted','Alu Mutter Tawewala','Mutter Patilawala','Alu Masala Chat','Alu Tikki','Kele Ki Tikki','Bangali Alu Chat','Veg Frenky','Alu Mutter Cup Chat','Dever Bhabhi Ki Chat','Fruit Chat','Bhel Puri','Lachha Katori','Cheese Basket','Pao-Bhaji','Chatni Puri','Raj Kachori','Kachori with Cholay','Shahi Chat','Sweet Corn Kiss','Tiranga Pettis','Paneer T.Bar-B-Q','Banarasi Tohfa'] },
  'Cleva - Nasta': { items: ['Bedmi & Alu Ka Saag','Cholay Bhatura','Mix Pakoda','Assorted Sandwich','Pizza','Burger','Hot-Dog'] },
  'Dal & Kadhi': { items: ['Dal Panch Masala','Dal Makhani','Rajama Masala','Dal Fry','Dal Marwari','Dal Gujaratio','Kadi Punjabi','Kadi Marwari','Kadi Gujarati','Kaji Lajawab','Dal Jaipuri (Dry)','Dal Lachka','Dal Tropolia'] },
  'Vegetables A — Paneer': { note: 'Choose any One', items: ['Paneer Pasanda','Shahi Paneer','Stuffed Paneer','Cream Paneer','Chilli Paneer','Butter Paneer Masala','Mutter Paneer','Palak Paneer','Paneer Makhanwala','Panner Korma','Bengali Lajwab','Paneer Bhurji','Triranga Paneer','Yam Yam Butter Masala','Shabnam Paneer','Methi Paner','Paneer Amritsari','Paneer Kofta','Paneer Palak Kaju','Chhole Paneer','Paneer Mirch Masala','Paneer Dum Masala','Chunmun Paneer Masala','Kesari Paneer','Orange Paneer Masala','Pan Paneer Masala','Pineapple Paneer','Baby Corn + Paneer','Mushroom + Curry','Cappsicum + Paneer','Paneer Khada Masala','Harra Chana Paneer (Seasonal)'] },
  'Vegetables B': { note: 'Choose any Two', items: ['Mutter Maharani','Khoya Mutter Kaju','Mutter Jinger','Mutter Ichakdama','Mutter Mashroom','Bhain Mutter','Japani Korma','Shahi Korma','Navratna Korma','Stuff Tinda','Stuff Perval','Bhindi Masala','Gobhi Masala','Veg Singapuri','Green Peas with Pineapple','Veg Jal Frazee','Veg Nawabi','Green Chana Masala','Methi Malai','Dana Muthiya Papri Ka Saag','Patra Dana Ka Saag','Undhiya','Kaju Kerala','Jeera Alu','Alu Dum','Dum Alu (Kashmiri)','Goani Alu','Alu Gobhi','Hydabadi Alu Masala','Alu Pudina','Stuff Capsicum','Malai Kofta','Nargis Kofta','Veg Kofta','Palak Kofta','Chhole Pindi','Chhole Golden','Chhole Masala','Gutta Masala','Mix Veg','Methi Chaman','Methi Ki Loongi','Kair Sangri','Tringa Kofta','Maxican Alu','Sabji Kachar','Shahi Kashmiri Korma','Lauki Nazakat','Kakri Nazakat','Baby Corn Dum Masala','Palak Corn Masala','Sweet Corn Tomato Bhatra','Bhindi Kerala','Rasgulla Masala','R.K.S Manpasand','Hyaderabadi Jayak','Mushroom Do Piaza'] },
  'From China With Love': { items: ['Veg Hakka Noodles','Singapuri Noodles','Veg Chow Min','Veg Manchurian','American Chopsuey','Spring Roll','Sweet N Sour','Paneer Chilly','Veg Ball with Sazwan','Fried Rice','Veg Maifu'] },
  'Pulao & Rice': { note: 'Choose any One', items: ['Plain Rice','Jeera Rice','Mutter Pulao','Mutter Paneer Pulao','Veg Pulao','Biriyani Veg','Kashmiri Pulao','Jafrani Zarda (Sweet Pulao)','White Pulao with Kaju Kismis','Navratna Pulao','Hydrabadi Biriyani','Hindi Biriyani'] },
  'Papad Lijjat': { items: ['Fried Papad','Roasted Papad','Fryam Khichia','Disco Papad'] },
  'From Karai': { items: ['Plain Puri','Tirangi Puri','Puri','Culcutti Puri','Bedmi','Bhature'] },
  'From Tawa': { items: ['Plain Parotha','Stuff Parotha','Roomali Roti','Fulka','Maithi Thepla','Bazarai Ki Roti'] },
  'From Clay Tandoor': { note: 'Choose any One', items: ['Khasta Roti','Butter Nan','Kandhari Nan (Additional Charge)','Fenny Parotha','Pudina Parotha','Missi Roti','Makka Ki Roti','Kashmiri Nan','Reshmi Parotha','Bazera Ki Roti Tandoori','Baby Nan'] },
  'Hot Sweet Dishes': { note: 'Choose any One', items: ['Stuffed Gulab Jamun','Kala Jamun','Mava Bati','Boondi with Rabdi','Jalebi Kesaria','Mal Puva','Imerti','Mung Ki Dal Ka Halwa','Doodh Pak','Kheer','Gajar Ka Halwa (Seasonal)','Jalebi with Rabd','Gulab Jamun with Rubadi','Mal Puva with Kheer','Khajoor Ki Bedmi','Anjeer Ki Bedmi','Anjeer Halwa','Neela Nariyal Ka Halwa','Hot Dry Fruit Halwa','Puran Puri','Tawa Mithai (Bengali Jalwa)'] },
  'Cold Sweet Dishes': { note: 'Choose any Two', items: ['Lacchha Rubadi','Ras Malai','Raj Bhog','Chhaina Pyse','Ras Madhuri','Rasgulla','Triveni','Chhainna Ka Aam','Malai Champ','Hiramani','Stuffed Perval','Pakiza Stufed Perval','Orange Ki Kheer','Chandani','Kashmiri Halwa','Makhan Ka Tarbooj','Bassodi (Kesar)','Basoodi','Sitafal Strawberry (Seasonal)','Basoodi (Dry Fruit)','Bassodi (Mango)','Basoodi (Kesar Boondi)','Panner Ghawer','Kangan Malai Ghawer','Mini Ghawer','Shrikhand (Mango/Dry Fruit/Kesar/Elaichi)','Aam Ras','Fresh Fruit Rabadi','Makhan Ka Samosa','Inderani','Amrutt Bhog'] },
  'Special Sweets': { note: 'Additional Charge', items: ['Badam Ki Katali','Badam Pista Roll','Badshah Passanda','Mehfil','Amrapali','Amardeep','Tri Colour Katali','Badam Pista Basket Halwa','Badam Ka Halwa','Pista Ka Halwa','Tri Colour Basket','Kaju Pista Roll','Badam Pista Samosa','Badam Pista Sandwich','Pista Rasgulla','Badam Pista Trirangi Barfi','Kaju Kesar Samosa','Kaju Pista Samosa','Pista Rani'] },
  'Desert Dish': { note: 'Choose any One', items: ['Matka Kulfi','Kulfi Faluda','Rubdi Faluda','Ice Slush','Rajwadi Slush','Loose Ice Cream'] },
  'Ice Cream': { items: ['Kesar Pista','Kaju Draksh','American Dry Fruit','Havmore','Butter Scotch','Rajbhog','Anjeer','Pineapple','Mango','Kasata','Butter Chocolate Cone','Rainbow','Mava Masti','Sitafal','Shahi Gulab','Special Amla','Litchi','American Chocolate','Dairy Milk','Matka Kulfi','Barf Chhin with Ice Cream','Cream Keri with Ice Cream'] },
  'Rangila Rajasthani Khana': { items: ['Dal Bati Churma','Gata Ka Saag','Lehsun Ki Chatni','Fulka','Kair-Sangri Ka Achar','Methi Ki Loongi','Kachar + Gawar Pali & Alu Mix'] },
  'Garvi Gujarat': { items: ['Khati-Mithi Kadhi','Khichadi','Bazara Ni Roti + Makhan','Ringan-Bataka Nu Saag','Pudina Garlic Geen Chatni','Makai Ka Handwa','Chhash'] },
  'South Indian': { items: ['Assorted Dosa','Uttapam Assorted','Veg Omlet','Idly','Medu Vada','Misri Bella Bhat','Sambar','Nariyal Chatni','Paisam','Steam Rice Curb'] },
  'Expresso Coffee & Tea': { items: ['Tea','Coffee'] },
  'Mukhwas & Pan': { items: ['Ghana Ni Dal','Lili Variyali','Mithu Pan','Sadu Pan','Oltaim Raj Mukhwas','Kharec','Hajma Hajam','Suvani Dal','Shingoda Pan','Lilo Mukhwas','Lakhanavi Pan','Pan Bida'] },
};

const PRESET_MENUS: Record<number, { title: string; items: string[] }> = {
  1:  { title: 'Classic Vegetarian',  items: ['Tomato Soup','Sitafal Basoodi','Kaju Pina Sandwich','Garam Puri','Butter Nan','Paneer Korma','Sev Boondi Capsicum','Lilva Wonton','Makai Corn','Lili Chatni','Delhi Chat','Paneer Chilla','Hakka Noodles','Dal Fry','Mix Achar','Mukhwas','Ice Cream','Mineral Water'] },
  2:  { title: 'Festive Special',     items: ['Minestrone Soup','Anjeer Kedabari Basoodi','Coconut Delight','Puri Garam','Amali Roti','Chainese Bhel','Lachha Kachori','Alu Tikka','Bar Becyu Chat','Manchurian Gravy','Papad Fry','Gujarati Dal','Plain Rice','Tawa Thalji','Mini Undhiyu','Red Sauce','Mukhwas','Ice Cream','Mineral Water'] },
  3:  { title: 'Grand Celebration',   items: ['Minestrone Soup','Anjeer Kedabari Basoodi','Coconut Delight','Puri Garam','Amali Roti','Chainese Bhel','Lachha Kachori','Alu Tikka','Bar Becyu Chat','Manchurian Gravy','Papad Fry','Gujarati Dal','Plain Rice','Tawa Thalji','Mini Undhiyu','Mukhwas','Ice Cream','Mix Achar','Mineral Water'] },
  4:  { title: 'Royal Thali',         items: ['Hot & Sour Soup','Shahi Rabdi','Halwo','Locha Puri','Mithi Roti','Paneer Pasanda','Rajasthani Bataki','Tava Vegetable','Lilva Korns','Mini Honsa','Red Sauce','Dal Hyderabadi','Jeera Rice','Chilli Paneer','Manchurian','Papad Fry','Mukhwas','Lemon Chilli Achar','Mineral Water'] },
  5:  { title: 'Premium Select',      items: ['Corn Tomato Soup','Rabdi Jvadi','Anjeer Halwa','Locha Puri','Amali Roti','Jodhpuri Bataki','Mini Undhiyu','Paneer Capsicum','In Mutter','Bel','Hyderabadi Chilla','Sbaka Kadhi','Pulav Dry Fruit','Palak Paneer','Capsicum Alu Tikki','Papads','Red Sauce','Mukhwas','Mix Achar','Mineral Water'] },
  6:  { title: 'Spice Garden',        items: ['Chilli Beans Soup','Cream Flavour','Kaju Anjeer Tapapuri','Tanduri Roti','Locha Puri','Sarso Da Shak','Chilli Boondi Shak','Paneer Tikka','Batakani Chips','Red Sauce','Chat Basket','Gujarati Dal','Plain Bhat','Papad Mix Fry','Mukhwas','Draksanu Athanu','Mineral Water'] },
  7:  { title: 'Fusion Feast',        items: ['Vegetable Noodles with Tomato Soup','Anguri Rabdi','Badam Halwa','Methina Thepla','Locha Puri','Naan','Jayapuri Vegetable','Panjabi Flavar','Potato Chips','Chainese Samosa','Khasta Kachori','Delhi Chat','Mini Uttapam','American Chopsi','Fry Chilli Paneer','Red Sauce','Green Chatni','Raiwala Vadavani Marcha','Kadhi Sbokavali','Pulav Kaju Flas','Papads Bested','Mineral Water'] },
  8:  { title: 'Maharaja Special',    items: ['Palak Flavar Soup','Kala Jam','Locha Puri','Angur Basoodi','Butter Nan','Shahi Paneer','Rajasthani Bataka','Sev Boondi Capsicum','Lilva Konas','Chat Basket','Red Sauce','Dasabari Kabab','Manchurian with Fry Rice','Dal Kadhi','Veg Oli Ariyani','Papads Fry','Samtanu','Mineral Water'] },
  9:  { title: 'Exotic Blend',        items: ['Noodles with Butter Stick Soup','Basoodi','Coconut Halwa','Locha Puri','Methi Na Thepla','Malai Kofta','Sev Boondi Capsicum','Potato Chips','Ratala Pettis','Corn Basket','Red Sauce','Green Chatni','Gujarati Kadhi','Green Pis Pulav','Papad Fry','Mix Khadu Athanu','Mineral Water'] },
  10: { title: 'Heritage Menu',       items: ['Corn Soup','Kaju Paina Sendvich','Locha Puri','Amali Roti','Methi Chaman with Paneer','Falavar Vatana','Barel Parvar','Dhosana Rolls','Dhdhino Halwo','Green Chatni','Alu Tikki','Chainese Bhel','Rai Vala Marcha','Green Salad','Plain Bhat','Papad Mix Fry','Mukhwas','Draksanu Athanu','Mineral Water'] },
  11: { title: 'South-North Fusion',  items: ['Tomato Rasm','Dry Fruit Cream with Anguri','Kaju Pista Kamal','Locha Puri','Masala Naan','Tava Thalji','Fansdi Makai','Vatana In Palak Grevi','Idskola Fry','Paneer Chilla','Methi Bajina Dhokla','Red Sauce','Paneer Cholla','Dhis-Ko Rolls','Green Dal','Plain Basmati Rice','Rajasthani Khchida','Mix Papads','Gajar Libunu Athanu','Mineral Water'] },
  12: { title: 'Palak Corn Special',  items: ['Palakno Corn Soup','Indhrani','Kaju Koprana Rolls','Locha Puri','Methi Naan','Butter Paneer Korma','Mini Undhiyu','Bindi Masala','Bermis Roll','Ratala Handvo','Red Sauce','Samosa Chat','Manchurian n Fry Rice','Dal Kadhi','Veg Oily Ariyani','Papad Fry','Samtanu','Mineral Water'] },
  13: { title: 'Rajasthani Thali',    items: ['Dal (Panchranga)','Baati','Churma','Gatta Nu Shak','Ringan Batakanu Shak','Khasta Kachori','Lili Chatni','Rajasthani Kadhi','Rajasthani Khichida','Mula Nu Salad','Ghewer'] },
  14: { title: 'Makai Special',       items: ['Makaini Roti','Sarso Da Shak','Tanduri','Paneer Korma','Rajbhog Motha','Dal Fry','Jeera Rice','Jwar Mix Fry Chayms'] },
  15: { title: 'Simple Gujarati',     items: ['Chole','Bhature','Dal Fry','Jeera Rice','Kala Jamun','Green Salad','Papads'] },
  16: { title: 'Mini Thali',          items: ['Parotha','Shak','Kadhi','Pulao','Jalebi','Papdi'] },
  17: { title: 'Puri Moti Bhoj',      items: ['Puri Moti','Shak','Dal-Bhat','Papads','Mahi'] },
  18: { title: 'Traditional Gujarati',items: ['Fada Lapsi','Puri','Gota','Batakanu Shak','Deshi Chana','Dal','Bhat','Papads','Salad'] },
  19: { title: 'Festive Bhoj',        items: ['Chokha Ghina Ladu','Puri','Fulvadi','Batakanu Rasavalu Shak','Ek Green Shak','Deshi Chana/Val','Gujarati Dal','Plain Bhat','Papads','Green Salad','Ravanu'] },
};

const CAT_ICONS: Record<string, string> = {
  'Cold Appetizer':'🥤','Hot Appetizer':'🍲','Bitting / Starters':'🍢',
  'Chatni & Sauce':'🥣','Namkeen':'🥟','Salad':'🥗','Chat':'🌮',
  'Cleva - Nasta':'🥪','Dal & Kadhi':'🍛','Vegetables A — Paneer':'🧀',
  'Vegetables B':'🥘','From China With Love':'🍜','Pulao & Rice':'🍚',
  'Papad Lijjat':'🫓','From Karai':'🥙','From Tawa':'🫔',
  'From Clay Tandoor':'🍞','Hot Sweet Dishes':'🍮','Cold Sweet Dishes':'🍨',
  'Special Sweets':'🍬','Desert Dish':'🍦','Ice Cream':'🍧',
  'Rangila Rajasthani Khana':'🏜️','Garvi Gujarat':'🙏',
  'South Indian':'🍲','Expresso Coffee & Tea':'☕','Mukhwas & Pan':'🌿',
};

export default function Menu() {
  const [tab, setTab] = useState<'alacarte' | 'preset'>('alacarte');
  const [search, setSearch] = useState('');
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [openPreset, setOpenPreset] = useState<number | null>(null);

  const cats = Object.entries(ALA_CARTE);
  const filtered = search.trim()
    ? cats.filter(([cat, { items }]) =>
        cat.toLowerCase().includes(search.toLowerCase()) ||
        items.some(i => i.toLowerCase().includes(search.toLowerCase())))
    : cats;

  return (
    <>
      <Header />
      <div style={{ paddingTop: 70 }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #2D0000, #4A0000)', padding: '52px 0', textAlign: 'center' }}>
          <div className="container">
            <div className="chip" style={{ background: 'rgba(201,150,26,0.18)', color: '#F5C842', borderColor: 'rgba(201,150,26,0.35)', margin: '0 auto 14px' }}>Our Cuisine</div>
            <h1 style={{ fontFamily: 'Cinzel,serif', color: '#F5C842', fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: 10, fontWeight: 900 }}>Complete Menu</h1>
            <div className="divider divider-center" />
            <p style={{ color: 'rgba(245,200,66,0.65)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
              500+ dishes across 25+ categories — Gujarati, Rajasthani, South Indian, Chinese & more
            </p>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ background: 'white', borderBottom: '2px solid rgba(201,150,26,0.2)', position: 'sticky', top: 70, zIndex: 100 }}>
          <div className="container" style={{ display: 'flex' }}>
            {[{ k: 'alacarte', label: '🍽️ À La Carte Menu' }, { k: 'preset', label: '📋 Set Menus (1–19)' }].map(t => (
              <button key={t.k} onClick={() => setTab(t.k as any)} style={{
                padding: '16px 28px', border: 'none', cursor: 'pointer',
                fontFamily: 'Cinzel,serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
                background: 'transparent', textTransform: 'uppercase',
                color: tab === t.k ? '#C9961A' : '#8B5E3C',
                borderBottom: tab === t.k ? '3px solid #C9961A' : '3px solid transparent',
                transition: 'all 0.2s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* À LA CARTE */}
        {tab === 'alacarte' && (
          <div style={{ padding: '40px 0 64px', background: 'var(--cream)' }}>
            <div className="container">
              <div style={{ maxWidth: 460, margin: '0 auto 32px' }}>
                <input className="form-input" placeholder="🔍 Search any dish or category..." value={search}
                  onChange={e => setSearch(e.target.value)} style={{ textAlign: 'center', fontSize: '0.9rem' }} />
                {search && <p style={{ textAlign: 'center', color: '#8B5E3C', marginTop: 8, fontSize: '0.82rem', fontFamily: 'Cormorant Garamond,serif' }}>
                  Showing results for "<strong>{search}</strong>"
                </p>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(([cat, { note, items }]) => {
                  const filteredItems = search
                    ? items.filter(i => i.toLowerCase().includes(search.toLowerCase()) || cat.toLowerCase().includes(search.toLowerCase()))
                    : items;
                  const isOpen = openCat === cat || !!search;
                  return (
                    <div key={cat} className="card" style={{ border: isOpen && !search ? '1.5px solid rgba(201,150,26,0.4)' : '1px solid rgba(201,150,26,0.18)' }}>
                      <button onClick={() => setOpenCat(isOpen && !search ? null : cat)} style={{
                        width: '100%', padding: '15px 20px', border: 'none', cursor: 'pointer', textAlign: 'left',
                        background: isOpen && !search ? 'linear-gradient(135deg, #FDF5DC, #FFFBF0)' : 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderRadius: isOpen && !search ? '10px 10px 0 0' : 10, transition: 'all 0.2s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: '1.4rem' }}>{CAT_ICONS[cat] || '🍴'}</span>
                          <div>
                            <div style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, color: '#2D0000', fontSize: '0.88rem', letterSpacing: '0.04em' }}>{cat}</div>
                            {note && <div style={{ fontSize: '0.68rem', color: '#C9961A', fontWeight: 700, marginTop: 2, fontFamily: 'Cinzel,serif', letterSpacing: '0.06em' }}>{note}</div>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ background: 'var(--gold-pale)', color: '#C9961A', padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700, fontFamily: 'Cinzel,serif', border: '1px solid rgba(201,150,26,0.3)' }}>
                            {filteredItems.length} items
                          </span>
                          <span style={{ color: '#C9961A', fontSize: '0.75rem', transform: isOpen && !search ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(201,150,26,0.15)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: 8 }}>
                            {filteredItems.map((item, idx) => (
                              <div key={idx} style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '7px 11px', borderRadius: 8,
                                background: 'var(--cream)', border: '1px solid rgba(201,150,26,0.15)',
                                fontSize: '0.83rem', color: '#2D0000', fontFamily: 'Cormorant Garamond,serif', fontSize: '0.95rem',
                              }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9961A', flexShrink: 0 }} />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SET MENUS */}
        {tab === 'preset' && (
          <div style={{ padding: '40px 0 64px', background: 'var(--cream)' }}>
            <div className="container">
              <p style={{ textAlign: 'center', color: '#6A4A2A', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem', marginBottom: 36 }}>
                Click any menu to see all included dishes. Perfect for weddings, receptions & all occasions.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
                {Object.entries(PRESET_MENUS).map(([num, menu]) => {
                  const n = parseInt(num);
                  const isOpen = openPreset === n;
                  return (
                    <div key={num} className="card" style={{ border: isOpen ? '1.5px solid rgba(201,150,26,0.5)' : '1px solid rgba(201,150,26,0.2)', transition: 'all 0.2s' }}>
                      <button onClick={() => setOpenPreset(isOpen ? null : n)} style={{
                        width: '100%', padding: '16px 20px', border: 'none', cursor: 'pointer', textAlign: 'left',
                        background: isOpen ? 'linear-gradient(135deg, #4A0000, #6B0000)' : 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderRadius: isOpen ? '10px 10px 0 0' : 10, transition: 'all 0.2s',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                            background: isOpen ? 'rgba(201,150,26,0.25)' : 'linear-gradient(135deg, #C9961A, #E5B732)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'Cinzel,serif', fontWeight: 900, fontSize: '1.1rem',
                            color: isOpen ? '#F5C842' : '#2D0000',
                          }}>{n}</div>
                          <div>
                            <div style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, color: isOpen ? '#F5C842' : '#2D0000', fontSize: '0.88rem' }}>
                              Menu {n}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: isOpen ? 'rgba(245,200,66,0.7)' : '#8B5E3C', marginTop: 2, fontFamily: 'Cormorant Garamond,serif' }}>
                              {menu.title}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            background: isOpen ? 'rgba(201,150,26,0.2)' : 'var(--gold-pale)',
                            color: isOpen ? '#F5C842' : '#C9961A',
                            padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 700,
                            fontFamily: 'Cinzel,serif', border: `1px solid ${isOpen ? 'rgba(201,150,26,0.3)' : 'rgba(201,150,26,0.3)'}`,
                          }}>
                            {menu.items.length} courses
                          </span>
                          <span style={{ color: isOpen ? '#F5C842' : '#C9961A', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', fontSize: '0.75rem' }}>▼</span>
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '16px 18px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {menu.items.map((item, i) => (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8,
                                background: i % 2 === 0 ? 'var(--cream)' : 'white',
                                border: '1px solid rgba(201,150,26,0.12)',
                              }}>
                                <div style={{
                                  width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                                  background: 'linear-gradient(135deg, #C9961A, #E5B732)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: '#2D0000', fontSize: '0.62rem', fontWeight: 900, fontFamily: 'Cinzel,serif',
                                }}>{i + 1}</div>
                                <span style={{ fontSize: '0.88rem', color: '#1A0A00', fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', fontWeight: 500 }}>{item}</span>
                              </div>
                            ))}
                          </div>
                          <a href="/quote" className="btn btn-maroon btn-sm" style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
                            Book Menu {n} →
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #C9961A, #E5B732, #C9961A)', padding: '52px 0', textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontFamily: 'Cinzel,serif', color: '#2D0000', fontSize: '1.6rem', marginBottom: 10, fontWeight: 900 }}>Ready to Book Your Menu?</h2>
            <p style={{ color: 'rgba(45,0,0,0.75)', fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem', marginBottom: 28 }}>Contact us to customise or request a free quote.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/quote" className="btn btn-maroon btn-lg">Get Free Quote</a>
              <a href="/custom-menu" className="btn btn-lg" style={{ background: 'linear-gradient(135deg, #3D0008, #6B0010)', color: '#F0C040', border: '1px solid rgba(184,134,11,0.4)' }}>✦ Build Custom Menu</a>
              <a href="https://wa.me/9879556507?text=Hello! I want to enquire about your catering menu." target="_blank" rel="noreferrer"
                className="btn btn-lg" style={{ background: '#25D366', color: 'white' }}>💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
