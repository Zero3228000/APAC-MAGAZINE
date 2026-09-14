import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageData, ViewMode, PageFeedback } from '../types';
import { PageView } from './PageView';
import { playPageTurnSound } from '../utils/audio';
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, 
  BookOpen, FileText, Volume2, VolumeX, Maximize2, Minimize2,
  Grid, Compass, MessageSquarePlus
} from 'lucide-react';

interface FlipBookViewerProps {
  pages: PageData[];
  currentPage: number; // 1 to 32
  viewMode: ViewMode;
  zoom: number;
  soundEnabled: boolean;
  showSafeMargins: boolean;
  feedbackList: PageFeedback[];
  onPageChange: (newPage: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onZoomChange: (zoom: number) => void;
  onSoundToggle: () => void;
  onSafeMarginsToggle: () => void;
  onOpenFeedback: (pageNumber: number) => void;
  onAddAnnotation: (pageNumber: number, x: number, y: number) => void;
  onSelectFeedback: (fb: PageFeedback) => void;
}

export const FlipBookViewer: React.FC<FlipBookViewerProps> = ({
  pages,
  currentPage,
  viewMode,
  zoom,
  soundEnabled,
  showSafeMargins,
  feedbackList,
  onPageChange,
  onViewModeChange,
  onZoomChange,
  onSoundToggle,
  onSafeMarginsToggle,
  onOpenFeedback,
  onAddAnnotation,
  onSelectFeedback
}) => {
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isFlipping, setIsFlipping] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const touchDistanceRef = useRef<number | null>(null);

  // Calculate current spread in spread mode
  // Page 1 is single (Cover)
  // Page 2 & 3, Page 4 & 5 ... Page 30 & 31
  // Page 32 is single (Back Cover)
  const isCover = currentPage === 1;
  const isBackCover = currentPage === pages.length;

  let leftPageNumber: number | null = null;
  let rightPageNumber: number | null = null;

  if (viewMode === 'single') {
    leftPageNumber = currentPage;
    rightPageNumber = null;
  } else {
    if (isCover) {
      leftPageNumber = null;
      rightPageNumber = 1;
    } else if (isBackCover) {
      leftPageNumber = pages.length;
      rightPageNumber = null;
    } else {
      // For interior spreads: even on left, odd on right
      leftPageNumber = currentPage % 2 === 0 ? currentPage : currentPage - 1;
      rightPageNumber = leftPageNumber + 1 <= pages.length ? leftPageNumber + 1 : null;
    }
  }

  const leftPageData = leftPageNumber ? pages.find(p => p.pageNumber === leftPageNumber) : null;
  const rightPageData = rightPageNumber ? pages.find(p => p.pageNumber === rightPageNumber) : null;

  // Turn page logic
  const handleNextPage = useCallback(() => {
    if (isFlipping) return;
    let next = currentPage;
    if (viewMode === 'single') {
      next = Math.min(pages.length, currentPage + 1);
    } else {
      if (currentPage === 1) {
        next = 2;
      } else if (currentPage >= pages.length - 1) {
        next = pages.length;
      } else {
        next = Math.min(pages.length, (currentPage % 2 === 0 ? currentPage : currentPage - 1) + 2);
      }
    }

    if (next !== currentPage) {
      setFlipDirection('next');
      setIsFlipping(true);
      if (soundEnabled) playPageTurnSound();
      onPageChange(next);
      setTimeout(() => setIsFlipping(false), 500);
    }
  }, [currentPage, isFlipping, onPageChange, pages.length, soundEnabled, viewMode]);

  const handlePrevPage = useCallback(() => {
    if (isFlipping) return;
    let prev = currentPage;
    if (viewMode === 'single') {
      prev = Math.max(1, currentPage - 1);
    } else {
      if (currentPage === pages.length) {
        prev = pages.length - 1;
      } else if (currentPage <= 3) {
        prev = 1;
      } else {
        prev = Math.max(1, (currentPage % 2 === 0 ? currentPage : currentPage - 1) - 2);
      }
    }

    if (prev !== currentPage) {
      setFlipDirection('prev');
      setIsFlipping(true);
      if (soundEnabled) playPageTurnSound();
      onPageChange(prev);
      setTimeout(() => setIsFlipping(false), 500);
    }
  }, [currentPage, isFlipping, onPageChange, pages.length, soundEnabled, viewMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        onPageChange(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        onPageChange(pages.length);
      } else if (e.key === '+' || e.key === '=') {
        onZoomChange(Math.min(2.5, zoom + 0.25));
      } else if (e.key === '-') {
        onZoomChange(Math.max(1, zoom - 0.25));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, onPageChange, onZoomChange, pages.length, zoom]);

  // Touch Pinch-to-Zoom Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - touchDistanceRef.current;
      if (Math.abs(delta) > 10) {
        const newZoom = Math.min(2.5, Math.max(1, zoom + delta * 0.005));
        onZoomChange(Math.round(newZoom * 100) / 100);
        touchDistanceRef.current = dist;
      }
    } else if (e.touches.length === 1 && isDragging && zoom > 1) {
      setPanOffset({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y
      });
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
    setIsDragging(false);
  };

  // Mouse pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1 && (e.button === 0 || e.button === 1)) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPanOffset({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double click to toggle zoom
  const handleDoubleClick = () => {
    if (zoom > 1) {
      onZoomChange(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      onZoomChange(1.6);
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
      className={`relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden ${
        zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Background ambient gradient */}
      <div className="absolute inset-0 bg-radial from-neutral-800/40 via-neutral-900 to-black pointer-events-none" />

      {/* Main Flipbook Display Stage */}
      <div className="relative z-10 w-full max-w-6xl h-full max-h-[86vh] flex items-center justify-center perspective-2000">
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1 || isFlipping}
          className="absolute left-2 sm:left-4 z-40 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/10 shadow-xl backdrop-blur-xs disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-all"
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= pages.length || isFlipping}
          className="absolute right-2 sm:right-4 z-40 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-white/10 shadow-xl backdrop-blur-xs disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-all"
          title="Next Page (Right Arrow or Space)"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>

        {/* Scaled Book Container with 3D animation */}
        <motion.div
          animate={{
            scale: zoom,
            x: panOffset.x,
            y: panOffset.y,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative flex items-center justify-center transform-style-3d origin-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${currentPage}-${viewMode}`}
              initial={{ 
                opacity: 0.9,
                rotateY: flipDirection === 'next' ? 8 : -8,
              }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
              }}
              exit={{ 
                opacity: 0.9,
                rotateY: flipDirection === 'next' ? -8 : 8,
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-center justify-center transform-style-3d drop-shadow-2xl"
            >
              {/* SPREAD MODE */}
              {viewMode === 'spread' && (
                <div className="flex items-stretch justify-center">
                  {/* Left Page (hidden if single Cover) */}
                  {leftPageData ? (
                    <div className="relative w-[340px] sm:w-[420px] md:w-[480px] lg:w-[540px] aspect-7/10 rounded-l-md overflow-hidden bg-white shadow-2xl border-y border-l border-neutral-300 transform-style-3d origin-right">
                      <PageView 
                        page={leftPageData} 
                        feedbackList={feedbackList}
                        onAddAnnotation={onAddAnnotation}
                        showSafeMargins={showSafeMargins}
                        onSelectFeedback={onSelectFeedback}
                      />
                      {/* Left Page spine curl shadow */}
                      <div className="absolute top-0 right-0 bottom-0 w-8 pointer-events-none bg-linear-to-l from-black/25 via-black/10 to-transparent" />
                    </div>
                  ) : (
                    /* Blank half when looking at Cover in Spread Mode */
                    <div className="hidden md:block w-[340px] sm:w-[420px] md:w-[480px] lg:w-[540px] aspect-7/10 rounded-l-md bg-neutral-900/40 border border-neutral-800/40 flex items-center justify-center text-neutral-600 text-xs font-mono">
                      <span>APAC Organization Magazine • 2026 Edition</span>
                    </div>
                  )}

                  {/* Center Book Spine */}
                  <div className="w-[3px] bg-linear-to-r from-neutral-600 via-neutral-900 to-neutral-600 shadow-lg z-20 shrink-0 self-stretch" />

                  {/* Right Page (hidden if single Back Cover) */}
                  {rightPageData ? (
                    <div className="relative w-[340px] sm:w-[420px] md:w-[480px] lg:w-[540px] aspect-7/10 rounded-r-md overflow-hidden bg-white shadow-2xl border-y border-r border-neutral-300 transform-style-3d origin-left">
                      <PageView 
                        page={rightPageData} 
                        feedbackList={feedbackList}
                        onAddAnnotation={onAddAnnotation}
                        showSafeMargins={showSafeMargins}
                        onSelectFeedback={onSelectFeedback}
                      />
                      {/* Right Page spine curl shadow */}
                      <div className="absolute top-0 left-0 bottom-0 w-8 pointer-events-none bg-linear-to-r from-black/25 via-black/10 to-transparent" />
                      
                      {/* Page corner peel interactive hint */}
                      <button
                        onClick={handleNextPage}
                        className="absolute bottom-0 right-0 w-12 h-12 z-20 cursor-pointer group"
                        title="Click corner to turn page"
                      >
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-linear-to-tl from-neutral-400/40 via-neutral-300/20 to-transparent rounded-tl-lg group-hover:w-10 group-hover:h-10 transition-all" />
                      </button>
                    </div>
                  ) : (
                    /* Blank half when looking at Back Cover in Spread Mode */
                    <div className="hidden md:block w-[340px] sm:w-[420px] md:w-[480px] lg:w-[540px] aspect-7/10 rounded-r-md bg-neutral-900/40 border border-neutral-800/40 flex items-center justify-center text-neutral-600 text-xs font-mono">
                      <span>End of Publication • All Rights Reserved</span>
                    </div>
                  )}
                </div>
              )}

              {/* SINGLE PAGE MODE */}
              {viewMode === 'single' && leftPageData && (
                <div className="relative w-[350px] sm:w-[440px] md:w-[520px] lg:w-[580px] aspect-7/10 rounded-md overflow-hidden bg-white shadow-2xl border border-neutral-300">
                  <PageView 
                    page={leftPageData} 
                    feedbackList={feedbackList}
                    onAddAnnotation={onAddAnnotation}
                    showSafeMargins={showSafeMargins}
                    onSelectFeedback={onSelectFeedback}
                  />

                  {/* Corner peel hint */}
                  <button
                    onClick={handleNextPage}
                    className="absolute bottom-0 right-0 w-12 h-12 z-20 cursor-pointer group"
                    title="Click corner to turn page"
                  >
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-linear-to-tl from-neutral-400/40 to-transparent rounded-tl-lg group-hover:w-10 group-hover:h-10 transition-all" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Quick Floating Action Bar for Reading Controls */}
      <div className="relative z-30 mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-white/15 text-neutral-300 shadow-xl backdrop-blur-md text-xs">
        {/* Page spread indicator */}
        <span className="font-mono text-[11px] sm:text-xs text-white px-2 py-0.5 rounded bg-white/10">
          {viewMode === 'spread' ? (
            isCover ? 'Cover (P. 01)' : isBackCover ? 'Back Cover (P. 32)' : `Pages ${leftPageNumber}–${rightPageNumber}`
          ) : (
            `Page ${currentPage} of ${pages.length}`
          )}
        </span>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        {/* View Mode Toggle: Spread vs Single */}
        <button
          onClick={() => onViewModeChange(viewMode === 'spread' ? 'single' : 'spread')}
          className={`p-1.5 rounded hover:bg-white/15 transition-colors ${
            viewMode === 'spread' ? 'text-sky-400 font-semibold' : 'text-neutral-300'
          }`}
          title={viewMode === 'spread' ? 'Switch to Single Page View' : 'Switch to Two-Page Spread View'}
        >
          {viewMode === 'spread' ? (
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /><span className="hidden sm:inline text-[11px]">2-Page Spread</span></span>
          ) : (
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /><span className="hidden sm:inline text-[11px]">Single Page</span></span>
          )}
        </button>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        {/* Zoom Controls */}
        <button
          onClick={() => onZoomChange(Math.max(1, Math.round((zoom - 0.25) * 100) / 100))}
          disabled={zoom <= 1}
          className="p-1.5 rounded hover:bg-white/15 disabled:opacity-30 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            onZoomChange(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="text-[11px] font-mono px-1 hover:text-white transition-colors"
          title="Reset Zoom (100%)"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={() => onZoomChange(Math.min(2.5, Math.round((zoom + 0.25) * 100) / 100))}
          disabled={zoom >= 2.5}
          className="p-1.5 rounded hover:bg-white/15 disabled:opacity-30 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        {/* Sound Toggle */}
        <button
          onClick={onSoundToggle}
          className={`p-1.5 rounded hover:bg-white/15 transition-colors ${
            soundEnabled ? 'text-amber-400' : 'text-neutral-500'
          }`}
          title={soundEnabled ? 'Mute Page Flip Sound' : 'Enable Page Flip Sound'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Safe Margins Toggle for Printer Proofing */}
        <button
          onClick={onSafeMarginsToggle}
          className={`p-1.5 rounded hover:bg-white/15 transition-colors hidden sm:flex items-center gap-1 ${
            showSafeMargins ? 'text-red-400 bg-red-950/40' : 'text-neutral-400'
          }`}
          title="Toggle Print Trim & Safe Gutter Margins (0.25in)"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="text-[10px]">Print Margins</span>
        </button>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        {/* Add Feedback for this Page */}
        <button
          onClick={() => onOpenFeedback(currentPage)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-medium text-[11px] shadow-sm transition-colors"
          title="Chairman / Editorial Review Feedback"
        >
          <MessageSquarePlus className="w-3 h-3" />
          <span className="hidden sm:inline">Review Note</span>
        </button>
      </div>
    </div>
  );
};
