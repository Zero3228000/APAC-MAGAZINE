import React, { useRef, useEffect } from 'react';
import { PageData, ReviewStatus } from '../types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ThumbnailScrubberProps {
  pages: PageData[];
  currentPage: number;
  onSelectPage: (pageNumber: number) => void;
  getPageStatus: (pageNumber: number) => ReviewStatus;
}

export const ThumbnailScrubber: React.FC<ThumbnailScrubberProps> = ({
  pages,
  currentPage,
  onSelectPage,
  getPageStatus
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active thumb into view
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-page="${currentPage}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentPage]);

  return (
    <div className="w-full bg-neutral-950/80 border-t border-white/10 px-2 py-2 backdrop-blur-md">
      <div 
        ref={scrollRef}
        className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-1 px-2 no-scrollbar"
      >
        {pages.map((p) => {
          const isActive = currentPage === p.pageNumber;
          const status = getPageStatus(p.pageNumber);

          return (
            <button
              key={p.pageNumber}
              data-page={p.pageNumber}
              onClick={() => onSelectPage(p.pageNumber)}
              className={`shrink-0 flex flex-col items-center group transition-all text-left ${
                isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              {/* Mini Page Canvas Replica */}
              <div className={`relative w-12 sm:w-14 h-16 sm:h-18 rounded overflow-hidden border transition-all ${
                isActive 
                  ? 'border-red-500 ring-2 ring-red-500/50 shadow-lg' 
                  : 'border-white/15 bg-neutral-900 group-hover:border-white/40'
              } ${p.layoutType === 'cover' ? 'bg-[#fdfdfd]' : p.layoutType === 'back-cover' ? 'bg-[#0a192f]' : 'bg-[#faf9f6]'}`}>
                
                {/* Page miniature content simulation */}
                {p.layoutType === 'cover' ? (
                  <div className="p-1 h-full flex flex-col justify-between items-center text-[5px] text-[#0a192f] text-center font-bold">
                    <span className="text-[4px] uppercase text-red-700">APAC</span>
                    <span className="leading-none text-[5px] scale-90">Rooted in heritage</span>
                    <div className="w-full h-4 bg-sky-200/80 rounded-xs mt-0.5" />
                    <span className="text-[4px] text-neutral-500">2026</span>
                  </div>
                ) : p.layoutType === 'back-cover' ? (
                  <div className="p-1 h-full flex flex-col justify-between items-center text-[5px] text-white text-center">
                    <span className="text-[4px] text-amber-300">DIRECTORY</span>
                    <div className="w-4 h-4 bg-white/20 rounded-xs" />
                    <span className="text-[3.5px] text-neutral-400">501(c)(3)</span>
                  </div>
                ) : (
                  <div className="p-1 h-full flex flex-col justify-between text-[5px] text-neutral-800">
                    <div className="flex items-center justify-between text-[4px] text-neutral-400 font-bold border-b border-neutral-200 pb-0.5">
                      <span className="truncate max-w-[30px]">{p.category}</span>
                      <span>{p.pageNumber}</span>
                    </div>
                    {p.images?.[0] ? (
                      <div className="w-full h-5 bg-neutral-200 rounded-xs overflow-hidden my-auto">
                        <img 
                          src={p.images[0].imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="space-y-0.5 my-auto">
                        <div className="w-full h-1 bg-neutral-300 rounded-xs" />
                        <div className="w-4/5 h-1 bg-neutral-200 rounded-xs" />
                        <div className="w-full h-1 bg-neutral-200 rounded-xs" />
                      </div>
                    )}
                    <span className="text-[4px] font-bold truncate text-[#0a192f]">{p.title}</span>
                  </div>
                )}

                {/* Status indicator pin */}
                {status === 'approved' && (
                  <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-2 h-2" />
                  </div>
                )}
                {status === 'changes_requested' && (
                  <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-xs">
                    <AlertCircle className="w-2 h-2" />
                  </div>
                )}
              </div>

              {/* Folio label */}
              <span className={`text-[10px] font-mono mt-1 ${
                isActive ? 'text-red-400 font-bold' : 'text-neutral-400 group-hover:text-white'
              }`}>
                {p.pageNumber === 1 ? 'Cover' : p.pageNumber === 32 ? 'Back' : p.pageNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
