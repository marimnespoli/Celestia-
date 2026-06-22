
// Celestia — Shared Components

// ── Star Field background ──────────────────────────────────────
// Respects prefers-reduced-motion for accessibility (WCAG 2.3.3)
function StarField() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stars = React.useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.6 + 0.15,
    dur: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  })), []);

  return (
    <div
      role="presentation"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    >
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: s.size > 2 ? 'rgba(180,160,240,0.8)' : 'rgba(255,255,255,0.9)',
          opacity: s.opacity,
          // Paused when user prefers reduced motion — no layout shift, no vestibular trigger
          animation: prefersReduced
            ? 'none'
            : `starPulse ${s.dur}s ${s.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,60,180,0.15) 0%, transparent 70%)', top: '10%', left: '-10%', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,80,160,0.12) 0%, transparent 70%)', bottom: '20%', right: '-5%', filter: 'blur(40px)' }} />
    </div>
  );
}

// ── Circular Progress Ring ─────────────────────────────────────
// aria-label exposes the metric value to screen readers
function CircularProgress({ value, label, color = '#9B85E0', size = 72 }) {
  const radius = (size - 10) / 2;
  const circ = 2 * Math.PI * radius;
  const [animated, setAnimated] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  const animOffset = circ - (animated / 100) * circ;

  return (
    <div
      role="img"
      aria-label={`${label}: ${value}%`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
          {/* track-empty: low contrast intentional — decorative track only */}
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={PALETTE.trackEmpty} strokeWidth={4} />
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={animOffset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 1,
        }}>
          <span style={{ color: PALETTE.text, fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{value}</span>
          <span style={{ color: PALETTE.muted, fontSize: 8, fontWeight: 500, lineHeight: 1 }}>/100</span>
        </div>
      </div>
      {/* text-muted token (0.65) ensures ≥7:1 contrast on dark bg */}
      <span style={{ color: PALETTE.muted, fontSize: 11, letterSpacing: 0.3, textAlign: 'center' }}>{label}</span>
    </div>
  );
}

// ── Zodiac Illustration ────────────────────────────────────────
function ZodiacArt({ name, cardBg, figureLight = false, size = 'full' }) {
  const h = size === 'full' ? 220 : 200;
  const w = size === 'full' ? 200 : 190;
  const src = `images/${name.toLowerCase()}.png`;

  return (
    <img
      src={src}
      alt={`${name} zodiac illustration`}
      style={{
        width: w,
        height: h,
        objectFit: 'contain',
        objectPosition: 'center bottom',
        display: 'block',
      }}
    />
  );
}

// ── Bottom Tab Bar ────────────────────────────────────────────
// aria-current="page" marks the active tab for screen readers
function BottomNav({ activeTab, onTab }) {
  const tabs = [
    {
      id: 'horoscope', label: 'Horoscope',
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill={active ? PALETTE.pink : PALETTE.subtle} />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
            stroke={active ? PALETTE.pink : PALETTE.subtle} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'compatibility', label: 'Compatibility',
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="8" cy="12" r="5" stroke={active ? PALETTE.lavender : PALETTE.subtle} strokeWidth="1.8" />
          <circle cx="16" cy="12" r="5" stroke={active ? PALETTE.lavender : PALETTE.subtle} strokeWidth="1.8" />
          <path d="M11 9l2 3-2 3" stroke={active ? PALETTE.lavender : PALETTE.subtle} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'settings', label: 'Profile',
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="4" stroke={active ? PALETTE.pink : PALETTE.subtle} strokeWidth="1.8" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? PALETTE.pink : PALETTE.subtle} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
  ];

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 72,
        background: 'rgba(13,13,43,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
        paddingTop: SPACING.sm + 2, zIndex: 50,
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTab(tab.id)}
          aria-label={tab.label}
          aria-current={activeTab === tab.id ? 'page' : undefined}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SPACING.xs,
            padding: `${SPACING.xs}px ${SPACING.lg}px`,
            // Focus ring for keyboard navigation — uses outline so it's visible without hover
            outline: 'none',
            borderRadius: 8,
            transition: 'opacity 0.2s, transform 0.15s',
          }}
          onFocus={e => { e.currentTarget.style.outline = `2px solid ${PALETTE.lavender}`; }}
          onBlur={e => { e.currentTarget.style.outline = 'none'; }}
        >
          {tab.icon(activeTab === tab.id)}
          <span style={{
            fontSize: 10, letterSpacing: 0.2, fontWeight: 500,
            // Active tab uses brand color; inactive uses text-subtle (0.50 → 4.9:1 contrast ✓)
            color: activeTab === tab.id ? (tab.id === 'compatibility' ? PALETTE.lavender : PALETTE.pink) : PALETTE.subtle,
            transition: 'color 0.2s',
            fontFamily: 'Outfit, sans-serif',
          }}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Glass Card ────────────────────────────────────────────────
// card-background / card-border tokens ensure visual consistency across all cards
function GlassCard({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: PALETTE.cardBackground,
      backdropFilter: 'blur(16px)',
      border: `1px solid ${PALETTE.cardBorder}`,
      borderRadius: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Primary Action Button ─────────────────────────────────────
// Centralised button with hover/active micro-interactions and focus ring
// Hover: brightness lift + shadow expansion
// Active: scale-down tactile press feedback
function PrimaryButton({ children, onClick, style = {}, disabled = false, ariaLabel }) {
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={e => { e.currentTarget.style.outline = `2px solid ${PALETTE.lavender}`; e.currentTarget.style.outlineOffset = '2px'; }}
      onBlur={e => { e.currentTarget.style.outline = 'none'; }}
      style={{
        background: 'linear-gradient(135deg, #9B85E0, #F0A8C4)',
        border: 'none', borderRadius: 20,
        padding: '8px 18px',
        color: '#fff', fontSize: 12, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
        letterSpacing: 0.3,
        fontFamily: 'Outfit, sans-serif',
        // hover: elevated glow; active: tactile press scale
        boxShadow: pressed
          ? '0 2px 8px rgba(155,133,224,0.3)'
          : hovered
            ? '0 8px 28px rgba(155,133,224,0.65)'
            : '0 4px 16px rgba(155,133,224,0.4)',
        transform: pressed ? 'scale(0.97)' : hovered ? 'scale(1.02)' : 'scale(1)',
        opacity: disabled ? 0.5 : 1,
        transition: 'box-shadow 0.2s ease, transform 0.15s ease',
        outline: 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

Object.assign(window, { StarField, CircularProgress, ZodiacArt, BottomNav, GlassCard, PrimaryButton });
