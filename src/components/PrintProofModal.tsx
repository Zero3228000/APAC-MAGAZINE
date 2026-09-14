import React, { useState } from 'react';
import { PageData, ReviewStatus } from '../types';
import { PageView } from './PageView';
import { X, Printer, FileText, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

interface PrintProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PageData[];
  currentPage: number;
}

export const PrintProofModal: React.FC<PrintProofModalProps> = ({
  isOpen,
  onClose,
  pages,
  currentPage
}) => {
  const [printScope, setPrintScope] = useState<'current' | 'all'>('current');
  const [showCropMarks, setShowCropMarks] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const pagesToPrint = printScope === 'current' 
    ? pages.filter(p => p.pageNumber === currentPage)
    : pages;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-neutral-900 rounded-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                Commercial Print Proof & Technical Specifications
              </h3>
              <p className="text-[11px] text-neutral-400">
                US Letter Saddle-Stitch 32-Page Master Layout
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Technical Print Spec Card */}
        <div className="p-4 bg-white/5 border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 block uppercase">Trim Size</span>
            <span className="font-bold text-white">8.5" × 11" US Letter</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block uppercase">Binding</span>
            <span className="font-bold text-white">32pp Saddle-Stitched</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block uppercase">Color Space</span>
            <span className="font-bold text-white">CMYK (Coated FOGRA39)</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block uppercase">Paper Stock</span>
            <span className="font-bold text-white">100lb Gloss Cover / 80lb Text</span>
          </div>
        </div>

        {/* Print Scope selector */}
        <div className="px-4 py-2 bg-neutral-950/40 border-b border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Proof Scope:</span>
            <button
              onClick={() => setPrintScope('current')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                printScope === 'current' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Current Page ({currentPage})
            </button>
            <button
              onClick={() => setPrintScope('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                printScope === 'all' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              All 32 Pages (Master Proof)
            </button>
          </div>

          <label className="flex items-center gap-1.5 text-neutral-300 cursor-pointer">
            <input 
              type="checkbox" 
              checked={showCropMarks} 
              onChange={(e) => setShowCropMarks(e.target.checked)}
              className="rounded bg-neutral-800 border-neutral-700 text-red-600"
            />
            <span className="text-[11px]">Show Safe Margins (0.25")</span>
          </label>
        </div>

        {/* Preview Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-950/60 space-y-6">
          {pagesToPrint.map(page => (
            <div 
              key={page.pageNumber}
              className="print-page max-w-xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-neutral-300 aspect-7/10 relative"
            >
              {/* Corner crop marks visual */}
              {showCropMarks && (
                <div className="absolute inset-0 pointer-events-none z-30">
                  {/* Top-left */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-black/60" />
                  {/* Top-right */}
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-black/60" />
                  {/* Bottom-left */}
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-black/60" />
                  {/* Bottom-right */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-black/60" />
                </div>
              )}

              <PageView 
                page={page} 
                showSafeMargins={showCropMarks}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
