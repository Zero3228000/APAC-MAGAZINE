import React, { useState } from 'react';
import { PageData, PageFeedback, ReviewStatus, ReviewCategory } from '../types';
import { EDITORIAL_GUIDELINES_CHECKLIST } from '../data/magazineData';
import confetti from 'canvas-confetti';
import { 
  X, CheckCircle2, AlertCircle, Clock, Send, 
  Trash2, Download, Copy, Check, FileCheck,
  User, Tag, Filter, Sparkles, AlertTriangle
} from 'lucide-react';

interface EditorialFeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  pages: PageData[];
  feedbackList: PageFeedback[];
  onAddFeedback: (feedback: Omit<PageFeedback, 'id' | 'timestamp'>) => void;
  onDeleteFeedback: (id: string) => void;
  onUpdatePageStatus: (pageNumber: number, status: ReviewStatus) => void;
  onJumpToPage: (pageNumber: number) => void;
  activeAnnotationCoord?: { x: number; y: number } | null;
  onClearAnnotationCoord?: () => void;
}

export const EditorialFeedbackDrawer: React.FC<EditorialFeedbackDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  pages,
  feedbackList,
  onAddFeedback,
  onDeleteFeedback,
  onUpdatePageStatus,
  onJumpToPage,
  activeAnnotationCoord,
  onClearAnnotationCoord
}) => {
  const [author, setAuthor] = useState('Chairman Sheikh Tauqeer ul Haq');
  const [role, setRole] = useState('Chairman & Founder');
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<ReviewCategory>('copy');
  const [selectedStatus, setSelectedStatus] = useState<ReviewStatus>('approved');
  const [filterMode, setFilterMode] = useState<'current' | 'all'>('current');
  const [copied, setCopied] = useState(false);
  const [checklist, setChecklist] = useState(EDITORIAL_GUIDELINES_CHECKLIST);

  if (!isOpen) return null;

  const currentPageData = pages.find(p => p.pageNumber === currentPage);

  // Approval calculations
  // Get status of each page: latest feedback status or default pending
  const getPageStatus = (pNum: number): ReviewStatus => {
    const pageFbs = feedbackList.filter(f => f.pageNumber === pNum);
    if (pageFbs.length === 0) return 'pending';
    return pageFbs[pageFbs.length - 1].status;
  };

  const approvedCount = pages.filter(p => getPageStatus(p.pageNumber) === 'approved').length;
  const changesCount = pages.filter(p => getPageStatus(p.pageNumber) === 'changes_requested').length;
  const pendingCount = pages.length - (approvedCount + changesCount);
  const percentComplete = Math.round((approvedCount / pages.length) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && selectedStatus !== 'approved') return;

    const noteText = comment.trim() || `Approved page outline and copy.`;

    onAddFeedback({
      pageNumber: currentPage,
      author,
      role,
      status: selectedStatus,
      category,
      comment: noteText,
      pinPosition: activeAnnotationCoord || undefined
    });

    if (selectedStatus === 'approved') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    setComment('');
    onClearAnnotationCoord?.();
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'approved' ? 'pending' : 'approved';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleExportSummary = () => {
    let text = `# APAC Organization Magazine — Editorial Review Report\n`;
    text += `Generated: ${new Date().toLocaleDateString()} | Reviewer: ${author} (${role})\n`;
    text += `Overall Approval: ${approvedCount} of 32 pages (${percentComplete}%)\n\n`;
    text += `## Executive Summary\n`;
    text += `- Approved Pages: ${approvedCount}\n`;
    text += `- Changes Requested: ${changesCount}\n`;
    text += `- Pending Review: ${pendingCount}\n\n`;
    text += `## Detailed Page Review Notes\n`;

    pages.forEach(p => {
      const pFbs = feedbackList.filter(f => f.pageNumber === p.pageNumber);
      text += `### Page ${p.pageNumber}: ${p.title} (${p.category})\n`;
      text += `Status: ${getPageStatus(p.pageNumber).toUpperCase()}\n`;
      if (pFbs.length > 0) {
        pFbs.forEach(f => {
          text += `- [${f.category.toUpperCase()}] ${f.author}: "${f.comment}"\n`;
        });
      } else {
        text += `- No review notes recorded.\n`;
      }
      text += `\n`;
    });

    text += `## Pre-Print Verification Checklist\n`;
    checklist.forEach(c => {
      text += `- [${c.status === 'approved' ? 'X' : ' '}] (Page ${c.page}) ${c.title}: ${c.description}\n`;
    });

    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `APAC_Magazine_Review_Report.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    let text = `APAC Magazine Review Status: ${approvedCount}/32 Approved (${percentComplete}%).\n`;
    feedbackList.forEach(f => {
      text += `P.${f.pageNumber} [${f.status}]: ${f.comment} (${f.author})\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFeedback = filterMode === 'current' 
    ? feedbackList.filter(f => f.pageNumber === currentPage)
    : feedbackList;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-neutral-900 text-neutral-100 shadow-2xl border-l border-white/10 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-neutral-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight font-display">
              Chairman & Editorial Review
            </h3>
            <p className="text-[11px] text-neutral-400">
              Review and approve publication outline
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

      {/* Overview Stats Bar */}
      <div className="p-4 bg-white/5 border-b border-white/10">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-neutral-300">Publication Approval Progress</span>
          <span className="font-mono font-bold text-emerald-400">{percentComplete}% ({approvedCount}/32 Pages)</span>
        </div>
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${(approvedCount / 32) * 100}%` }} 
            className="bg-emerald-500 h-full transition-all"
            title={`Approved: ${approvedCount} pages`}
          />
          <div 
            style={{ width: `${(changesCount / 32) * 100}%` }} 
            className="bg-amber-500 h-full transition-all"
            title={`Changes Requested: ${changesCount} pages`}
          />
        </div>

        <div className="flex items-center justify-between mt-2.5 text-[10px] text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> {approvedCount} Approved
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <AlertCircle className="w-3 h-3" /> {changesCount} Revisions
          </span>
          <span className="flex items-center gap-1 text-neutral-400">
            <Clock className="w-3 h-3" /> {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* Current Active Page Card */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-red-400">Currently Reviewing</span>
            <span className="font-mono text-neutral-400">Page {currentPage} of 32</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            {currentPageData?.title}
          </h4>
          <p className="text-xs text-neutral-300 mt-0.5 line-clamp-2">
            {currentPageData?.headline}
          </p>

          {/* Quick Page Approval Buttons */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
            <button
              onClick={() => {
                onUpdatePageStatus(currentPage, 'approved');
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
              }}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                getPageStatus(currentPage) === 'approved' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Page</span>
            </button>

            <button
              onClick={() => onUpdatePageStatus(currentPage, 'changes_requested')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                getPageStatus(currentPage) === 'changes_requested' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 border border-amber-800/60'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Request Edit</span>
            </button>
          </div>
        </div>

        {/* Feedback Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 p-4 rounded-xl bg-neutral-950/40 border border-white/10">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>Submit Review Feedback</span>
            </h4>
            {activeAnnotationCoord && (
              <span className="text-[10px] text-amber-400 font-mono bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/50">
                Pin dropped at {activeAnnotationCoord.x}%, {activeAnnotationCoord.y}%
              </span>
            )}
          </div>

          {/* Reviewer Selector */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Reviewer Name</label>
              <select
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  if (e.target.value.includes('Chairman')) setRole('Chairman & Founder');
                  else if (e.target.value.includes('Chairperson')) setRole('Chairperson');
                  else if (e.target.value.includes('Youth')) setRole('Youth Wing President');
                  else setRole('Editorial Committee');
                }}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-hidden focus:border-red-500"
              >
                <option value="Chairman Sheikh Tauqeer ul Haq">Sheikh Tauqeer ul Haq (Chairman)</option>
                <option value="Chairperson Aliya Tauqeer">Aliya Tauqeer (Chairperson)</option>
                <option value="Ribal ul Haq">Ribal ul Haq (Youth President)</option>
                <option value="Editorial Board Committee">Editorial Board Committee</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReviewCategory)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-hidden focus:border-red-500"
              >
                <option value="copy">Copy & Text Edit</option>
                <option value="photo">Photo Placement</option>
                <option value="layout">Design & Layout</option>
                <option value="factual">Factual / Verification</option>
                <option value="general">General Direction</option>
              </select>
            </div>
          </div>

          {/* Status radio selection */}
          <div>
            <label className="text-[10px] text-neutral-400 block mb-1">Page Recommendation</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedStatus('approved')}
                className={`py-1.5 px-2 rounded-md text-[11px] font-semibold border transition-all ${
                  selectedStatus === 'approved' 
                    ? 'bg-emerald-600 text-white border-emerald-500' 
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                Approved
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('changes_requested')}
                className={`py-1.5 px-2 rounded-md text-[11px] font-semibold border transition-all ${
                  selectedStatus === 'changes_requested' 
                    ? 'bg-amber-600 text-white border-amber-500' 
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                Needs Edit
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('reviewed')}
                className={`py-1.5 px-2 rounded-md text-[11px] font-semibold border transition-all ${
                  selectedStatus === 'reviewed' 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white'
                }`}
              >
                Comment
              </button>
            </div>
          </div>

          {/* Comment input */}
          <div>
            <label className="text-[10px] text-neutral-400 block mb-1">Reviewer Guidance / Suggestions</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Layout looks balanced. Ensure leader title aligns with official charter, check high-res image contrast before print..."
              rows={3}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-neutral-500">
              Click anywhere on page to drop a numbered pin
            </span>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save Review Note</span>
            </button>
          </div>
        </form>

        {/* Editorial Verification Checklist (The 8 checks from outline) */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Pre-Print Verification Checklist</span>
            </h4>
            <span className="text-[10px] font-mono text-neutral-400">
              {checklist.filter(c => c.status === 'approved').length}/{checklist.length} Verified
            </span>
          </div>

          <div className="space-y-2">
            {checklist.map(item => (
              <div 
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                  item.status === 'approved'
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {item.status === 'approved' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{item.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToPage(item.page);
                      }}
                      className="text-[10px] text-sky-400 hover:underline font-mono"
                    >
                      P.{item.page} →
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Feedback Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Review Notes Log ({filteredFeedback.length})
            </h4>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1 bg-neutral-800 p-0.5 rounded-lg text-[10px]">
              <button
                onClick={() => setFilterMode('current')}
                className={`px-2 py-0.5 rounded ${
                  filterMode === 'current' ? 'bg-red-600 text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                Page {currentPage}
              </button>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2 py-0.5 rounded ${
                  filterMode === 'all' ? 'bg-red-600 text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                All 32 Pages
              </button>
            </div>
          </div>

          {filteredFeedback.length === 0 ? (
            <div className="p-6 text-center text-neutral-500 text-xs bg-neutral-950/30 rounded-xl border border-neutral-800">
              No review notes recorded for this selection yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredFeedback.map(fb => (
                <div 
                  key={fb.id}
                  className="p-3 rounded-lg bg-neutral-950/60 border border-white/10 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{fb.author}</span>
                      <span className="text-[10px] text-neutral-400">({fb.role})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                        fb.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        fb.status === 'changes_requested' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {fb.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => onDeleteFeedback(fb.id)}
                        className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-neutral-200 text-xs leading-relaxed">
                    "{fb.comment}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-white/5">
                    <button 
                      onClick={() => onJumpToPage(fb.pageNumber)}
                      className="text-sky-400 hover:underline font-mono"
                    >
                      Page {fb.pageNumber} • {fb.category}
                    </button>
                    <span>{fb.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer: Export Actions */}
      <div className="p-4 border-t border-white/10 bg-neutral-950 flex items-center gap-2">
        <button
          onClick={handleExportSummary}
          className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          title="Download full editorial review report as Markdown"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Review Report</span>
        </button>

        <button
          onClick={handleCopySummary}
          className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          title="Copy brief review summary to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
