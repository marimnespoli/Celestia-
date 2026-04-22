
// Celestia — Screens

// ── ASTRO CALCULATIONS ────────────────────────────────────────
function getMoonSign(birthDateStr) {
  if (!birthDateStr) return null;
  // Reference: Jan 2, 2000 UTC — Moon entered Aries
  const refDate = new Date('2000-01-02T12:00:00Z');
  const birth   = new Date(birthDateStr + 'T12:00:00Z');
  const days    = (birth - refDate) / 86400000;
  const cycle   = 27.321661; // sidereal month in days
  const pos     = ((days % cycle) + cycle) % cycle;
  return ZODIAC_SIGNS[Math.floor(pos / (cycle / 12))].name;
}

function getRisingSign(birthDateStr, birthTimeStr) {
  if (!birthDateStr || !birthTimeStr) return null;
  const [h, m] = birthTimeStr.split(':').map(Number);
  const birth  = new Date(birthDateStr);
  const doy    = Math.floor((birth - new Date(birth.getFullYear(), 0, 1)) / 86400000);
  // Approximate sun sign index from day of year
  const sunIdx = Math.floor(((doy + 10) % 365) / 30.4) % 12;
  // Rising advances ~1 sign per 2 hours; offset so 6am ≈ sun sign on the horizon
  const rising = (sunIdx + Math.floor((h * 60 + m) / 120) + 6) % 12;
  return ZODIAC_SIGNS[rising].name;
}

// ── HOME SCREEN (Zodiac Carousel) ─────────────────────────────
function HomeScreen({ userSign, onSelectSign }) {
  const [idx, setIdx] = React.useState(
    userSign ? ZODIAC_SIGNS.findIndex(z => z.name === userSign) : 0
  );
  const [dragging, setDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const sign = ZODIAC_SIGNS[idx];

  const go = (dir) => setIdx(i => (i + dir + 12) % 12);

  const onTouchStart = e => { setDragging(true); setStartX(e.touches[0].clientX); };
  const onTouchEnd = e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    setDragging(false);
  };

  const today = sign.horoscope.today;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(240,238,248,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>Today</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#F0EEF8', letterSpacing: -0.3 }}>Celestia</div>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(240,238,248,0.5)', textAlign: 'right' }}>
          <div style={{ color: '#9B85E0', fontWeight: 500, fontSize: 12 }}>April 21, 2026</div>
          <div>Choose your sign</div>
        </div>
      </div>

      {/* Main card carousel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px', gap: 14, overflow: 'hidden' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Sign card */}
        <div style={{
          flex: '0 0 auto', height: 310,
          background: sign.cardBg, borderRadius: 28,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Nav arrows */}
          <button onClick={() => go(-1)} style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#1A1A5E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
          }}>‹</button>
          <button onClick={() => go(1)} style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#1A1A5E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
          }}>›</button>

          {/* Illustration area */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Glow behind figure */}
            <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', filter: 'blur(30px)', top: '15%' }} />
            <ZodiacArt name={sign.name} cardBg={sign.cardBg} figureLight={sign.figureLight} size="full" />
          </div>

          {/* Bottom info */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '30px 22px 18px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.18))',
          }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: sign.figureLight ? '#F0EEF8' : '#1A1A5E', letterSpacing: -0.5 }}>
              {sign.name}
            </div>
            <div style={{ fontSize: 12, color: sign.figureLight ? 'rgba(240,238,248,0.7)' : 'rgba(26,26,94,0.65)', marginTop: 2 }}>
              {sign.dates}
              {userSign === sign.name && <span style={{ marginLeft: 8, opacity: 0.7 }}>(you)</span>}
            </div>
          </div>

          {/* Planet badge */}
          <div style={{
            position: 'absolute', top: 16, right: 52,
            background: 'rgba(255,255,255,0.3)', borderRadius: 12,
            padding: '3px 10px', fontSize: 10, fontWeight: 600,
            color: sign.figureLight ? '#F0EEF8' : '#1A1A5E',
            letterSpacing: 0.5, backdropFilter: 'blur(8px)',
          }}>{sign.element} · {sign.planet}</div>
        </div>

        {/* Choose zone */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 4 }}>
          <span style={{ color: 'rgba(240,238,248,0.7)', fontSize: 13, fontWeight: 500, letterSpacing: 0.2 }}>Choose zone</span>
          <button onClick={() => onSelectSign(sign.name)} style={{
            background: 'linear-gradient(135deg, #9B85E0, #F0A8C4)',
            border: 'none', borderRadius: 20, padding: '7px 18px',
            color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            letterSpacing: 0.3, boxShadow: '0 4px 16px rgba(155,133,224,0.4)',
          }}>View Horoscope ›</button>
        </div>

        {/* Progress rings */}
        <GlassCard style={{ padding: '18px 12px 14px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
          <CircularProgress key={`${sign.name}-love`} value={today.love} label="Love" color="#F0A8C4" />
          <CircularProgress key={`${sign.name}-emo`} value={today.emotions} label="Emotions" color="#9B85E0" />
          <CircularProgress key={`${sign.name}-mind`} value={today.mentality} label="Mentality" color="#7EC8E3" />
          <CircularProgress key={`${sign.name}-career`} value={today.career} label="Career" color="#A8D8A8" />
        </GlassCard>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingBottom: 4 }}>
          {ZODIAC_SIGNS.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{
              width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
              background: i === idx ? '#9B85E0' : 'rgba(255,255,255,0.2)',
              cursor: 'pointer', transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HOROSCOPE SCREEN ──────────────────────────────────────────
function HoroscopeScreen({ sign, onBack }) {
  const [tab, setTab] = React.useState('today');
  const [activeCategory, setActiveCategory] = React.useState(0);
  const data = sign.horoscope[tab];

  const categories = [
    { label: 'Love', icon: '♥', color: '#F0A8C4' },
    { label: 'Career', icon: '◆', color: '#A8D8A8' },
  ];

  const stars = Math.round((data[['love','career','emotions','mentality'][activeCategory]] / 20));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero card */}
      <div style={{
        flex: '0 0 auto', height: 220, background: sign.cardBg,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Art */}
        <div style={{ position: 'absolute', right: 10, bottom: 0, opacity: 0.95 }}>
          <ZodiacArt name={sign.name} cardBg={sign.cardBg} figureLight={sign.figureLight} size="small" />
        </div>

        {/* Back button */}
        <button onClick={onBack} style={{
          position: 'absolute', top: 14, left: 16,
          background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%',
          width: 32, height: 32, cursor: 'pointer', fontSize: 16,
          color: sign.figureLight ? '#F0EEF8' : '#1A1A5E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>‹</button>

        {/* Dot menu */}
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: sign.figureLight ? 'rgba(240,238,248,0.5)' : 'rgba(26,26,94,0.4)' }} />)}
        </div>

        {/* Sign info */}
        <div style={{ position: 'absolute', bottom: 22, left: 22 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.6, color: sign.figureLight ? '#F0EEF8' : '#1A1A5E' }}>{sign.name}</div>
          <div style={{ fontSize: 12, color: sign.figureLight ? 'rgba(240,238,248,0.65)' : 'rgba(26,26,94,0.6)', marginTop: 2 }}>{sign.dates}</div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 80px', paddingTop: 0 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 24, padding: '16px 0 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['today', 'month'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px',
              fontSize: 14, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? '#F0EEF8' : 'rgba(240,238,248,0.45)',
              position: 'relative', textTransform: 'capitalize',
              fontFamily: 'Outfit, sans-serif',
              borderBottom: tab === t ? '2.5px solid #9B85E0' : '2.5px solid transparent',
              marginBottom: -13, transition: 'all 0.2s',
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 10, padding: '16px 0 8px', overflowX: 'auto' }}>
          {categories.map((cat, i) => (
            <button key={i} onClick={() => setActiveCategory(i)} style={{
              flex: '0 0 auto',
              width: 54, height: 54, borderRadius: 18,
              background: i === activeCategory ? cat.color : 'rgba(255,255,255,0.07)',
              border: `1px solid ${i === activeCategory ? cat.color : 'rgba(255,255,255,0.1)'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, transition: 'all 0.25s',
              boxShadow: i === activeCategory ? `0 6px 20px ${cat.color}50` : 'none',
            }}>{cat.icon}</button>
          ))}
        </div>

        {/* Category content */}
        <div style={{ paddingTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#F0EEF8' }}>{categories[activeCategory].label}</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 12, color: s <= stars ? '#F0A8C4' : 'rgba(240,238,248,0.2)' }}>★</span>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(240,238,248,0.7)', margin: 0 }}>
            {data.loveSex}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(240,238,248,0.5)', marginTop: 12 }}>
            {data.overall}
          </p>
        </div>

        {/* Progress rings */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 12, color: 'rgba(240,238,248,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>Your energies today</div>
          <GlassCard style={{ padding: '18px 8px 14px', display: 'flex', justifyContent: 'space-around' }}>
            <CircularProgress key={`h-${tab}-love`} value={data.love} label="Love" color="#F0A8C4" />
            <CircularProgress key={`h-${tab}-emo`} value={data.emotions} label="Emotions" color="#9B85E0" />
            <CircularProgress key={`h-${tab}-mind`} value={data.mentality} label="Mentality" color="#7EC8E3" />
            <CircularProgress key={`h-${tab}-career`} value={data.career} label="Career" color="#A8D8A8" />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ── COMPATIBILITY SCREEN ──────────────────────────────────────
function CompatibilityScreen({ userSign }) {
  const [partnerSign, setPartnerSign] = React.useState(null);
  const [showPicker, setShowPicker] = React.useState(false);
  const [angle, setAngle] = React.useState(0);

  React.useEffect(() => {
    const raf = requestAnimationFrame(function tick() {
      setAngle(a => (a + 0.4) % 360);
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const mySign = ZODIAC_SIGNS.find(z => z.name === userSign) || ZODIAC_SIGNS[0];
  const partner = partnerSign ? ZODIAC_SIGNS.find(z => z.name === partnerSign) : null;
  const compat = partner ? COMPATIBILITY_DATA[mySign.name]?.[partner.name] : null;
  const i1 = ZODIAC_SIGNS.findIndex(z => z.name === mySign.name);
  const i2 = partner ? ZODIAC_SIGNS.findIndex(z => z.name === partner.name) : 0;
  const loveScore  = compat ? Math.min(99, Math.max(35, compat + ((i1 * 5 + i2 * 3) % 21) - 10)) : null;
  const friendScore = compat ? Math.min(99, Math.max(35, compat + ((i1 * 3 + i2 * 7) % 21) - 10)) : null;

  const orbR = 95;
  const partnerX = 160 + orbR * Math.cos((angle * Math.PI) / 180);
  const partnerY = 160 + orbR * Math.sin((angle * Math.PI) / 180);
  const myX = 160 + orbR * Math.cos(((angle + 180) * Math.PI) / 180);
  const myY = 160 + orbR * Math.sin(((angle + 180) * Math.PI) / 180);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#F0EEF8', letterSpacing: -0.4 }}>Compatibility</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[0,1,2].map(i=><div key={i} style={{ width: 20, height: 2.5, borderRadius: 2, background: 'rgba(240,238,248,0.3)' }} />)}
        </div>
      </div>

      {/* Profile sign hint */}
      <div style={{ textAlign: 'center', fontSize: 11, padding: '4px 22px 0', color: userSign ? 'rgba(155,133,224,0.6)' : 'rgba(240,168,196,0.75)' }}>
        {userSign ? `Your sign (${userSign}) is saved in Profile` : 'Set your sign in Profile — it will appear here'}
      </div>

      {/* Orbital animation canvas */}
      <div style={{ position: 'relative', height: 260, flexShrink: 0, overflow: 'hidden' }}>
        <svg viewBox="0 0 320 320" width="100%" height="260" style={{ position: 'absolute', inset: 0 }}>
          {/* Outer dashed orbit */}
          <circle cx="160" cy="160" r="130" stroke="rgba(155,133,224,0.18)" strokeWidth="1.5" fill="none" strokeDasharray="6 5" />
          {/* Inner dashed orbit */}
          <circle cx="160" cy="160" r="95" stroke="rgba(240,168,196,0.22)" strokeWidth="1" fill="none" strokeDasharray="4 4" />

          {/* Floating sparkles */}
          {[{x:60,y:80},{x:260,y:60},{x:40,y:240},{x:280,y:250},{x:180,y:40},{x:100,y:290}].map((p,i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i%2===0?3:2}
              fill={i%3===0?'#F0A8C4':i%3===1?'#9B85E0':'#fff'}
              opacity={0.6 + 0.3*Math.sin((angle/20)+i)} />
          ))}

          <defs>
            <radialGradient id="partnerGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#C8B8F8" />
              <stop offset="100%" stopColor="#7050B8" />
            </radialGradient>
            <radialGradient id="myGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#F8C8D8" />
              <stop offset="100%" stopColor="#C050A0" />
            </radialGradient>
            <clipPath id="myClip"><circle cx="0" cy="0" r="28" /></clipPath>
            <clipPath id="partnerClip"><circle cx="0" cy="0" r="28" /></clipPath>
          </defs>

          {/* Partner avatar orbiting */}
          {partner ? (
            <g transform={`translate(${partnerX},${partnerY})`}>
              <circle cx="0" cy="0" r="32" fill="url(#partnerGrad)" stroke="rgba(240,168,196,0.5)" strokeWidth="2" />
              <image href={`images/icon-${partner.name.toLowerCase()}.png`} x="-28" y="-28" width="56" height="56" clipPath="url(#partnerClip)" />
            </g>
          ) : (
            <g transform={`translate(${partnerX},${partnerY})`}>
              <circle cx="0" cy="0" r="28" fill="rgba(155,133,224,0.15)" stroke="rgba(155,133,224,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
              <text x="0" y="5" textAnchor="middle" fontSize="16" fill="rgba(155,133,224,0.5)">?</text>
            </g>
          )}

          {/* My sign avatar */}
          <g transform={`translate(${myX},${myY})`}>
            <circle cx="0" cy="0" r="32" fill="url(#myGrad)" stroke="rgba(155,133,224,0.5)" strokeWidth="2" />
            <image href={`images/icon-${mySign.name.toLowerCase()}.png`} x="-28" y="-28" width="56" height="56" clipPath="url(#myClip)" />
          </g>
        </svg>
      </div>

      {/* Add Partner button */}
      <div style={{ padding: '8px 22px 4px' }}>
        <button onClick={() => setShowPicker(true)} style={{
          width: '100%', padding: '13px', borderRadius: 30,
          background: 'linear-gradient(135deg, rgba(240,168,196,0.25), rgba(155,133,224,0.25))',
          border: '1.5px solid rgba(240,168,196,0.4)',
          color: '#F0EEF8', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(240,168,196,0.15)',
          letterSpacing: 0.3, transition: 'all 0.2s',
        }}>
          ⊕ {partner ? `Change Partner (${partner.name})` : 'Add Partner'}
        </button>
      </div>

      {/* Compat scores if partner selected */}
      {compat && (
        <div style={{ padding: '4px 22px 8px' }}>
          <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#F0EEF8', marginBottom: 10 }}>
            {compat}% <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(240,238,248,0.5)' }}>overall match</span>
          </div>
          {[{ label: 'Love', score: loveScore, color: 'linear-gradient(90deg,#F0A8C4,#e06090)' },
            { label: 'Friendship', score: friendScore, color: 'linear-gradient(90deg,#9B85E0,#6a9ee0)' }
          ].map(({ label, score, color }) => (
            <div key={label} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'rgba(240,238,248,0.6)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#F0EEF8' }}>{score}%</span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Text content */}
      <div style={{ padding: '0 22px', flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#F0EEF8', marginBottom: 8, letterSpacing: -0.3 }}>
          {partner ? `${mySign.name} & ${partner.name}` : 'Test compatibility in love and friendship'}
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(240,238,248,0.5)', margin: 0 }}>
          {partner
            ? `${mySign.name} and ${partner.name} share a ${compat >= 80 ? 'deeply harmonious' : compat >= 65 ? 'complementary' : 'challenging but growth-filled'} bond. The celestial dance between ${mySign.planet} and ${partner.planet} creates ${compat >= 75 ? 'powerful synergy' : 'meaningful tension'}.`
            : 'Discover cosmic connections. Add a partner to reveal the celestial forces at work between your signs.'}
        </p>
      </div>

      {/* Sign picker modal */}
      {showPicker && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(13,13,43,0.95)',
          backdropFilter: 'blur(20px)', zIndex: 100, display: 'flex', flexDirection: 'column',
          borderRadius: 'inherit',
        }}>
          <div style={{ padding: '20px 22px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#F0EEF8' }}>Choose partner's sign</span>
            <button onClick={() => setShowPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'rgba(240,238,248,0.5)' }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '4px 22px 20px', overflowY: 'auto' }}>
            {ZODIAC_SIGNS.map(z => (
              <button key={z.name} onClick={() => { setPartnerSign(z.name); setShowPicker(false); }} style={{
                background: partnerSign === z.name ? 'linear-gradient(135deg,#9B85E0,#F0A8C4)' : 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '14px 8px',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif',
              }}>
                <img src={`images/icon-${z.name.toLowerCase()}.png`} alt={z.name} style={{ width: 52, height: 52, objectFit: 'contain' }} />
                <span style={{ fontSize: 12, color: '#F0EEF8', fontWeight: 500 }}>{z.name}</span>
                <span style={{ fontSize: 10, color: 'rgba(240,238,248,0.5)' }}>{z.dates.split('–')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SETTINGS SCREEN ───────────────────────────────────────────
function SettingsScreen({ userSign, birthDate, birthTime, onSave }) {
  const [selSign, setSelSign] = React.useState(userSign || '');
  const [date, setDate]       = React.useState(birthDate || '');
  const [time, setTime]       = React.useState(birthTime || '');
  const [saved, setSaved]     = React.useState(false);

  const handle = () => {
    if (!selSign) return;
    onSave(selSign, date, time);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectedSign  = ZODIAC_SIGNS.find(z => z.name === selSign);
  const moonSignName  = getMoonSign(date);
  const moonSign      = moonSignName ? ZODIAC_SIGNS.find(z => z.name === moonSignName) : null;
  const risingSignName = getRisingSign(date, time);
  const risingSign    = risingSignName ? ZODIAC_SIGNS.find(z => z.name === risingSignName) : null;

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '18px 22px 14px' }}>
        <div style={{ fontSize: 11, color: 'rgba(240,238,248,0.4)', letterSpacing: 2, textTransform: 'uppercase' }}>Your</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#F0EEF8', letterSpacing: -0.5 }}>Celestial Profile</div>
      </div>

      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Sign picker */}
        <div>
          <div style={{ fontSize: 12, color: 'rgba(240,238,248,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Your Zodiac Sign</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {ZODIAC_SIGNS.map(z => (
              <button key={z.name} onClick={() => setSelSign(z.name)} style={{
                background: 'none', border: 'none',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif', padding: '4px',
              }}>
                <img src={`images/icon-${z.name.toLowerCase()}.png`} alt={z.name} style={{
                  width: 56, height: 56, objectFit: 'contain', borderRadius: '50%',
                  boxShadow: selSign === z.name ? '0 0 0 3px #9B85E0, 0 4px 16px rgba(155,133,224,0.5)' : 'none',
                  transition: 'box-shadow 0.2s',
                }} />
                <span style={{ fontSize: 9.5, color: selSign === z.name ? '#9B85E0' : '#F0EEF8', fontWeight: 500 }}>{z.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Birth date */}
        <div>
          <div style={{ fontSize: 12, color: 'rgba(240,238,248,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Birth Date</div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
            width: '100%', padding: '14px 16px', borderRadius: 16, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#F0EEF8', fontSize: 15, fontFamily: 'Outfit, sans-serif',
            outline: 'none', cursor: 'pointer',
            colorScheme: 'dark',
          }} />
        </div>

        {/* Birth time */}
        <div>
          <div style={{ fontSize: 12, color: 'rgba(240,238,248,0.5)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Birth Time</div>
          <div style={{ fontSize: 11, color: 'rgba(240,238,248,0.3)', marginBottom: 10 }}>Used to calculate your Rising sign</div>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{
            width: '100%', padding: '14px 16px', borderRadius: 16, boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            color: '#F0EEF8', fontSize: 15, fontFamily: 'Outfit, sans-serif',
            outline: 'none', cursor: 'pointer', colorScheme: 'dark',
          }} />
        </div>

        {/* Profile preview */}
        {selectedSign && (
          <GlassCard style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: moonSign || risingSign ? 12 : 0 }}>
              {[
                { label: 'Sun', sign: selectedSign, color: '#F0A8C4' },
                { label: 'Moon', sign: moonSign, color: '#9B85E0' },
                { label: 'Rising', sign: risingSign, color: '#7EC8E3' },
              ].map(({ label, sign, color }) => (
                <div key={label} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: sign ? 1 : 0.35 }}>
                  <div style={{ fontSize: 9, color, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{label}</div>
                  {sign
                    ? <img src={`images/icon-${sign.name.toLowerCase()}.png`} alt={sign.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>?</div>
                  }
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#F0EEF8' }}>{sign ? sign.name : label === 'Moon' ? 'Add date' : 'Add time'}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(selectedSign.traits || []).map(t => (
                <span key={'sun-'+t} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(240,168,196,0.15)', color: '#F0A8C4', border: '1px solid rgba(240,168,196,0.25)' }}>{t}</span>
              ))}
              {(moonSign?.traits || []).slice(0,2).map(t => (
                <span key={'moon-'+t} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(155,133,224,0.15)', color: '#B8A4E8', border: '1px solid rgba(155,133,224,0.25)' }}>{t}</span>
              ))}
              {(risingSign?.traits || []).slice(0,1).map(t => (
                <span key={'ris-'+t} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(126,200,227,0.15)', color: '#7EC8E3', border: '1px solid rgba(126,200,227,0.25)' }}>{t}</span>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Save */}
        <button onClick={handle} style={{
          padding: '15px', borderRadius: 20,
          background: saved ? 'linear-gradient(135deg,#4CAF8A,#2E8B6A)' : 'linear-gradient(135deg,#9B85E0,#F0A8C4)',
          border: 'none', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif', letterSpacing: 0.3,
          boxShadow: '0 8px 32px rgba(155,133,224,0.4)', transition: 'all 0.3s',
        }}>
          {saved ? '✓ Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, HoroscopeScreen, CompatibilityScreen, SettingsScreen });
