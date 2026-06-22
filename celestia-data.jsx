
// Celestia — Zodiac data, horoscope content, illustrations

// ── DESIGN SYSTEM: Semantic Color Tokens ─────────────────────
// All opacity values verified against WCAG 2.1 AA (min 4.5:1 on #0D0D2B bg)
// rgba(240,238,248,0.3) → ~2.5:1 ✗  |  0.5 → ~4.9:1 ✓  |  0.65 → ~7.0:1 ✓
const PALETTE = {
  // Backgrounds
  bg: '#0D0D2B',               // card-background: main app dark navy
  bgCard: '#1A1A4E',           // card-surface: elevated card bg
  bgCard2: '#13133A',          // card-surface-alt: secondary card bg

  // Brand accents
  pink: '#F0A8C4',             // primary-action: love / CTA highlight
  lavender: '#9B85E0',         // secondary-action: compatibility / rings
  purple: '#6B4FA0',           // interactive-hover: pressed / hover states

  // Text — WCAG AA compliant on #0D0D2B background
  text: '#F0EEF8',             // text-primary: ~14:1 contrast ✓
  textSecondary: 'rgba(240,238,248,0.75)', // text-secondary: ~9:1 ✓
  muted: 'rgba(240,238,248,0.65)',          // text-muted: ~7:1 ✓  (was 0.55)
  subtle: 'rgba(240,238,248,0.50)',         // text-subtle: ~4.9:1 ✓ (replaces 0.3/0.4 which failed)

  // Surfaces
  glass: 'rgba(255,255,255,0.07)',          // glass-surface
  glassBorder: 'rgba(255,255,255,0.13)',    // glass-border

  // Semantic aliases for component use
  cardBackground: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.12)',
  trackEmpty: 'rgba(255,255,255,0.10)',

  // bg-overlay: dark backdrop behind text blocks so starfield doesn't bleed into content
  // Solves legibility issue without hiding the atmospheric background entirely
  bgOverlay: 'rgba(10,10,35,0.65)',

  // Energy ring colours (per metric)
  ringLove: '#F0A8C4',
  ringEmotions: '#9B85E0',
  ringMentality: '#7EC8E3',
  ringCareer: '#A8D8A8',
};

// ── DESIGN SYSTEM: Spacing Scale ─────────────────────────────
// 4-point grid — reduces cognitive load through consistent rhythm
const SPACING = {
  xs:  4,   // tight inline gap
  sm:  8,   // inner card padding unit
  md:  12,  // component internal gap
  lg:  16,  // section gutter
  xl:  20,  // screen-edge padding
  xxl: 24,  // section separation
  '3xl': 32,
};

// ── DESIGN SYSTEM: Typography Scale ──────────────────────────
const TYPE = {
  label:    { fontSize: 11, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase' },
  caption:  { fontSize: 12, fontWeight: 400, lineHeight: 1.5 },
  body:     { fontSize: 13.5, fontWeight: 400, lineHeight: 1.75 }, // improved line-height for readability
  bodyLg:   { fontSize: 15, fontWeight: 400, lineHeight: 1.7 },
  subtitle: { fontSize: 16, fontWeight: 600, letterSpacing: -0.2 },
  title:    { fontSize: 22, fontWeight: 700, letterSpacing: -0.5 },
  hero:     { fontSize: 30, fontWeight: 700, letterSpacing: -0.6 },
};

const ZODIAC_SIGNS = [
  {
    name: 'Aries', symbol: '♈', dates: 'Mar 21 – Apr 19',
    cardBg: 'linear-gradient(160deg,#F5C0CC,#FAD4C0)', element: 'Fire', planet: 'Mars',
    traits: ['Bold', 'Ambitious', 'Courageous'],
    accentColor: '#E8A0B0',
    horoscope: {
      yesterday:{ love: 78, emotions: 74, mentality: 88, career: 70, loveSex: 'Yesterday\'s boldness created real sparks. A conversation you almost avoided turned into something meaningful — trust where it\'s heading.', overall: 'Strong initiative led to productive results. The confidence you showed is already opening new doors.' },
      today:    { love: 82, emotions: 67, mentality: 91, career: 75, loveSex: 'Mars, your ruling planet, ignites desire and boldness. Your passion runs high today — be direct about your feelings. It will be received exactly as intended.', overall: 'A powerful day for natural leadership. Your boldness opens doors.' },
      tomorrow: { love: 76, emotions: 88, mentality: 72, career: 85, loveSex: 'Venus softens your usual fire, creating space for deeper emotional connection. Open your heart and listen.', overall: 'Creative energy surges. Financial opportunities appear — trust your instincts.' },
      month:    { love: 79, emotions: 73, mentality: 84, career: 88, loveSex: 'April reveals hidden feelings. The full moon on the 15th illuminates what you truly desire in love.', overall: 'A transformative month. Career advancement is strongly favored — step into your power.' },
    }
  },
  {
    name: 'Taurus', symbol: '♉', dates: 'Apr 20 – May 20',
    cardBg: 'linear-gradient(160deg,#C8E6C9,#E8F5C4)', element: 'Earth', planet: 'Venus',
    traits: ['Patient', 'Reliable', 'Sensual'],
    accentColor: '#8DBE9A',
    horoscope: {
      yesterday:{ love: 84, emotions: 68, mentality: 60, career: 74, loveSex: 'Yesterday\'s Venus influence made your presence deeply felt. Someone held your warmth close and is still thinking about you.', overall: 'Your reliability proved invaluable. A careful financial decision is quietly showing its wisdom.' },
      today:    { love: 88, emotions: 72, mentality: 65, career: 79, loveSex: 'Venus blesses your relationships with warmth and sensuality. A slow, tender connection deepens beautifully today.', overall: 'Stability is your superpower. Practical decisions made today will prove wise.' },
      tomorrow: { love: 92, emotions: 80, mentality: 70, career: 74, loveSex: 'Your natural magnetism is at its peak. Someone close to you sees your beauty in a new light.', overall: 'A grounding day. Tend to home and finances with care.' },
      month:    { love: 85, emotions: 76, mentality: 68, career: 82, loveSex: 'May brings romantic warmth. Existing relationships grow stronger; single Taureans may meet someone earthy and real.', overall: 'Slow and steady wins. Financial gains emerge from patient effort.' },
    }
  },
  {
    name: 'Gemini', symbol: '♊', dates: 'May 21 – Jun 20',
    cardBg: 'linear-gradient(160deg,#C8C8F5,#D4C8F8)', element: 'Air', planet: 'Mercury',
    traits: ['Curious', 'Witty', 'Adaptable'],
    accentColor: '#8080D8',
    horoscope: {
      yesterday:{ love: 70, emotions: 78, mentality: 90, career: 68, loveSex: 'Your sharp wit opened hearts yesterday. A playful exchange turned unexpectedly deep — those conversations matter more than you know.', overall: 'Your ideas flowed freely. One connection you made will prove more valuable than it seemed.' },
      today:    { love: 74, emotions: 82, mentality: 96, career: 71, loveSex: 'Your wit and charm are irresistible today. Playful exchanges lead somewhere deeper — let conversations wander freely.', overall: 'Your mind is electric. Ideas flow fast; write everything down.' },
      tomorrow: { love: 68, emotions: 76, mentality: 88, career: 80, loveSex: 'Two sides of your nature seek harmony. Be honest with yourself about what you actually want from this connection.', overall: 'Communication is your gift today. Use it at work to shine.' },
      month:    { love: 71, emotions: 79, mentality: 92, career: 83, loveSex: 'June energizes your social world. New romantic sparks fly in intellectual settings.', overall: 'A brilliant month for networking, learning, and expression.' },
    }
  },
  {
    name: 'Cancer', symbol: '♋', dates: 'Jun 21 – Jul 22',
    cardBg: 'linear-gradient(160deg,#B8E0F5,#C8D8F8)', element: 'Water', planet: 'Moon',
    traits: ['Intuitive', 'Nurturing', 'Empathetic'],
    accentColor: '#6A9EC4',
    horoscope: {
      yesterday:{ love: 88, emotions: 90, mentality: 60, career: 65, loveSex: 'Deep emotional currents moved through your relationships. The vulnerability you showed yesterday is already drawing people closer.', overall: 'Your intuition was your guide. The small gestures of care you offered resonate longer than any grand display.' },
      today:    { love: 90, emotions: 94, mentality: 63, career: 68, loveSex: 'The Moon heightens your emotional depth. Vulnerability is your strength today — let someone truly in.', overall: 'Nurture those you love. Your intuition is a superpower right now.' },
      tomorrow: { love: 85, emotions: 87, mentality: 70, career: 72, loveSex: 'A deeply emotional day. Old feelings resurface — process them with compassion for yourself.', overall: 'Home and family matters take priority. A loving gesture carries great weight.' },
      month:    { love: 88, emotions: 91, mentality: 67, career: 73, loveSex: 'July is rich with emotional connections. Cancer season amplifies all that you feel — beautifully.', overall: 'Trust your instincts in all areas. You are more powerful than you know.' },
    }
  },
  {
    name: 'Leo', symbol: '♌', dates: 'Jul 23 – Aug 22',
    cardBg: 'linear-gradient(160deg,#FAD9B0,#F8E8B4)', element: 'Fire', planet: 'Sun',
    traits: ['Radiant', 'Generous', 'Confident'],
    accentColor: '#D4A050',
    horoscope: {
      yesterday:{ love: 82, emotions: 68, mentality: 76, career: 90, loveSex: 'Your magnetism was undeniable yesterday. Someone is still thinking about your presence long after you left the room.', overall: 'Leadership came naturally. A confident decision you made is already showing its first promising signs.' },
      today:    { love: 86, emotions: 70, mentality: 78, career: 93, loveSex: 'Your radiant energy is impossible to ignore. Love gravitates toward you — accept adoration graciously.', overall: 'You are in your element. Leadership opportunities arise; take center stage.' },
      tomorrow: { love: 80, emotions: 74, mentality: 82, career: 88, loveSex: 'Someone admires your confidence from afar. Your warmth makes everyone around you glow.', overall: 'Creative projects shine. Your vision inspires the team.' },
      month:    { love: 83, emotions: 72, mentality: 80, career: 90, loveSex: 'August amplifies Leo energy. Romance is theatrical and passionate — exactly how you like it.', overall: 'A triumphant month. Pursue recognition — you have earned it.' },
    }
  },
  {
    name: 'Virgo', symbol: '♍', dates: 'Aug 23 – Sep 22',
    cardBg: 'linear-gradient(160deg,#D4C4E8,#E4D0F4)', element: 'Earth', planet: 'Mercury',
    traits: ['Analytical', 'Precise', 'Devoted'],
    accentColor: '#9070C0',
    horoscope: {
      yesterday:{ love: 68, emotions: 74, mentality: 90, career: 84, loveSex: 'Your thoughtful attention was deeply felt. A careful observation you made about someone strengthened a bond that needed it.', overall: 'Your methodical approach solved a problem others overlooked. Your precision is your signature.' },
      today:    { love: 71, emotions: 76, mentality: 94, career: 87, loveSex: 'Analytical and tender in equal measure. Your careful attention to detail touches your partner deeply today.', overall: 'Your eye for precision is your gift. Tackle complex problems with ease.' },
      tomorrow: { love: 65, emotions: 80, mentality: 90, career: 82, loveSex: 'Practice letting love be imperfect — its beauty lives in the small, genuine moments.', overall: 'A productive day. Systems you put in place now pay off greatly.' },
      month:    { love: 68, emotions: 78, mentality: 92, career: 85, loveSex: 'September invites Virgo to soften. Relationships improve when you release the need to fix everything.', overall: 'Methodical effort yields significant results. Health routines take root.' },
    }
  },
  {
    name: 'Libra', symbol: '♎', dates: 'Sep 23 – Oct 22',
    cardBg: 'linear-gradient(160deg,#F0C8D8,#F8D4E8)', element: 'Air', planet: 'Venus',
    traits: ['Harmonious', 'Charming', 'Fair-minded'],
    accentColor: '#D080A8',
    horoscope: {
      yesterday:{ love: 85, emotions: 76, mentality: 78, career: 68, loveSex: 'Your gentle diplomacy smoothed over tensions. Your grace in a difficult conversation left everyone feeling seen and respected.', overall: 'Balance was your gift yesterday. A fair-minded decision you made is quietly earning you trust.' },
      today:    { love: 89, emotions: 78, mentality: 81, career: 70, loveSex: 'Venus in your sign makes you irresistible. Harmony in relationships flows effortlessly — embrace it.', overall: 'Balance is your art. Difficult decisions become clear when you trust your sense of fairness.' },
      tomorrow: { love: 83, emotions: 82, mentality: 76, career: 74, loveSex: 'A day for beauty and connection. Surround yourself with loveliness and let love find you.', overall: 'Collaboration over competition. Joint efforts are highly favored.' },
      month:    { love: 86, emotions: 80, mentality: 79, career: 72, loveSex: 'October brings romantic harmony. Libra season amplifies your natural grace in love.', overall: 'A month of beautiful balance. Art, relationships, and negotiation flourish.' },
    }
  },
  {
    name: 'Scorpio', symbol: '♏', dates: 'Oct 23 – Nov 21',
    cardBg: 'linear-gradient(160deg,#2A1A4E,#3D1A5E)', element: 'Water', planet: 'Pluto',
    traits: ['Intense', 'Perceptive', 'Magnetic'],
    accentColor: '#8B4AC8',
    figureLight: true,
    horoscope: {
      yesterday:{ love: 87, emotions: 80, mentality: 86, career: 76, loveSex: 'Depth was everything yesterday. A moment of raw honesty shattered the usual surface-level exchanges — that connection is now irrevocably real.', overall: 'Your perception cut through the noise. A truth you uncovered is still reshaping the way you see things.' },
      today:    { love: 91, emotions: 84, mentality: 88, career: 79, loveSex: 'Intensity is your love language. Today, desire runs deep and transformative. Let yourself be seen completely.', overall: 'Your intuition pierces through illusion. Trust what you feel beneath the surface.' },
      tomorrow: { love: 87, emotions: 78, mentality: 85, career: 83, loveSex: 'Power dynamics in relationships become clear. Authentic vulnerability creates the deepest bond.', overall: 'Secrets come to light. Your perception gives you a significant advantage.' },
      month:    { love: 89, emotions: 81, mentality: 86, career: 81, loveSex: 'November is magnetic and intense. Scorpio season fuels transformation in all relationships.', overall: 'A month of profound change. Shed what no longer serves you — rebirth awaits.' },
    }
  },
  {
    name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21',
    cardBg: 'linear-gradient(160deg,#F5E4B8,#FAF0C4)', element: 'Fire', planet: 'Jupiter',
    traits: ['Optimistic', 'Adventurous', 'Philosophical'],
    accentColor: '#C0900A',
    horoscope: {
      yesterday:{ love: 74, emotions: 62, mentality: 86, career: 80, loveSex: 'An unexpected adventure sparked a genuine connection. The story you two shared yesterday is already becoming something worth remembering.', overall: 'Your optimism was infectious. An opportunity you pursued boldly is beginning to open its door.' },
      today:    { love: 77, emotions: 65, mentality: 88, career: 84, loveSex: 'Freedom and adventure are your love languages. Invite your partner into an experience, not just a conversation.', overall: 'Your optimism is contagious. Expand your horizons — the universe rewards boldness.' },
      tomorrow: { love: 72, emotions: 70, mentality: 92, career: 80, loveSex: 'Philosophical discussions spark connection. Someone who matches your mind also captures your heart.', overall: 'Travel, learning, and new perspectives are favored. Say yes to the unexpected.' },
      month:    { love: 75, emotions: 68, mentality: 90, career: 86, loveSex: 'December invites depth beneath your usual freedom-seeking. Let love surprise you.', overall: 'A month of expansion. Jupiter blesses all you reach toward.' },
    }
  },
  {
    name: 'Capricorn', symbol: '♑', dates: 'Dec 22 – Jan 19',
    cardBg: 'linear-gradient(160deg,#C0D4E8,#D0E0F0)', element: 'Earth', planet: 'Saturn',
    traits: ['Disciplined', 'Patient', 'Ambitious'],
    accentColor: '#5080A8',
    horoscope: {
      yesterday:{ love: 66, emotions: 60, mentality: 84, career: 93, loveSex: 'A quiet act of devotion spoke louder than words yesterday. The consistency you showed is being noticed more than you realize.', overall: 'Disciplined effort produced real progress. The foundation you\'re building is proving more solid each day.' },
      today:    { love: 68, emotions: 62, mentality: 87, career: 96, loveSex: 'Practical and devoted, your love is shown through action. A small, reliable gesture matters more than grand words.', overall: 'Saturn rewards your discipline today. Ambitious goals feel within reach.' },
      tomorrow: { love: 72, emotions: 68, mentality: 84, career: 92, loveSex: 'Allow yourself to be vulnerable. Behind your strong exterior is a tender heart that deserves to be cherished.', overall: 'Strategy and patience are your allies. Long-term plans crystallize.' },
      month:    { love: 70, emotions: 65, mentality: 85, career: 94, loveSex: 'January brings steady, grounding love. Committed relationships deepen through shared goals.', overall: 'A highly productive month. Every brick you lay now forms a lasting foundation.' },
    }
  },
  {
    name: 'Aquarius', symbol: '♒', dates: 'Jan 20 – Feb 18',
    cardBg: 'linear-gradient(160deg,#B8E8F4,#C4D8F8)', element: 'Air', planet: 'Uranus',
    traits: ['Visionary', 'Original', 'Humanitarian'],
    accentColor: '#40A0C8',
    horoscope: {
      yesterday:{ love: 71, emotions: 68, mentality: 94, career: 78, loveSex: 'Your originality was magnetic yesterday. Someone was drawn to your perspective in a way they couldn\'t quite explain — lean into that energy.', overall: 'An unconventional idea you shared is already taking root. Innovation is its own reward.' },
      today:    { love: 74, emotions: 70, mentality: 97, career: 82, loveSex: 'Unconventional and brilliant, your unique approach to love is exactly what someone needs today. Be authentically you.', overall: 'Your visionary ideas are ready for the world. Innovation is your superpower.' },
      tomorrow: { love: 70, emotions: 75, mentality: 93, career: 78, loveSex: 'Friendship transforms into something more. Intellectual equals make the most enduring partners for you.', overall: 'Collective efforts benefit from your leadership. Think big and act boldly.' },
      month:    { love: 72, emotions: 73, mentality: 95, career: 80, loveSex: 'February sparks unexpected connections. Aquarius season makes your originality powerfully attractive.', overall: 'A month for revolutionary ideas. You are ahead of your time — let the world catch up.' },
    }
  },
  {
    name: 'Pisces', symbol: '♓', dates: 'Feb 19 – Mar 20',
    cardBg: 'linear-gradient(160deg,#F0C4D8,#E8C8F0)', element: 'Water', planet: 'Neptune',
    traits: ['Empathetic', 'Artistic', 'Dreamy'],
    accentColor: '#B870C8',
    horoscope: {
      yesterday:{ love: 90, emotions: 94, mentality: 66, career: 62, loveSex: 'Your compassion flowed effortlessly yesterday. A moment of pure empathy you offered is still echoing in someone\'s heart today.', overall: 'Your intuition guided every step. The creative current you followed is leading somewhere truly beautiful.' },
      today:    { love: 93, emotions: 96, mentality: 68, career: 65, loveSex: 'Neptune opens your heart to boundless compassion. Love flows through you like a river — let it carry both of you somewhere beautiful.', overall: 'Your intuition is at its most powerful. Art, dreams, and spiritual insights abound.' },
      tomorrow: { love: 88, emotions: 90, mentality: 72, career: 70, loveSex: 'A deeply romantic day. The smallest act of tenderness means everything under these stars.', overall: 'Surrender to the creative flow. What you make now will move others.' },
      month:    { love: 91, emotions: 93, mentality: 70, career: 68, loveSex: 'March is your season. Love in Pisces is transcendent, spiritual, and utterly beautiful.', overall: 'A magical month. Dreams become reality when you trust the invisible currents.' },
    }
  },
];

const COMPATIBILITY_DATA = {
  Aries:   { Aries: 72, Taurus: 58, Gemini: 85, Cancer: 50, Leo: 92, Virgo: 45, Libra: 68, Scorpio: 62, Sagittarius: 90, Capricorn: 48, Aquarius: 74, Pisces: 60 },
  Taurus:  { Aries: 58, Taurus: 80, Gemini: 55, Cancer: 88, Leo: 60, Virgo: 92, Libra: 74, Scorpio: 85, Sagittarius: 50, Capricorn: 90, Aquarius: 52, Pisces: 84 },
  Gemini:  { Aries: 85, Taurus: 55, Gemini: 70, Cancer: 60, Leo: 82, Virgo: 78, Libra: 92, Scorpio: 48, Sagittarius: 86, Capricorn: 55, Aquarius: 90, Pisces: 62 },
  Cancer:  { Aries: 50, Taurus: 88, Gemini: 60, Cancer: 78, Leo: 55, Virgo: 80, Libra: 65, Scorpio: 94, Sagittarius: 48, Capricorn: 76, Aquarius: 50, Pisces: 92 },
  Leo:     { Aries: 92, Taurus: 60, Gemini: 82, Cancer: 55, Leo: 74, Virgo: 62, Libra: 86, Scorpio: 65, Sagittarius: 90, Capricorn: 50, Aquarius: 76, Pisces: 58 },
  Virgo:   { Aries: 45, Taurus: 92, Gemini: 78, Cancer: 80, Leo: 62, Virgo: 72, Libra: 70, Scorpio: 82, Sagittarius: 55, Capricorn: 90, Aquarius: 68, Pisces: 76 },
  Libra:   { Aries: 68, Taurus: 74, Gemini: 92, Cancer: 65, Leo: 86, Virgo: 70, Libra: 76, Scorpio: 60, Sagittarius: 84, Capricorn: 65, Aquarius: 88, Pisces: 68 },
  Scorpio: { Aries: 62, Taurus: 85, Gemini: 48, Cancer: 94, Leo: 65, Virgo: 82, Libra: 60, Scorpio: 78, Sagittarius: 55, Capricorn: 84, Aquarius: 58, Pisces: 90 },
  Sagittarius: { Aries: 90, Taurus: 50, Gemini: 86, Cancer: 48, Leo: 90, Virgo: 55, Libra: 84, Scorpio: 55, Sagittarius: 76, Capricorn: 52, Aquarius: 88, Pisces: 62 },
  Capricorn: { Aries: 48, Taurus: 90, Gemini: 55, Cancer: 76, Leo: 50, Virgo: 90, Libra: 65, Scorpio: 84, Sagittarius: 52, Capricorn: 80, Aquarius: 72, Pisces: 78 },
  Aquarius: { Aries: 74, Taurus: 52, Gemini: 90, Cancer: 50, Leo: 76, Virgo: 68, Libra: 88, Scorpio: 58, Sagittarius: 88, Capricorn: 72, Aquarius: 78, Pisces: 65 },
  Pisces:  { Aries: 60, Taurus: 84, Gemini: 62, Cancer: 92, Leo: 58, Virgo: 76, Libra: 68, Scorpio: 90, Sagittarius: 62, Capricorn: 78, Aquarius: 65, Pisces: 82 },
};

Object.assign(window, { ZODIAC_SIGNS, COMPATIBILITY_DATA, PALETTE, SPACING, TYPE });
