import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ExternalLink,
  Tag,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { Language, LessonStage, SourceReference, TrackId } from '../types';
import { CURRICULUM_DATA } from '../data/curriculumData';
import { APPROVED_SOURCES_REGISTRY } from '../data/sourcesRegistry';

interface SearchBarProps {
  language: Language;
  currentTrackId: TrackId;
  onSelectStage: (stage: LessonStage) => void;
  onSelectSource?: (source: SourceReference) => void;
}

type FilterScope = 'all' | 'current_track' | 'all_tracks' | 'sources';

export const SearchBar: React.FC<SearchBarProps> = ({
  language,
  currentTrackId,
  onSelectStage,
  onSelectSource,
}) => {
  const isAr = language === 'ar';
  const isUr = language === 'ur';
  const isRtl = isAr || isUr;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeScope, setActiveScope] = useState<FilterScope>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Registry of trusted sources as list
  const allSourcesList = useMemo(() => {
    const list = Object.values(APPROVED_SOURCES_REGISTRY);
    // Also include any extra unique sources referenced in lessons
    const seen = new Set(list.map((s) => s.title));
    CURRICULUM_DATA.forEach((stage) => {
      stage.sources.forEach((src) => {
        if (!seen.has(src.title)) {
          seen.add(src.title);
          list.push(src);
        }
      });
    });
    return list;
  }, []);

  // Quick suggestions
  const quickSuggestions = isAr
    ? ['التوحيد', 'الصلاة', 'الوضوء', 'صحيح البخاري', 'الدرر السنية', 'آداب الطعام']
    : isUr
    ? ['توحید', 'نماز', 'وضو', 'صحیح بخاری', 'الدرر السنیہ', 'کھانے کے آداب']
    : ['Tawhid', 'Prayer', 'Wudu', 'Sahih Bukhari', 'Dorar.net', 'Etiquette'];

  // Normalization helper for resilient Arabic and English search
  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel/diacritics
      .trim();
  };

  const normalizedQuery = normalize(query);

  // Search Results
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return { stages: [], sources: [] };
    }

    // Filter stages
    let eligibleStages = CURRICULUM_DATA;
    if (activeScope === 'current_track') {
      eligibleStages = eligibleStages.filter((s) => s.trackId === currentTrackId);
    }

    const matchedStages = eligibleStages.filter((stage) => {
      if (activeScope === 'sources') return false;

      const titleMatch = normalize(stage.title).includes(normalizedQuery) ||
                         normalize(stage.titleEn).includes(normalizedQuery);
      const subtitleMatch = normalize(stage.subtitle).includes(normalizedQuery) ||
                            normalize(stage.subtitleEn).includes(normalizedQuery);
      const conceptMatch = normalize(stage.conceptExplanation).includes(normalizedQuery) ||
                           normalize(stage.conceptExplanationEn).includes(normalizedQuery);
      
      const scripturesMatch = stage.scriptures.some((sc) => 
        normalize(sc.arabicText).includes(normalizedQuery) ||
        normalize(sc.reference).includes(normalizedQuery) ||
        (sc.translationEn && normalize(sc.translationEn).includes(normalizedQuery))
      );

      const termsMatch = stage.keyTerms?.some((term) =>
        normalize(term.ar).includes(normalizedQuery) ||
        normalize(term.en).includes(normalizedQuery) ||
        normalize(term.approvedStandard).includes(normalizedQuery)
      );

      return titleMatch || subtitleMatch || conceptMatch || scripturesMatch || termsMatch;
    });

    // Filter sources
    let matchedSources: SourceReference[] = [];
    if (activeScope !== 'current_track') {
      matchedSources = allSourcesList.filter((source) => {
        const titleMatch = normalize(source.title).includes(normalizedQuery);
        const domainMatch = normalize(source.domain).includes(normalizedQuery);
        const catMatch = normalize(source.category).includes(normalizedQuery);
        const detailMatch = normalize(source.referenceDetail).includes(normalizedQuery);
        const reliabilityMatch = source.reliabilityNote ? normalize(source.reliabilityNote).includes(normalizedQuery) : false;

        return titleMatch || domainMatch || catMatch || detailMatch || reliabilityMatch;
      });
    }

    return {
      stages: matchedStages.slice(0, 8),
      sources: matchedSources.slice(0, 6)
    };
  }, [normalizedQuery, activeScope, currentTrackId, allSourcesList]);

  const totalResultsCount = results.stages.length + results.sources.length;

  const handleSelectLesson = (stage: LessonStage) => {
    onSelectStage(stage);
    setIsOpen(false);
  };

  const handleSelectSourceItem = (source: SourceReference) => {
    if (onSelectSource) {
      onSelectSource(source);
    } else if (source.url) {
      window.open(source.url, '_blank', 'noopener,noreferrer');
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full mb-6 z-30">
      
      {/* Search Input Box */}
      <div className="relative group">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-slate-400 group-focus-within:text-amber-600 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder={
            isAr
              ? 'ابحث في محتوى المسار، الآيات، الأحاديث، أو قاعدة المصادر المعتمدة...'
              : isUr
              ? 'اسباق کے متن، قرآنی آیات، احادیث، یا مستند مصادر میں تلاش کریں...'
              : 'Search track lessons, verses, Hadiths, or verified sources...'
          }
          className="w-full ps-11 pe-20 py-3.5 bg-[#FFFDFB] border border-[#EAE3D6] rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 shadow-xs transition"
        />

        <div className="absolute inset-y-0 end-0 flex items-center pe-3 gap-1.5">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F4EFEA] text-slate-600 border border-[#EAE3D6]">
            {isAr ? 'بحث فوري' : isUr ? 'فوری تلاش' : 'Live'}
          </span>
        </div>
      </div>

      {/* Popover Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full start-0 end-0 mt-2 bg-[#FFFDFB]/98 backdrop-blur-md rounded-2xl border border-[#EAE3D6] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] flex flex-col z-50">
          
          {/* Scope Filters Row */}
          <div className="p-3 bg-[#F7F3EC]/80 border-b border-[#EAE3D6] flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400 me-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>{isAr ? 'النطاق:' : isUr ? 'دائرہ کار:' : 'Scope:'}</span>
            </span>

            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All', labelUr: 'سب' },
              { id: 'current_track', labelAr: 'المسار الحالي فقط', labelEn: 'Current Track', labelUr: 'صرف موجودہ راستہ' },
              { id: 'all_tracks', labelAr: 'كل الدروس', labelEn: 'All Lessons', labelUr: 'تمام اسباق' },
              { id: 'sources', labelAr: 'المصادر المعتمدة', labelEn: 'Sources', labelUr: 'مستند مصادر' },
            ].map((scope) => (
              <button
                key={scope.id}
                onClick={() => setActiveScope(scope.id as FilterScope)}
                className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                  activeScope === scope.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {isAr ? scope.labelAr : isUr ? scope.labelUr : scope.labelEn}
              </button>
            ))}

            {normalizedQuery && (
              <span className="ms-auto text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {totalResultsCount} {isAr ? 'نتيجة مطابقة' : isUr ? 'نتائج' : 'results'}
              </span>
            )}
          </div>

          {/* Quick Suggestions when Query is Empty */}
          {!normalizedQuery ? (
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isAr ? 'عمليات بحث شائعة مقترحة:' : 'Suggested Quick Searches:'}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item);
                      setIsOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 text-xs text-slate-700 font-medium transition cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{isAr ? 'يدعم البحث الفوري في نصوص القرآن، تخريج الأحاديث، وتفاصيل المتون' : 'Instant search across scriptures, Hadiths, and verified databases'}</span>
                <span className="font-mono text-slate-400">Esc {isAr ? 'للإغلاق' : 'to close'}</span>
              </div>
            </div>
          ) : totalResultsCount === 0 ? (
            /* No Results Empty State */
            <div className="p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-1">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                {isAr ? `لا توجد نتائج مطابقة لـ «${query}»` : `No results found for "${query}"`}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {isAr
                  ? 'جرب البحث بمصطلحات عامة مثل: التوحيد، الوضوء، الصلاة، البخاري، أو وسّع النطاق باختيار «الكل».'
                  : 'Try general terms like: Tawhid, Prayer, Wudu, Bukhari, or expand scope to "All".'}
              </p>
            </div>
          ) : (
            /* Matched Results List */
            <div className="overflow-y-auto divide-y divide-slate-100 p-2 space-y-3">
              
              {/* STAGES SECTION */}
              {results.stages.length > 0 && (
                <div className="space-y-1.5">
                  <div className="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isAr ? 'الدروس والمحطات التعليمية' : 'Curriculum Lessons'}</span>
                    </span>
                    <span>({results.stages.length})</span>
                  </div>

                  {results.stages.map((stage) => {
                    const isCurrentTrack = stage.trackId === currentTrackId;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => handleSelectLesson(stage)}
                        className="w-full text-start p-3 rounded-xl hover:bg-amber-50/50 border border-transparent hover:border-amber-200 transition group cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              {stage.stageNumber ? `${isAr ? 'المرحلة' : 'Stage'} ${stage.stageNumber}` : stage.id}
                            </span>

                            {isCurrentTrack ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {isAr ? 'المسار الحالي' : 'Current Track'}
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-slate-400">
                                {stage.trackId}
                              </span>
                            )}

                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{stage.estimatedMinutes} {isAr ? 'د' : 'm'}</span>
                            </span>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-900 font-serif">
                            {isAr ? stage.title : stage.titleEn}
                          </h4>

                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {isAr ? stage.subtitle : stage.subtitleEn}
                          </p>
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                          <ArrowIcon className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* SOURCES SECTION */}
              {results.sources.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <div className="px-3 pt-1 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? 'المصادر المعتمدة وقاعدة التوثيق' : 'Verified Scholastic Sources'}</span>
                    </span>
                    <span>({results.sources.length})</span>
                  </div>

                  {results.sources.map((source, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSelectSourceItem(source)}
                      className="w-full text-start p-3 rounded-xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-200 transition group cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {source.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {source.domain}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-950">
                          {source.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {source.referenceDetail}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
};
