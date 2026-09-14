import React from 'react';
import { ViewMode, ReviewStatus } from '../types';
import { 
  Search, BookOpen, Layers, Maximize2, Minimize2, 
  Printer, CheckSquare, Sparkles, SlidersHorizontal,
  FileCheck, Shield, ChevronDown
} from 'lucide-react';

interface TopNavBarProps {
  currentPage: number;
  totalPages: number;
  viewMode: ViewMode;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenSearch: () => void;
  onOpenTOC: () => void;
  onOpenFeedback: () => void;
  onOpenPrintProof: () => void;
  approvedCount: number;
  changesCount: number;
  onJumpToPage: (page: number) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentPage,
  totalPages,
  viewMode,
  isFullscreen,
  onToggleFullscreen,
  onOpenSearch,
  onOpenTOC,
  onOpenFeedback,
  onOpenPrintProof,
  approvedCount,
  changesCount,
  onJumpToPage
}) => {
  return (
    <header className="w-full bg-[#0a192f] border-b border-white/10 text-white px-3 sm:px-6 py-2.5 flex items-center justify-between z-40 select-none shadow-md">
      {/* Brand / Publication Identifier */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onJumpToPage(1)}
          className="flex items-center gap-2.5 text-left group"
          title="Jump to Cover"
        >
          {/* Crest Mini Vector */}
          <div className="w-8 h-8 rounded-full bg-white/10 p-1 border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="46" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2" />
              <path d="M35 32 H65 V58 Q65 74 50 82 Q35 74 35 58 Z" fill="#ffffff" />
              <text x="50" y="48" fill="#0a192f" fontSize="13" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">AP</text>
              <text x="50" y="62" fill="#0a192f" fontSize="13" fontWeight="bold" fontFamily="Cinzel, serif" textAnchor="middle">AC</text>
              <path d="M20 82 Q50 78 80 82 L84 89 Q50 84 16 89 Z" fill="#b91c1c" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase font-display text-white group-hover:text-amber-300 transition-colors">
                APAC Magazine
              </span>
              <span className="hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded bg-red-700/80 text-white font-semibold uppercase tracking-wider">
                Print Outline
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 hidden sm:block">
              All Pakistani American Coalition • 32 Pages
            </p>
          </div>
        </button>

        {/* Page Jumper Quick Dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 ml-4 pl-4 border-l border-white/10 text-xs text-neutral-300">
          <span>Go to:</span>
          <select
            value={currentPage}
            onChange={(e) => onJumpToPage(Number(e.target.value))}
            className="bg-neutral-900 border border-neutral-700 text-white rounded px-2 py-1 text-xs focus:outline-hidden focus:border-red-500 font-mono"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <option key={pageNum} value={pageNum}>
                Page {pageNum === 1 ? '01 (Cover)' : pageNum === 32 ? '32 (Back)' : pageNum}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center / Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Search Modal Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 hover:text-white border border-white/10 text-xs transition-colors"
          title="Search articles and people (Cmd/Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden md:inline">Search</span>
          <kbd className="hidden lg:inline text-[9px] font-mono bg-black/40 px-1 py-0.5 rounded text-neutral-400">
            ⌘K
          </kbd>
        </button>

        {/* Table of Contents Trigger */}
        <button
          onClick={onOpenTOC}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 hover:text-white border border-white/10 text-xs transition-colors"
          title="Open complete Table of Contents"
        >
          <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Contents</span>
        </button>

        {/* Print Proof Modal Trigger */}
        <button
          onClick={onOpenPrintProof}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 hover:text-white border border-white/10 text-xs transition-colors"
          title="Print specifications & proofing layout"
        >
          <Printer className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden md:inline">Print Proof</span>
        </button>

        {/* Fullscreen Reading Mode Trigger */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-neutral-200 hover:text-white border border-white/10 transition-colors"
          title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Reading Mode'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Highlighted Review & Approval Button (Specifically for the Chairman review) */}
        <button
          onClick={onOpenFeedback}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-900/30 transition-all hover:scale-105 active:scale-95 border border-red-400/30"
          title="Chairman Approval & Feedback Panel"
        >
          <FileCheck className="w-4 h-4" />
          <span>Review & Approve</span>
          {approvedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-mono text-emerald-300">
              {approvedCount}/32
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
