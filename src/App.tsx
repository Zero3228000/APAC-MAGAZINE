/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MAGAZINE_PAGES } from './data/magazineData';
import { ViewMode, PageFeedback, ReviewStatus } from './types';
import { FlipBookViewer } from './components/FlipBookViewer';
import { TopNavBar } from './components/TopNavBar';
import { ThumbnailScrubber } from './components/ThumbnailScrubber';
import { SearchModal } from './components/SearchModal';
import { TableOfContentsModal } from './components/TableOfContentsModal';
import { EditorialFeedbackDrawer } from './components/EditorialFeedbackDrawer';
import { PrintProofModal } from './components/PrintProofModal';

// Initial pre-loaded executive review notes
const INITIAL_FEEDBACK: PageFeedback[] = [
  {
    id: 'fb-initial-1',
    pageNumber: 1,
    author: 'Chairman Sheikh Tauqeer ul Haq',
    role: 'Founder & Chairman',
    timestamp: '2026-09-14',
    status: 'approved',
    category: 'layout',
    comment: 'Cover artwork captures our identity gracefully. Balanced Pakistan and US visual motifs with the stone bridge reflect our founding vision perfectly.',
    pinPosition: { x: 50, y: 35 }
  },
  {
    id: 'fb-initial-2',
    pageNumber: 5,
    author: 'Chairman Sheikh Tauqeer ul Haq',
    role: 'Founder & Chairman',
    timestamp: '2026-09-14',
    status: 'approved',
    category: 'copy',
    comment: 'Foreword editorial draft reviewed and approved. Please ensure my official title matches the board charter.',
    pinPosition: { x: 70, y: 60 }
  },
  {
    id: 'fb-initial-3',
    pageNumber: 12,
    author: 'Editorial Committee',
    role: 'Editorial Board',
    timestamp: '2026-09-14',
    status: 'changes_requested',
    category: 'factual',
    comment: 'Reminder before final print: Re-confirm full name spelling for AIFT President Mohammed Irshad Virk.',
    pinPosition: { x: 30, y: 40 }
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return window.innerWidth < 768 ? 'single' : 'spread';
  });
  const [zoom, setZoom] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSafeMargins, setShowSafeMargins] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals & Drawers state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isTOCOpen, setIsTOCOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isPrintProofOpen, setIsPrintProofOpen] = useState<boolean>(false);

  // Annotation drop on page
  const [activeAnnotationCoord, setActiveAnnotationCoord] = useState<{ x: number; y: number } | null>(null);

  // Review Feedback stored locally
  const [feedbackList, setFeedbackList] = useState<PageFeedback[]>(() => {
    try {
      const saved = localStorage.getItem('apac_magazine_feedback');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_FEEDBACK;
  });

  // Save feedback changes
  useEffect(() => {
    try {
      localStorage.setItem('apac_magazine_feedback', JSON.stringify(feedbackList));
    } catch {
      // ignore
    }
  }, [feedbackList]);

  // Sync fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Listen for Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle window resize for adaptive viewMode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && viewMode === 'spread') {
        setViewMode('single');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleAddFeedback = (newFb: Omit<PageFeedback, 'id' | 'timestamp'>) => {
    const item: PageFeedback = {
      ...newFb,
      id: 'fb-' + Date.now(),
      timestamp: new Date().toISOString().split('T')[0]
    };
    setFeedbackList(prev => [item, ...prev]);
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbackList(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdatePageStatus = (pageNumber: number, status: ReviewStatus) => {
    const item: PageFeedback = {
      id: 'fb-status-' + Date.now(),
      pageNumber,
      author: 'Chairman Sheikh Tauqeer ul Haq',
      role: 'Founder & Chairman',
      timestamp: new Date().toISOString().split('T')[0],
      status,
      category: 'general',
      comment: status === 'approved' 
        ? 'Executive Approval granted for this page outline.' 
        : 'Editorial revision requested by Chairman.'
    };
    setFeedbackList(prev => [item, ...prev]);
  };

  const handleAddAnnotation = (pageNumber: number, x: number, y: number) => {
    setActiveAnnotationCoord({ x, y });
    setCurrentPage(pageNumber);
    setIsFeedbackOpen(true);
  };

  const handleSelectFeedback = (fb: PageFeedback) => {
    setCurrentPage(fb.pageNumber);
    setIsFeedbackOpen(true);
  };

  // Status query helper
  const getPageStatus = (pNum: number): ReviewStatus => {
    const pageFbs = feedbackList.filter(f => f.pageNumber === pNum);
    if (pageFbs.length === 0) return 'pending';
    return pageFbs[0].status;
  };

  const approvedCount = MAGAZINE_PAGES.filter(p => getPageStatus(p.pageNumber) === 'approved').length;
  const changesCount = MAGAZINE_PAGES.filter(p => getPageStatus(p.pageNumber) === 'changes_requested').length;

  return (
    <div className="flex flex-col h-screen w-screen bg-[#111827] text-neutral-100 overflow-hidden font-sans select-none">
      {/* Top Corporate Navigation Header */}
      <TopNavBar
        currentPage={currentPage}
        totalPages={MAGAZINE_PAGES.length}
        viewMode={viewMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTOC={() => setIsTOCOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenPrintProof={() => setIsPrintProofOpen(true)}
        approvedCount={approvedCount}
        changesCount={changesCount}
        onJumpToPage={(p) => setCurrentPage(p)}
      />

      {/* Main Flipbook Viewer Center Canvas */}
      <main className="flex-1 relative w-full h-full overflow-hidden flex items-center justify-center">
        <FlipBookViewer
          pages={MAGAZINE_PAGES}
          currentPage={currentPage}
          viewMode={viewMode}
          zoom={zoom}
          soundEnabled={soundEnabled}
          showSafeMargins={showSafeMargins}
          feedbackList={feedbackList}
          onPageChange={(p) => setCurrentPage(p)}
          onViewModeChange={(mode) => setViewMode(mode)}
          onZoomChange={(z) => setZoom(z)}
          onSoundToggle={() => setSoundEnabled(prev => !prev)}
          onSafeMarginsToggle={() => setShowSafeMargins(prev => !prev)}
          onOpenFeedback={(p) => {
            setCurrentPage(p);
            setIsFeedbackOpen(true);
          }}
          onAddAnnotation={handleAddAnnotation}
          onSelectFeedback={handleSelectFeedback}
        />
      </main>

      {/* Bottom 32-Page Thumbnail Filmstrip Scrubber */}
      <ThumbnailScrubber
        pages={MAGAZINE_PAGES}
        currentPage={currentPage}
        onSelectPage={(p) => setCurrentPage(p)}
        getPageStatus={getPageStatus}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        pages={MAGAZINE_PAGES}
        onSelectPage={(p) => setCurrentPage(p)}
      />

      {/* Table of Contents Modal */}
      <TableOfContentsModal
        isOpen={isTOCOpen}
        onClose={() => setIsTOCOpen(false)}
        pages={MAGAZINE_PAGES}
        currentPage={currentPage}
        onSelectPage={(p) => setCurrentPage(p)}
        getPageStatus={getPageStatus}
      />

      {/* Chairman & Editorial Feedback Submission Drawer */}
      <EditorialFeedbackDrawer
        isOpen={isFeedbackOpen}
        onClose={() => {
          setIsFeedbackOpen(false);
          setActiveAnnotationCoord(null);
        }}
        currentPage={currentPage}
        pages={MAGAZINE_PAGES}
        feedbackList={feedbackList}
        onAddFeedback={handleAddFeedback}
        onDeleteFeedback={handleDeleteFeedback}
        onUpdatePageStatus={handleUpdatePageStatus}
        onJumpToPage={(p) => setCurrentPage(p)}
        activeAnnotationCoord={activeAnnotationCoord}
        onClearAnnotationCoord={() => setActiveAnnotationCoord(null)}
      />

      {/* Commercial Print Proofing Modal */}
      <PrintProofModal
        isOpen={isPrintProofOpen}
        onClose={() => setIsPrintProofOpen(false)}
        pages={MAGAZINE_PAGES}
        currentPage={currentPage}
      />
    </div>
  );
}
