
// Celestia — Screens

// ── ASTRO CALCULATIONS ────────────────────────────────────────
function getMoonSign(birthDateStr) {
  if (!birthDateStr) return null;
  const refDate = new Date('2000-01-02T12:00:00Z');
  const birth   = new Date(birthDateStr + 'T12:00:00Z');
  const days    = (birth - refDate) / 86400000;
  const cycle   = 27.321661;
  const pos     = ((days % cycle) + cycle) % cycle;
  return ZODIAC_SIGNS[Math.floor(pos / (cycle / 12))].name;
}

function getRisingSign(birthDateStr, birthTimeStr) {
  if (!birthDateStr || !birthTimeStr) return null;
  const [h, m] = birthTimeStr.split(':').map(Number);
  const birth  = new Date(birthDateStr);
  const doy    = Math.floor((birth - new Date(birth.getFullYear(), 0, 1)) / 86400000);
  const sunIdx = Math.floor(((doy + 10) % 365) / 30.4) % 12;
  const rising = (sunIdx + Math.floor((h * 60 + m) / 120) + 6) % 12;
  return ZODIAC_SIGNS[rising].name;
}

// ── DASHBOARD SCREEN ──────────────────────────────────────────
function DashboardScreen({ userSign }) {
  const defaultSign = userSign || ZODIAC_SIGNS[0].name;
  const [selectedSign, setSelectedSign] = React.useState(defaultSign);
  const [period, setPeriod] = React.useState('today');

  React.useEffect(() => {
    if (userSign) setSelectedSign(userSign);
  }, [userSign]);

  const sign    = ZODIAC_SIGNS.find(z => z.name === selectedSign) || ZODIAC_SIGNS[0];
  const data    = sign.horoscope[period] || sign.horoscope.today;
  const signIdx = ZODIAC_SIGNS.findIndex(z => z.name === selectedSign);

  const periodOffset = { yesterday: 3, today: 1, tomorrow: 5 };
  const colorOffset  = { yesterday: 2, today: 0,  tomorrow: 4 };
  const luckyNum     = ((signIdx * 7 + periodOffset[period]) % 11) + 1;
  const luckyColors  = ['Crimson','Emerald','Violet','Silver','Gold','Lavender','Rose','Midnight Blue','Amber','Cobalt','Aqua','Pearl'];
  const luckyColor   = luckyColors[(signIdx + colorOffset[period]) % 12];

  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (!scrollRef.current) return;
    const items = scrollRef.current.querySelectorAll('[data-sign-btn]');
    if (items[signIdx]) {
      items[signIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedSign]);

  const periods = [
    { id: 'yesterday', label: 'Yesterday' },
    { id: 'today',     label: 'Today'     },
    { id: 'tomorrow',  label: 'Tomorrow'  },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{
        padding: `${SPACING.sm}px ${SPACING.xl}px 0`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <rect x="1" y="1" width="7" height="7" rx="1.5" fill={PALETTE.subtle} />
          <rect x="12" y="1" width="7" height="7" rx="1.5" fill={PALETTE.subtle} />
          <rect x="1" y="12" width="7" height="7" rx="1.5" fill={PALETTE.subtle} />
          <rect x="12" y="12" width="7" height="7" rx="1.5" fill={PALETTE.subtle} />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: PALETTE.text, letterSpacing: 2, textTransform: 'uppercase' }}>
          Horoscope
        </span>
        <div style={{ width: 18 }} />
      </div>

      {/* ── Sign Glyph Scroll Bar ──
          Minimalist glyph-only approach: no images competing with the illustration.
          Active glyph brightens + gets an underline dot — clear selection signal. */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Select zodiac sign"
        style={{
          display: 'flex', gap: 0, overflowX: 'auto',
          padding: `${SPACING.sm}px ${SPACING.xl}px ${SPACING.xs}px`,
          scrollbarWidth: 'none', flexShrink: 0,
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        {ZODIAC_SIGNS.map((z) => {
          const isActive = z.name === selectedSign;
          return (
            <button
              key={z.name}
              data-sign-btn
              role="tab"
              aria-selected={isActive}
              aria-label={`${z.name}, ${z.dates}`}
              onClick={() => setSelectedSign(z.name)}
              style={{
                flex: '0 0 auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: `${SPACING.xs}px 10px`,
              }}
            >
              <span style={{
                fontSize: 20,
                color: isActive ? PALETTE.text : PALETTE.subtle,
                transition: 'color 0.2s',
                lineHeight: 1,
                filter: isActive ? 'drop-shadow(0 0 6px rgba(155,133,224,0.7))' : 'none',
              }}>
                {z.symbol}
              </span>
              {/* Active indicator dot */}
              <span style={{
                width: 4, height: 4, borderRadius: '50%',
                background: isActive ? PALETTE.lavender : 'transparent',
                transition: 'background 0.2s',
                display: 'block',
              }} />
            </button>
          );
        })}
      </div>

      {/* ── Period Tabs — pill style active state ── */}
      <div
        role="tablist"
        aria-label="Select time period"
        style={{
          display: 'flex', justifyContent: 'center', gap: SPACING.xs,
          padding: `${SPACING.xs}px ${SPACING.xl}px ${SPACING.sm}px`,
          flexShrink: 0,
        }}
      >
        {periods.map(p => (
          <button
            key={p.id}
            role="tab"
            aria-selected={period === p.id}
            onClick={() => setPeriod(p.id)}
            style={{
              flex: 1, border: 'none', cursor: 'pointer',
              padding: `${SPACING.xs + 2}px ${SPACING.xs}px`,
              fontSize: 11, fontWeight: period === p.id ? 700 : 500,
              color: period === p.id ? PALETTE.text : PALETTE.subtle,
              letterSpacing: 0.6,
              background: period === p.id
                ? 'rgba(155,133,224,0.22)'
                : 'transparent',
              borderRadius: 20,
              transition: 'all 0.2s',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Main Content (scrollable) ── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>

        {/* Illustration — transparent bg, illustration floats on the starfield */}
        <div style={{
          height: 180, position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {/* Atmospheric colour bloom matching sign */}
          <div aria-hidden="true" style={{
            position: 'absolute', width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${sign.accentColor || 'rgba(100,80,200,0.3)'} 0%, transparent 70%)`,
            filter: 'blur(35px)', opacity: 0.6,
          }} />
          <ZodiacArt name={sign.name} cardBg={sign.cardBg} figureLight={sign.figureLight} size="full" />
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: `linear-gradient(to bottom, transparent, ${PALETTE.bg})`,
          }} />
        </div>

        {/* ── Content block ── */}
        <div style={{ padding: `0 ${SPACING.xl}px` }}>

          {/* Sign name */}
          <div style={{ marginBottom: SPACING.md }}>
            <h1 style={{
              margin: 0, fontSize: 28, fontWeight: 800, color: PALETTE.text,
              letterSpacing: 1.5, lineHeight: 1, textTransform: 'uppercase',
            }}>
              {sign.name}
            </h1>
            <p style={{ margin: `${SPACING.xs}px 0 0`, fontSize: 11, color: PALETTE.subtle, fontWeight: 500, letterSpacing: 0.3 }}>
              {sign.element} · {sign.planet} · {sign.dates}
            </p>
          </div>

          {/* Energy rings */}
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            padding: `${SPACING.md}px ${SPACING.xs}px`,
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: SPACING.md, backdropFilter: 'blur(8px)',
          }}>
            <CircularProgress key={`${sign.name}-${period}-love`}   value={data.love}      label="Love"      color={PALETTE.ringLove}      size={66} />
            <CircularProgress key={`${sign.name}-${period}-emo`}    value={data.emotions}  label="Emotions"  color={PALETTE.ringEmotions}  size={66} />
            <CircularProgress key={`${sign.name}-${period}-mind`}   value={data.mentality} label="Mind"      color={PALETTE.ringMentality} size={66} />
            <CircularProgress key={`${sign.name}-${period}-career`} value={data.career}    label="Career"    color={PALETTE.ringCareer}    size={66} />
          </div>

          {/* Narrative — single paragraph, high contrast on blurred overlay */}
          <div style={{
            background: 'rgba(8,8,28,0.72)',
            backdropFilter: 'blur(12px)',
            borderRadius: 18,
            padding: `${SPACING.lg}px`,
            marginBottom: SPACING.md,
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <p style={{ ...TYPE.body, color: PALETTE.textSecondary, margin: 0 }}>
              {data.loveSex}
            </p>
          </div>

          {/* Lucky Number + Color — glassmorphism cards with breathing room */}
          <div style={{ display: 'flex', gap: SPACING.sm, marginBottom: SPACING.md }}>
            <div style={{
              flex: 1,
              background: 'rgba(155,133,224,0.10)',
              borderRadius: 18, padding: `${SPACING.lg}px ${SPACING.md}px`,
              border: '1px solid rgba(155,133,224,0.18)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: PALETTE.subtle, marginBottom: SPACING.sm }}>
                Lucky Number
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: PALETTE.lavender, lineHeight: 1 }}>{luckyNum}</div>
            </div>
            <div style={{
              flex: 2,
              background: 'rgba(240,168,196,0.08)',
              borderRadius: 18, padding: `${SPACING.lg}px ${SPACING.md}px`,
              border: '1px solid rgba(240,168,196,0.16)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: PALETTE.subtle, marginBottom: SPACING.sm }}>
                Lucky Color
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: PALETTE.text, lineHeight: 1.2 }}>{luckyColor}</div>
            </div>
          </div>

          {/* Traits */}
          <div style={{ display: 'flex', gap: SPACING.xs, flexWrap: 'wrap', marginBottom: SPACING.lg }}>
            {sign.traits.map(t => (
              <span key={t} style={{
                padding: `${SPACING.xs}px ${SPACING.md}px`,
                borderRadius: 20, fontSize: 11, fontWeight: 500,
                background: 'rgba(155,133,224,0.10)', color: PALETTE.lavender,
                border: '1px solid rgba(155,133,224,0.20)',
                letterSpacing: 0.2,
              }}>{t}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
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
      {/* Header — standardised xl (20px) side padding matches screen-edge grid */}
      <div style={{ padding: `14px ${SPACING.xl}px 6px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <div>
          {/* text-subtle (0.50) = ~4.9:1 contrast ✓ — previously 0.50 which is borderline, bumped label to match */}
          <div style={{ ...TYPE.label, color: PALETTE.muted, marginBottom: 2 }}>Today</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: PALETTE.text, letterSpacing: -0.3 }}>Celestia</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: PALETTE.lavender, fontWeight: 500, fontSize: 12 }}>April 21, 2026</div>
          {/* muted (0.65) replaces old 0.50 to pass WCAG AA */}
          <div style={{ fontSize: 11, color: PALETTE.muted }}>Choose your sign</div>
        </div>
      </div>

      {/* Main card carousel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: `0 ${SPACING.xl}px`, gap: SPACING.md, overflow: 'hidden' }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Sign card */}
        <div style={{
          flex: '0 0 auto', height: 310,
          background: sign.cardBg, borderRadius: 28,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Nav arrows — aria-label provides context without visible text */}
          <button
            onClick={() => go(-1)}
            aria-label={`Previous sign: ${ZODIAC_SIGNS[(idx - 1 + 12) % 12].name}`}
            style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#1A1A5E',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
            }}
          >‹</button>
          <button
            onClick={() => go(1)}
            aria-label={`Next sign: ${ZODIAC_SIGNS[(idx + 1) % 12].name}`}
            style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#1A1A5E',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5,
            }}
          >›</button>

          {/* Illustration */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', filter: 'blur(30px)', top: '15%' }} />
            <ZodiacArt name={sign.name} cardBg={sign.cardBg} figureLight={sign.figureLight} size="full" />
          </div>

          {/* Bottom info gradient overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: `30px ${SPACING.xxl}px 18px`,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.18))',
          }}>
            {/* Visual hierarchy: sign name (hero) → date range (caption) */}
            <div style={{ fontSize: 26, fontWeight: 700, color: sign.figureLight ? PALETTE.text : '#1A1A5E', letterSpacing: -0.5 }}>
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
            color: sign.figureLight ? PALETTE.text : '#1A1A5E',
            letterSpacing: 0.5, backdropFilter: 'blur(8px)',
          }}>{sign.element} · {sign.planet}</div>
        </div>

        {/* CTA row — uses PrimaryButton with hover/active states */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: SPACING.xs }}>
          {/* text-secondary (0.75) replaces old 0.70 — minor readability improvement */}
          <span style={{ color: PALETTE.textSecondary, fontSize: 13, fontWeight: 500, letterSpacing: 0.2 }}>Choose zone</span>
          <PrimaryButton onClick={() => onSelectSign(sign.name)} ariaLabel={`View ${sign.name} horoscope`}>
            View Horoscope ›
          </PrimaryButton>
        </div>

        {/* Progress rings card — standardised padding via SPACING tokens */}
        <GlassCard style={{ padding: `${SPACING.lg}px ${SPACING.md}px 14px`, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
          <CircularProgress key={`${sign.name}-love`}    value={today.love}      label="Love"      color={PALETTE.ringLove} />
          <CircularProgress key={`${sign.name}-emo`}     value={today.emotions}  label="Emotions"  color={PALETTE.ringEmotions} />
          <CircularProgress key={`${sign.name}-mind`}    value={today.mentality} label="Mentality" color={PALETTE.ringMentality} />
          <CircularProgress key={`${sign.name}-career`}  value={today.career}    label="Career"    color={PALETTE.ringCareer} />
        </GlassCard>

        {/* Dot indicators — aria-label for screen reader pagination */}
        <div role="tablist" aria-label="Sign selector" style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingBottom: SPACING.xs }}>
          {ZODIAC_SIGNS.map((z, i) => (
            <div
              key={i}
              role="tab"
              aria-selected={i === idx}
              aria-label={z.name}
              onClick={() => setIdx(i)}
              style={{
                width: i === idx ? 18 : 6, height: 6, borderRadius: 3,
                background: i === idx ? PALETTE.lavender : 'rgba(255,255,255,0.2)',
                cursor: 'pointer', transition: 'all 0.3s',
              }}
            />
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
    { label: 'Love & Relationships', shortLabel: 'Love', icon: '♥', color: PALETTE.ringLove },
    { label: 'Career & Ambition',    shortLabel: 'Career', icon: '◆', color: PALETTE.ringCareer },
  ];

  const stars = Math.round((data[['love','career','emotions','mentality'][activeCategory]] / 20));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Hero card */}
      <div style={{
        flex: '0 0 auto', height: 220, background: sign.cardBg,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: 10, bottom: 0, opacity: 0.95 }}>
          <ZodiacArt name={sign.name} cardBg={sign.cardBg} figureLight={sign.figureLight} size="small" />
        </div>

        {/* Back — aria-label communicates destination, not just direction */}
        <button
          onClick={onBack}
          aria-label="Back to sign carousel"
          style={{
            position: 'absolute', top: 14, left: 16,
            background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', fontSize: 16,
            color: sign.figureLight ? PALETTE.text : '#1A1A5E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >‹</button>

        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }} aria-hidden="true">
          {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: sign.figureLight ? 'rgba(240,238,248,0.5)' : 'rgba(26,26,94,0.4)' }} />)}
        </div>

        {/* Hero sign info — clear title/subtitle hierarchy */}
        <div style={{ position: 'absolute', bottom: SPACING.xxl, left: SPACING.xxl }}>
          {/* H1-equivalent: sign name at hero scale */}
          <div style={{ ...TYPE.hero, color: sign.figureLight ? PALETTE.text : '#1A1A5E' }}>{sign.name}</div>
          {/* Subtitle: dates at reduced opacity — passes WCAG only on light cardBg */}
          <div style={{ fontSize: 12, color: sign.figureLight ? 'rgba(240,238,248,0.75)' : 'rgba(26,26,94,0.7)', marginTop: SPACING.xs }}>
            {sign.dates}
          </div>
        </div>
      </div>

      {/* Scrollable content — bottom padding clears the nav bar */}
      <div style={{ flex: 1, overflowY: 'auto', padding: `0 ${SPACING.lg + 2}px 80px` }}>

        {/* Period tabs */}
        <div role="tablist" style={{ display: 'flex', gap: SPACING.xxl, padding: `${SPACING.lg}px 0 ${SPACING.md}px`, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['today', 'month'].map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: `0 0 ${SPACING.sm + 2}px`,
                fontSize: 14, fontWeight: tab === t ? 600 : 400,
                // Active tab uses text-primary; inactive uses text-subtle (0.50 → 4.9:1 ✓)
                // Previously 0.45 which was ~4.2:1 (failed AA)
                color: tab === t ? PALETTE.text : PALETTE.subtle,
                position: 'relative', textTransform: 'capitalize',
                fontFamily: 'Outfit, sans-serif',
                borderBottom: tab === t ? `2.5px solid ${PALETTE.lavender}` : '2.5px solid transparent',
                marginBottom: -13, transition: 'all 0.2s',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Category pills — enlarged to 56px tap target (WCAG 2.5.5 minimum) */}
        <div role="tablist" aria-label="Energy category" style={{ display: 'flex', gap: SPACING.sm + 2, padding: `${SPACING.lg}px 0 ${SPACING.sm}px`, overflowX: 'auto' }}>
          {categories.map((cat, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeCategory}
              aria-label={cat.label}
              onClick={() => setActiveCategory(i)}
              style={{
                flex: '0 0 auto',
                width: 56, height: 56, borderRadius: 18,
                background: i === activeCategory ? cat.color : 'rgba(255,255,255,0.07)',
                border: `1px solid ${i === activeCategory ? cat.color : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, transition: 'all 0.25s',
                // Active state uses glow; inactive is flat — clear visual distinction
                boxShadow: i === activeCategory ? `0 6px 20px ${cat.color}50` : 'none',
              }}
            >{cat.icon}</button>
          ))}
        </div>

        {/* ── Content area — visual hierarchy: title → star rating → body → secondary ── */}
        <div style={{ paddingTop: SPACING.md }}>

          {/* Level 1: Category title + rating — establishes context */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
            <span style={{ ...TYPE.subtitle, color: PALETTE.text }}>{categories[activeCategory].shortLabel}</span>
            {/* Star rating — aria-label conveys meaning without relying on colour alone */}
            <div role="img" aria-label={`${stars} out of 5 stars`} style={{ display: 'flex', gap: 4 }}>
              {[1,2,3,4,5].map(s => (
                <span
                  key={s}
                  aria-hidden="true"
                  style={{
                    fontSize: 14,
                    // Filled stars: pink accent ✓  |  Empty: 0.30 is decorative, not text
                    color: s <= stars ? PALETTE.pink : 'rgba(240,238,248,0.25)',
                  }}
                >★</span>
              ))}
            </div>
          </div>

          {/* Level 2: Primary narrative — body text (1.75 line-height for readability) */}
          {/* text-secondary (0.75) ensures ~9:1 contrast — previously 0.70 */}
          <p style={{ ...TYPE.body, color: PALETTE.textSecondary, margin: 0 }}>
            {data.loveSex}
          </p>

          {/* Level 3: Secondary insight — visually subordinate but still WCAG-compliant */}
          {/* text-muted (0.65) = ~7:1 ✓ — previously 0.50 which was marginal */}
          <p style={{ fontSize: 13, lineHeight: 1.65, color: PALETTE.muted, marginTop: SPACING.md }}>
            {data.overall}
          </p>
        </div>

        {/* Energy rings — standardised with SPACING tokens */}
        <div style={{ marginTop: SPACING.xl }}>
          {/* Section label uses text-subtle (0.50) — decorative, not critical info */}
          <div style={{ ...TYPE.label, color: PALETTE.subtle, marginBottom: SPACING.md }}>
            Your energies today
          </div>
          <GlassCard style={{ padding: `${SPACING.lg}px ${SPACING.sm}px 14px`, display: 'flex', justifyContent: 'space-around' }}>
            <CircularProgress key={`h-${tab}-love`}    value={data.love}      label="Love"      color={PALETTE.ringLove} />
            <CircularProgress key={`h-${tab}-emo`}     value={data.emotions}  label="Emotions"  color={PALETTE.ringEmotions} />
            <CircularProgress key={`h-${tab}-mind`}    value={data.mentality} label="Mentality" color={PALETTE.ringMentality} />
            <CircularProgress key={`h-${tab}-career`}  value={data.career}    label="Career"    color={PALETTE.ringCareer} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ── COMPATIBILITY SCREEN ──────────────────────────────────────
function CompatibilityScreen({ userSign }) {
  const [partnerSign, setPartnerSign] = React.useState(null);
  const [showPicker, setShowPicker]   = React.useState(false);
  const [angle, setAngle]             = React.useState(0);
  // Loading state: provides immediate UX feedback when a sign is tapped
  const [selecting, setSelecting]     = React.useState(null);

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
  const loveScore   = compat ? Math.min(99, Math.max(35, compat + ((i1 * 5 + i2 * 3) % 21) - 10)) : null;
  const friendScore = compat ? Math.min(99, Math.max(35, compat + ((i1 * 3 + i2 * 7) % 21) - 10)) : null;

  const orbR = 95;
  const partnerX = 160 + orbR * Math.cos((angle * Math.PI) / 180);
  const partnerY = 160 + orbR * Math.sin((angle * Math.PI) / 180);
  const myX = 160 + orbR * Math.cos(((angle + 180) * Math.PI) / 180);
  const myY = 160 + orbR * Math.sin(((angle + 180) * Math.PI) / 180);

  // Simulates network/processing latency so the user sees confirmation before dismiss
  const handleSelectSign = (name) => {
    setSelecting(name);
    setTimeout(() => {
      setPartnerSign(name);
      setSelecting(null);
      setShowPicker(false);
    }, 600);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: `${SPACING.lg}px ${SPACING.xxl}px 0`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: PALETTE.text, letterSpacing: -0.4 }}>Compatibility</span>
        <div style={{ display: 'flex', gap: SPACING.xs }} aria-hidden="true">
          {[0,1,2].map(i=><div key={i} style={{ width: 20, height: 2.5, borderRadius: 2, background: 'rgba(240,238,248,0.3)' }} />)}
        </div>
      </div>

      {/* Profile sign hint — text-muted (0.65) bumped from original 0.60/0.75 for consistency */}
      <div style={{ textAlign: 'center', fontSize: 11, padding: `${SPACING.xs}px ${SPACING.xxl}px 0`, color: userSign ? PALETTE.muted : PALETTE.pink }}>
        {userSign ? `Your sign (${userSign}) is saved in Profile` : 'Set your sign in Profile — it will appear here'}
      </div>

      {/* Orbital animation */}
      <div style={{ position: 'relative', height: 260, flexShrink: 0, overflow: 'hidden' }}>
        <svg viewBox="0 0 320 320" width="100%" height="260" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <circle cx="160" cy="160" r="130" stroke="rgba(155,133,224,0.18)" strokeWidth="1.5" fill="none" strokeDasharray="6 5" />
          <circle cx="160" cy="160" r="95" stroke="rgba(240,168,196,0.22)" strokeWidth="1" fill="none" strokeDasharray="4 4" />

          {[{x:60,y:80},{x:260,y:60},{x:40,y:240},{x:280,y:250},{x:180,y:40},{x:100,y:290}].map((p,i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i%2===0?3:2}
              fill={i%3===0?PALETTE.pink:i%3===1?PALETTE.lavender:'#fff'}
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

          <g transform={`translate(${myX},${myY})`}>
            <circle cx="0" cy="0" r="32" fill="url(#myGrad)" stroke="rgba(155,133,224,0.5)" strokeWidth="2" />
            <image href={`images/icon-${mySign.name.toLowerCase()}.png`} x="-28" y="-28" width="56" height="56" clipPath="url(#myClip)" />
          </g>
        </svg>
      </div>

      {/* Add Partner CTA */}
      <div style={{ padding: `${SPACING.sm}px ${SPACING.xxl}px ${SPACING.xs}px` }}>
        <button
          onClick={() => setShowPicker(true)}
          aria-label={partner ? `Change partner, currently ${partner.name}` : 'Add a partner sign'}
          style={{
            width: '100%', padding: '13px', borderRadius: 30,
            background: 'linear-gradient(135deg, rgba(240,168,196,0.25), rgba(155,133,224,0.25))',
            border: `1.5px solid rgba(240,168,196,0.4)`,
            color: PALETTE.text, fontSize: 15, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(240,168,196,0.15)',
            letterSpacing: 0.3, transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240,168,196,0.38), rgba(155,133,224,0.38))'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(240,168,196,0.28)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(240,168,196,0.25), rgba(155,133,224,0.25))'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(240,168,196,0.15)'; }}
        >
          ⊕ {partner ? `Change Partner (${partner.name})` : 'Add Partner'}
        </button>
      </div>

      {/* Compatibility scores */}
      {compat && (
        <div style={{ padding: `${SPACING.xs}px ${SPACING.xxl}px ${SPACING.sm}px` }}>
          <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: PALETTE.text, marginBottom: SPACING.sm + 2 }}>
            {compat}% <span style={{ fontSize: 13, fontWeight: 400, color: PALETTE.muted }}>overall match</span>
          </div>
          {[
            { label: 'Love',       score: loveScore,   color: 'linear-gradient(90deg,#F0A8C4,#e06090)' },
            { label: 'Friendship', score: friendScore,  color: 'linear-gradient(90deg,#9B85E0,#6a9ee0)' },
          ].map(({ label, score, color }) => (
            <div key={label} style={{ marginBottom: SPACING.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.xs }}>
                {/* muted (0.65) replaces old 0.60 — consistent token use */}
                <span style={{ fontSize: 12, color: PALETTE.muted }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: PALETTE.text }}>{score}%</span>
              </div>
              <div role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} compatibility`} style={{ height: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Descriptive text */}
      <div style={{ padding: `0 ${SPACING.xxl}px`, flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: PALETTE.text, marginBottom: SPACING.sm, letterSpacing: -0.3 }}>
          {partner ? `${mySign.name} & ${partner.name}` : 'Test compatibility in love and friendship'}
        </div>
        {/* muted (0.65) replaces old 0.50 — improves readability without losing hierarchy */}
        <p style={{ fontSize: 13, lineHeight: 1.65, color: PALETTE.muted, margin: 0 }}>
          {partner
            ? `${mySign.name} and ${partner.name} share a ${compat >= 80 ? 'deeply harmonious' : compat >= 65 ? 'complementary' : 'challenging but growth-filled'} bond. The celestial dance between ${mySign.planet} and ${partner.planet} creates ${compat >= 75 ? 'powerful synergy' : 'meaningful tension'}.`
            : 'Discover cosmic connections. Add a partner to reveal the celestial forces at work between your signs.'}
        </p>
      </div>

      {/* ── Sign Picker Modal ── */}
      {showPicker && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose your partner's zodiac sign"
          style={{
            position: 'absolute', inset: 0, background: 'rgba(13,13,43,0.95)',
            backdropFilter: 'blur(20px)', zIndex: 100, display: 'flex', flexDirection: 'column',
            borderRadius: 'inherit',
          }}
        >
          <div style={{ padding: `${SPACING.xl}px ${SPACING.xxl}px ${SPACING.md}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: PALETTE.text }}>Choose partner's sign</span>
            <button
              onClick={() => setShowPicker(false)}
              aria-label="Close sign picker"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: PALETTE.muted }}
            >✕</button>
          </div>

          {/* Sign grid — 3 columns with consistent SPACING.sm (8px) gap */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: SPACING.sm + 2,
            padding: `${SPACING.xs}px ${SPACING.xxl}px ${SPACING.xl}px`,
            overflowY: 'auto',
          }}>
            {ZODIAC_SIGNS.map(z => {
              const isSelected  = partnerSign === z.name;
              const isSelecting = selecting === z.name;

              return (
                <button
                  key={z.name}
                  onClick={() => handleSelectSign(z.name)}
                  aria-pressed={isSelected}
                  aria-label={`Select ${z.name}, ${z.dates}`}
                  disabled={!!selecting}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg,#9B85E0,#F0A8C4)'
                      : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isSelecting ? PALETTE.lavender : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 16,
                    padding: `${SPACING.md}px ${SPACING.sm}px`,
                    cursor: selecting ? 'default' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING.sm - 2,
                    transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif',
                    // Scale-down feedback when this specific sign is being confirmed
                    transform: isSelecting ? 'scale(0.95)' : 'scale(1)',
                    opacity: selecting && !isSelecting ? 0.5 : 1,
                  }}
                >
                  {isSelecting ? (
                    // Loading micro-interaction: pulsing ring confirms action was registered
                    <div
                      aria-label="Loading..."
                      style={{
                        width: 52, height: 52, borderRadius: '50%',
                        border: `3px solid ${PALETTE.lavender}`,
                        borderTopColor: 'transparent',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                  ) : (
                    <img
                      src={`images/icon-${z.name.toLowerCase()}.png`}
                      alt=""
                      style={{ width: 52, height: 52, objectFit: 'contain' }}
                    />
                  )}
                  <span style={{ fontSize: 12, color: PALETTE.text, fontWeight: 500 }}>{z.name}</span>
                  <span style={{ fontSize: 10, color: PALETTE.muted }}>{z.dates.split('–')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SETTINGS / PROFILE SCREEN ─────────────────────────────────
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

  const selectedSign   = ZODIAC_SIGNS.find(z => z.name === selSign);
  const moonSignName   = getMoonSign(date);
  const moonSign       = moonSignName ? ZODIAC_SIGNS.find(z => z.name === moonSignName) : null;
  const risingSignName = getRisingSign(date, time);
  const risingSign     = risingSignName ? ZODIAC_SIGNS.find(z => z.name === risingSignName) : null;

  // Shared input style — extracted to reduce duplication (DRY)
  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 16, boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: PALETTE.text, fontSize: 15, fontFamily: 'Outfit, sans-serif',
    outline: 'none', cursor: 'pointer', colorScheme: 'dark',
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header — standardised padding matches xl grid (20px sides) */}
      <div style={{ padding: `18px ${SPACING.xl}px 14px` }}>
        {/* Breadcrumb label — text-subtle (0.50) = 4.9:1 ✓, upgraded from 0.40 which was 3.5:1 ✗ */}
        <div style={{ ...TYPE.label, color: PALETTE.subtle }}>Your</div>
        <div style={{ ...TYPE.title, color: PALETTE.text }}>Celestial Profile</div>
      </div>

      {/* All sections use SPACING.xl gap and SPACING.xl horizontal padding for consistent grid */}
      <div style={{ padding: `0 ${SPACING.xl}px`, display: 'flex', flexDirection: 'column', gap: SPACING.xl }}>

        {/* Sign picker — 4-col grid with 8px gap reduces crowding vs original 8px */}
        <section aria-label="Zodiac sign selection">
          {/* Section label — text-subtle (0.50) ✓, was 0.50 (borderline), keeping consistent */}
          <div style={{ ...TYPE.label, color: PALETTE.subtle, marginBottom: SPACING.sm + 2 }}>Your Zodiac Sign</div>
          {/* 4-column grid — gap increased to SPACING.sm (8px) for breathing room */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: SPACING.sm }}>
            {ZODIAC_SIGNS.map(z => (
              <button
                key={z.name}
                onClick={() => setSelSign(z.name)}
                aria-pressed={selSign === z.name}
                aria-label={`${z.name}, ${z.dates}`}
                style={{
                  background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: SPACING.xs,
                  transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif',
                  // Increased padding from 4px to 6px — reduces button crowding (visual breathing room)
                  padding: `${SPACING.xs + 2}px ${SPACING.xs}px`,
                  borderRadius: 12,
                }}
              >
                <img
                  src={`images/icon-${z.name.toLowerCase()}.png`}
                  alt=""
                  style={{
                    width: 52, height: 52, objectFit: 'contain', borderRadius: '50%',
                    // selection-ring uses lavender (primary-action) with glow
                    boxShadow: selSign === z.name
                      ? `0 0 0 3px ${PALETTE.lavender}, 0 4px 16px rgba(155,133,224,0.5)`
                      : 'none',
                    transition: 'box-shadow 0.2s',
                  }}
                />
                {/* text-subtle (0.50) for unselected name → 4.9:1 ✓ (was 0.50, keeping) */}
                <span style={{
                  fontSize: 9.5,
                  color: selSign === z.name ? PALETTE.lavender : PALETTE.subtle,
                  fontWeight: 500,
                }}>{z.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Birth date — label linked via wrapping label element for a11y */}
        <section aria-label="Birth date input">
          <label htmlFor="birth-date" style={{ display: 'block', ...TYPE.label, color: PALETTE.subtle, marginBottom: SPACING.sm + 2 }}>
            Birth Date
          </label>
          <input
            id="birth-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={inputStyle}
          />
        </section>

        {/* Birth time */}
        <section aria-label="Birth time input">
          <label htmlFor="birth-time" style={{ display: 'block', ...TYPE.label, color: PALETTE.subtle, marginBottom: SPACING.xs }}>
            Birth Time
          </label>
          {/* muted (0.65) replaces old 0.30 which was ~2.5:1 — WCAG AA fix */}
          <div style={{ fontSize: 11, color: PALETTE.muted, marginBottom: SPACING.sm + 2 }}>
            Used to calculate your Rising sign
          </div>
          <input
            id="birth-time"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            style={inputStyle}
          />
        </section>

        {/* Profile preview card — increased internal gap from 8px to 12px to reduce crowding */}
        {selectedSign && (
          <GlassCard style={{ padding: SPACING.lg }}>
            <div style={{ display: 'flex', gap: SPACING.md, marginBottom: moonSign || risingSign ? SPACING.md : 0 }}>
              {[
                { label: 'Sun',    sign: selectedSign, color: PALETTE.pink },
                { label: 'Moon',   sign: moonSign,     color: PALETTE.lavender },
                { label: 'Rising', sign: risingSign,   color: PALETTE.ringMentality },
              ].map(({ label, sign, color }) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 12,
                    // Standardised internal padding using SPACING tokens
                    padding: `${SPACING.sm + 2}px ${SPACING.sm}px`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: SPACING.sm - 2,
                    opacity: sign ? 1 : 0.35,
                  }}
                >
                  {/* Category label — uses inline color for semantic distinction */}
                  <div style={{ fontSize: 9, color, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{label}</div>
                  {sign
                    ? <img src={`images/icon-${sign.name.toLowerCase()}.png`} alt={sign.name} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                    : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'rgba(255,255,255,0.2)' }}>?</div>
                  }
                  {/* text-primary on sign name — highest priority in this card */}
                  <div style={{ fontSize: 12, fontWeight: 600, color: PALETTE.text }}>
                    {sign ? sign.name : label === 'Moon' ? 'Add date' : 'Add time'}
                  </div>
                </div>
              ))}
            </div>

            {/* Trait tags — wrapped pills with consistent inner padding */}
            <div style={{ display: 'flex', gap: SPACING.sm - 2, flexWrap: 'wrap' }}>
              {(selectedSign.traits || []).map(t => (
                // primary-trait: pink for Sun sign
                <span key={'sun-'+t} style={{ padding: `${SPACING.xs}px ${SPACING.sm + 2}px`, borderRadius: 20, fontSize: 11, background: 'rgba(240,168,196,0.15)', color: PALETTE.pink, border: '1px solid rgba(240,168,196,0.25)' }}>{t}</span>
              ))}
              {(moonSign?.traits || []).slice(0,2).map(t => (
                // secondary-trait: lavender for Moon sign
                <span key={'moon-'+t} style={{ padding: `${SPACING.xs}px ${SPACING.sm + 2}px`, borderRadius: 20, fontSize: 11, background: 'rgba(155,133,224,0.15)', color: '#B8A4E8', border: '1px solid rgba(155,133,224,0.25)' }}>{t}</span>
              ))}
              {(risingSign?.traits || []).slice(0,1).map(t => (
                // tertiary-trait: cyan for Rising sign
                <span key={'ris-'+t} style={{ padding: `${SPACING.xs}px ${SPACING.sm + 2}px`, borderRadius: 20, fontSize: 11, background: 'rgba(126,200,227,0.15)', color: PALETTE.ringMentality, border: '1px solid rgba(126,200,227,0.25)' }}>{t}</span>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Save — primary-action button with success state transition */}
        <button
          onClick={handle}
          aria-label={saved ? 'Profile saved' : 'Save profile'}
          style={{
            padding: '15px', borderRadius: 20,
            background: saved
              ? 'linear-gradient(135deg,#4CAF8A,#2E8B6A)'
              : 'linear-gradient(135deg,#9B85E0,#F0A8C4)',
            border: 'none', color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'Outfit, sans-serif', letterSpacing: 0.3,
            boxShadow: '0 8px 32px rgba(155,133,224,0.4)', transition: 'all 0.3s',
          }}
          onMouseEnter={e => { if (!saved) e.currentTarget.style.boxShadow = '0 12px 40px rgba(155,133,224,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(155,133,224,0.4)'; }}
        >
          {saved ? '✓ Saved!' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, HomeScreen, HoroscopeScreen, CompatibilityScreen, SettingsScreen });
