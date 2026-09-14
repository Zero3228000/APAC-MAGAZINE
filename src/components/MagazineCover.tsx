import React from 'react';

interface MagazineCoverProps {
  showSafeMargins?: boolean;
}

export const MagazineCover: React.FC<MagazineCoverProps> = ({ showSafeMargins = false }) => {
  return (
    <div className="relative w-full h-full bg-[#fdfdfd] text-[#0c1f38] flex flex-col justify-between p-6 sm:p-8 select-none overflow-hidden shadow-inner">
      {/* Print Safe Margins Overlay (toggleable for print proofing) */}
      {showSafeMargins && (
        <div className="absolute inset-4 border border-dashed border-red-400 pointer-events-none z-30 opacity-70">
          <span className="absolute top-1 left-2 text-[9px] font-mono text-red-600 bg-white/90 px-1 rounded">
            Safe Margin (0.25in / 6mm)
          </span>
        </div>
      )}

      {/* Top Header Row with Logo & Organization Title */}
      <div className="relative z-10 w-full pt-1">
        <div className="flex items-center gap-3 sm:gap-4 border-b border-neutral-200 pb-3">
          {/* Official Crest Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              <defs>
                <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              {/* Outer laurel wreath */}
              <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="41" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
              
              {/* Crossed Flags mini vector */}
              <path d="M30 24 L50 42 M70 24 L50 42" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              
              {/* Shield Center */}
              <path d="M35 34 H65 V58 Q65 72 50 80 Q35 72 35 58 Z" fill="url(#crestGold)" />
              
              {/* Shield Text: AP AC */}
              <text x="50" y="47" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">AP</text>
              <text x="50" y="60" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">AC</text>
              
              {/* Banner at bottom */}
              <path d="M22 80 Q50 75 78 80 L82 87 Q50 82 18 87 Z" fill="#b91c1c" />
              <text x="50" y="85" fill="#ffffff" fontSize="5.5" fontWeight="600" textAnchor="middle">UNITY • FAITH • DISCIPLINE</text>
            </svg>
          </div>

          {/* Red separator line */}
          <div className="w-0.5 h-12 bg-red-700 shrink-0" />

          {/* Organization Title */}
          <div>
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-tight text-[#0a192f] uppercase leading-tight font-display">
              All Pakistani American Coalition
            </h1>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase mt-0.5">
              Organization Magazine
            </p>
          </div>
        </div>

        {/* Big Editorial Headline */}
        <div className="mt-5 sm:mt-7 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] leading-[1.08] tracking-tight font-display">
            Rooted in heritage.<br />
            <span className="text-[#0a192f]">United for tomorrow.</span>
          </h2>

          <div className="flex items-center gap-3 mt-3 sm:mt-4">
            <div className="w-12 sm:w-16 h-0.5 bg-red-600" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#0f2849] uppercase">
              Connecting Communities
            </span>
          </div>
        </div>

        {/* Crossed Flags Display */}
        <div className="flex items-center justify-center gap-3 mt-3 sm:mt-4">
          {/* Pakistan Flag */}
          <div className="w-10 sm:w-12 h-6 sm:h-7 rounded border border-neutral-300 overflow-hidden shadow-xs relative bg-[#01411C]">
            <div className="absolute top-0 bottom-0 left-0 w-1/4 bg-white" />
            {/* Crescent and Star */}
            <div className="absolute inset-0 flex items-center justify-center pl-2">
              <svg viewBox="0 0 40 30" className="w-4 h-4 text-white fill-current">
                <circle cx="20" cy="15" r="7" />
                <circle cx="22" cy="14" r="6" fill="#01411C" />
                <polygon points="23,9 24,12 27,12 25,14 26,17 23,15 20,17 21,14 19,12 22,12" />
              </svg>
            </div>
          </div>

          {/* USA Flag */}
          <div className="w-10 sm:w-12 h-6 sm:h-7 rounded border border-neutral-300 overflow-hidden shadow-xs relative bg-white flex flex-col">
            {/* 13 Stripes */}
            <div className="h-[2px] bg-red-600" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-red-600" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-red-600" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-red-600" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-red-600" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-red-600" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-red-600" />
            {/* Canton with Blue */}
            <div className="absolute top-0 left-0 w-5 h-4 bg-[#0A3161] flex items-center justify-center">
              <div className="w-3 h-2 text-[5px] text-white leading-none tracking-tighter">
                ★★★★
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Illustrated Landscape Spread Artwork */}
      <div className="relative w-full my-2 flex-1 max-h-[46%] rounded-lg overflow-hidden border border-neutral-200/80 shadow-sm bg-linear-to-b from-sky-50 via-sky-100 to-amber-50">
        {/* Sky with soft clouds and sun */}
        <div className="absolute inset-0 bg-linear-to-b from-sky-200/60 via-sky-100/40 to-white/20" />
        
        {/* Sky background illustration */}
        <svg viewBox="0 0 600 380" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="60%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#fef3c7" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="35%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="monumentStone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="600" height="380" fill="url(#skyGrad)" />

          {/* Far Mountains/Hills */}
          <path d="M0 240 Q150 200 300 235 T600 220 L600 260 L0 260 Z" fill="#cbd5e1" opacity="0.4" />

          {/* Left Side: Minar-e-Pakistan & Faisal Mosque */}
          {/* Minar-e-Pakistan */}
          <g transform="translate(65, 55)">
            {/* Tower Spire */}
            <path d="M25 10 L28 100 L32 180 L20 180 L23 100 Z" fill="url(#monumentStone)" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="26" y1="0" x2="26" y2="15" stroke="#475569" strokeWidth="1.5" />
            {/* Balconies */}
            <rect x="22" y="70" width="8" height="3" fill="#64748b" rx="1" />
            <rect x="20" y="115" width="12" height="3.5" fill="#64748b" rx="1" />
            <rect x="18" y="150" width="16" height="4" fill="#64748b" rx="1" />
            {/* Petal Base of Minar-e-Pakistan */}
            <path d="M5 190 C12 175 18 160 26 160 C34 160 40 175 47 190 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
            <path d="M-2 195 C8 178 18 160 26 160 C34 160 44 178 54 195 Z" fill="none" stroke="#64748b" strokeWidth="1" />
            <rect x="-8" y="195" width="68" height="15" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" rx="2" />
          </g>

          {/* Faisal Mosque on Left-Center */}
          <g transform="translate(135, 120)">
            {/* Main Tent-shaped prayer hall */}
            <polygon points="55,20 10,95 100,95" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
            <polygon points="55,20 35,95 75,95" fill="#ffffff" opacity="0.6" />
            {/* Crescent on top */}
            <circle cx="55" cy="16" r="3" fill="none" stroke="#eab308" strokeWidth="1" />
            {/* 4 Turkish-style thin minarets */}
            <line x1="12" y1="2" x2="12" y2="95" stroke="#e2e8f0" strokeWidth="3" />
            <polygon points="12,-8 10,2 14,2" fill="#64748b" />
            <line x1="98" y1="2" x2="98" y2="95" stroke="#e2e8f0" strokeWidth="3" />
            <polygon points="98,-8 96,2 100,2" fill="#64748b" />
            <line x1="28" y1="18" x2="28" y2="95" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="82" y1="18" x2="82" y2="95" stroke="#cbd5e1" strokeWidth="2.5" />
          </g>

          {/* Right Side: Statue of Liberty & US Capitol */}
          {/* US Capitol Dome */}
          <g transform="translate(460, 115)">
            {/* Capitol Dome Top Lantern & Statue of Freedom */}
            <line x1="60" y1="10" x2="60" y2="25" stroke="#475569" strokeWidth="1.5" />
            <path d="M54 25 C54 20 66 20 66 25 Z" fill="#64748b" />
            {/* Dome curve */}
            <path d="M30 65 C30 35 90 35 90 65 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" />
            {/* Pillars ring */}
            <rect x="25" y="65" width="70" height="18" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
            <line x1="35" y1="65" x2="35" y2="83" stroke="#64748b" strokeWidth="1.5" />
            <line x1="45" y1="65" x2="45" y2="83" stroke="#64748b" strokeWidth="1.5" />
            <line x1="55" y1="65" x2="55" y2="83" stroke="#64748b" strokeWidth="1.5" />
            <line x1="65" y1="65" x2="65" y2="83" stroke="#64748b" strokeWidth="1.5" />
            <line x1="75" y1="65" x2="75" y2="83" stroke="#64748b" strokeWidth="1.5" />
            <line x1="85" y1="65" x2="85" y2="83" stroke="#64748b" strokeWidth="1.5" />
            {/* Capitol Base Wings */}
            <rect x="0" y="83" width="120" height="35" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
            <polygon points="60,78 40,84 80,84" fill="#cbd5e1" />
          </g>

          {/* Statue of Liberty */}
          <g transform="translate(405, 80)">
            {/* Copper patina green color: #2dd4bf / #0d9488 */}
            {/* Pedestal */}
            <rect x="24" y="115" width="28" height="40" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
            <polygon points="20,155 56,155 60,165 16,165" fill="#64748b" />
            {/* Lady Liberty Body */}
            <path d="M30 65 Q38 45 46 65 L44 115 L32 115 Z" fill="#14b8a6" stroke="#0f766e" strokeWidth="1" />
            {/* Robe folds */}
            <path d="M35 70 Q40 90 36 115 M41 72 Q43 95 41 115" stroke="#0d9488" strokeWidth="0.8" fill="none" />
            {/* Head & Crown */}
            <circle cx="38" cy="40" r="5" fill="#2dd4bf" />
            {/* Crown spikes */}
            <polygon points="34,36 32,32 35,35" fill="#14b8a6" />
            <polygon points="37,35 38,30 39,35" fill="#14b8a6" />
            <polygon points="41,35 44,32 42,36" fill="#14b8a6" />
            {/* Raised Torch Arm */}
            <path d="M43 45 L50 25 L53 27 L46 48 Z" fill="#14b8a6" stroke="#0f766e" strokeWidth="0.8" />
            {/* Torch flame (Gold/amber) */}
            <circle cx="51" cy="22" r="3" fill="#f59e0b" />
            <path d="M51 22 Q52 16 54 18 Q55 22 51 22 Z" fill="#ef4444" />
            {/* Tablet in left hand */}
            <rect x="29" y="58" width="6" height="10" fill="#f0fdfa" stroke="#0f766e" strokeWidth="0.6" transform="rotate(-15 29 58)" />
          </g>

          {/* Lush Green Trees and foliage on banks */}
          <path d="M0 245 Q40 225 90 235 Q140 220 200 240 Q260 230 300 245 Q350 225 420 240 Q490 220 550 235 Q580 230 600 245 L600 270 L0 270 Z" fill="#15803d" />
          <path d="M30 240 Q60 215 100 230 Q160 225 210 240 L210 265 L30 265 Z" fill="#166534" />
          <path d="M400 235 Q440 215 480 230 Q530 215 570 235 L570 265 L400 265 Z" fill="#166534" />

          {/* Central Classical Arched Stone Bridge */}
          <g transform="translate(160, 220)">
            {/* Main Bridge Roadway */}
            <path d="M0 32 Q140 18 280 32 L280 44 Q140 30 0 44 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
            {/* Stone balustrade pillars */}
            <rect x="10" y="24" width="4" height="10" fill="#cbd5e1" />
            <rect x="40" y="22" width="4" height="10" fill="#cbd5e1" />
            <rect x="70" y="20" width="4" height="10" fill="#cbd5e1" />
            <rect x="100" y="19" width="4" height="10" fill="#cbd5e1" />
            <rect x="138" y="18" width="5" height="11" fill="#cbd5e1" />
            <rect x="176" y="19" width="4" height="10" fill="#cbd5e1" />
            <rect x="206" y="20" width="4" height="10" fill="#cbd5e1" />
            <rect x="236" y="22" width="4" height="10" fill="#cbd5e1" />
            <rect x="266" y="24" width="4" height="10" fill="#cbd5e1" />
            {/* Bridge Arches (3 Classical Stone Arches) */}
            {/* Left Arch */}
            <path d="M15 44 C25 65 65 65 75 44 Z" fill="#0369a1" stroke="#94a3b8" strokeWidth="1" />
            {/* Center Arch (Large) */}
            <path d="M95 44 C110 70 170 70 185 44 Z" fill="#0369a1" stroke="#94a3b8" strokeWidth="1.2" />
            {/* Right Arch */}
            <path d="M205 44 C215 65 255 65 265 44 Z" fill="#0369a1" stroke="#94a3b8" strokeWidth="1" />
            {/* Bridge Pier keystones */}
            <rect x="0" y="32" width="280" height="12" fill="#e2e8f0" opacity="0.9" />
          </g>

          {/* Foreground Water & Reflections */}
          <rect x="0" y="260" width="600" height="120" fill="url(#waterGrad)" />
          {/* Water reflection ripples */}
          <line x1="50" y1="275" x2="130" y2="275" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.7" />
          <line x1="180" y1="285" x2="320" y2="285" stroke="#bae6fd" strokeWidth="1.5" opacity="0.8" />
          <line x1="360" y1="280" x2="460" y2="280" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.7" />
          <line x1="80" y1="305" x2="220" y2="305" stroke="#bae6fd" strokeWidth="1.2" opacity="0.5" />
          <line x1="240" y1="315" x2="390" y2="315" stroke="#e0f2fe" strokeWidth="1.8" opacity="0.9" />
          <line x1="420" y1="310" x2="520" y2="310" stroke="#7dd3fc" strokeWidth="1.2" opacity="0.6" />
          <line x1="130" y1="340" x2="300" y2="340" stroke="#bae6fd" strokeWidth="1" opacity="0.5" />
          <line x1="330" y1="345" x2="480" y2="345" stroke="#bae6fd" strokeWidth="1.2" opacity="0.6" />
        </svg>

        {/* Subtle vignette border */}
        <div className="absolute inset-0 pointer-events-none border border-black/10 rounded-lg" />
      </div>

      {/* Bottom Footer Section */}
      <div className="relative z-10 w-full text-center pt-2 pb-1">
        {/* Red accent line with motto */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-0.5 w-16 sm:w-28 bg-red-600" />
          <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.25em] text-[#0a192f] uppercase">
            Unity • Faith • Discipline
          </span>
          <div className="h-0.5 w-16 sm:w-28 bg-red-600" />
        </div>

        {/* Website link */}
        <div className="mt-1.5">
          <a
            href="https://apac-us.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-neutral-600 tracking-wider hover:text-blue-900 transition-colors"
          >
            www.apac-us.org
          </a>
        </div>
      </div>
    </div>
  );
};
