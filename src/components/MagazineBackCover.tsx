import React from 'react';
import { Mail, Phone, MapPin, Globe, CheckCircle2 } from 'lucide-react';

interface MagazineBackCoverProps {
  showSafeMargins?: boolean;
}

export const MagazineBackCover: React.FC<MagazineBackCoverProps> = ({ showSafeMargins = false }) => {
  return (
    <div className="relative w-full h-full bg-[#0a192f] text-neutral-100 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden shadow-inner">
      {/* Print Safe Margins Overlay */}
      {showSafeMargins && (
        <div className="absolute inset-4 border border-dashed border-red-400 pointer-events-none z-30 opacity-70">
          <span className="absolute top-1 left-2 text-[9px] font-mono text-red-300 bg-black/80 px-1 rounded">
            Safe Margin (0.25in / 6mm)
          </span>
        </div>
      )}

      {/* Top Banner / Crest */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/15 p-2 shadow-inner mb-3">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#0f2b48" stroke="#38bdf8" strokeWidth="2" />
            <path d="M35 32 H65 V58 Q65 74 50 82 Q35 74 35 58 Z" fill="#ffffff" />
            <text x="50" y="48" fill="#0a192f" fontSize="12" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">AP</text>
            <text x="50" y="62" fill="#0a192f" fontSize="12" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">AC</text>
            <path d="M20 82 Q50 78 80 82 L84 89 Q50 84 16 89 Z" fill="#b91c1c" />
            <text x="50" y="87" fill="#ffffff" fontSize="5.5" fontWeight="600" textAnchor="middle">UNITY • FAITH • DISCIPLINE</text>
          </svg>
        </div>

        <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white uppercase font-display">
          All Pakistani American Coalition
        </h2>
        <p className="text-xs sm:text-sm text-red-400 font-semibold tracking-widest uppercase mt-1">
          Rooted in Heritage • United for Tomorrow
        </p>
        <div className="w-16 h-0.5 bg-red-600 mx-auto mt-3" />
      </div>

      {/* Middle Content: Contact Information & Interactive QR */}
      <div className="my-auto py-4">
        <div className="bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-5 sm:p-6 max-w-md mx-auto">
          <h3 className="text-xs sm:text-sm font-bold tracking-wider text-amber-300 uppercase mb-4 text-center">
            Organization Directory & Head Office
          </h3>

          <div className="space-y-3.5 text-xs sm:text-sm text-neutral-200">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-white">National Headquarters</span>
                <span className="text-neutral-300">2444 Fenton Ave, Bronx, NY 10469</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <span className="font-semibold text-white mr-1.5">Direct Line:</span>
                <a href="tel:+19174966955" className="hover:text-sky-300 transition-colors">
                  +1 (917) 496-6955
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-white mr-1.5">Executive Email:</span>
                <a href="mailto:info@apac-us.org" className="hover:text-amber-200 transition-colors">
                  info@apac-us.org
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-white mr-1.5">Official Portal:</span>
                <a href="https://apac-us.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors">
                  www.apac-us.org
                </a>
              </div>
            </div>
          </div>

          {/* QR Code and Join Banner */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left text-xs">
              <span className="font-bold text-white block">Become a Member or Volunteer</span>
              <span className="text-[11px] text-neutral-400">Scan code with smartphone camera</span>
              <div className="mt-1 text-[10px] text-sky-300 font-mono">apac-us.org/membership</div>
            </div>

            {/* Simulated Vector QR code */}
            <div className="w-20 h-20 bg-white p-1.5 rounded-lg shrink-0 shadow-md flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* QR Finder patterns */}
                <rect x="0" y="0" width="30" height="30" fill="#0a192f" />
                <rect x="5" y="5" width="20" height="20" fill="#ffffff" />
                <rect x="10" y="10" width="10" height="10" fill="#0a192f" />

                <rect x="70" y="0" width="30" height="30" fill="#0a192f" />
                <rect x="75" y="5" width="20" height="20" fill="#ffffff" />
                <rect x="80" y="10" width="10" height="10" fill="#0a192f" />

                <rect x="0" y="70" width="30" height="30" fill="#0a192f" />
                <rect x="5" y="75" width="20" height="20" fill="#ffffff" />
                <rect x="10" y="80" width="10" height="10" fill="#0a192f" />

                {/* Data bits */}
                <rect x="36" y="10" width="6" height="6" fill="#0a192f" />
                <rect x="46" y="15" width="6" height="6" fill="#0a192f" />
                <rect x="56" y="10" width="6" height="6" fill="#0a192f" />
                <rect x="36" y="36" width="28" height="28" fill="#0a192f" />
                <rect x="42" y="42" width="16" height="16" fill="#ffffff" />
                <rect x="47" y="47" width="6" height="6" fill="#b91c1c" />
                <rect x="15" y="40" width="6" height="6" fill="#0a192f" />
                <rect x="75" y="40" width="6" height="6" fill="#0a192f" />
                <rect x="40" y="75" width="6" height="6" fill="#0a192f" />
                <rect x="55" y="80" width="6" height="6" fill="#0a192f" />
                <rect x="75" y="75" width="6" height="6" fill="#0a192f" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Mandatory Federal Statement */}
      <div className="text-center pt-3 pb-1 border-t border-white/10">
        <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Official 501(c)(3) Federal Nonprofit Organization</span>
        </div>
        <p className="text-[11px] sm:text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
          APAC is a United States 501(c)(3) nonprofit organization in compliance with applicable federal law (EIN: 82-3512699).
        </p>
        <p className="text-[9px] text-neutral-500 mt-2 font-mono">
          Specification: 32pp Saddle-Stitch Booklet • US Letter 8.5" × 11" Portrait • APAC-2026-PUB-V1
        </p>
      </div>
    </div>
  );
};
