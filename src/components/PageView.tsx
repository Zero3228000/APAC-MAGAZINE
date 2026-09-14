import React from 'react';
import { PageData, PageFeedback } from '../types';
import { 
  Users, Award, Cpu, BookOpen, Briefcase, 
  HeartHandshake, Calendar, QrCode, Sparkles, 
  MessageSquare, ChevronRight, CheckCircle, AlertTriangle
} from 'lucide-react';
import { MagazineCover } from './MagazineCover';
import { MagazineBackCover } from './MagazineBackCover';

interface PageViewProps {
  page: PageData;
  feedbackList?: PageFeedback[];
  onAddAnnotation?: (pageNumber: number, x: number, y: number) => void;
  showSafeMargins?: boolean;
  onSelectFeedback?: (feedback: PageFeedback) => void;
}

export const PageView: React.FC<PageViewProps> = ({
  page,
  feedbackList = [],
  onAddAnnotation,
  showSafeMargins = false,
  onSelectFeedback
}) => {
  // Special full-page layouts
  if (page.layoutType === 'cover') {
    return <MagazineCover showSafeMargins={showSafeMargins} />;
  }

  if (page.layoutType === 'back-cover') {
    return <MagazineBackCover showSafeMargins={showSafeMargins} />;
  }

  const pageFeedback = feedbackList.filter(f => f.pageNumber === page.pageNumber);
  const isLeftPage = page.pageNumber % 2 === 0;

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking on an existing button or pin, don't trigger new pin
    const target = e.target as HTMLElement;
    if (target.closest('.feedback-pin') || target.closest('button') || target.closest('a')) {
      return;
    }

    if (onAddAnnotation) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      onAddAnnotation(page.pageNumber, x, y);
    }
  };

  return (
    <div 
      onClick={handlePageClick}
      className={`relative w-full h-full bg-[#fcfbf9] text-neutral-800 flex flex-col justify-between p-6 sm:p-8 select-text overflow-hidden ${
        isLeftPage ? 'page-left-shadow' : 'page-right-shadow'
      }`}
    >
      {/* Print Safe Margins Overlay */}
      {showSafeMargins && (
        <div className="absolute inset-4 border border-dashed border-red-300 pointer-events-none z-30 opacity-60">
          <span className="absolute top-1 left-2 text-[9px] font-mono text-red-600 bg-white/80 px-1 rounded">
            Trim Safety 0.25in
          </span>
        </div>
      )}

      {/* Floating Feedback Pin Markers on Page */}
      {pageFeedback.map((fb, idx) => {
        if (!fb.pinPosition) return null;
        return (
          <button
            key={fb.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectFeedback?.(fb);
            }}
            style={{ left: `${fb.pinPosition.x}%`, top: `${fb.pinPosition.y}%` }}
            className="feedback-pin absolute z-30 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-lg hover:scale-125 transition-transform ring-2 ring-white"
            title={`Review note by ${fb.author}: ${fb.comment.slice(0, 40)}...`}
          >
            {idx + 1}
          </button>
        );
      })}

      {/* Header Running Folio */}
      <div className={`relative z-10 flex items-center justify-between border-b border-neutral-200 pb-2 text-[10px] sm:text-xs tracking-wider text-neutral-500 uppercase ${
        isLeftPage ? 'flex-row' : 'flex-row-reverse'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-red-700">{page.category}</span>
          <span className="text-neutral-300">•</span>
          <span className="truncate max-w-[200px] sm:max-w-xs">{page.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {page.editorialChecks && page.editorialChecks.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>{page.editorialChecks.length} Review Notes</span>
            </span>
          )}
          <span className="font-mono font-bold text-neutral-800">
            PAGE {String(page.pageNumber).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Main Body Content based on Layout Type */}
      <div className="flex-1 my-3 overflow-y-auto pr-1">
        {/* Title & Subtitle */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#0a192f] leading-tight font-display">
            {page.headline}
          </h2>
          {page.subtitle && (
            <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-1 font-serif italic">
              {page.subtitle}
            </p>
          )}
          <div className="w-10 h-0.5 bg-red-600 mt-2" />
        </div>

        {/* Contents Page (Page 02) */}
        {page.layoutType === 'contents' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-white rounded-lg border border-neutral-200 shadow-2xs">
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {page.leadParagraph}
              </p>
              {page.paragraphs.map((p, i) => (
                <p key={i} className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {page.highlights?.map((h, i) => {
                const parts = h.split(':');
                return (
                  <div key={i} className="p-2.5 bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-200/80 transition-colors flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold text-[#0a192f]">{parts[0]}</span>
                    <span className="text-[11px] sm:text-xs text-neutral-600 truncate ml-2">{parts[1]}</span>
                  </div>
                );
              })}
            </div>

            {page.images?.[0] && (
              <div className="mt-3 rounded-lg overflow-hidden border border-neutral-200">
                <img 
                  src={page.images[0].imageUrl} 
                  alt={page.images[0].caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-32 sm:h-40 object-cover"
                />
                <div className="p-2 bg-neutral-100 text-[10px] text-neutral-600 italic">
                  {page.images[0].caption}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Message from Leader (Pages 05, 06, 07) */}
        {page.layoutType === 'message' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Leader Formal Portrait */}
              {page.images?.[0] && (
                <div className="w-full sm:w-44 shrink-0 rounded-lg overflow-hidden border border-neutral-300 shadow-xs bg-neutral-100">
                  <img 
                    src={page.images[0].imageUrl} 
                    alt={page.images[0].caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-48 sm:h-52 object-cover"
                  />
                  <div className="p-2 bg-[#0a192f] text-white text-center">
                    <div className="font-bold text-xs">{page.people?.[0]?.name}</div>
                    <div className="text-[10px] text-amber-300">{page.people?.[0]?.title}</div>
                  </div>
                </div>
              )}

              {/* Text Body */}
              <div className="flex-1 space-y-2.5 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {page.leadParagraph && (
                  <p className="font-medium text-neutral-900 border-l-2 border-red-600 pl-3 italic font-serif text-sm sm:text-base">
                    "{page.leadParagraph}"
                  </p>
                )}
                {page.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
              <div className="text-[11px] text-neutral-500 italic">
                {page.people?.[0]?.title} • All Pakistani American Coalition
              </div>
              <div className="text-right">
                <div className="font-serif italic text-lg sm:text-xl text-[#0a192f] tracking-wide">
                  {page.people?.[0]?.name}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-neutral-400">
                  Executive Signature on File
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leadership Grid (Pages 08, 09, 10, 15, 17, 18) */}
        {page.layoutType === 'grid-leadership' && (
          <div className="space-y-4">
            {page.leadParagraph && (
              <p className="text-xs sm:text-sm text-neutral-600 italic">
                {page.leadParagraph}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {page.people?.map((person, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-lg p-3 border border-neutral-200 shadow-2xs flex flex-col items-center text-center hover:border-neutral-300 transition-colors"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-linear-to-tr from-slate-700 to-[#0a192f] text-white font-bold flex items-center justify-center text-sm shadow-inner mb-2 border-2 border-white">
                    {person.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0a192f] leading-tight">
                    {person.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-red-700 font-semibold mt-0.5">
                    {person.title}
                  </p>
                  {person.wing && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded font-medium mt-1">
                      {person.wing}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {page.paragraphs.map((p, i) => (
              <p key={i} className="text-xs text-neutral-600 leading-relaxed mt-2">
                {p}
              </p>
            ))}
          </div>
        )}

        {/* Focus Areas (Page 11) */}
        {page.layoutType === 'focus-areas' && (
          <div className="space-y-3">
            {page.leadParagraph && (
              <p className="text-xs sm:text-sm text-neutral-700">{page.leadParagraph}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.paragraphs.map((p, idx) => {
                const [title, ...rest] = p.split(':');
                const desc = rest.join(':');
                return (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-neutral-200 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#0a192f]">
                          {title.replace(/^\d+\.\s*/, '')}
                        </h4>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Course Pathway (Page 13) */}
        {page.layoutType === 'course-pathway' && (
          <div className="space-y-4">
            {page.leadParagraph && (
              <p className="text-xs sm:text-sm text-neutral-700">{page.leadParagraph}</p>
            )}

            {/* 4 Foundation Courses Roadmap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {page.paragraphs.slice(0, 4).map((c, i) => {
                const [cTitle, ...cDesc] = c.split(':');
                return (
                  <div key={i} className="p-3 bg-slate-900 text-white rounded-lg border border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                        Module 0{i + 1}
                      </span>
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                      {cTitle.replace(/^\d+\.\s*/, '')}
                    </h4>
                    <p className="text-[10px] text-neutral-300 leading-relaxed">
                      {cDesc.join(':')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Advanced Pathways and Scholarships */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Advanced Pathways & Scholarship Access</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {page.paragraphs[4]}
              </p>
              <p className="text-[11px] text-neutral-700">
                {page.paragraphs[5]}
              </p>
            </div>

            {/* QR Section */}
            {page.qrCode && (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
                <div className="text-xs">
                  <div className="font-bold text-[#0a192f]">{page.qrCode.label}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">{page.qrCode.fallbackText}</div>
                </div>
                <div className="w-10 h-10 bg-neutral-100 rounded p-1 border border-neutral-300 flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-neutral-800" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photo Story / Photo Essay (Pages 21, 23, 25) */}
        {page.layoutType === 'photo-story' && (
          <div className="space-y-3">
            {page.leadParagraph && (
              <p className="text-xs sm:text-sm text-neutral-700 italic font-serif">
                {page.leadParagraph}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {page.images?.map((img, idx) => (
                <div key={idx} className={`rounded-lg overflow-hidden border border-neutral-200 shadow-xs bg-white ${
                  idx === 0 && page.images && page.images.length % 2 !== 0 ? 'sm:col-span-2' : ''
                }`}>
                  <img 
                    src={img.imageUrl} 
                    alt={img.caption}
                    referrerPolicy="no-referrer"
                    className={`w-full object-cover ${
                      idx === 0 && page.images && page.images.length % 2 !== 0 ? 'h-36 sm:h-48' : 'h-32 sm:h-40'
                    }`}
                  />
                  <div className="p-2 bg-white text-[10px] text-neutral-700 border-t border-neutral-100">
                    <span className="font-semibold text-[#0a192f]">FIG {idx + 1}: </span>
                    {img.caption}
                  </div>
                </div>
              ))}
            </div>

            {page.paragraphs.map((p, i) => (
              <p key={i} className="text-xs text-neutral-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        )}

        {/* Timeline (Page 28) */}
        {page.layoutType === 'timeline' && (
          <div className="space-y-3">
            {page.leadParagraph && (
              <p className="text-xs sm:text-sm text-neutral-700 mb-2">{page.leadParagraph}</p>
            )}
            <div className="relative pl-5 border-l-2 border-red-600 space-y-3.5 my-2">
              {page.paragraphs.map((milestone, idx) => {
                const [yearPart, ...rest] = milestone.split('—');
                return (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-red-600 group-hover:bg-red-600 transition-colors" />
                    <div className="text-xs font-bold text-[#0a192f]">
                      {yearPart.replace(/^•\s*/, '')}
                    </div>
                    <div className="text-[11px] text-neutral-600 leading-snug">
                      {rest.join('—')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Membership (Page 29) */}
        {page.layoutType === 'membership' && (
          <div className="space-y-4">
            {page.leadParagraph && (
              <p className="text-xs sm:text-sm text-neutral-700">{page.leadParagraph}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-linear-to-br from-[#0a192f] to-[#1e3a8a] text-white rounded-lg shadow-sm">
                <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Executive Tier</div>
                <div className="text-lg font-bold text-white mt-0.5">$600 <span className="text-xs text-neutral-300 font-normal">/ year</span></div>
                <h4 className="text-xs font-bold mt-2 text-white">Professional Membership</h4>
                <p className="text-[10px] text-neutral-200 mt-1 leading-relaxed">
                  Full voting rights, executive business directory, VIP gala seating, and diplomatic roundtable access.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-neutral-300 rounded-lg shadow-2xs">
                <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Youth & Academic</div>
                <div className="text-lg font-bold text-[#0a192f] mt-0.5">$25 <span className="text-xs text-neutral-500 font-normal">/ year</span></div>
                <h4 className="text-xs font-bold mt-2 text-[#0a192f]">Student & Youth Tier</h4>
                <p className="text-[10px] text-neutral-600 mt-1 leading-relaxed">
                  AIFT technology workshops, 1-on-1 industry mentoring, civic internships, and volunteer certification.
                </p>
              </div>
            </div>

            {/* 5 Step Sequence */}
            <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-200">
              <div className="text-xs font-bold text-[#0a192f] mb-2 uppercase tracking-wide">
                5-Step Application Sequence
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-neutral-700">
                <span className="px-2 py-0.5 bg-white rounded shadow-2xs border border-neutral-200">1. Online Application</span>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <span className="px-2 py-0.5 bg-white rounded shadow-2xs border border-neutral-200">2. Review</span>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <span className="px-2 py-0.5 bg-white rounded shadow-2xs border border-neutral-200">3. Approval</span>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <span className="px-2 py-0.5 bg-white rounded shadow-2xs border border-neutral-200">4. Dues Activation</span>
                <ChevronRight className="w-3 h-3 text-neutral-400" />
                <span className="px-2 py-0.5 bg-red-600 text-white rounded shadow-2xs">5. Induction</span>
              </div>
            </div>
          </div>
        )}

        {/* Calendar (Page 30) */}
        {page.layoutType === 'calendar' && (
          <div className="space-y-3">
            {page.leadParagraph && (
              <p className="text-xs sm:text-sm text-neutral-700">{page.leadParagraph}</p>
            )}

            <div className="space-y-2">
              {page.paragraphs.map((item, idx) => {
                const [datePart, ...desc] = item.split(':');
                return (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-neutral-200 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-red-50 border border-red-100 flex flex-col items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0a192f]">
                          {datePart.replace(/^•\s*/, '')}
                        </div>
                        <div className="text-[11px] text-neutral-600">
                          {desc.join(':')}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-neutral-400 uppercase">
                      Tentative
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[10px] text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
              <span>All upcoming event dates and venues are subject to final board confirmation prior to publication.</span>
            </div>
          </div>
        )}

        {/* Standard Editorial / Feature Split (Pages 03, 04, 14, 16, 19, 20, 22, 24, 26, 27, 31) */}
        {(page.layoutType === 'editorial' || page.layoutType === 'feature-split' || page.layoutType === 'media') && (
          <div className="space-y-3">
            {/* Image banner if present */}
            {page.images?.[0] && (
              <div className="rounded-lg overflow-hidden border border-neutral-200 shadow-xs mb-3 bg-neutral-100">
                <img 
                  src={page.images[0].imageUrl} 
                  alt={page.images[0].caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-36 sm:h-44 object-cover"
                />
                <div className="p-2 bg-white text-[10px] text-neutral-600 italic border-t border-neutral-100">
                  {page.images[0].caption}
                </div>
              </div>
            )}

            {page.leadParagraph && (
              <p className="text-xs sm:text-sm font-medium text-neutral-900 leading-relaxed font-serif">
                {page.leadParagraph}
              </p>
            )}

            <div className="space-y-2 text-xs sm:text-sm text-neutral-700 leading-relaxed">
              {page.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Highlights chips */}
            {page.highlights && page.highlights.length > 0 && (
              <div className="pt-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Key Focus & Milestones
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {page.highlights.map((h, i) => (
                    <span key={i} className="text-[10px] bg-neutral-100 text-[#0a192f] px-2 py-0.5 rounded border border-neutral-200">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Running Rule */}
      <div className={`relative z-10 pt-2 border-t border-neutral-200 flex items-center justify-between text-[9px] sm:text-[10px] text-neutral-400 ${
        isLeftPage ? 'flex-row' : 'flex-row-reverse'
      }`}>
        <span>All Pakistani American Coalition • Official Magazine 2026</span>
        <div className="flex items-center gap-2">
          <span>Target Words: {page.targetWords}</span>
          <span>•</span>
          <span className="font-bold text-neutral-700">{page.pageNumber}</span>
        </div>
      </div>
    </div>
  );
};
