
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

function getSunSign(birthDateStr) {
  if (!birthDateStr) return null;
  const d = new Date(birthDateStr + 'T12:00:00Z');
  const mo = d.getUTCMonth() + 1, dy = d.getUTCDate();
  if ((mo===3&&dy>=21)||(mo===4&&dy<=19)) return 'Aries';
  if ((mo===4&&dy>=20)||(mo===5&&dy<=20)) return 'Taurus';
  if ((mo===5&&dy>=21)||(mo===6&&dy<=20)) return 'Gemini';
  if ((mo===6&&dy>=21)||(mo===7&&dy<=22)) return 'Cancer';
  if ((mo===7&&dy>=23)||(mo===8&&dy<=22)) return 'Leo';
  if ((mo===8&&dy>=23)||(mo===9&&dy<=22)) return 'Virgo';
  if ((mo===9&&dy>=23)||(mo===10&&dy<=22)) return 'Libra';
  if ((mo===10&&dy>=23)||(mo===11&&dy<=21)) return 'Scorpio';
  if ((mo===11&&dy>=22)||(mo===12&&dy<=21)) return 'Sagittarius';
  if ((mo===12&&dy>=22)||(mo===1&&dy<=19)) return 'Capricorn';
  if ((mo===1&&dy>=20)||(mo===2&&dy<=18)) return 'Aquarius';
  return 'Pisces';
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
          Line-art SVG glyphs — no circles, no backgrounds, no emoji.
          Active sign: white + glow (brightest); inactive: 38% opacity (deep).
          Reference: uniform kerning, centred, pure form. */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Select zodiac sign"
        style={{
          display: 'flex', gap: 0, overflowX: 'auto',
          padding: `${SPACING.xs}px ${SPACING.xl}px ${SPACING.sm}px`,
          scrollbarWidth: 'none', flexShrink: 0,
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
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
                padding: `${SPACING.sm}px 14px`,
                // Active: white + strong glow; inactive: 52% — readable but clearly subordinate
                color: isActive ? '#FFFFFF' : 'rgba(240,238,248,0.52)',
                filter: isActive
                  ? 'drop-shadow(0 0 9px rgba(255,255,255,0.90)) drop-shadow(0 0 4px rgba(180,160,255,0.65))'
                  : 'none',
                transform: isActive ? 'scale(1.14)' : 'scale(1)',
                transition: 'color 0.22s ease, filter 0.22s ease, transform 0.22s ease',
              }}
            >
              <SignGlyph name={z.name} size={19} />
              {/* Minimal active dot — secondary cue after brightness */}
              <span style={{
                width: 3, height: 3, borderRadius: '50%',
                background: isActive ? 'rgba(255,255,255,0.7)' : 'transparent',
                display: 'block',
                transition: 'background 0.2s',
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

          {/* Sign name — 8px grid: 24px below to match section rhythm */}
          <div style={{ marginBottom: SPACING.xxl }}>
            <h1 style={{
              margin: 0, fontSize: 28, fontWeight: 800, color: PALETTE.text,
              letterSpacing: 1.5, lineHeight: 1, textTransform: 'uppercase',
            }}>
              {sign.name}
            </h1>
            <p style={{ margin: `6px 0 0`, fontSize: 11, color: PALETTE.muted, fontWeight: 500, letterSpacing: 0.3 }}>
              {sign.element} · {sign.planet} · {sign.dates}
            </p>
          </div>

          {/* Energy rings — 24px below */}
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            padding: `${SPACING.md}px ${SPACING.xs}px`,
            background: 'rgba(255,255,255,0.055)',
            borderRadius: 20, border: '1px solid rgba(255,255,255,0.10)',
            marginBottom: SPACING.xxl, backdropFilter: 'blur(12px)',
          }}>
            <CircularProgress key={`${sign.name}-${period}-love`}   value={data.love}      label="Love"      color={PALETTE.ringLove}      size={66} />
            <CircularProgress key={`${sign.name}-${period}-emo`}    value={data.emotions}  label="Emotions"  color={PALETTE.ringEmotions}  size={66} />
            <CircularProgress key={`${sign.name}-${period}-mind`}   value={data.mentality} label="Mind"      color={PALETTE.ringMentality} size={66} />
            <CircularProgress key={`${sign.name}-${period}-career`} value={data.career}    label="Career"    color={PALETTE.ringCareer}    size={66} />
          </div>

          {/* Narrative */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            borderRadius: 20,
            padding: `${SPACING.lg}px ${SPACING.lg}px`,
            marginBottom: SPACING.xxl,
            border: '1px solid rgba(255,255,255,0.09)',
          }}>
            <p style={{ ...TYPE.body, lineHeight: 1.95, color: PALETTE.textSecondary, margin: 0 }}>
              {data.loveSex}
            </p>
          </div>

          {/* Lucky Number + Color */}
          <div style={{ display: 'flex', gap: SPACING.md, marginBottom: SPACING.xxl }}>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 20, padding: `${SPACING.lg}px ${SPACING.md}px`,
              border: '1px solid rgba(255,255,255,0.10)',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: PALETTE.muted, marginBottom: SPACING.sm }}>
                Lucky Number
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: PALETTE.text, lineHeight: 1 }}>{luckyNum}</div>
            </div>
            <div style={{
              flex: 2,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 20, padding: `${SPACING.lg}px ${SPACING.md}px`,
              border: '1px solid rgba(255,255,255,0.10)',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1.8, textTransform: 'uppercase', color: PALETTE.muted, marginBottom: SPACING.sm }}>
                Lucky Color
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: PALETTE.text, lineHeight: 1.2 }}>{luckyColor}</div>
            </div>
          </div>

          {/* Traits */}
          <div style={{ display: 'flex', gap: SPACING.xs, flexWrap: 'wrap', marginBottom: SPACING.xxl }}>
            {sign.traits.map(t => (
              <span key={t} style={{
                padding: `${SPACING.xs}px ${SPACING.md}px`,
                borderRadius: 20, fontSize: 11, fontWeight: 500,
                background: 'rgba(255,255,255,0.05)', color: PALETTE.muted,
                border: '1px solid rgba(255,255,255,0.10)',
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
  const [angle, setAngle]             = React.useState(225);
  const [selecting, setSelecting]     = React.useState(null);
  const [category, setCategory]       = React.useState('Love');

  React.useEffect(() => {
    if (!document.getElementById('cosmic-pulse-kf')) {
      const s = document.createElement('style');
      s.id = 'cosmic-pulse-kf';
      s.textContent = `@keyframes cosmicPulse{0%,100%{opacity:0.22}50%{opacity:0.65}}.partner-pulse{animation:cosmicPulse 2.4s ease-in-out infinite;transform-origin:50% 50%;transform-box:fill-box}`;
      document.head.appendChild(s);
    }
  }, []);

  React.useEffect(() => {
    let rafId;
    const tick = () => { setAngle(a => (a + 0.35) % 360); rafId = requestAnimationFrame(tick); };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const mySign  = ZODIAC_SIGNS.find(z => z.name === userSign) || ZODIAC_SIGNS[0];
  const partner = partnerSign ? ZODIAC_SIGNS.find(z => z.name === partnerSign) : null;
  const compat  = partner ? COMPATIBILITY_DATA[mySign.name]?.[partner.name] : null;
  const i1 = ZODIAC_SIGNS.findIndex(z => z.name === mySign.name);
  const i2 = partner ? ZODIAC_SIGNS.findIndex(z => z.name === partner.name) : 0;
  const loveScore   = compat ? Math.min(99, Math.max(35, compat + ((i1 * 5 + i2 * 3) % 21) - 10)) : null;
  const friendScore = compat ? Math.min(99, Math.max(35, compat + ((i1 * 3 + i2 * 7) % 21) - 10)) : null;
  const workScore   = compat ? Math.min(99, Math.max(30, compat + ((i1 * 7 + i2 * 2) % 23) - 11)) : null;
  const crushScore  = compat ? Math.min(99, Math.max(40, compat + ((i1 * 4 + i2 * 9) % 19) - 9))  : null;

  const toRad = d => d * Math.PI / 180;
  const ORB_R = 74;
  const c1x = 132, c1y = 112;
  const c2x = 188, c2y = 132;
  const myX = c1x + ORB_R * Math.cos(toRad(angle));
  const myY = c1y + ORB_R * Math.sin(toRad(angle));
  const partnerX = c2x + ORB_R * Math.cos(toRad(angle + 180));
  const partnerY = c2y + ORB_R * Math.sin(toRad(angle + 180));

  const handleSelectSign = (name) => {
    setSelecting(name);
    setTimeout(() => { setPartnerSign(name); setSelecting(null); setShowPicker(false); }, 600);
  };

  // Per-category ring config
  const catConfig = {
    Love:       { ring1: { v: loveScore,   l: 'Love',       c: PALETTE.ringLove,   g: ['#FFB8D6','#E0447C'] }, ring2: { v: crushScore,  l: 'Attraction', c: PALETTE.pink,        g: ['#FFD0E8','#FF6B9D'] } },
    Friendship: { ring1: { v: friendScore, l: 'Friendship', c: PALETTE.lavender,   g: ['#C4B0FF','#6D4FBF'] }, ring2: { v: loveScore,   l: 'Warmth',     c: PALETTE.ringLove,    g: ['#FFB8D6','#E0447C'] } },
    Work:       { ring1: { v: workScore,   l: 'Work',       c: PALETTE.ringCareer, g: ['#FFD580','#C08800'] }, ring2: { v: friendScore, l: 'Trust',      c: PALETTE.lavender,    g: ['#C4B0FF','#6D4FBF'] } },
    Crush:      { ring1: { v: crushScore,  l: 'Attraction', c: PALETTE.pink,       g: ['#FFD0E8','#FF6B9D'] }, ring2: { v: loveScore,   l: 'Love',       c: PALETTE.ringLove,    g: ['#FFB8D6','#E0447C'] } },
  };
  const cfg = catConfig[category];

  const harmonyText = {
    Love: compat >= 80
      ? `${mySign.name} and ${partner?.name} radiate a natural, uplifting bond. Your energies align to amplify each other's strengths and create a rare sense of ease.`
      : compat >= 65
      ? `${mySign.name} and ${partner?.name} find beauty in contrast — your different energies complement each other in ways that deepen with time.`
      : `${mySign.name} and ${partner?.name} discover meaning through difference. The tension between you can spark genuine transformation when channelled with care.`,
    Friendship: compat >= 80
      ? `${mySign.name} and ${partner?.name} are natural allies. Your connection feels effortless and mutually supportive — a friendship built to last.`
      : compat >= 65
      ? `${mySign.name} and ${partner?.name} bring out unique qualities in each other. Your bond rewards you both with genuine understanding over time.`
      : `${mySign.name} and ${partner?.name} may clash at first, but shared experiences reveal unexpected common ground.`,
    Work: compat >= 80
      ? `${mySign.name} and ${partner?.name} are a powerhouse team. Complementary skills and shared drive create remarkable results when focused on a common goal.`
      : compat >= 65
      ? `${mySign.name} and ${partner?.name} bring different strengths to the table. The contrast in your styles fuels creative and well-rounded outcomes.`
      : `${mySign.name} and ${partner?.name} have starkly different working rhythms. With clear roles and boundaries, these differences become your greatest asset.`,
    Crush: compat >= 80
      ? `The pull between ${mySign.name} and ${partner?.name} is magnetic and undeniable. Your chemistry is electric — a connection written in the stars.`
      : compat >= 65
      ? `${mySign.name} and ${partner?.name} share a smouldering tension. The attraction is real and the intrigue runs deep.`
      : `${mySign.name} and ${partner?.name} orbit each other with restless energy. The contrast between you creates a fascination that's hard to ignore.`,
  };

  const attentionText = {
    Love: compat >= 80
      ? `Even the deepest bonds need nurturing. Watch for moments when shared intensity becomes pressure — honouring individual space keeps the connection vibrant.`
      : compat >= 65
      ? `Differing rhythms between ${mySign.planet} and ${partner?.planet} can create friction. Patience and clear expression are your most powerful tools.`
      : `The push-pull between your signs demands deliberate effort. Power dynamics require mutual respect and a willingness to adapt.`,
    Friendship: compat >= 80
      ? `Strong friendships can slip into codependency. Make space for individual growth to keep the dynamic healthy and fresh.`
      : compat >= 65
      ? `Mismatched energy levels can lead to one-sided effort. Regular honest check-ins ensure the friendship feels balanced for both of you.`
      : `Different communication styles may cause misunderstandings. Lead with curiosity, not assumptions, to bridge the gap.`,
    Work: compat >= 80
      ? `High-performing partnerships can breed friction over recognition. Defining clear lanes of ownership early prevents tension from building.`
      : compat >= 65
      ? `Contrasting approaches may cause decision-making friction. Agree on a shared process before diving into tasks to maintain momentum.`
      : `Clashing work styles require explicit agreements. Set shared expectations around communication and deadlines to avoid frustration.`,
    Crush: compat >= 80
      ? `Intense chemistry can move fast. Let things unfold naturally rather than rushing — the real depth of this connection reveals itself with time.`
      : compat >= 65
      ? `The attraction is real, but don't mistake excitement for compatibility. Take time to understand each other's deeper values before diving in.`
      : `The pull you feel may be more about contrast than lasting harmony. Stay grounded in what you truly need as you explore this connection.`,
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ padding: `${SPACING.lg}px ${SPACING.xxl}px 0`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <div>
          {userSign && (
            <div style={{ fontSize: 10, color: PALETTE.muted, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 3 }}>
              {userSign}
            </div>
          )}
          <span style={{ fontSize: 20, fontWeight: 700, color: PALETTE.text, letterSpacing: -0.4 }}>Cosmic Synergy</span>
        </div>
        <div style={{ display: 'flex', gap: SPACING.xs }} aria-hidden="true">
          {[0,1,2].map(i => <div key={i} style={{ width: 20, height: 2.5, borderRadius: 2, background: 'rgba(240,238,248,0.3)' }} />)}
        </div>
      </div>

      {/* ── Orbital canvas ── */}
      <div style={{ position: 'relative', height: 248, flexShrink: 0, overflow: 'hidden' }}>
        <svg viewBox="0 0 320 248" width="100%" height="248" style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <defs>
            <filter id="intersection-glow-blur">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          {/* Intersection glow — opacity and color scale with compatibility % */}
          {partner && compat && (
            <circle
              cx={(c1x + c2x) / 2} cy={(c1y + c2y) / 2} r={50}
              fill={compat >= 75 ? '#D4AF37' : compat >= 55 ? '#9B85E0' : '#C06080'}
              filter="url(#intersection-glow-blur)"
              opacity={compat / 100 * 0.68}
            />
          )}

          {/* Two crossing orbits */}
          <circle cx={c1x} cy={c1y} r={ORB_R} fill="none"
            stroke="rgba(200,158,148,0.42)" strokeWidth="1.2" />
          <circle cx={c2x} cy={c2y} r={ORB_R} fill="none"
            stroke="rgba(200,158,148,0.42)" strokeWidth="1.2" />

          {/* Partner node — pulses when empty */}
          {partner ? (
            <g>
              <circle cx={partnerX} cy={partnerY} r={34}
                fill="none" stroke="rgba(255,255,255,0.50)" strokeWidth="1.0" strokeDasharray="3 2" />
              <foreignObject x={partnerX - 20} y={partnerY - 20} width="40" height="40">
                <div xmlns="http://www.w3.org/1999/xhtml" style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.92)' }}>
                  <SignGlyph name={partner.name} size={20} />
                </div>
              </foreignObject>
              {(() => {
                const ang = Math.atan2(partnerY - c2y, partnerX - c2x);
                const lx = partnerX + 50 * Math.cos(ang);
                const ly = partnerY + 50 * Math.sin(ang);
                return (
                  <text x={lx} y={ly + 4} textAnchor="middle" fontSize="7.5"
                    fill="rgba(255,255,255,0.44)" fontFamily="Outfit,sans-serif" letterSpacing="1.5">
                    {partner.name.toUpperCase()}
                  </text>
                );
              })()}
            </g>
          ) : (
            <g className="partner-pulse">
              <circle cx={partnerX} cy={partnerY} r={34}
                fill="rgba(155,133,224,0.10)" stroke="rgba(155,133,224,0.55)"
                strokeWidth="1.0" strokeDasharray="3 3" />
              <text x={partnerX} y={partnerY + 5} textAnchor="middle" fontSize="14"
                fill="rgba(155,133,224,0.65)" fontFamily="Outfit,sans-serif" fontWeight="300">+</text>
            </g>
          )}

          {/* My sign node — golden accent so user knows it's them */}
          <g>
            <circle cx={myX} cy={myY} r={36}
              fill="rgba(212,175,55,0.13)" stroke="rgba(212,175,55,0.70)" strokeWidth="1.2" strokeDasharray="3 2" />
            <foreignObject x={myX - 20} y={myY - 20} width="40" height="40">
              <div xmlns="http://www.w3.org/1999/xhtml" style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.96)' }}>
                <SignGlyph name={mySign.name} size={20} />
              </div>
            </foreignObject>
            {(() => {
              const ang = Math.atan2(myY - c1y, myX - c1x);
              const lx = myX + 50 * Math.cos(ang);
              const ly = myY + 50 * Math.sin(ang);
              return (
                <text x={lx} y={ly + 4} textAnchor="middle" fontSize="7.5"
                  fill="rgba(255,255,255,0.50)" fontFamily="Outfit,sans-serif" letterSpacing="1.5">
                  {mySign.name.toUpperCase()}
                </text>
              );
            })()}
          </g>

        </svg>
      </div>

      {/* ── Empty state ── */}
      {!partner ? (
        <div style={{ padding: `44px ${SPACING.xxl}px ${SPACING.xxl}px`, display: 'flex', flexDirection: 'column', flex: 1 }}>

          <div style={{ marginBottom: SPACING.xxl }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: PALETTE.text, marginBottom: SPACING.sm, letterSpacing: -0.5 }}>
              Discover your cosmic connection
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.8, color: 'rgba(240,238,248,0.55)', margin: 0, fontWeight: 300 }}>
              Add someone to see how your energies align across love, friendship, work, and attraction — all in one dynamic report.
            </p>
          </div>

          {/* Primary CTA — ghost with gradient border */}
          <div style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.55),rgba(155,133,224,0.55))', padding: '1px', borderRadius: 20 }}>
            <button
              onClick={() => setShowPicker(true)}
              aria-label="Connect with someone"
              style={{
                width: '100%', padding: '14px', borderRadius: 19,
                background: 'rgba(10,8,38,0.80)',
                border: 'none', color: '#fff', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif', letterSpacing: 0.3,
                transition: 'background 0.20s, transform 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(155,133,224,0.18)'; e.currentTarget.style.transform='scale(1.01)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(10,8,38,0.80)'; e.currentTarget.style.transform='scale(1)'; }}
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M7 2v10M2 7h10" />
              </svg>
              Connect with someone
            </button>
          </div>
        </div>

      ) : (
        <>
          {/* ── Change partner (compact ghost) ── */}
          <div style={{ padding: `${SPACING.xs}px 28px`, display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setShowPicker(true)}
              aria-label={`Change partner, currently ${partner.name}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '7px 20px', borderRadius: 30,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.20)',
                color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif', letterSpacing: 0.6,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.38)'; e.currentTarget.style.color='#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.20)'; e.currentTarget.style.color='rgba(255,255,255,0.65)'; }}
            >
              Change · {partner.name}
            </button>
          </div>

          {/* ── Overall match + Category chips ── */}
          {compat && (
            <div style={{ padding: `${SPACING.xs}px ${SPACING.xxl}px ${SPACING.sm}px` }}>
              <div style={{ textAlign: 'center', fontSize: 21, fontWeight: 700, color: PALETTE.text, marginBottom: SPACING.md }}>
                {compat}%{' '}
                <span style={{ fontSize: 13, fontWeight: 400, color: PALETTE.muted }}>overall match</span>
              </div>

              {/* Category chips */}
              <div style={{ display: 'flex', gap: SPACING.sm, justifyContent: 'center', marginBottom: SPACING.md }}>
                {['Love', 'Friendship', 'Work', 'Crush'].map(cat => {
                  const active = cat === category;
                  const chipColors = { Love: PALETTE.ringLove, Friendship: PALETTE.lavender, Work: PALETTE.ringCareer, Crush: PALETTE.pink };
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: `${SPACING.xs + 1}px ${SPACING.md}px`,
                        borderRadius: 20, fontSize: 11, fontWeight: active ? 700 : 500,
                        background: active ? `${chipColors[cat]}22` : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${active ? chipColors[cat] : 'rgba(255,255,255,0.12)'}`,
                        color: active ? '#fff' : 'rgba(240,238,248,0.60)',
                        cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                        boxShadow: active ? `0 0 10px 1px ${chipColors[cat]}44` : 'none',
                        transition: 'all 0.18s',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Score rings — update based on selected category */}
              {cfg && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 40 }}>
                  <CircularProgress key={`${category}-r1`} value={cfg.ring1.v} label={cfg.ring1.l} color={cfg.ring1.c} size={80} gradientColors={cfg.ring1.g} />
                  <CircularProgress key={`${category}-r2`} value={cfg.ring2.v} label={cfg.ring2.l} color={cfg.ring2.c} size={80} gradientColors={cfg.ring2.g} />
                </div>
              )}
            </div>
          )}

          {/* ── Narrative ── */}
          <div style={{ padding: `0 28px ${SPACING.xxl}px`, flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: PALETTE.text, marginBottom: SPACING.md, letterSpacing: -0.4, lineHeight: 1.3 }}>
              {mySign.name} & {partner.name}
            </div>

            {/* Harmony */}
            <div style={{ marginBottom: SPACING.md }}>
              <div style={{ fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', color: PALETTE.ringLove, fontWeight: 600, marginBottom: SPACING.xs }}>
                Harmony
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.85, color: 'rgba(240,238,248,0.75)', margin: 0 }}>
                {harmonyText[category]}
              </p>
            </div>

            {/* Point of Attention */}
            <div style={{ marginBottom: SPACING.lg }}>
              <div style={{ fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', color: PALETTE.lavender, fontWeight: 600, marginBottom: SPACING.xs }}>
                Point of Attention
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.85, color: 'rgba(240,238,248,0.55)', margin: 0 }}>
                {attentionText[category]}
              </p>
            </div>

            {/* Share Result */}
            <div style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.50),rgba(155,133,224,0.50))', padding: '1px', borderRadius: 16 }}>
              <button
                onClick={() => {
                  const text = `${mySign.name} & ${partner.name}: ${compat}% cosmic compatibility ✨ — Celestia`;
                  if (navigator.share) navigator.share({ title: 'Cosmic Compatibility', text });
                  else navigator.clipboard?.writeText(text);
                }}
                style={{
                  width: '100%', padding: '12px', borderRadius: 15,
                  background: 'rgba(10,8,38,0.85)', border: 'none',
                  color: '#fff', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif', letterSpacing: 0.3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  transition: 'background 0.20s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(155,133,224,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,8,38,0.85)'; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share Result
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Sign Picker Modal ── */}
      {showPicker && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose your partner's zodiac sign"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10,10,34,0.97)',
            backdropFilter: 'blur(20px)', zIndex: 100,
            display: 'flex', flexDirection: 'column',
            borderRadius: 'inherit',
          }}
        >
          <div style={{ padding: `${SPACING.xl}px ${SPACING.xxl}px ${SPACING.md}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: PALETTE.text }}>Choose a sign</span>
            <button
              onClick={() => setShowPicker(false)}
              aria-label="Close"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: PALETTE.muted }}
            >✕</button>
          </div>
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
                  aria-label={`${z.name}, ${z.dates}`}
                  disabled={!!selecting}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg,#9B85E0,#F0A8C4)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isSelecting ? PALETTE.lavender : isSelected ? 'transparent' : 'rgba(255,255,255,0.10)'}`,
                    borderRadius: 16,
                    padding: `${SPACING.md}px ${SPACING.sm}px`,
                    cursor: selecting ? 'default' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING.sm - 2,
                    transition: 'all 0.2s', fontFamily: 'Outfit, sans-serif',
                    transform: isSelecting ? 'scale(0.95)' : 'scale(1)',
                    opacity: selecting && !isSelecting ? 0.45 : 1,
                  }}
                >
                  {isSelecting ? (
                    <div aria-label="Loading..." style={{
                      width: 44, height: 44, borderRadius: '50%',
                      border: `3px solid ${PALETTE.lavender}`, borderTopColor: 'transparent',
                      animation: 'spin 0.7s linear infinite',
                    }} />
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: isSelected ? 'rgba(255,255,255,0.22)' : 'rgba(155,133,224,0.14)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isSelected ? '#fff' : 'rgba(200,180,255,0.85)',
                    }}>
                      <SignGlyph name={z.name} size={24} />
                    </div>
                  )}
                  <span style={{ fontSize: 11, color: PALETTE.text, fontWeight: 500 }}>{z.name}</span>
                  <span style={{ fontSize: 9, color: PALETTE.muted }}>{z.dates.split('–')[0].trim()}</span>
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
function SettingsScreen({ userSign, birthDate, birthTime, onSave, onNavigate }) {
  const [date, setDate]           = React.useState(birthDate || '');
  const [time, setTime]           = React.useState(birthTime || '');
  const [saved, setSaved] = React.useState(false);

  const sunSignName    = date ? getSunSign(date) : (userSign || null);
  const sunSign        = sunSignName ? ZODIAC_SIGNS.find(z => z.name === sunSignName) : null;
  const moonSignName   = getMoonSign(date);
  const moonSign       = moonSignName ? ZODIAC_SIGNS.find(z => z.name === moonSignName) : null;
  const risingSignName = getRisingSign(date, time);
  const risingSign     = risingSignName ? ZODIAC_SIGNS.find(z => z.name === risingSignName) : null;

  const hasPending = date !== (birthDate || '') || time !== (birthTime || '');

  const handleShare = () => {
    const parts = [
      sunSignName    ? `Sun: ${sunSignName}` : null,
      moonSignName   ? `Moon: ${moonSignName}` : null,
      risingSignName ? `Rising: ${risingSignName}` : null,
    ].filter(Boolean).join(' · ');
    const text = `My Big Three: ${parts} — Celestia`;
    if (navigator.share) navigator.share({ title: 'My Birth Chart', text });
    else navigator.clipboard?.writeText(text);
  };

  const handle = () => {
    if (!sunSignName) return;
    onSave(sunSignName, date, time);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: '100%', padding: '13px 14px', borderRadius: 14, boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: PALETTE.text, fontSize: 14, fontFamily: 'Outfit, sans-serif',
    outline: 'none', cursor: 'pointer', colorScheme: 'dark',
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: `18px ${SPACING.xl}px 14px`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ ...TYPE.label, color: PALETTE.subtle }}>Your</div>
          <div style={{ ...TYPE.title, color: PALETTE.text }}>Birth Chart</div>
        </div>
        {sunSign && (
          <button
            onClick={handleShare}
            aria-label="Share birth chart"
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 12, padding: '8px 10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
              color: 'rgba(240,238,248,0.65)', fontSize: 11, fontFamily: 'Outfit, sans-serif',
              transition: 'background 0.18s, color 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(155,133,224,0.18)'; e.currentTarget.style.color='#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='rgba(240,238,248,0.65)'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
          </button>
        )}
      </div>

      <div style={{ padding: `0 ${SPACING.xl}px`, display: 'flex', flexDirection: 'column', gap: SPACING.xl }}>

        {/* ── Inputs + sun sign inline feedback ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm - 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.sm }}>
            <section aria-label="Birth date">
              <label htmlFor="birth-date" style={{ display: 'block', ...TYPE.label, color: PALETTE.subtle, marginBottom: SPACING.xs }}>
                Birth Date
              </label>
              <input
                id="birth-date" type="date" value={date}
                onChange={e => { setDate(e.target.value); setSaved(false); }}
                style={inputStyle}
              />
            </section>
            <section aria-label="Birth time">
              <label htmlFor="birth-time" style={{ display: 'block', ...TYPE.label, color: PALETTE.subtle, marginBottom: SPACING.xs }}>
                Birth Time
              </label>
              <input
                id="birth-time" type="time" value={time}
                onChange={e => { setTime(e.target.value); setSaved(false); }}
                style={inputStyle}
              />
            </section>
          </div>
          {date && sunSignName && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: SPACING.xs + 2,
              padding: `${SPACING.xs + 2}px ${SPACING.md}px`,
              background: 'rgba(240,168,196,0.08)', borderRadius: 10,
              border: '1px solid rgba(240,168,196,0.18)',
            }}>
              <img src={`images/icon-${sunSignName.toLowerCase()}.png`} alt="" style={{ width: 18, height: 18, objectFit: 'contain' }} />
              <span style={{ fontSize: 11, color: PALETTE.muted, letterSpacing: 0.3 }}>Sun sign</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: PALETTE.pink, marginLeft: 2 }}>{sunSignName}</span>
            </div>
          )}
        </div>

        {/* ── Big Three — hero card ── */}
        <GlassCard style={{ padding: SPACING.lg }}>
          <div style={{ ...TYPE.label, color: PALETTE.subtle, marginBottom: SPACING.md, textAlign: 'center', letterSpacing: 1.6 }}>
            Big Three
          </div>
          <div style={{ display: 'flex', gap: SPACING.sm }}>
            {[
              { label: 'Sun',    sub: 'Essence',            sign: sunSign,    color: PALETTE.pink,          hint: 'Add date' },
              { label: 'Moon',   sub: 'Emotions',           sign: moonSign,   color: PALETTE.lavender,      hint: 'Add date' },
              { label: 'Rising', sub: 'First impression',   sign: risingSign, color: PALETTE.ringMentality, hint: 'Add time' },
            ].map(({ label, sub, sign, color, hint }) => (
              <div key={label} style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 14,
                padding: `${SPACING.md}px ${SPACING.sm}px`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING.xs + 2,
                opacity: sign ? 1 : 0.38,
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 1, letterSpacing: 0.3 }}>{sub}</div>
                </div>
                {sign
                  ? <img src={`images/icon-${sign.name.toLowerCase()}.png`} alt={sign.name} style={{ width: 46, height: 46, objectFit: 'contain' }} />
                  : <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'rgba(255,255,255,0.18)' }}>?</div>
                }
                <div style={{ fontSize: 11, fontWeight: 600, color: PALETTE.text, textAlign: 'center' }}>
                  {sign ? sign.name : hint}
                </div>
              </div>
            ))}
          </div>

          {/* ── Traits — always visible ── */}
          {sunSign && (
            <div style={{ marginTop: SPACING.md }}>
              <div style={{ fontSize: 9, color: PALETTE.muted, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: SPACING.sm }}>
                Your traits
              </div>
              <div style={{ display: 'flex', gap: SPACING.xs + 2, flexWrap: 'wrap' }}>
                {(sunSign.traits || []).map(t => (
                  <span key={'s-'+t} style={{ padding: `${SPACING.xs}px ${SPACING.sm+2}px`, borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(240,168,196,0.15)', color: PALETTE.pink, border: '1px solid rgba(240,168,196,0.25)' }}>{t}</span>
                ))}
                {(moonSign?.traits || []).slice(0,2).map(t => (
                  <span key={'m-'+t} style={{ padding: `${SPACING.xs}px ${SPACING.sm+2}px`, borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(155,133,224,0.15)', color: '#B8A4E8', border: '1px solid rgba(155,133,224,0.25)' }}>{t}</span>
                ))}
                {(risingSign?.traits || []).slice(0,1).map(t => (
                  <span key={'r-'+t} style={{ padding: `${SPACING.xs}px ${SPACING.sm+2}px`, borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(126,200,227,0.15)', color: PALETTE.ringMentality, border: '1px solid rgba(126,200,227,0.25)' }}>{t}</span>
                ))}
              </div>

              {/* ── Horoscope CTA ── */}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('horoscope')}
                  style={{
                    marginTop: SPACING.md, width: '100%',
                    padding: `${SPACING.sm + 1}px`, borderRadius: 14,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'background 0.18s, border-color 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(155,133,224,0.12)'; e.currentTarget.style.borderColor='rgba(155,133,224,0.30)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.10)'; }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 11, color: PALETTE.muted, marginBottom: 2 }}>How does this affect your day?</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.text }}>See my horoscope</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(155,133,224,0.70)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </GlassCard>

        {/* ── Save — only when there are pending changes ── */}
        {(hasPending || saved) && (
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
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, HomeScreen, HoroscopeScreen, CompatibilityScreen, SettingsScreen });
