import React from 'react';
import { PageData, ReviewStatus } from '../types';
import { X, BookOpen, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface TableOfContentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PageData[];
  currentPage: number;
  onSelectPage: (pageNumber: number) => void;
  getPageStatus: (pageNumber: number) => ReviewStatus;
}

export const TableOfContentsModal: React.FC<TableOfContentsModalProps> = ({
  isOpen,
  onClose,
  pages,
  currentPage,
  onSelectPage,
  getPageStatus
}) => {
  if (!isOpen) return null;

  // Group pages by category
  const categories = [
    { name: 'Cover & Overview', pages: pages.filter(p => p.pageNumber <= 2) },
    { name: 'Foundations & Purpose', pages: pages.filter(p => p.pageNumber >= 3 && p.pageNumber <= 4) },
    { name: 'Executive Leadership Messages', pages: pages.filter(p => p.pageNumber >= 5 && p.pageNumber <= 7) },
    { name: 'Governance & Committees', pages: pages.filter(p => p.pageNumber >= 8 && p.pageNumber <= 10) },
    { name: 'Focus Areas, AI Tech & Commerce', pages: pages.filter(p => p.pageNumber >= 11 && p.pageNumber <= 15) },
    { name: 'Youth Leadership & Next Gen', pages: pages.filter(p => p.pageNumber >= 16 && p.pageNumber <= 18) },
    { name: 'Community Action & Education', pages: pages.filter(p => p.pageNumber >= 19 && p.pageNumber <= 21) },
    { name: 'Heritage, Galas & Fellowship', pages: pages.filter(p => p.pageNumber >= 22 && p.pageNumber <= 27) },
    { name: 'Organization Directory & Closing', pages: pages.filter(p => p.pageNumber >= 28 && p.pageNumber <= 32) }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-neutral-900 rounded-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                Complete Publication Directory (32 Pages)
              </h3>
              <p className="text-[11px] text-neutral-400">
                APAC Organization Magazine • Standard Saddle-Stitched 32pp Extent
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories and page links list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {categories.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-2.5">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>{cat.name}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.pages.map(page => {
                  const isCurrent = currentPage === page.pageNumber;
                  const status = getPageStatus(page.pageNumber);

                  return (
                    <button
                      key={page.pageNumber}
                      onClick={() => {
                        onSelectPage(page.pageNumber);
                        onClose();
                      }}
                      className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                        isCurrent
                          ? 'bg-red-950/50 border-red-500 text-white ring-1 ring-red-500/50'
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                          isCurrent ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700'
                        }`}>
                          {String(page.pageNumber).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold truncate group-hover:text-amber-300 transition-colors">
                            {page.title}
                          </h5>
                          <p className="text-[10px] text-neutral-400 truncate">
                            {page.headline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {status === 'approved' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Approved" />
                        )}
                        {status === 'changes_requested' && (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400" title="Changes requested" />
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/10 bg-neutral-950 text-xs text-neutral-400 flex items-center justify-between">
          <span>Click any article to flip immediately</span>
          <button 
            onClick={onClose}
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
