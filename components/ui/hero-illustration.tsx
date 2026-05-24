"use client";

/** Lifestyle hero illustration — property owner relaxing, properties handled. */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 620 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full"
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8DCF5" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#EEF4FB" stopOpacity="0.08" />
        </linearGradient>
        {/* Patio floor */}
        <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DDE6F0" />
          <stop offset="100%" stopColor="#C8D6E8" />
        </linearGradient>
        {/* Chair seat */}
        <linearGradient id="gChair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4A7EC0" />
          <stop offset="100%" stopColor="#2B5FA0" />
        </linearGradient>
        {/* Subtle glow */}
        <filter id="fBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        {/* Card drop shadow */}
        <filter id="fCard" x="-15%" y="-15%" width="130%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#0F2040" floodOpacity="0.07" />
        </filter>
        {/* Chair/person shadow */}
        <filter id="fScene" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#1B4080" floodOpacity="0.14" />
        </filter>
      </defs>

      {/* ── ATMOSPHERE ── */}
      <rect width="620" height="500" fill="url(#gSky)" />
      {/* Sun warmth glow */}
      <circle cx="560" cy="65" r="85" fill="#FEF3C7" opacity="0.45" filter="url(#fBlur)" />
      <circle cx="560" cy="65" r="46" fill="#FDE68A" opacity="0.22" />
      {/* Ambient haze behind buildings */}
      <ellipse cx="160" cy="300" rx="180" ry="220" fill="#D0E4F5" opacity="0.22" filter="url(#fBlur)" />

      {/* ── BACKGROUND BUILDINGS (wireframe, distant) ── */}
      {/* B1 */}
      <rect x="18" y="145" width="48" height="235" rx="3" fill="#EEF4FB" stroke="#BFCFE8" strokeWidth="1.5" />
      <rect x="28" y="160" width="12" height="9" rx="2" fill="#8AB4D8" opacity="0.5" />
      <rect x="46" y="160" width="12" height="9" rx="2" fill="#C8DCF5" opacity="0.45" />
      <rect x="28" y="179" width="12" height="9" rx="2" fill="#C8DCF5" opacity="0.38" />
      <rect x="46" y="179" width="12" height="9" rx="2" fill="#8AB4D8" opacity="0.45" />
      <rect x="28" y="198" width="12" height="9" rx="2" fill="#C8DCF5" opacity="0.3" />
      <rect x="46" y="198" width="12" height="9" rx="2" fill="#C8DCF5" opacity="0.3" />
      {/* B2 */}
      <rect x="80" y="105" width="65" height="275" rx="3" fill="#EEF4FB" stroke="#BFCFE8" strokeWidth="1.5" />
      <rect x="92" y="120" width="14" height="10" rx="2" fill="#8AB4D8" opacity="0.48" />
      <rect x="112" y="120" width="14" height="10" rx="2" fill="#C8DCF5" opacity="0.4" />
      <rect x="92" y="140" width="14" height="10" rx="2" fill="#C8DCF5" opacity="0.38" />
      <rect x="112" y="140" width="14" height="10" rx="2" fill="#8AB4D8" opacity="0.48" />
      <rect x="92" y="160" width="14" height="10" rx="2" fill="#C8DCF5" opacity="0.32" />
      <rect x="112" y="160" width="14" height="10" rx="2" fill="#C8DCF5" opacity="0.32" />
      <rect x="92" y="180" width="14" height="10" rx="2" fill="#8AB4D8" opacity="0.35" />
      <rect x="112" y="180" width="14" height="10" rx="2" fill="#C8DCF5" opacity="0.28" />
      {/* B3 — tallest */}
      <rect x="160" y="78" width="58" height="302" rx="3" fill="#EEF4FB" stroke="#BFCFE8" strokeWidth="1.5" />
      <rect x="171" y="94" width="13" height="10" rx="2" fill="#8AB4D8" opacity="0.48" />
      <rect x="190" y="94" width="13" height="10" rx="2" fill="#C8DCF5" opacity="0.4" />
      <rect x="171" y="114" width="13" height="10" rx="2" fill="#C8DCF5" opacity="0.38" />
      <rect x="190" y="114" width="13" height="10" rx="2" fill="#8AB4D8" opacity="0.45" />
      <rect x="171" y="134" width="13" height="10" rx="2" fill="#C8DCF5" opacity="0.3" />
      <rect x="190" y="134" width="13" height="10" rx="2" fill="#C8DCF5" opacity="0.3" />
      <rect x="171" y="154" width="13" height="10" rx="2" fill="#8AB4D8" opacity="0.32" />
      <rect x="190" y="154" width="13" height="10" rx="2" fill="#C8DCF5" opacity="0.28" />

      {/* ── ROOFTOP PATIO ── */}
      <rect x="0" y="392" width="620" height="108" fill="url(#gFloor)" opacity="0.52" />
      <line x1="0" y1="392" x2="620" y2="392" stroke="#A0B8D0" strokeWidth="1" opacity="0.35" />
      {/* Railing bar */}
      <rect x="0" y="385" width="620" height="8" rx="4" fill="#96AFC8" opacity="0.38" />
      {/* Balusters */}
      {Array.from({ length: 23 }, (_, i) => (
        <rect key={i} x={7 + i * 27} y={385} width="3" height="52" rx="1.5" fill="#96AFC8" opacity="0.16" />
      ))}

      {/* ── LEFT PLANT ── */}
      <rect x="36" y="400" width="38" height="48" rx="5" fill="#A16207" opacity="0.52" />
      <ellipse cx="55" cy="399" rx="21" ry="7" fill="#92400E" opacity="0.46" />
      <ellipse cx="55" cy="367" rx="21" ry="33" fill="#22C55E" opacity="0.6" transform="rotate(-9 55 367)" />
      <ellipse cx="71" cy="372" rx="16" ry="25" fill="#16A34A" opacity="0.5" transform="rotate(13 71 372)" />
      <ellipse cx="39" cy="374" rx="14" ry="21" fill="#15803D" opacity="0.4" transform="rotate(-19 39 374)" />
      <line x1="55" y1="398" x2="55" y2="369" stroke="#166534" strokeWidth="1.5" opacity="0.32" />

      {/* ── LOUNGE CHAIR ── */}
      {/* Ground shadow */}
      <ellipse cx="370" cy="435" rx="125" ry="11" fill="#1B4080" opacity="0.09" filter="url(#fBlur)" />
      {/* Legs */}
      <rect x="260" y="420" width="11" height="22" rx="4" fill="#1B3A72" opacity="0.6" />
      <rect x="458" y="420" width="11" height="22" rx="4" fill="#1B3A72" opacity="0.6" />
      {/* Seat */}
      <rect x="246" y="372" width="228" height="54" rx="15" fill="url(#gChair)" filter="url(#fScene)" />
      {/* Seat highlight */}
      <rect x="258" y="378" width="206" height="17" rx="7" fill="white" opacity="0.1" />
      {/* Backrest */}
      <rect x="432" y="305" width="46" height="92" rx="13" fill="#3568A8" transform="rotate(-13 455 351)" filter="url(#fScene)" />
      <rect x="439" y="313" width="30" height="19" rx="6" fill="white" opacity="0.09" transform="rotate(-13 455 351)" />
      {/* Left armrest */}
      <rect x="238" y="362" width="19" height="50" rx="8" fill="#2B5FAA" opacity="0.92" />

      {/* ── PERSON (reclining, relaxed) ── */}
      {/* Legs */}
      <rect x="254" y="382" width="148" height="25" rx="12" fill="#FDBA74" opacity="0.9" />
      {/* Shoes */}
      <ellipse cx="263" cy="394" rx="15" ry="10" fill="#FDE68A" opacity="0.78" />
      {/* Body / torso — light-blue shirt */}
      <ellipse cx="426" cy="375" rx="42" ry="27" fill="#BFDBFE" opacity="0.95" />
      <ellipse cx="426" cy="378" rx="30" ry="18" fill="#93C5FD" opacity="0.4" />
      {/* Head */}
      <circle cx="481" cy="340" r="29" fill="#FDBA74" opacity="0.94" />
      {/* Hair */}
      <ellipse cx="481" cy="320" rx="27" ry="13.5" fill="#78350F" opacity="0.7" />
      {/* Sunglasses — key "relaxed" signal */}
      <rect x="466" y="336" width="14" height="9" rx="4.5" fill="#1E293B" opacity="0.78" />
      <rect x="483" y="336" width="14" height="9" rx="4.5" fill="#1E293B" opacity="0.78" />
      <line x1="480" y1="340" x2="483" y2="340" stroke="#1E293B" strokeWidth="2" opacity="0.78" />
      <line x1="465" y1="340" x2="466" y2="340" stroke="#1E293B" strokeWidth="2" opacity="0.5" />
      <line x1="497" y1="340" x2="498" y2="340" stroke="#1E293B" strokeWidth="2" opacity="0.5" />
      {/* Smile */}
      <path d="M 470 354 Q 481 362 491 354" stroke="#A16207" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* Arm holding phone */}
      <ellipse cx="456" cy="355" rx="30" ry="12" fill="#FDBA74" opacity="0.85" transform="rotate(-28 456 355)" />

      {/* ── PHONE WITH DASHBOARD ── */}
      <rect x="462" y="278" width="55" height="78" rx="9" fill="white" filter="url(#fCard)" opacity="0.97" />
      <rect x="462" y="278" width="55" height="78" rx="9" stroke="#DDE6F0" strokeWidth="1" />
      {/* Notch */}
      <rect x="481" y="280" width="17" height="3.5" rx="1.75" fill="#DDE6F0" />
      {/* App header bar */}
      <rect x="469" y="290" width="41" height="5" rx="2.5" fill="#C8DCF5" />
      <rect x="469" y="299" width="28" height="3.5" rx="1.75" fill="#E8EFF7" />
      {/* Check items */}
      <circle cx="474" cy="312" r="5" fill="#86EFAC" />
      <path d="M472 312 L474 314.5 L477.5 309.5" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="483" y="309" width="28" height="4" rx="2" fill="#DCFCE7" />
      <circle cx="474" cy="325" r="5" fill="#86EFAC" />
      <path d="M472 325 L474 327.5 L477.5 322.5" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="483" y="322" width="24" height="4" rx="2" fill="#DCFCE7" />
      <circle cx="474" cy="338" r="5" fill="#86EFAC" />
      <path d="M472 338 L474 340.5 L477.5 335.5" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="483" y="335" width="26" height="4" rx="2" fill="#DCFCE7" />

      {/* ── COFFEE CUP (on armrest) ── */}
      <rect x="230" y="354" width="23" height="26" rx="5" fill="white" opacity="0.93" stroke="#DDE6F0" strokeWidth="1" />
      <path d="M 253 364 Q 260 364 260 371 Q 260 378 253 378" stroke="#DDE6F0" strokeWidth="1.5" fill="none" />
      <rect x="232" y="358" width="19" height="7" rx="2.5" fill="#F9A8D4" opacity="0.5" />
      {/* Steam wisps */}
      <path d="M 237 352 Q 239 345 237 338" stroke="#96AFC8" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.38" />
      <path d="M 243 350 Q 245 342 243 335" stroke="#96AFC8" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.28" />

      {/* ── FLOATING CARD 1 — Repair ticket resolved (top-left) ── */}
      <rect x="22" y="24" width="156" height="76" rx="14" fill="white" filter="url(#fCard)" opacity="0.97" />
      <rect x="22" y="24" width="156" height="76" rx="14" stroke="#DDE6F0" strokeWidth="1" />
      <circle cx="46" cy="52" r="15" fill="#DBEAFE" />
      <path d="M 39 52 L 43 56 L 54 45" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="68" y="45" width="96" height="5" rx="2.5" fill="#1E2A3A" opacity="0.72" />
      <rect x="68" y="55" width="74" height="4" rx="2" fill="#96AFC8" opacity="0.58" />
      <rect x="32" y="76" width="128" height="17" rx="8.5" fill="#DBEAFE" />
      <text x="96" y="88" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#2B5FAA" fontFamily="system-ui,sans-serif">Repair ticket resolved ✓</text>

      {/* ── FLOATING CARD 2 — All clear (top-right) ── */}
      <rect x="396" y="108" width="198" height="76" rx="14" fill="white" filter="url(#fCard)" opacity="0.97" />
      <rect x="396" y="108" width="198" height="76" rx="14" stroke="#DDE6F0" strokeWidth="1" />
      <circle cx="420" cy="136" r="15" fill="#D1FAE5" />
      <path d="M 413 136 L 417 140 L 428 128" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="442" y="129" width="138" height="5" rx="2.5" fill="#1E2A3A" opacity="0.72" />
      <rect x="442" y="139" width="108" height="4" rx="2" fill="#96AFC8" opacity="0.55" />
      <rect x="406" y="158" width="174" height="17" rx="8.5" fill="#D1FAE5" />
      <text x="493" y="170" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#166534" fontFamily="system-ui,sans-serif">2 properties · All clear</text>

      {/* ── FLOATING CARD 3 — Monthly expenses (right-mid) ── */}
      <rect x="396" y="204" width="158" height="76" rx="14" fill="white" filter="url(#fCard)" opacity="0.96" />
      <rect x="396" y="204" width="158" height="76" rx="14" stroke="#DDE6F0" strokeWidth="1" />
      <rect x="411" y="219" width="128" height="4" rx="2" fill="#96AFC8" opacity="0.44" />
      <text x="411" y="248" fontSize="22" fontWeight="700" fill="#0F1E2E" fontFamily="system-ui,sans-serif">$4,820</text>
      <rect x="411" y="256" width="128" height="15" rx="7.5" fill="#FEF3C7" />
      <text x="475" y="267" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#B45309" fontFamily="system-ui,sans-serif">Expenses logged · On track</text>

      {/* ── RIGHT PLANT ── */}
      <rect x="544" y="397" width="36" height="46" rx="5" fill="#A16207" opacity="0.48" />
      <ellipse cx="562" cy="396" rx="20" ry="6.5" fill="#92400E" opacity="0.43" />
      <ellipse cx="562" cy="367" rx="19" ry="29" fill="#22C55E" opacity="0.56" />
      <ellipse cx="575" cy="372" rx="14" ry="22" fill="#16A34A" opacity="0.46" transform="rotate(13 575 372)" />
      <ellipse cx="549" cy="374" rx="13" ry="19" fill="#15803D" opacity="0.37" transform="rotate(-16 549 374)" />
    </svg>
  );
}
