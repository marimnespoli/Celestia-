
// Celestia — Shared Components

// ── Star Field background ──────────────────────────────────────
function StarField() {
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
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%',
          background: s.size > 2 ? 'rgba(180,160,240,0.8)' : 'rgba(255,255,255,0.9)',
          opacity: s.opacity,
          animation: `starPulse ${s.dur}s ${s.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
      {/* nebula blobs */}
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(100,60,180,0.15) 0%, transparent 70%)', top: '10%', left: '-10%', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,80,160,0.12) 0%, transparent 70%)', bottom: '20%', right: '-5%', filter: 'blur(40px)' }} />
    </div>
  );
}

// ── Circular Progress Ring ─────────────────────────────────────
function CircularProgress({ value, label, color = '#9B85E0', size = 72 }) {
  const radius = (size - 10) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  const [animated, setAnimated] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 100);
    return () => clearTimeout(t);
  }, [value]);

  const animOffset = circ - (animated / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
          <circle cx={size/2} cy={size/2} r={radius}
            fill="none" stroke={color} strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={animOffset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: 1 }}>
            {value}<sup style={{ fontSize: 8, fontWeight: 400 }}>%</sup>
          </span>
        </div>
      </div>
      <span style={{ color: 'rgba(240,238,248,0.6)', fontSize: 11, letterSpacing: 0.3, textAlign: 'center' }}>{label}</span>
    </div>
  );
}

// ── Zodiac Illustration ────────────────────────────────────────
function ZodiacArt({ name, cardBg, figureLight = false, size = 'full' }) {
  const h = size === 'full' ? 220 : 200;
  const w = size === 'full' ? 200 : 190;
  const fill = figureLight ? 'rgba(200,180,255,0.9)' : '#1A1A5E';
  const src = `images/${name.toLowerCase()}.png`;

  if (true) {
    return (
      <img
        src={src}
        alt={name}
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

  // Taurus fallback — keep original SVG
  const hi = figureLight ? 'rgba(255,255,255,0.4)' : '#6060C0';
  const bg = cardBg;

  const arts = {
    Aries: (
      <g>
        {/* Body */}
        <ellipse cx="100" cy="145" rx="28" ry="42" fill={fill} />
        {/* Head */}
        <circle cx="100" cy="88" r="22" fill={fill} />
        {/* Left horn curl */}
        <path d="M88,72 C70,60 45,65 40,82 C35,99 48,112 62,105 C52,100 46,88 52,78 C60,66 78,68 88,72Z" fill={fill} opacity="0.9" />
        {/* Right horn curl */}
        <path d="M112,72 C130,60 155,65 160,82 C165,99 152,112 138,105 C148,100 154,88 148,78 C140,66 122,68 112,72Z" fill={fill} opacity="0.9" />
        {/* Highlight */}
        <ellipse cx="93" cy="82" rx="6" ry="8" fill={hi} opacity="0.6" />
        {/* Legs */}
        <rect x="82" y="182" width="14" height="36" rx="7" fill={fill} />
        <rect x="104" y="182" width="14" height="36" rx="7" fill={fill} />
      </g>
    ),
    Taurus: (
      <g>
        <ellipse cx="100" cy="150" rx="32" ry="48" fill={fill} />
        <circle cx="100" cy="92" r="26" fill={fill} />
        {/* Wide sweeping horns */}
        <path d="M76,76 Q50,40 30,50 Q20,60 30,72 Q45,75 60,78Z" fill={fill} />
        <path d="M124,76 Q150,40 170,50 Q180,60 170,72 Q155,75 140,78Z" fill={fill} />
        <ellipse cx="93" cy="86" rx="7" ry="9" fill={hi} opacity="0.5" />
        <rect x="80" y="192" width="16" height="30" rx="8" fill={fill} />
        <rect x="104" y="192" width="16" height="30" rx="8" fill={fill} />
      </g>
    ),
    Gemini: (
      <g>
        {/* Left figure */}
        <circle cx="72" cy="90" r="16" fill={fill} />
        <ellipse cx="72" cy="145" rx="18" ry="38" fill={fill} />
        <rect x="62" y="178" width="10" height="30" rx="5" fill={fill} />
        <rect x="76" y="178" width="10" height="30" rx="5" fill={fill} />
        {/* Right figure */}
        <circle cx="128" cy="90" r="16" fill={fill} />
        <ellipse cx="128" cy="145" rx="18" ry="38" fill={fill} />
        <rect x="118" y="178" width="10" height="30" rx="5" fill={fill} />
        <rect x="132" y="178" width="10" height="30" rx="5" fill={fill} />
        {/* Connection line */}
        <path d="M88,90 Q100,80 112,90" stroke={hi} strokeWidth="2.5" fill="none" opacity="0.7" />
        <path d="M90,145 Q100,155 110,145" stroke={hi} strokeWidth="2.5" fill="none" opacity="0.7" />
        {/* Highlights */}
        <ellipse cx="67" cy="84" rx="4" ry="6" fill={hi} opacity="0.5" />
        <ellipse cx="123" cy="84" rx="4" ry="6" fill={hi} opacity="0.5" />
      </g>
    ),
    Cancer: (
      <g>
        {/* Crab body */}
        <ellipse cx="100" cy="135" rx="38" ry="32" fill={fill} />
        {/* Left claws */}
        <path d="M62,120 C42,105 30,85 38,72 C45,60 58,65 62,78 C52,78 48,88 55,96Z" fill={fill} />
        <path d="M62,130 C35,130 18,118 22,104 C26,92 40,92 48,102 C38,106 36,118 46,122Z" fill={fill} />
        {/* Right claws */}
        <path d="M138,120 C158,105 170,85 162,72 C155,60 142,65 138,78 C148,78 152,88 145,96Z" fill={fill} />
        <path d="M138,130 C165,130 182,118 178,104 C174,92 160,92 152,102 C162,106 164,118 154,122Z" fill={fill} />
        {/* Eyes */}
        <circle cx="88" cy="125" r="5" fill={hi} opacity="0.7" />
        <circle cx="112" cy="125" r="5" fill={hi} opacity="0.7" />
        {/* Legs */}
        <path d="M72,155 L55,175" stroke={fill} strokeWidth="8" strokeLinecap="round" />
        <path d="M82,162 L70,185" stroke={fill} strokeWidth="8" strokeLinecap="round" />
        <path d="M118,155 L135,175" stroke={fill} strokeWidth="8" strokeLinecap="round" />
        <path d="M118,162 L130,185" stroke={fill} strokeWidth="8" strokeLinecap="round" />
      </g>
    ),
    Leo: (
      <g>
        {/* Mane */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
          <line key={i} x1="100" y1="100" x2={100 + 52*Math.cos(a*Math.PI/180)} y2={100 + 52*Math.sin(a*Math.PI/180)}
            stroke={fill} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
        ))}
        <circle cx="100" cy="100" r="34" fill={fill} />
        {/* Body */}
        <ellipse cx="100" cy="168" rx="28" ry="40" fill={fill} />
        {/* Tail */}
        <path d="M128,175 C150,165 165,145 155,130 C148,120 138,128 142,138" stroke={fill} strokeWidth="9" fill="none" strokeLinecap="round" />
        <ellipse cx="95" cy="93" rx="8" ry="10" fill={hi} opacity="0.5" />
        {/* Legs */}
        <rect x="80" y="200" width="14" height="28" rx="7" fill={fill} />
        <rect x="106" y="200" width="14" height="28" rx="7" fill={fill} />
      </g>
    ),
    Virgo: (
      <g>
        {/* Flowing hair */}
        <path d="M75,65 C55,70 45,90 50,115 C45,100 42,78 60,60 C70,50 88,48 100,50 C112,48 130,50 140,60 C158,78 155,100 150,115 C155,90 145,70 125,65Z" fill={fill} opacity="0.8" />
        {/* Head */}
        <circle cx="100" cy="88" r="24" fill={fill} />
        {/* Body/dress */}
        <path d="M76,108 C65,130 60,165 65,200 L135,200 C140,165 135,130 124,108Z" fill={fill} />
        {/* Arms */}
        <path d="M76,120 C55,130 45,150 52,165" stroke={fill} strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M124,120 C145,130 155,150 148,165" stroke={fill} strokeWidth="12" fill="none" strokeLinecap="round" />
        <ellipse cx="94" cy="82" rx="7" ry="9" fill={hi} opacity="0.5" />
        {/* Wheat detail */}
        <path d="M52,165 Q45,180 50,195" stroke={hi} strokeWidth="3" fill="none" opacity="0.7" />
        <ellipse cx="50" cy="195" rx="5" ry="9" fill={hi} opacity="0.6" transform="rotate(-15 50 195)" />
      </g>
    ),
    Libra: (
      <g>
        {/* Balance beam */}
        <rect x="40" y="118" width="120" height="8" rx="4" fill={fill} />
        <rect x="97" y="85" width="6" height="80" rx="3" fill={fill} />
        {/* Left pan */}
        <path d="M40,126 Q55,150 70,126" stroke={fill} strokeWidth="4" fill="rgba(100,80,200,0.3)" />
        <ellipse cx="55" cy="150" rx="20" ry="6" fill={fill} opacity="0.6" />
        {/* Right pan */}
        <path d="M130,126 Q145,150 160,126" stroke={fill} strokeWidth="4" fill="rgba(100,80,200,0.3)" />
        <ellipse cx="145" cy="150" rx="20" ry="6" fill={fill} opacity="0.6" />
        {/* Top circle */}
        <circle cx="100" cy="80" r="14" fill={fill} />
        <circle cx="100" cy="80" r="8" fill={hi} opacity="0.5" />
        {/* Stand */}
        <rect x="92" y="165" width="16" height="45" rx="4" fill={fill} />
        <rect x="72" y="205" width="56" height="10" rx="5" fill={fill} />
      </g>
    ),
    Scorpio: (
      <g>
        {/* Body */}
        <ellipse cx="100" cy="145" rx="30" ry="46" fill={fill} />
        {/* Head */}
        <circle cx="100" cy="85" r="25" fill={fill} />
        {/* Arms */}
        <path d="M70,130 C50,120 38,130 35,148" stroke={fill} strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M130,130 C150,120 162,130 165,148" stroke={fill} strokeWidth="14" fill="none" strokeLinecap="round" />
        {/* Tail */}
        <path d="M100,188 C90,205 82,220 90,232 C98,244 114,240 118,228 C122,216 115,208 108,215" stroke={fill} strokeWidth="10" fill="none" strokeLinecap="round" />
        {/* Stinger */}
        <polygon points="108,215 118,210 114,224" fill={fill} />
        <ellipse cx="94" cy="78" rx="7" ry="9" fill={hi} opacity="0.5" />
      </g>
    ),
    Sagittarius: (
      <g>
        {/* Centaur body - horse part */}
        <ellipse cx="100" cy="175" rx="45" ry="30" fill={fill} />
        {/* Horse legs */}
        <rect x="64" y="195" width="14" height="32" rx="7" fill={fill} />
        <rect x="84" y="198" width="14" height="28" rx="7" fill={fill} />
        <rect x="102" y="198" width="14" height="28" rx="7" fill={fill} />
        <rect x="122" y="195" width="14" height="32" rx="7" fill={fill} />
        {/* Human torso */}
        <ellipse cx="100" cy="128" rx="24" ry="34" fill={fill} />
        {/* Head */}
        <circle cx="100" cy="88" r="20" fill={fill} />
        {/* Bow arm */}
        <path d="M80,125 C60,115 50,100 55,82" stroke={fill} strokeWidth="12" fill="none" strokeLinecap="round" />
        {/* Arrow */}
        <line x1="55" y1="82" x2="160" y2="72" stroke={hi} strokeWidth="3" opacity="0.9" />
        <polygon points="160,72 148,66 150,78" fill={hi} opacity="0.9" />
        <ellipse cx="94" cy="82" rx="5" ry="7" fill={hi} opacity="0.5" />
      </g>
    ),
    Capricorn: (
      <g>
        {/* Goat body */}
        <ellipse cx="95" cy="150" rx="35" ry="44" fill={fill} />
        {/* Head */}
        <circle cx="100" cy="90" r="24" fill={fill} />
        {/* Horns */}
        <path d="M88,70 C82,52 70,48 66,58 C62,68 72,76 84,76Z" fill={fill} />
        <path d="M112,70 C118,52 130,48 134,58 C138,68 128,76 116,76Z" fill={fill} />
        {/* Beard */}
        <path d="M92,112 C88,122 86,132 90,138" stroke={fill} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.8" />
        {/* Fish tail */}
        <path d="M120,168 C140,180 155,172 158,158 C161,144 148,136 138,145 C148,148 152,160 144,166 C135,172 124,165 120,168Z" fill={fill} opacity="0.85" />
        <ellipse cx="94" cy="83" rx="6" ry="8" fill={hi} opacity="0.5" />
        <rect x="74" y="186" width="14" height="28" rx="7" fill={fill} />
        <rect x="98" y="186" width="14" height="28" rx="7" fill={fill} />
      </g>
    ),
    Aquarius: (
      <g>
        {/* Figure */}
        <circle cx="100" cy="82" r="22" fill={fill} />
        <ellipse cx="100" cy="140" rx="26" ry="42" fill={fill} />
        {/* Water jug */}
        <path d="M118,118 C130,118 138,125 136,138 L120,155 C114,148 110,138 112,128Z" fill={fill} opacity="0.9" />
        {/* Water waves pouring */}
        <path d="M120,155 Q130,165 125,178 Q135,168 145,178 Q138,190 148,200" stroke={hi} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M130,160 Q140,170 135,183" stroke={hi} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
        <ellipse cx="94" cy="76" rx="6" ry="8" fill={hi} opacity="0.5" />
        <rect x="78" y="175" width="14" height="30" rx="7" fill={fill} />
        <rect x="100" y="175" width="14" height="30" rx="7" fill={fill} />
      </g>
    ),
    Pisces: (
      <g>
        {/* Two fish */}
        {/* Upper fish */}
        <ellipse cx="100" cy="95" rx="22" ry="50" fill={fill} transform="rotate(-25 100 95)" />
        <path d="M78,55 L62,38 L72,62Z" fill={fill} transform="rotate(-25 78 55)" />
        <ellipse cx="115" cy="88" rx="5" ry="6" fill={hi} opacity="0.6" />
        {/* Lower fish */}
        <ellipse cx="100" cy="165" rx="22" ry="50" fill={fill} transform="rotate(25 100 165)" opacity="0.9" />
        <path d="M122,205 L138,222 L128,198Z" fill={fill} transform="rotate(25 122 205)" />
        <ellipse cx="84" cy="172" rx="5" ry="6" fill={hi} opacity="0.6" />
        {/* Connecting curve */}
        <path d="M90,125 Q100,140 110,135" stroke={hi} strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round" />
      </g>
    ),
  };

  return (
    <svg viewBox={`0 0 200 ${h === 220 ? 230 : 210}`} width={w} height={h}
      style={{ display: 'block', overflow: 'visible' }}>
      {arts[name] || (
        <text x="100" y="130" textAnchor="middle" fontSize="80" fill={fill} opacity="0.4"
          fontFamily="serif">{ZODIAC_SIGNS.find(z=>z.name===name)?.symbol}</text>
      )}
    </svg>
  );
}

// ── Bottom Tab Bar ────────────────────────────────────────────
function BottomNav({ activeTab, onTab }) {
  const tabs = [
    {
      id: 'horoscope', label: 'Horoscope',
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" fill={active ? '#F0A8C4' : 'rgba(240,238,248,0.4)'} />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
            stroke={active ? '#F0A8C4' : 'rgba(240,238,248,0.4)'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'compatibility', label: 'Compatibility',
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="8" cy="12" r="5" stroke={active ? '#9B85E0' : 'rgba(240,238,248,0.4)'} strokeWidth="1.8" />
          <circle cx="16" cy="12" r="5" stroke={active ? '#9B85E0' : 'rgba(240,238,248,0.4)'} strokeWidth="1.8" />
          <path d="M11 9l2 3-2 3" stroke={active ? '#9B85E0' : 'rgba(240,238,248,0.4)'} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'settings', label: 'Profile',
      icon: (active) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke={active ? '#F0A8C4' : 'rgba(240,238,248,0.4)'} strokeWidth="1.8" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? '#F0A8C4' : 'rgba(240,238,248,0.4)'} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 72,
      background: 'rgba(13,13,43,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around',
      paddingTop: 10, zIndex: 50,
    }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onTab(tab.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '4px 16px',
          transition: 'opacity 0.2s',
        }}>
          {tab.icon(activeTab === tab.id)}
          <span style={{
            fontSize: 10, letterSpacing: 0.2, fontWeight: 500,
            color: activeTab === tab.id ? (tab.id === 'compatibility' ? '#9B85E0' : '#F0A8C4') : 'rgba(240,238,248,0.4)',
            transition: 'color 0.2s',
            fontFamily: 'Outfit, sans-serif',
          }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── Glass Card ────────────────────────────────────────────────
function GlassCard({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

Object.assign(window, { StarField, CircularProgress, ZodiacArt, BottomNav, GlassCard });
