import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageData, SearchResult } from '../types';
import { Search, X, BookOpen, ChevronRight, User, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: PageData[];
  onSelectPage: (pageNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  pages,
  onSelectPage
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    pages.forEach(p => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [pages]);

  const searchResults: SearchResult[] = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Return top articles when empty
      return pages
        .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
        .map(p => ({
          pageNumber: p.pageNumber,
          title: p.title,
          category: p.category,
          matchType: 'title',
          snippet: p.headline || p.leadParagraph || p.paragraphs[0]?.slice(0, 100) || ''
        }));
    }

    const results: SearchResult[] = [];

    pages.forEach(page => {
      if (selectedCategory !== 'All' && page.category !== selectedCategory) {
        return;
      }

      // Check title or headline
      if (page.title.toLowerCase().includes(trimmed) || page.headline.toLowerCase().includes(trimmed)) {
        results.push({
          pageNumber: page.pageNumber,
          title: page.title,
          category: page.category,
          matchType: 'title',
          snippet: page.headline
        });
        return;
      }

      // Check people
      const matchingPerson = page.people?.find(peep => peep.name.toLowerCase().includes(trimmed) || peep.title.toLowerCase().includes(trimmed));
      if (matchingPerson) {
        results.push({
          pageNumber: page.pageNumber,
          title: page.title,
          category: page.category,
          matchType: 'person',
          snippet: `${matchingPerson.name} — ${matchingPerson.title}`
        });
        return;
      }

      // Check editorial checks
      const matchingCheck = page.editorialChecks?.find(c => c.toLowerCase().includes(trimmed));
      if (matchingCheck) {
        results.push({
          pageNumber: page.pageNumber,
          title: page.title,
          category: page.category,
          matchType: 'editorial',
          snippet: `Editorial Check: ${matchingCheck}`
        });
        return;
      }

      // Check content paragraphs
      const matchingPara = page.paragraphs.find(p => p.toLowerCase().includes(trimmed));
      if (matchingPara) {
        const idx = matchingPara.toLowerCase().indexOf(trimmed);
        const start = Math.max(0, idx - 40);
        const end = Math.min(matchingPara.length, idx + trimmed.length + 60);
        const excerpt = (start > 0 ? '...' : '') + matchingPara.slice(start, end) + (end < matchingPara.length ? '...' : '');

        results.push({
          pageNumber: page.pageNumber,
          title: page.title,
          category: page.category,
          matchType: 'content',
          snippet: excerpt
        });
      }
    });

    return results;
  }, [pages, query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-neutral-900 rounded-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-neutral-950/60">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 32 articles, leaders, AIFT, business, photos, or keywords..."
            className="flex-1 bg-transparent text-white placeholder:text-neutral-500 text-sm sm:text-base focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-400 hover:text-white px-1.5 py-0.5 rounded bg-neutral-800"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2.5 border-b border-white/5 bg-neutral-950/30 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white font-semibold'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              No matching articles found for "<span className="text-white">{query}</span>"
            </div>
          ) : (
            searchResults.map((result) => (
              <button
                key={`${result.pageNumber}-${result.title}`}
                onClick={() => {
                  onSelectPage(result.pageNumber);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-red-500/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-lg bg-neutral-800 text-white font-mono font-bold text-xs flex flex-col items-center justify-center shrink-0 group-hover:bg-red-700 transition-colors">
                    <span className="text-[9px] text-neutral-400 group-hover:text-white/80">P.</span>
                    <span>{String(result.pageNumber).padStart(2, '0')}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                        {result.category}
                      </span>
                      {result.matchType === 'person' && (
                        <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          <User className="w-2.5 h-2.5" /> Person
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {result.title}
                    </h4>

                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {result.snippet}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-neutral-950 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>{searchResults.length} pages indexed</span>
          <span className="font-mono text-[10px] text-neutral-500">Esc to close</span>
        </div>
      </div>
    </div>
  );
};
